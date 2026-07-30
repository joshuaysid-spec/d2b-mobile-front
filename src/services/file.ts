// 파일첨부(File) 서비스 — RaonK 백엔드 REST 연동(B안). 횡단 관심사(op·bd·ct 공통).
// USE_MOCK=true(기본): 목업 반환 · false: apiClient 실호출.
// ⚠️ 폐쇄망 반입 후 실백엔드 경로/요청필드/응답필드 확정 시 EP 맵만 수정한다(메서드 본문 불변).
//    업로드 엔드포인트/요청필드/응답필드는 백엔드(eGovFrame + RaonK)와 협의 후 확정.
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_FILE } from '@/mocks/file'
import type { UploadedFile } from '@/types/file'

const EP = {
  /** 업로드(multipart) — 횡단 파일 저장소. (구 추정 '/v1/bds/files' → 횡단이라 '/v1/files' 로 이동) */
  UPLOAD: '/v1/files',
  /** 삭제 — guid 로 첨부 제거. */
  FILE: (guid: string) => `/v1/files/${guid}`,
  /** 다운로드 — guid 로 원본 바이너리(Blob) 조회. */
  DOWNLOAD: (guid: string) => `/v1/files/${guid}/download`,
  /** 디지털 캐비닛 선택 — 보관함에서 첨부 선택. (캐비닛 조회 API 미확정 — 잠정) */
  CABINET: '/v1/files/cabinet',
} as const

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
   * 목업은 실제 GUID 형식 값을 생성(File 인자에서 계산).
   */
  async upload(file: File): Promise<UploadedFile> {
    if (USE_MOCK) {
      // 업로드중 UX 확인용 지연(목업) + 서버 GUID 형식 값 생성.
      return mockDelay(
        { guid: crypto.randomUUID(), orgnlFileNm: file.name, fileSz: file.size },
        400,
      )
    }
    const form = new FormData()
    form.append('file', file)
    form.append('bizDivCd', 'BD') // 백엔드 요구 파라미터
    // Content-Type 을 비워 브라우저가 multipart boundary 를 자동 생성하게 한다(지우면 multipart 깨짐 — 유지 필수).
    return apiClient.post<UploadedFile, UploadedFile>(EP.UPLOAD, form, {
      headers: { 'Content-Type': undefined },
    })
  },

  /** 업로드 파일 삭제(guid). */
  async remove(guid: string): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined)
    return apiClient.post<void, void>(EP.FILE(guid))
  },

  /** 파일 다운로드(guid) — 원본 바이너리(Blob) 반환. 저장/뷰어는 호출측 담당. */
  async download(guid: string): Promise<Blob> {
    if (USE_MOCK) return mockDelay(new Blob([`mock file ${guid}`], { type: 'application/octet-stream' }))
    return apiClient.post<Blob, Blob>(EP.DOWNLOAD(guid), null, { responseType: 'blob' })
  },

  /** 디지털 캐비닛(보관함)에서 첨부 선택 — 선택한 파일 목록 반환. */
  async pickFromCabinet(): Promise<UploadedFile[]> {
    if (USE_MOCK) return mockDelay(MOCK_FILE.cabinetPicks)
    return apiClient.post<UploadedFile[], UploadedFile[]>(EP.CABINET)
  },
}
