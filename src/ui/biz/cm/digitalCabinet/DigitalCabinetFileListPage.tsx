// MUI-CM-06-M16 폴더 내 파일 목록 (DigitalCabinetFileListPage). 설계서 00.공통 v0.84 slide111·112.
// 선택한 디지털캐비닛 폴더의 파일 목록. 상단 "상위 폴더 목록 이동" 클릭 → 디지털캐비닛(M14) 복귀.
//   파일 등록/삭제는 PC 에서만. 파일첨부/업로드 > 디지털캐비닛 선택으로 진입한 경우:
//     - 파일 선택 시 하이라이트 + 하단 "파일 업로드" 버튼 노출(설계서 slide111).
// 웹경로: 메인 홈 > 마이페이지 > 디지털캐비닛(> 폴더). 셸 안 + sub헤더. 4뎁스라 BottomNav 숨김.
//
// 상단(폴더명)은 목록에서 넘어온 folder(navigate state)로 그리고, 직접 진입(state 없음)이면 페이지 목업.
// 데이터=파일 내 목업(데이터영역 dl_digitalCabinetFileList 항목명/형식), 동작=경계 스텁.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Icon } from '@/ui/common/base/Icon'
import { Button } from '@/ui/common/base/Button'
import { Notice } from '@/ui/common/composites/Notice'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import type { DigitalCabinetFile, DigitalCabinetFldr } from '@/types/cm'

// ── 목업 (설계서 slide111 예시 + 데이터영역 dl_digitalCabinetFileList 항목명/형식) ────
const MOCK_FLDR: DigitalCabinetFldr = { fldrSn: '1', fldrNm: '입찰 제출서류', fldrSz: '10MB' }
const MOCK_FILES: DigitalCabinetFile[] = [
  { fileId: 'f1', fileNm: '사업자등록증.pdf', fileSz: '369KB', vldPrdEndYmd: '2025-01-31', eldocYn: 'N' },
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

// ⚠️ 목업 — 파일첨부/업로드 > 디지털캐비닛 선택으로 진입했는지(선택 하이라이트 + 업로드 버튼).
//    네비게이션 연동 시 navigate state(진입경로)로 교체.
const MOCK_FROM_ATTACH = false

export function DigitalCabinetFileListPage() {
  const navigate = useNavigate()
  // 목록에서 넘어온 폴더(navigate state)로 상단 폴더명 표시. 직접 진입이면 페이지 목업.
  const folder = (useLocation().state as DigitalCabinetFldr | null) ?? MOCK_FLDR
  // 파일첨부 진입 시 선택된 파일 id(하이라이트).
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // ── 동작 스텁 ──
  const handleBackToFolders = () => {
    // 상위 폴더 목록(디지털캐비닛 M14)으로 이동.
    navigate(ROUTES.DIGITAL_CABINET)
  }
  const handleFileClick = (file: DigitalCabinetFile) => {
    if (MOCK_FROM_ATTACH) {
      setSelectedId((prev) => (prev === file.fileId ? null : file.fileId))
      console.log('[DigitalCabinetFileList] 파일 선택', file.fileId)
      return
    }
    console.log('[DigitalCabinetFileList] 파일 열기', file.fileId) // 추후: 파일 다운로드/미리보기
  }
  const handleUpload = () => {
    console.log('[DigitalCabinetFileList] 파일 업로드', selectedId) // 추후: fileService 로 선택 파일 첨부
  }
  const handleHelp = () => {
    console.log('[DigitalCabinetFileList] 업무도움')
  }

  return (
    <div className="flex w-full flex-col">
      {/* 안내(중요) — Figma m_notice_urgent 1:1. 공통 Notice urgent 재사용. */}
      <Notice type="urgent">폴더와 파일의 추가. 삭제는 PC 버전에서 가능합니다.</Notice>

      {/* 상위 폴더 목록 이동(뒤로) — ← 📁 상위 폴더 목록 이동 */}
      <button
        type="button"
        onClick={handleBackToFolders}
        className="mx-4 mt-4 flex items-center gap-krds-5 rounded-krds-8 border border-krds-border-field p-krds-7 text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
      >
        <Icon name="ArrowBack" size={20} aria-hidden className="shrink-0 text-krds-text-ink" />
        <Icon name="Folder" size={24} fill={1} aria-hidden className="shrink-0 text-krds-text-primary" />
        <span className="min-w-px flex-1 text-[17px] font-bold leading-normal text-krds-text-ink">
          상위 폴더 목록 이동
        </span>
      </button>

      {/* 현재 폴더명 — 목록에서 넘어온 폴더(state). */}
      <div className="flex items-center gap-krds-5 px-4 pt-4">
        <span className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
          {folder.fldrNm}
        </span>
        <span className="text-[15px] leading-normal text-krds-text-muted">
          폴더크기 {folder.fldrSz}
        </span>
      </div>

      {/* 파일 리스트 — 📄 파일명 [파일크기] / 유효기간. */}
      <ul className="flex flex-col gap-krds-7 px-4 pb-4 pt-4">
        {MOCK_FILES.map((file) => {
          const selected = selectedId === file.fileId
          return (
            <li key={file.fileId}>
              <button
                type="button"
                onClick={() => handleFileClick(file)}
                className={cn(
                  'flex w-full items-center gap-krds-7 rounded-[12px] border bg-background p-krds-8 text-left shadow-[0px_0px_5px_0px_rgba(23,43,77,0.1)]',
                  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
                  selected
                    ? 'border-krds-border-primary bg-krds-bg-primary-faint'
                    : 'border-krds-border-divider',
                )}
              >
                <Icon
                  name="Description"
                  size={28}
                  aria-hidden
                  className="shrink-0 text-krds-text-primary-active"
                />
                <div className="flex min-w-px flex-1 flex-col gap-0.5">
                  <span className="text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                    {file.fileNm} <span className="font-normal text-krds-text-muted">[{file.fileSz}]</span>
                  </span>
                  <span className="text-[15px] leading-normal text-krds-text-muted">
                    유효기간 {file.vldPrdEndYmd ?? '-'}
                  </span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>

      {/* 파일 업로드 버튼 — 파일첨부/업로드 진입 시에만 노출(설계서 slide111). */}
      {MOCK_FROM_ATTACH && (
        <div className="px-4 pb-2">
          <Button variant="primary" className="w-full" onClick={handleUpload} disabled={!selectedId}>
            <Icon name="Upload" size={20} aria-hidden />
            파일 업로드
          </Button>
        </div>
      )}

      {/* 업무도움 */}
      <div className="px-4 pb-6 pt-2">
        <Button variant="secondary" className="w-full" onClick={handleHelp}>
          <Icon name="Info" size={20} aria-hidden />
          업무도움
        </Button>
      </div>

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-20 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />
    </div>
  )
}
DigitalCabinetFileListPage.displayName = 'DigitalCabinetFileListPage'
