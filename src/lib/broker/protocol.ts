import * as fflate from 'fflate'

export const enum CompressType {
    NONE = 0,
    ZLIB = 1,
    GZIP = 2,
}

export namespace Protocol {
    export const PKG_HEAD_BYTES: number = 4;
    export const MSG_FLAG_BYTES: number = 1;
    export const MSG_ROUTE_CODE_BYTES: number = 2;
    export const MSG_ID_MAX_BYTES: number = 5;
    export const MSG_ROUTE_LEN_BYTES: number = 1;

    export const MSG_ROUTE_CODE_MAX: number = 0xffff;

    export const MSG_COMPRESS_ROUTE_MASK: number = 0x1;
    export const MSG_TYPE_MASK: number = 0x7;

    const utf8Encoder = new TextEncoder();
    const utf8Decoder = new TextDecoder('utf-8');

    /**
     * 基于 UTF-8 的字符串编码为字节流
     * @param str
     */
    export function strEncode(str: string): Uint8Array {
        return utf8Encoder.encode(str);
    }

    /**
     * 基于 UTF-8 的字节流解码为字符串
     * @param buffer
     */
    export function strDecode(buffer: Uint8Array): string {
        return utf8Decoder.decode(inflate(buffer));
    }

    /**
     * 检查数据的压缩类型（相关逻辑取自 Pitaya Source）
     * @param buffer
     */
    export function isCompressed(buffer: Uint8Array): CompressType {
        if (buffer.length > 2) {
            const d0 = buffer[0];
            const d1 = buffer[1];

            if (d0 === 0x78 &&
              (d1 === 0x9C ||
                d1 === 0x01 ||
                d1 === 0xDA ||
                d1 === 0x5E)) {
                return CompressType.ZLIB;
            } else if (d0 === 0x1F && d1 === 0x8B) {
                return CompressType.GZIP;
            }
        }

        return CompressType.NONE;
    }

    /**
     * 根据数据扫描结果，解压缩对应字节流
     * @param buffer 用于扫描的字节流
     * @return 解压缩后的字节流
     */
    export function inflate(buffer: Uint8Array): Uint8Array {
        const type = isCompressed(buffer);

        switch (type) {
            case CompressType.ZLIB:
                return fflate.unzlibSync(buffer);

            case CompressType.GZIP: {
                const unzipped = fflate.unzipSync(buffer);
                let bytes: Uint8Array

                for (const unzip in unzipped) {
                    bytes = unzipped[unzip];
                }

                return bytes!;
            }

            default:
                return buffer;
        }
    }

    /**
     * 字节流复制
     * @param dest
     * @param dOffset
     * @param src
     * @param sOffset
     * @param length
     */
    export function copyArray(dest: Uint8Array, dOffset: number, src: Uint8Array, sOffset: number, length: number) {
        if (length > 0) {
            // Uint8Array
            for (let index = 0; index < length; index++) {
                dest[dOffset++] = src[sOffset++];
            }
        }
    }
}

export const enum PackageType {
    HANDSHAKE = 1,
    HANDSHAKE_ACK = 2,
    HEARTBEAT = 3,
    DATA = 4,
    KICK = 5,
}

export type PackageData = {
    type: PackageType
    body?: Uint8Array
}

export namespace Package {

    /**
     * 客户端数据封包
     * @param type 数据封包类型
     * @param body 数据封包内容（Protobuf 格式）
     * @return Uint8Array 数据封包字节流
     */
    export function encode(type: PackageType, body?: Uint8Array): Uint8Array {
        const length = body?.length ?? 0;
        const buffer = new Uint8Array(Protocol.PKG_HEAD_BYTES + length);

        let index = 0;
        buffer[index++] = type & 0xff;
        buffer[index++] = (length >> 16) & 0xff;
        buffer[index++] = (length >> 8) & 0xff;
        buffer[index++] = length & 0xff;

        if (body) {
            Protocol.copyArray(buffer, index, body, 0, length);
        }

        return buffer;
    }

    /**
     * 客户端数据解包
     * @param buffer 数据封包字节流
     * @return 拆封后数据包
     */
    export function decode(buffer: ArrayBufferLike): PackageData[] {
        let offset = 0;
        const bytes = new Uint8Array(buffer);
        let length = 0;
        const rs: PackageData[] = [];

        while (offset < bytes.length) {
            let type = bytes[offset++];
            length = ((bytes[offset++]) << 16 | (bytes[offset++]) << 8 | bytes[offset++]) >>> 0;

            let body: Uint8Array | undefined;
            if (length > 0) {
                body = new Uint8Array(length);
                Protocol.copyArray(body, 0, bytes, offset, length);
                offset += length;
            }

            rs.push({ type, body });
        }

        return rs;
    }
}

export const enum MessageType {
    REQUEST = 0,
    NOTIFY = 1,
    RESPONSE = 2,
    PUSH = 3,
}

export namespace Message {

