import {Message, MessageType, Package, PackageData, PackageType, Protocol} from './protocol.ts'
import Emitter from 'component-emitter'
import logger from 'loglevel'

export namespace PitayaClient {

    import MessageData = Message.MessageData
    /** 连接成功 */
    const RES_OK = 200
    /** 版本不统一 */
    const RES_OLD_CLIENT = 501

    export interface ConnectorOptions {
        /** WebSocket 服务器地址 */
        wsUrl: string,

        /** 最大重连次数 */
        maxReconnectAttempts?: number,

        /** 是否重新连接 默认false */
        reconnect?: boolean,
    }

    const DefaultConnectorOptions: Partial<ConnectorOptions> = {
        maxReconnectAttempts: 10,
        reconnect: true,
    }

    /** 握手协议参数 */
    const HandshakeBuffer = {
        sys: {
            /** CLIENT类型 */
            type: 'js-websocket',
            /** CLIENT版本 */
            version: '0.6.6',
            rsa: {}
        },
        user: {

        },
    }

    /**
     * 基于 WebSocket 的连接器
     */
    export class WebSocketConnector {
        readonly emitter = new Emitter()


        /** WebSocket */
        private socket?: WebSocket

        /** socket连接状态 */
        public isConnected: boolean = false
        /** 消息id */
        private reqId: number = 0
        /** 请求回调 */
        private callbacks: Record<number, Function> = {}
        /** 显示请求加载 */
        private isShowLoads: Record<number, boolean> = {}

        /** 路由列表 */
        private routeMap: Record<number, string | number> = {}
        /** 压缩路由正查表 */
        private dict: Record<string, number> = {}
        /** 压缩路由反查表 */
        private abbrs: Record<number, string> = {}

        /** 初始化Socket数据 */
        private params?: ConnectorOptions

        /** 心跳间隔 */
        private heartbeatInterval: number = 0
        /** 心跳延迟 */
        private heartbeatTimeout = 0
        /** 下次心跳延迟 */
        private nextHeartbeatTimeout = 0
        /** 心跳间隙阈值 */
        private gapThreshold: number = 500
        /** 心跳定时器 */
        private heartbeatId?: ReturnType<typeof setTimeout>
        /** 心跳定时器 */
        private heartbeatTimeoutId?: ReturnType<typeof setTimeout>


        /** 默认最大连接次数 */
        private static readonly DEFAULT_MAX_RECONNECT_ATTEMPTS: number = 10
        /** 实际最大连接次数 */
        private maxReconnectAttempts: number = 0
        /** 重连定时器 */
        private reconnectTimer?: number
        /** 重连连接次数 */
        private reconnectAttempts = 0

        private reconnect: boolean = false

        /** 初始化回调 */
        private initCallback?: Function

        /** 重连 */
        private reconnectCallback?: Function

        /**
         * 初始化socket
         * @param params socket连接参数
         * @param cb 连接完成的回调
         */
        public async init(params: ConnectorOptions, cb?: Function): Promise<void> {
            logger.info(params, `WebSocketClient init`)

            this.initCallback = cb
            this.params = {
                ...DefaultConnectorOptions,
                ...params,
            }

            this.connect(params, params.wsUrl)

            this.isPinging = false
        }

        private lastTime: number = 0

        private isPinging: boolean = false

        private startHeartbeat(): void {
            if (!this.heartbeatInterval) {
                return
            }

            if (this.isPinging) {
                return
            }
            let obj = Package.encode(PackageType.HEARTBEAT)
            this.heartbeatId = setInterval(() => {
                if (this.socket && this.isConnected) {
                    this.send(obj)
                }
            }, this.heartbeatInterval)

            this.lastTime = Date.now()

            this.heartbeatTimeoutId = setInterval(() => {
                // this.send(obj)
                if (this.socket && this.isConnected && Date.now() - this.lastTime > this.heartbeatTimeout) {
                    this.disconnect()
                }
            }, this.gapThreshold)

            this.isPinging = true
        }

        /**
         * 心跳检测
         */
        private heartbeat(): void {
            if (!this.heartbeatInterval) {
                return
            }
            this.lastTime = Date.now()

            let packet = Package.encode(PackageType.HEARTBEAT)
            if (this.heartbeatTimeoutId) {
                clearTimeout(this.heartbeatTimeoutId)
                this.heartbeatTimeoutId = undefined
            }

            if (this.heartbeatId) {
                // already in a heartbeat interval
                return
            }
            this.heartbeatId = setTimeout(() => {
                this.heartbeatId = undefined
                this.send(packet)

                this.nextHeartbeatTimeout = Date.now() + this.heartbeatTimeout
                this.heartbeatTimeoutId = setTimeout(() => {
                    this.heartbeatTimeoutCb()
                }, this.heartbeatTimeout)
            }, this.heartbeatInterval)
        }


