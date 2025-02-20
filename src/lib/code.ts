export const enum Code {
  StatusOk = 200, // RFC 9110, 15.3.1

  StatusBadRequest = 400, // RFC 9110, 15.5.1
  StatusUnauthorized = 401, // RFC 9110, 15.5.2
  StatusPaymentRequired = 402, // RFC 9110, 15.5.3
  StatusForbidden = 403, // RFC 9110, 15.5.4
  StatusNotFound = 404, // RFC 9110, 15.5.5
  StatusMethodNotAllowed = 405, // RFC 9110, 15.5.6
  StatusNotAcceptable = 406, // RFC 9110, 15.5.7

  StatusInternalServerError = 500, // RFC 9110, 15.6.1
  StatusNotImplemented = 501, // RFC 9110, 15.6.2
  StatusBadGateway = 502, // RFC 9110, 15.6.3
  StatusServiceUnavailable = 503, // RFC 9110, 15.6.4
  StatusGatewayTimeout = 504, // RFC 9110, 15.6.5

  CodeLoginDuplicated = 600, // 登录信息重复
  CodeRoleNameDuplicated = 601, // 角色信息重复
}