    /**
     * 业务消息编码为字节流
     * @param id
     * @param type
     * @param compressRoute
     * @param route
     * @param msg
     */
    export function encode(id: number, type: MessageType, compressRoute: boolean, route: string | number, msg: Uint8Array): Uint8Array {
        // calculate the max length of this message
        const idBytes = msgHasId(type) ? calculateMsgIdBytes(id) : 0;
        let msgLen = Protocol.MSG_FLAG_BYTES + idBytes;
        let routeBytes: Uint8Array;

        if (msgHasRoute(type)) {
            if (compressRoute) {
                if (typeof route !== 'number') {
                    throw new Error('error flag for number route!');
                }
                msgLen += Protocol.MSG_ROUTE_CODE_BYTES;
            } else {
                msgLen += Protocol.MSG_ROUTE_LEN_BYTES;
                if (route) {
                    routeBytes = Protocol.strEncode(route as string);
                    if (routeBytes.length > 255) {
                        throw new Error('route maxlength is overflow');
                    }
                    msgLen += routeBytes.length;
                }
            }
        }

        if (msg) {
            msgLen += msg.length;
        }

        let buffer = new Uint8Array(msgLen);
        let offset = 0;

        // add flag
        offset = encodeMsgFlag(type, compressRoute, buffer, offset);

        // add message id
        if (msgHasId(type)) {
            offset = encodeMsgId(id, buffer, offset);
        }

        // add route
        if (msgHasRoute(type)) {
            offset = encodeMsgRoute(compressRoute, compressRoute ? route as number : routeBytes!, buffer, offset);
        }

        // add body
        if (msg) {
            offset = encodeMsgBody(msg, buffer, offset);
        }

        return buffer;
    }

    export type MessageData = {
        id: number;
        type: number;
        compressRoute: boolean;
        route: string | number;
        body: Uint8Array;
        payload?: any;
    }

    /**
     * 从字节流解码为业务消息
     * @param buffer
     */
    export function decode(buffer: ArrayBufferLike): MessageData {
        const bytes = new Uint8Array(buffer);
        const bytesLen: number = bytes.length || bytes.byteLength;
        let offset: number = 0;
        let id = 0;

        // parse flag
        const flag = bytes[offset++];
        const compressRoute = (flag & Protocol.MSG_COMPRESS_ROUTE_MASK) !== 0;
        const type = ((flag >> 1) & Protocol.MSG_TYPE_MASK) as MessageType;

        // parse id
        if (msgHasId(type)) {
            let m = bytes[offset];
            let i = 0;
            do {
                m = bytes[offset];
                id = id + ((m & 0x7f) * Math.pow(2, (7 * i)));
                offset++;
                i++;
            } while (m >= 128);
        }

        // parse route
        let route: string | number;

        if (msgHasRoute(type)) {
            if (compressRoute) {
                route = (bytes[offset++]) << 8 | bytes[offset++];
            } else {

                let routeLen = bytes[offset++];
                if (routeLen) {
                    const bytesRoute = new Uint8Array(routeLen);
                    Protocol.copyArray(bytesRoute, 0, bytes, offset, routeLen);
                    route = Protocol.strDecode(bytesRoute);
                } else {
                    route = '';
                }
                offset += routeLen;
            }
        }

        // parse body
        const bodyLen = bytesLen - offset;
        const body = new Uint8Array(bodyLen);

        Protocol.copyArray(body, 0, bytes, offset, bodyLen);

        return {
            id, type, compressRoute,
            route: route!, body,
        };
    }

    export function msgHasId(type: MessageType): boolean {
        return type === MessageType.REQUEST || type === MessageType.RESPONSE;
    }

    export function msgHasRoute(type: MessageType): boolean {
        return type === MessageType.REQUEST || type === MessageType.NOTIFY ||
            type === MessageType.PUSH;
    }

    export function calculateMsgIdBytes(id: number): number {
        let len = 0;
        do {
            len += 1;
            id >>= 7;
        } while (id > 0);
        return len;
    }

    export function encodeMsgFlag(type: MessageType, compressRoute: boolean, buffer: Uint8Array, offset: number): number {
        if (type !== MessageType.REQUEST && type !== MessageType.NOTIFY &&
            type !== MessageType.RESPONSE && type !== MessageType.PUSH) {
            throw new Error('unknown message type: ' + type);
        }

        buffer[offset] = (type << 1) | (compressRoute ? 1 : 0);

        return offset + Protocol.MSG_FLAG_BYTES;
    }

    export function encodeMsgId(id: number, buffer: Uint8Array, offset: number): number {
        do {
            let tmp = id % 128;
            const next = Math.floor(id / 128);

            if (next !== 0) {
                tmp = tmp + 128;
            }
            buffer[offset++] = tmp;

            id = next;
        } while (id !== 0);

        return offset;
    }

    export function encodeMsgRoute(compressRoute: boolean, route: Uint8Array | number, buffer: Uint8Array, offset: number): number {
        if (compressRoute) {
            const numberRoute = route as number;

            if (numberRoute > Protocol.MSG_ROUTE_CODE_MAX) {
                throw new Error('route number is overflow');
            }

            buffer[offset++] = (numberRoute >> 8) & 0xff;
            buffer[offset++] = numberRoute & 0xff;
        } else {
            const bytesRoute = route as Uint8Array;

            if (bytesRoute) {
                buffer[offset++] = bytesRoute.length & 0xff;
                Protocol.copyArray(buffer, offset, bytesRoute, 0, bytesRoute.length);
                offset += bytesRoute.length;
            } else {
                buffer[offset++] = 0;
            }
        }

        return offset;
    }

    export function encodeMsgBody(msg: Uint8Array, buffer: Uint8Array, offset: number): number {
        Protocol.copyArray(buffer, offset, msg, 0, msg.length);
        return offset + msg.length;
    }
}