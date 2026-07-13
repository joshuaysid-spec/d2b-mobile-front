// MUI-CM-04-M14 인증서 관리 / MUI-CM-04-P15 인증서 삭제. 설계서 00.공통 v0.83 slide337·338.
// ⚠️ 인증서 항목은 스마트PKI 솔루션이 제공하며, 설계서에 데이터영역(항목명 영문) 표가 없다.
//    아래 필드명은 화면 표기(발급기관/타이틀명/유효기간) 기준의 잠정 명칭 — 항목명 확정 시 교체 필요.
export interface CertItem {
  /** 로컬 식별자(목록 key·삭제 대상 식별). */
  id: string
  /** 발급기관 (예: 한국정보인증, 코스콤). */
  issuer: string
  /** 인증서 타이틀명. */
  certNm: string
  /** 유효기간 만료일 'YYYY-MM-DD'. */
  validUntil: string
}