        /**
         * 心跳超时
         */
        private heartbeatTimeoutCb(): void {
            let gap = this.nextHeartbeatTimeout - Date.now()
            if (gap > this.gapThreshold) {
                this.heartbeatTimeoutId = setTimeout(() => {
                    this.heartbeatTimeoutCb()
                }, gap)
            } else {
                logger.warn('server heartbeat timeout')
                this.disconnect()
            }
        }

        /**
         * 握手协议
         * @param data
         */
        private handshake(data: Uint8Array): void {
            const response = JSON.parse(Protocol.strDecode(data))
            if (response.code === RES_OLD_CLIENT) {
                logger.error('error', 'client version not fulfill')
                return
            }

            if (response.code !== RES_OK) {
                logger.error('error', 'handshake fail')
                return
            }

            this.handshakeInit(response)

            let packet = Package.encode(PackageType.HANDSHAKE_ACK)
            this.send(packet)

            if (this.initCallback) {
                this.initCallback(response)
                this.initCallback = undefined
            }

        }

        /** 握手初始化 */
        private handshakeInit(data: any): void {
            if (data.sys && data.sys.heartbeat) {
                this.heartbeatInterval = data.sys.heartbeat * 1000
                this.heartbeatTimeout = this.heartbeatInterval * 2
            } else {
                this.heartbeatInterval = 0
                this.heartbeatTimeout = 0
            }

            this.initData(data)
        }

        /**
         * 处理服务器消息
         * @param msg 服务器推送的数据
         */
        private processMessage(msg?: MessageData): void {
            if (!msg) {
                return
            }

            if (!msg.id) {
                logger.info('服务器广播消息', msg.route, msg.payload)
                this.emitter.emit(msg.route as string, msg.payload)
                return
            }

            // msg.body.isShowLoading = this.isShowLoads[msg.id]
            //if have a id then find the callback function with the request
            let cb = this.callbacks[msg.id]
            delete this.callbacks[msg.id]
            delete this.isShowLoads[msg.id]

            if (typeof cb === 'function') {
                cb(msg.payload)
            }

            return
        }

        /**
         * 服务器数据推送
         * @param packet 服务器推送的数据
         */
        private onData(packet: Uint8Array): void {
            let msg = this.messageDecode(packet)
            this.processMessage(msg)
        }

        /**
         * 被服务器强制踢出
         * @param data
         */
        private onKick(data?: Uint8Array): void {
            logger.info("onKick data:", data)

            if (data != null) {
                const kickMsg = JSON.parse(Protocol.strDecode(data))
                logger.info("onKick data:", kickMsg)
            }
        }

        /**
         * 初始化数据
         * @param data
         */
        initData(data: any): void {
            if (!data || !data.sys) {
                return
            }

            this.dict = {
                ...data.sys.dict,
            }

            this.abbrs = {}

            for (const route in this.dict) {
                this.abbrs[this.dict[route]] = route
            }
        }

        /**
         *
         * @param params SocketParams
         * @param url string
         */
        public connect(params: ConnectorOptions, url: string): void {
            this.maxReconnectAttempts = params.maxReconnectAttempts || WebSocketConnector.DEFAULT_MAX_RECONNECT_ATTEMPTS
            this.socket = new WebSocket(url)
            this.socket.binaryType = 'arraybuffer'
            this.socket.onopen = this.onOpen.bind(this)
            this.socket.onmessage = this.onMessage.bind(this)
            this.socket.onerror = this.onError.bind(this)
            this.socket.onclose = this.onClose.bind(this)
        }

        /**
         * 断开连接
         */
        public disconnect(): void {
            if (this.socket) {
                if (this.socket.close) {
                    this.socket.close()
                }
                this.isConnected = false
                logger.info('disconnect')

                this.socket = undefined
            }

            if (this.heartbeatId) {
                clearTimeout(this.heartbeatId)
                this.heartbeatId = undefined
            }
            if (this.heartbeatTimeoutId) {
                clearTimeout(this.heartbeatTimeoutId)
                this.heartbeatTimeoutId = undefined
            }

            this.lastTime = 0
        }

