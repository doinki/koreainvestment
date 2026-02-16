# [ELW 비교대상종목조회 [국내주식-183]](https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/elw/v1/quotations/compare-stocks)

- Type: REST
- Method: GET
- URL: /uapi/elw/v1/quotations/compare-stocks
- 실전 DOMAIN: https://openapi.koreainvestment.com:9443
- 모의 DOMAIN: 미지원
- 실전 TR ID: FHKEW151701C0
- 모의 TR ID: 모의투자 미지원

## 개요

ELW 비교대상종목조회 API입니다.
기초자산 종목코드를 입력하셔서 해당 종목을 기초자산으로 하는 ELW 목록을 조회하실 수 있습니다.

## 요청

### Header

| Element        | 한글명            | Type   | Required | Length | Description                                                                                                                                                                                                                                            |
| -------------- | ----------------- | ------ | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| content-type   | 컨텐츠타입        | String | Y        | 40     | application/json; charset=utf-8                                                                                                                                                                                                                        |
| authorization  | 접근토큰          | String | Y        | 350    | OAuth 토큰이 필요한 API 경우 발급한 Access token 일반고객(Access token 유효기간 1일, OAuth 2.0의 Client Credentials Grant 절차를 준용) 법인(Access token 유효기간 3개월, Refresh token 유효기간 1년, OAuth 2.0의 Authorization Code Grant 절차를 준용) |
| appkey         | 앱키              | String | Y        | 36     | 한국투자증권 홈페이지에서 발급받은 appkey (절대 노출되지 않도록 주의해주세요.)                                                                                                                                                                         |
| appsecret      | 앱시크릿키        | String | Y        | 180    | 한국투자증권 홈페이지에서 발급받은 appkey (절대 노출되지 않도록 주의해주세요.)                                                                                                                                                                         |
| personalseckey | 고객식별키        | String | N        | 180    | [법인 필수] 제휴사 회원 관리를 위한 고객식별키                                                                                                                                                                                                         |
| tr_id          | 거래ID            | String | Y        | 13     | FHKEW151701C0                                                                                                                                                                                                                                          |
| tr_cont        | 연속 거래 여부    | String | N        | 1      | tr_cont를 이용한 다음조회 불가 API                                                                                                                                                                                                                     |
| custtype       | 고객 타입         | String | Y        | 1      | B : 법인 P : 개인                                                                                                                                                                                                                                      |
| seq_no         | 일련번호          | String | N        | 2      | [법인 필수] 001                                                                                                                                                                                                                                        |
| mac_address    | 맥주소            | String | N        | 12     | 법인고객 혹은 개인고객의 Mac address 값                                                                                                                                                                                                                |
| phone_number   | 핸드폰번호        | String | N        | 12     | [법인 필수] 제휴사APP을 사용하는 경우 사용자(회원) 핸드폰번호 ex) 01011112222 (하이픈 등 구분값 제거)                                                                                                                                                  |
| ip_addr        | 접속 단말 공인 IP | String | N        | 12     | [법인 필수] 사용자(회원)의 IP Address                                                                                                                                                                                                                  |
| gt_uid         | Global UID        | String | N        | 32     | [법인 전용] 거래고유번호로 사용하므로 거래별로 UNIQUE해야 함                                                                                                                                                                                           |

### Body

| Element               | 한글명           | Type   | Required | Length | Description                   |
| --------------------- | ---------------- | ------ | -------- | ------ | ----------------------------- |
| FID_COND_SCR_DIV_CODE | 조건화면분류코드 | String | Y        | 5      | 11517(Primary key)            |
| FID_INPUT_ISCD        | 입력종목코드     | String | Y        | 12     | 종목코드(ex)005930(삼성전자)) |

## 응답

### Header

| Element      | 한글명         | Type   | Required | Length | Description                                                  |
| ------------ | -------------- | ------ | -------- | ------ | ------------------------------------------------------------ |
| content-type | 컨텐츠타입     | String | Y        | 40     | application/json; charset=utf-8                              |
| tr_id        | 거래ID         | String | Y        | 13     | 요청한 tr_id                                                 |
| tr_cont      | 연속 거래 여부 | String | N        | 1      | tr_cont를 이용한 다음조회 불가 API                           |
| gt_uid       | Global UID     | String | N        | 32     | [법인 전용] 거래고유번호로 사용하므로 거래별로 UNIQUE해야 함 |

### Body

| Element       | 한글명          | Type   | Required | Length | Description |
| ------------- | --------------- | ------ | -------- | ------ | ----------- |
| rt_cd         | 성공 실패 여부  | String | Y        | 1      |             |
| msg_cd        | 응답코드        | String | Y        | 8      |             |
| msg1          | 응답메세지      | String | Y        | 80     |             |
| output        | 응답상세        | Object | Y        |        |             |
| elw_shrn_iscd | ELW단축종목코드 | String | Y        | 9      |             |
| elw_kor_isnm  | ELW한글종목명   | String | Y        | 40     |             |
