# [ETF 구성종목시세[국내주식-073]](https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/etfetn/v1/quotations/inquire-component-stock-price)

- Type: REST
- Method: GET
- URL: /uapi/etfetn/v1/quotations/inquire-component-stock-price
- 실전 DOMAIN: https://openapi.koreainvestment.com:9443
- 모의 DOMAIN: 모의투자 미지원
- 실전 TR ID: FHKST121600C0
- 모의 TR ID: 모의투자 미지원

## 개요

ETF 구성종목시세 API입니다.
한국투자 HTS(eFriend Plus) &gt; [0245] ETF/ETN 구성종목시세 화면의 기능을 API로 개발한 사항으로, 해당 화면을 참고하시면 기능을 이해하기 쉽습니다.

## 요청

### Header

| Element        | 한글명            | Type   | Required | Length | Description                                                                                                                                                                                                                                            |
| -------------- | ----------------- | ------ | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| content-type   | 컨텐츠타입        | String | Y        | 40     | application/json; charset=utf-8                                                                                                                                                                                                                        |
| authorization  | 접근토큰          | String | Y        | 350    | OAuth 토큰이 필요한 API 경우 발급한 Access token 일반고객(Access token 유효기간 1일, OAuth 2.0의 Client Credentials Grant 절차를 준용) 법인(Access token 유효기간 3개월, Refresh token 유효기간 1년, OAuth 2.0의 Authorization Code Grant 절차를 준용) |
| appkey         | 앱키              | String | Y        | 36     | 한국투자증권 홈페이지에서 발급받은 appkey (절대 노출되지 않도록 주의해주세요.)                                                                                                                                                                         |
| appsecret      | 앱시크릿키        | String | Y        | 180    | 한국투자증권 홈페이지에서 발급받은 appkey (절대 노출되지 않도록 주의해주세요.)                                                                                                                                                                         |
| personalseckey | 고객식별키        | String | N        | 180    | [법인 필수] 제휴사 회원 관리를 위한 고객식별키                                                                                                                                                                                                         |
| tr_id          | 거래ID            | String | Y        | 13     | FHKST121600C0                                                                                                                                                                                                                                          |
| tr_cont        | 연속 거래 여부    | String | N        | 1      | tr_cont를 이용한 다음조회 불가 API                                                                                                                                                                                                                     |
| custtype       | 고객 타입         | String | Y        | 1      | B : 법인 P : 개인                                                                                                                                                                                                                                      |
| seq_no         | 일련번호          | String | N        | 2      | [법인 필수] 001                                                                                                                                                                                                                                        |
| mac_address    | 맥주소            | String | N        | 12     | 법인고객 혹은 개인고객의 Mac address 값                                                                                                                                                                                                                |
| phone_number   | 핸드폰번호        | String | N        | 12     | [법인 필수] 제휴사APP을 사용하는 경우 사용자(회원) 핸드폰번호 ex) 01011112222 (하이픈 등 구분값 제거)                                                                                                                                                  |
| ip_addr        | 접속 단말 공인 IP | String | N        | 12     | [법인 필수] 사용자(회원)의 IP Address                                                                                                                                                                                                                  |
| gt_uid         | Global UID        | String | N        | 32     | [법인 전용] 거래고유번호로 사용하므로 거래별로 UNIQUE해야 함                                                                                                                                                                                           |

### Body

| Element                | 한글명           | Type   | Required | Length | Description         |
| ---------------------- | ---------------- | ------ | -------- | ------ | ------------------- |
| FID_COND_MRKT_DIV_CODE | 조건시장분류코드 | String | Y        | 2      | 시장구분코드 (J)    |
| FID_INPUT_ISCD         | 입력종목코드     | String | Y        | 12     | 종목코드            |
| FID_COND_SCR_DIV_CODE  | 조건화면분류코드 | String | Y        | 5      | Unique key( 11216 ) |

## 응답

### Header