        /**
         * socket连接成功
         */
        private onOpen(): void {
            this.reset()

            let packet: Uint8Array = Package.encode(
              PackageType.HANDSHAKE,
              Protocol.strEncode(JSON.stringify(HandshakeBuffer)),
            )

            this.send(packet)
        }

        /**
         * socket重置
         */
        private reset(): void {
            this.reconnect = false
            // this.reconnectionDelay = 5000
            this.reconnectAttempts = 0

            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer)
                this.reconnectTimer = undefined
            }
        }

        /**
         * 接受请求服务器的返回
         * @param event
         */
        private onMessage(event: MessageEvent): void {
            this.processPackage(Package.decode(event.data))

            if (this.heartbeatTimeout) {
                this.nextHeartbeatTimeout = Date.now() + this.heartbeatTimeout
            }
        }

        /**
         * 将数据添加到记录里
         * @param packages
         */
        private processPackage(packages: PackageData[]): void {
            for (const pkg of packages) {
                switch (pkg.type) {
                    case PackageType.DATA:
                        this.onData(pkg.body!)
                        break

                    case PackageType.HEARTBEAT:
                        this.heartbeat()
                        break

                    case PackageType.HANDSHAKE_ACK:
                        // this.startHeartbeat()
                        break

                    case PackageType.HANDSHAKE:
                        this.handshake(pkg.body!)
                        break

                    case PackageType.KICK:
                        this.onKick(pkg.body)
                        break
                }
            }
        }

        private onError(): void {
            this.isConnected = false
        }

        private onClose(event: CloseEvent): void {
            this.isConnected = false

            logger.info('socket close: ', event)

            if (this.params?.reconnect && this.reconnectAttempts < this.maxReconnectAttempts && !this.isConnected) {
                this.reconnect = true
                this.reconnectAttempts++
            }

            this.disconnect()
        }

        reconnectMob(cb?: Function) {
            this.reconnectCallback = cb

            this.connect(this.params!, this.params!.wsUrl)
        }

        /**
         * 发送请求到服务器
         * @param route 路由
         * @param msg 发送的数据
         * @param isLoading 是否加载 此功能暂未开放
         * @param cb 发送消息结束服务器的返回
         * @returns
         */
        public request<R>(route: string, msg: unknown, isLoading: boolean, cb: (response: R) => void): void {
            if (!route) {
                return
            }

            this.reqId++
            this.sendMessage(this.reqId, route, msg)

            this.isShowLoads[this.reqId] = isLoading
            this.callbacks[this.reqId] = cb
            this.routeMap[this.reqId] = route
        }

        /**
         * 对请求数据进行加密发送至服务器
         * @param reqId 请求协议的唯一标识
         * @param route 请求协议的路由
         * @param msg 请求的数据
         */
        private sendMessage(reqId: number, route: string, msg: unknown): void {
            let newMsg = this.messageEncode(reqId, route, msg)
            this.send(Package.encode(PackageType.DATA, newMsg))
        }

        /**
         * 发送消息
         * @param packet Uint8Array类型数组
         */
        private send(packet: Uint8Array): void {
            this.socket?.send(packet.buffer)
        }

        /**
         * 对请求数据进行加密
         * @param reqId 请求协议的唯一标识
         * @param route 请求协议的路由
         * @param msg 请求的数据
         */
        private messageEncode(reqId: number, route: string | number, msg: unknown) {
            const type: MessageType = reqId ? MessageType.REQUEST : MessageType.NOTIFY
            let compressRoute = typeof route === "number"

            let message: Uint8Array

            if (msg !== null && msg !== undefined) {
                message = Protocol.strEncode(JSON.stringify(msg))
            } else {
                message = new Uint8Array(0)
            }

            return Message.encode(reqId, type, compressRoute, route, message)
        }

        /**
         * 将服务器的加密数据解码
         * @param data
         * @returns
         */
        private messageDecode(data: ArrayBufferLike): MessageData | undefined {
            let msg = Message.decode(data)
            if (msg.id > 0) {
                msg.route = this.routeMap[msg.id]
                delete this.routeMap[msg.id]

                if (!msg.route) {
                    return
                }
            }
            let route: string
            if (msg.compressRoute) {
                if (!this.abbrs[msg.route as number]) {
                    return
                }
                route = msg.route = this.abbrs[msg.route as number]
            } else {
                route = msg.route as string
            }

            try {
                msg.payload = JSON.parse(Protocol.strDecode(msg.body))
            } catch (error) {
                const newData = new Date()

                logger.error("default decode  time:, err:, routeNum:, bodyStr:", newData.toLocaleString(), error, route, String(msg.body))
            }

            return msg
        }
    }
}

