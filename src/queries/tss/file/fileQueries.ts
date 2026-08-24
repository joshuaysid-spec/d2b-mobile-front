// 파일첨부(File) Query 훅 — 횡단 관심사(op·bd·ct 공통), services/tss/file.ts 1:1.
// 3자 대칭: fileService · fileQueries. 쿼리키 없음(전부 사용자 액션 시점 useMutation) — keys.ts 없음.
// (2026-07-30 확정 — 페이지의 서비스 직접 import 금지. validateFile 등 순수 유틸은 예외).
import { useMutation } from '@tanstack/react-query'
import { fileService } from '@/services/tss/file'

export const fileQueries = {
  /** 파일 업로드(multipart) — 성공 시 서버 발급 UploadedFile(guid 등) 반환. */
  useUploadFile() {
    return useMutation({ mutationFn: (file: File) => fileService.uploadFile(file) })
  },

  /** 첨부 삭제(guid). */
  useRemoveFile() {
    return useMutation({ mutationFn: (guid: string) => fileService.removeFile(guid) })
  },

  /**
   * 첨부 다운로드(guid → Blob) — 이벤트 시점 실행이라 mutation 훅.
   * 사용 패턴(첨부서류 탭 공통):
   *   const downloadFile = fileQueries.useDownloadFile()
   *   saveBlob(await downloadFile.mutateAsync(guid), 파일명)   // 저장은 utils/download.saveBlob
   * 실패 시 throw — 호출부 try/catch 로 토스트/AlertModal 안내(slide27 4] 성공/실패 안내).
   */
  useDownloadFile() {
    return useMutation({ mutationFn: (guid: string) => fileService.downloadFile(guid) })
  },
}
