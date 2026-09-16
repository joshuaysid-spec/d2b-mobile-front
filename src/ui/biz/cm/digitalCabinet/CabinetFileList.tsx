// 디지털캐비닛 폴더 내 파일 목록 — 표시 전용(순수) 컴포넌트. M16 페이지와 첨부 팝업(CabinetPickFullPopup) 공용.
//   마크업/클래스는 DigitalCabinetFileListPage 원본 그대로. 선택 상태는 부모가 소유한다.
//   attachMode(첨부 진입)에서만 행이 선택 토글로 동작하고 체크박스가 보인다(설계서 00.공통 slide117).
import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'
import type { MockDigitalCabinetFile } from '@/types/mock/cm'

export interface CabinetFileListProps {
  files: MockDigitalCabinetFile[]
  /** 첨부 선택 모드 — 체크박스 노출 + 행 클릭 토글. false 면 조회 전용. */
  attachMode: boolean
  /** 선택된 파일 id(fileId) 목록. */
  selectedIds: string[]
  onToggle: (file: MockDigitalCabinetFile) => void
}

export function CabinetFileList({
  files,
  attachMode,
  selectedIds,
  onToggle,
}: CabinetFileListProps) {
  return (
    <ul className="flex flex-col gap-krds-7 px-4 pb-4 pt-4">
      {files.map((file) => {
        const selected = selectedIds.includes(file.fileId)
        return (
          <li key={file.fileId}>
            <button
              type="button"
              onClick={attachMode ? () => onToggle(file) : undefined}
              // 첨부 모드: 행 자체가 선택 토글(체크박스는 시각 표시) / 조회 모드: 상호작용 없음.
              role={attachMode ? 'checkbox' : undefined}
              aria-checked={attachMode ? selected : undefined}
              disabled={!attachMode}
              className={cn(
                'flex w-full items-center gap-krds-7 rounded-[12px] border bg-background p-krds-8 text-left shadow-[0px_0px_5px_0px_rgba(23,43,77,0.1)]',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2',
                !attachMode && 'cursor-default',
                selected
                  ? 'border-krds-border-primary bg-krds-bg-primary-faint'
                  : 'border-krds-border-divider',
              )}
            >
              {/* 선택 체크박스(설계서 2026-07-29 개정) — 첨부 모드에서만 노출. */}
              {attachMode && (
                <Icon
                  name={selected ? 'CheckBox' : 'CheckBoxOutlineBlank'}
                  size={24}
                  aria-hidden
                  className={cn(
                    'shrink-0',
                    selected ? 'text-krds-text-primary' : 'text-krds-text-muted',
                  )}
                />
              )}
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
  )
}
CabinetFileList.displayName = 'CabinetFileList'
