// MUI-CM-06-M16 폴더 내 파일 목록 (DigitalCabinetFileListPage). 설계서 00.공통 v0.85 slide117(+데이터영역 slide118).
// 선택한 디지털캐비닛 폴더의 파일 목록. 상단 "상위 폴더 목록 이동" 클릭 → 디지털캐비닛(M14) 복귀.
//   파일 등록/삭제는 PC 에서만(상단 중요 안내).
// 웹경로: 메인 홈 > 마이페이지 > 디지털캐비닛(> 폴더). 셸 안 + sub헤더. 4뎁스라 BottomNav 숨김.
//
// 화면 구성(slide117 목업 실측 순서): 중요 Notice → 업무도움(접힘 disclosure) → ← 📁 상위 폴더 목록 이동
//   → 파일 리스트([체크박스] 📄 파일명 [크기] / 유효기간) → 제일 하단 [선택 파일 첨부].
//
// ⚠️ 설계서 2026-07-29 개정 — "디지털 캐비닛에서 파일을 첨부하는 화면" 추가:
//      · 파일 행 좌측 세로중앙에 **체크박스**(선택 여부 확인) + 선택 시 행 하이라이트 — 여러 건 선택 가능
//      · 제일 하단 [선택 파일 첨부] — 선택 0건이면 비활성, 체크하면 활성
//      · 첨부 시 신청서 등의 첨부항목에 선택 자료 업로드 후 **이전 화면으로 복귀**
//    설계서는 이 UI 를 '파일첨부·파일업로드 > 디지털캐비닛 선택' 진입 케이스로 그리고 있으나, 상위 첨부 화면의
//    진입점이 아직 없어 **항상 노출**한다(2026-08-03 사용자 지시). 진입 경로별 분기가 필요해지면 그때 나눈다.
// 데이터=파일 내 목업(데이터영역 dl_digitalCabinetFileList 항목명/형식), 동작=경계 스텁.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Icon } from '@/ui/common/base/Icon'
import { Button } from '@/ui/common/base/Button'
import { Notice } from '@/ui/common/composites/Notice'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { CabinetHelpDisclosure } from '@/ui/biz/cm/digitalCabinet/CabinetHelpDisclosure'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import type { MockDigitalCabinetFile } from '@/types/mock/cm'

// ── 목업 (설계서 slide117 예시 + 데이터영역 dl_digitalCabinetFileList 항목명/형식) ────
const MOCK_FILES: MockDigitalCabinetFile[] = [
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

export function DigitalCabinetFileListPage() {
  const navigate = useNavigate()
  // 선택한 파일 id 집합(체크박스 — 여러 건 선택). [선택 파일 첨부] 활성 조건도 이 값으로 판정.
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // ── 동작 스텁 ──
  const handleBackToFolders = () => {
    // 상위 폴더 목록(디지털캐비닛 M14)으로 이동.
    navigate(ROUTES.DIGITAL_CABINET)
  }
  // 파일 행 클릭 = 선택 토글(행 하이라이트 + 좌측 체크박스 표시).
  const handleFileClick = (file: MockDigitalCabinetFile) => {
    setSelectedIds((prev) =>
      prev.includes(file.fileId) ? prev.filter((id) => id !== file.fileId) : [...prev, file.fileId],
    )
  }
  // [선택 파일 첨부] — 선택 자료를 이전(파일첨부하던) 화면의 첨부항목으로 올리고 그 화면으로 복귀.
  const handleAttach = () => {
    console.log('[DigitalCabinetFileList] 선택 파일 첨부', selectedIds) // 추후: 첨부항목에 선택 파일 전달
    navigate(-1)
  }

  return (
    <div className="flex w-full flex-col">
      {/* 안내(중요) — Figma m_notice_urgent 1:1. 공통 Notice urgent 재사용. */}
      <Notice type="urgent">폴더와 파일의 추가. 삭제는 PC 버전에서 가능합니다.</Notice>

      {/* 업무도움 — 설계서 slide117 목업 기준 Notice 바로 아래(접힘 disclosure). 폴더목록(M14)과 동일 컴포넌트. */}
      <CabinetHelpDisclosure />

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

      {/* 파일 리스트 — [체크박스] 📄 파일명 [파일크기] / 유효기간.
          체크박스는 카드 좌측 세로중앙(items-center)에 두고, gap-krds-7(12px)로 본문과 띄워 영역이 겹치지 않게 한다. */}
      <ul className="flex flex-col gap-krds-7 px-4 pb-4 pt-4">
        {MOCK_FILES.map((file) => {
          const selected = selectedIds.includes(file.fileId)
          return (
            <li key={file.fileId}>
              <button
                type="button"
                onClick={() => handleFileClick(file)}
                // 행 자체가 선택 토글 — 체크박스는 시각 표시(버튼 안 중첩 상호작용 방지).
                role="checkbox"
                aria-checked={selected}
                className={cn(
                  'flex w-full items-center gap-krds-7 rounded-[12px] border bg-background p-krds-8 text-left shadow-[0px_0px_5px_0px_rgba(23,43,77,0.1)]',
                  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
                  selected
                    ? 'border-krds-border-primary bg-krds-bg-primary-faint'
                    : 'border-krds-border-divider',
                )}
              >
                {/* 선택 여부 확인용 체크박스(설계서 2026-07-29 개정) — 좌측 세로중앙. */}
                <Icon
                  name={selected ? 'CheckBox' : 'CheckBoxOutlineBlank'}
                  size={24}
                  aria-hidden
                  className={cn(
                    'shrink-0',
                    selected ? 'text-krds-text-primary' : 'text-krds-text-muted',
                  )}
                />
                {/* 파일 정보 — 체크박스 영역과 분리된 본문 컬럼. */}
                <div className="flex min-w-px flex-1 items-center gap-krds-7">
                  <Icon
                    name="Description"
                    size={28}
                    aria-hidden
                    className="shrink-0 text-krds-text-primary-active"
                  />
                  <div className="flex min-w-px flex-1 flex-col gap-0.5">
                    <span className="text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                      {file.fileNm}{' '}
                      <span className="font-normal text-krds-text-muted">[{file.fileSz}]</span>
                    </span>
                    <span className="text-[15px] leading-normal text-krds-text-muted">
                      유효기간 {file.vldPrdEndYmd ?? '-'}
                    </span>
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>

      {/* [선택 파일 첨부] — 화면 제일 하단. 선택 0건이면 비활성, 체크하면 활성(설계서 slide117). */}
      <div className="px-4 pb-6">
        <Button
          variant="primary"
          className="w-full"
          onClick={handleAttach}
          disabled={selectedIds.length === 0}
        >
          <Icon name="Upload" size={20} aria-hidden />
          선택 파일 첨부
        </Button>
      </div>

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />
    </div>
  )
}
DigitalCabinetFileListPage.displayName = 'DigitalCabinetFileListPage'
