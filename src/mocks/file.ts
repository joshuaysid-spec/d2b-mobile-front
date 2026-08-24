// 파일첨부(File) 목업 데이터 — USE_MOCK=true 일 때 fbService 가 반환.
// upload 는 File 인자에서 계산(인라인), download 는 인라인 Blob 이라 여기엔 없다.
// pickFromCabinet(디지털 캐비닛 선택)만 정적 목업이 필요해 이 파일에 둔다.
// ⚠️ 실백엔드 연동 시 이 파일은 사용되지 않는다(서비스가 apiClient 분기).
import type { UploadedFile } from '@/types/file'

// 디지털 캐비닛에서 선택된 첨부 목록(목업) — 캐비닛 조회 API 미확정이라 잠정.
const CABINET_PICKS: UploadedFile[] = [
  { guid: '11111111-1111-4111-8111-111111111111', orgnlFileNm: '보안측정_증명서.pdf', fileSz: 262144 },
  { guid: '22222222-2222-4222-8222-222222222222', orgnlFileNm: '법인등기부등본.pdf', fileSz: 524288 },
]

export const MOCK_FILE = {
  cabinetPicks: CABINET_PICKS,
} as const
