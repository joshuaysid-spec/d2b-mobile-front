// 파일첨부(File) 서비스 — RaonK 백엔드 REST 연동(B안). 현재 백엔드 미연동 — 목업 스텁.
// frontend-architecture.md §7.1 — services 는 apiClient 로 호출 후 도메인 모델로 매핑.
// ⚠️ 실연동 시 이 파일의 '추후 API' 블록만 실제 apiClient 호출로 교체하면 된다(경계 격리).
//    업로드 엔드포인트/요청필드/응답필드는 백엔드(eGovFrame + RaonK)와 협의 후 확정.
import type { UploadedFile } from '@/types/file'

/** 첨부 1건 최대 크기 — 설계서 slide107 유의사항(건당 10MB 미만). */
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * 클라이언트 사전 검증(UX용) — 통과 시 null, 위반 시 사유 문자열.
 * 확장자 변조·바이러스 등 권위 검증은 백엔드(RaonK 핸들러) 소관.
 */
export function validateFile(file: File): string | null {
  if (file.size >= MAX_FILE_SIZE) {
    return `${file.name}: 건당 10MB 미만 파일만 첨부 가능합니다.`
  }
  return null
}

export const fileService = {
  /**
   * 파일 업로드(multipart). 성공 시 서버가 발급한 UploadedFile(guid 등) 반환.
   * 현재 목업 — 실제 GUID 형식 값을 생성해 반환한다.
   */
  async upload(file: File): Promise<UploadedFile> {
    console.log('[fileService] upload (API 스텁)', file.name, file.size)
    // 추후 API: multipart 전송. Content-Type 은 비워 브라우저가 boundary 를 자동 생성하게 한다.
    //   const form = new FormData()
    //   form.append('file', file)
    //   form.append('bizDivCd', 'BD')                 // 백엔드 요구 파라미터
    //   return apiClient.post('/v1/bds/files', form, {
    //     headers: { 'Content-Type': undefined },      // ← 지우지 않으면 multipart 깨짐
    //   })  // 인터셉터가 봉투 벗겨 data(UploadedFile) 반환
    await new Promise((resolve) => setTimeout(resolve, 400)) // 업로드중 UX 확인용 지연(목업)
    return {
      guid: crypto.randomUUID(),
      orgnlFileNm: file.name,
      fileSz: file.size,
    }
  },

  /** 업로드 파일 삭제(guid). 현재 목업 스텁. */
  async remove(guid: string): Promise<void> {
    console.log('[fileService] remove (API 스텁)', guid)
    // 추후 API: return apiClient.delete(`/v1/bds/files/${guid}`)
  },
}