| Element      | 한글명         | Type   | Required | Length | Description                                                  |
| ------------ | -------------- | ------ | -------- | ------ | ------------------------------------------------------------ |
| content-type | 컨텐츠타입     | String | Y        | 40     | application/json; charset=utf-8                              |
| tr_id        | 거래ID         | String | Y        | 13     | 요청한 tr_id                                                 |
| tr_cont      | 연속 거래 여부 | String | N        | 1      | tr_cont를 이용한 다음조회 불가 API                           |
| gt_uid       | Global UID     | String | N        | 32     | [법인 전용] 거래고유번호로 사용하므로 거래별로 UNIQUE해야 함 |

### Body

| Element                      | 한글명                | Type         | Required | Length | Description |
| ---------------------------- | --------------------- | ------------ | -------- | ------ | ----------- |
| rt_cd                        | 성공 실패 여부        | String       | Y        | 1      |             |
| msg_cd                       | 응답코드              | String       | Y        | 8      |             |
| msg1                         | 응답메세지            | String       | Y        | 80     |             |
| output1                      | 응답상세              | Object       | Y        |        |             |
| output1.stck_prpr            | 주식 현재가           | String       | Y        | 10     |             |
| output1.prdy_vrss            | 전일 대비             | String       | Y        | 10     |             |
| output1.prdy_vrss_sign       | 전일 대비 부호        | String       | Y        | 1      |             |
| output1.prdy_ctrt            | 전일 대비율           | String       | Y        | 82     |             |
| output1.etf_cnfg_issu_avls   | ETF구성종목시가총액   | String       | Y        | 18     |             |
| output1.nav                  | NAV                   | String       | Y        | 112    |             |
| output1.nav_prdy_vrss_sign   | NAV 전일 대비 부호    | String       | Y        | 1      |             |
| output1.nav_prdy_vrss        | NAV 전일 대비         | String       | Y        | 112    |             |
| output1.nav_prdy_ctrt        | NAV 전일 대비율       | String       | Y        | 84     |             |
| output1.etf_ntas_ttam        | ETF 순자산 총액       | String       | Y        | 22     |             |
| output1.prdy_clpr_nav        | NAV전일종가           | String       | Y        | 112    |             |
| output1.oprc_nav             | NAV시가               | String       | Y        | 112    |             |
| output1.hprc_nav             | NAV고가               | String       | Y        | 112    |             |
| output1.lprc_nav             | NAV저가               | String       | Y        | 112    |             |
| output1.etf_cu_unit_scrt_cnt | ETF CU 단위 증권 수   | String       | Y        | 18     |             |
| output1.etf_cnfg_issu_cnt    | ETF 구성 종목 수      | String       | Y        | 18     |             |
| output2                      | 응답상세              | Object Array | Y        |        | array       |
| output2.stck_shrn_iscd       | 주식 단축 종목코드    | String       | Y        | 9      |             |
| output2.hts_kor_isnm         | HTS 한글 종목명       | String       | Y        | 40     |             |
| output2.stck_prpr            | 주식 현재가           | String       | Y        | 10     |             |
| output2.prdy_vrss            | 전일 대비             | String       | Y        | 10     |             |
| output2.prdy_vrss_sign       | 전일 대비 부호        | String       | Y        | 1      |             |
| output2.prdy_ctrt            | 전일 대비율           | String       | Y        | 82     |             |
| output2.acml_vol             | 누적 거래량           | String       | Y        | 18     |             |
| output2.acml_tr_pbmn         | 누적 거래 대금        | String       | Y        | 18     |             |
| output2.tday_rsfl_rate       | 당일 등락 비율        | String       | Y        | 52     |             |
| output2.prdy_vrss_vol        | 전일 대비 거래량      | String       | Y        | 18     |             |
| output2.tr_pbmn_tnrt         | 거래대금회전율        | String       | Y        | 82     |             |
| output2.hts_avls             | HTS 시가총액          | String       | Y        | 18     |             |
| output2.etf_cnfg_issu_avls   | ETF구성종목시가총액   | String       | Y        | 18     |             |
| output2.etf_cnfg_issu_rlim   | ETF구성종목비중       | String       | Y        | 72     |             |
| output2.etf_vltn_amt         | ETF구성종목내평가금액 | String       | Y        | 18     |             |
