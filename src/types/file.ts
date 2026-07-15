// 파일첨부(File) 횡단 관심사 타입 — op·bd·ct 등 여러 도메인 공통.
// ⚠️ 도메인 파일(types/bd.ts 등)에 두지 않는다(다른 도메인이 특정 도메인 타입을 import 하는 역참조 방지).
// ⚠️ 필드명은 RaonK 응답 기준 잠정 — 백엔드 업로드 응답 스펙 확정 시 교체.

/** 업로드 완료된 첨부파일 1건 (서버 발급). */
export interface UploadedFile {
  /** 파일 식별자(RaonK GUID, UUID형 문자열). 불투명 취급 — 저장/삭제/다운로드 참조 키. */
  guid: string
  /** 원본 파일명(orgnlFileNm) — 목록 표시. */
  orgnlFileNm: string
  /** 파일 크기 바이트(fileSz) — 표시 시 formatFileSize 로 'KB/MB' 포맷. */
  fileSz: number
}
