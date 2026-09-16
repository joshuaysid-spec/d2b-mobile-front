// 디지털캐비닛 목업 — 페이지(M14/M16)와 첨부 팝업(CabinetPickFullPopup) 공용.
//   컴포넌트 파일에서 상수를 export 하면 react-refresh 경고(컴포넌트 외 export)라 별도 모듈로 분리.
//   값은 기존 페이지 목업 그대로(설계서 00.공통 v0.84 slide108/110, v0.85 slide117 데이터영역).
import type { MockDigitalCabinetFile, MockDigitalCabinetFldr } from '@/types/mock/cm'

// ── 폴더 목록 (설계서 slide108/110 예시 + 데이터영역 dl_digitalCabinetFldrList) ───────
export const MOCK_CABINET_FOLDERS: MockDigitalCabinetFldr[] = [
  {
    fldrSn: '1',
    fldrNm: '입찰 제출서류',
    fldrSz: '10MB',
    mdfrNm: '김대표',
    regDt: '2025-01-10 09:00',
    mdfcnDt: '2025-01-31 12:12',
    authrtList: [
      { userNm: '김대표', authrtSe: 'write', mdfcnDt: '2025-01-15 13:25' },
      { userNm: '박영업', authrtSe: 'read', mdfcnDt: '2025-01-15 14:47' },
      { userNm: 'James Burkley', authrtSe: 'none', mdfcnDt: '2025-01-15 16:22' },
    ],
  },
  {
    fldrSn: '2',
    fldrNm: '계약 관련 서류',
    fldrSz: '10MB',
    mdfrNm: '박영업',
    regDt: '2025-01-12 10:30',
    mdfcnDt: '2025-01-31 12:12',
    authrtList: [
      { userNm: '김대표', authrtSe: 'write', mdfcnDt: '2025-01-15 13:25' },
      { userNm: '박영업', authrtSe: 'write', mdfcnDt: '2025-01-15 14:47' },
    ],
  },
  {
    fldrSn: '3',
    fldrNm: '증빙 서류',
    fldrSz: '5MB',
    mdfrNm: '김대표',
    regDt: '2025-01-14 11:00',
    mdfcnDt: '2025-01-31 12:12',
    authrtList: [{ userNm: '김대표', authrtSe: 'write', mdfcnDt: '2025-01-15 13:25' }],
  },
]

// ── 폴더 내 파일 목록 (설계서 slide117 예시 + 데이터영역 dl_digitalCabinetFileList) ───
export const MOCK_CABINET_FILES: MockDigitalCabinetFile[] = [
  {
    fileId: 'f1',
    fileNm: '사업자등록증.pdf',
    fileSz: '369KB',
    vldPrdEndYmd: '2025-01-31',
    eldocYn: 'N',
  },
  {
    fileId: 'f2',
    fileNm: '4대사회보험사업장가입자명부.pdf',
    fileSz: '20KB',
    vldPrdEndYmd: '2025-01-31',
    eldocYn: 'N',
  },
  {
    fileId: 'f3',
    fileNm: '4대사회보험사업장가입내역확인서.pdf',
    fileSz: '20KB',
    vldPrdEndYmd: '2025-01-31',
    eldocYn: 'N',
  },
  { fileId: 'f4', fileNm: '전자문서.pdf', fileSz: '20KB', eldocYn: 'Y' },
]
