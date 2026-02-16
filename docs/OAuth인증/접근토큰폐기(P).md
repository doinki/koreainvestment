# [접근토큰폐기(P)[인증-002]](https://apiportal.koreainvestment.com/apiservice-apiservice?/oauth2/revokeP)

- Type: REST
- Method: POST
- URL: /oauth2/revokeP
- 실전 DOMAIN: https://openapi.koreainvestment.com:9443
- 모의 DOMAIN: https://openapivts.koreainvestment.com:29443
- 실전 TR ID: null
- 모의 TR ID: null

## 개요

부여받은 접큰토큰을 더 이상 활용하지 않을 때 사용합니다.

## 요청

### Header

### Body

| Element   | 한글명        | Type   | Required | Length | Description                                                                                                                                                                                                                                            |
| --------- | ------------- | ------ | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| appkey    | 고객 앱Key    | String | Y        | 36     | 한국투자증권 홈페이지에서 발급받은 appkey (절대 노출되지 않도록 주의해주세요.)                                                                                                                                                                         |
| appsecret | 고객 앱Secret | String | Y        | 180    | 한국투자증권 홈페이지에서 발급받은 appsecret (절대 노출되지 않도록 주의해주세요.)                                                                                                                                                                      |
| token     | 접근토큰      | String | Y        | 286    | OAuth 토큰이 필요한 API 경우 발급한 Access token 일반고객(Access token 유효기간 1일, OAuth 2.0의 Client Credentials Grant 절차를 준용) 법인(Access token 유효기간 3개월, Refresh token 유효기간 1년, OAuth 2.0의 Authorization Code Grant 절차를 준용) |

## 응답

### Header

### Body

| Element | 한글명     | Type   | Required | Length | Description   |
| ------- | ---------- | ------ | -------- | ------ | ------------- |
| code    | 응답코드   | String | N        | 8      | HTTP 응답코드 |
| message | 응답메세지 | String | N        | 450    | 응답메세지    |
