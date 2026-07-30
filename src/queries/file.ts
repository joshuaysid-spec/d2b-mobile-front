// 파일첨부(File) Query 훅 — 횡단 관심사(op·bd·ct 공통), services/file.ts 1:1.
// 업로드/삭제는 사용자 액션 시점 실행이라 useMutation 훅으로만 구성
// (2026-07-30 확정 — 페이지의 서비스 직접 import 금지. validateFile 등 순수 유틸은 예외).
import { useMutation } from '@tanstack/react-query'
import { fileService } from '@/services/file'

/** 파일 업로드(multipart) — 성공 시 서버 발급 UploadedFile(guid 등) 반환. */
export function useUploadFile() {
  return useMutation({ mutationFn: (file: File) => fileService.upload(file) })
}

/** 첨부 삭제(guid). */
export function useRemoveFile() {
  return useMutation({ mutationFn: (guid: string) => fileService.remove(guid) })
}
