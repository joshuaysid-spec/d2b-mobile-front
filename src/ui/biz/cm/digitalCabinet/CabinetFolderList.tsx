// 디지털캐비닛 폴더 목록 — 표시 전용(순수) 컴포넌트. M14 페이지와 첨부 팝업(CabinetPickFullPopup) 공용.
//   마크업/클래스는 DigitalCabinetPage 원본 그대로. 상태·네비게이션·시트는 부모가 소유한다.
//   권한 버튼은 대표자 조회 진입에서만(showPermBtn) — 첨부 선택 진입은 숨김(설계서 00.공통 slide118).
import { Icon } from '@/ui/common/base/Icon'
import { Button } from '@/ui/common/base/Button'
import { cn } from '@/utils/cn'
import type { MockDigitalCabinetFldr } from '@/types/mock/cm'

export interface CabinetFolderListProps {
  folders: MockDigitalCabinetFldr[]
  /** 폴더 클릭(전면 nav 버튼) — 파일 목록으로. */
  onOpen: (folder: MockDigitalCabinetFldr) => void
  /** 권한 버튼 노출 여부. 기본 false(첨부 선택 진입). */
  showPermBtn?: boolean
  onPerm?: (folder: MockDigitalCabinetFldr) => void
}

export function CabinetFolderList({
  folders,
  onOpen,
  showPermBtn = false,
  onPerm,
}: CabinetFolderListProps) {
  return (
    <ul className="flex w-full flex-col">
      {folders.map((folder, i) => {
        const last = i === folders.length - 1
        return (
          <li
            key={folder.fldrSn}
            className={cn(
              'relative flex w-full flex-col gap-krds-8',
              i > 0 && 'pt-krds-8',
              !last && 'border-b border-krds-border-divider pb-krds-8',
            )}
          >
            {/* 전면 nav 버튼 — 폴더 정보 클릭 시 파일 목록 이동. */}
            <button
              type="button"
              onClick={() => onOpen(folder)}
              aria-label={`${folder.fldrNm} 폴더 열기`}
              className="absolute inset-0 z-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
            />
            {/* 폴더 정보 행 */}
            <div className="pointer-events-none relative z-10 flex items-start gap-krds-5">
              <Icon
                name="Folder"
                size={24}
                aria-hidden
                className="mt-0.5 shrink-0 text-krds-text-ink"
              />
              <div className="flex min-w-px flex-1 flex-col gap-krds-5">
                <span className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                  {folder.fldrNm}
                </span>
                <div className="flex flex-wrap items-center gap-krds-5 text-[17px] leading-normal text-krds-text-muted">
                  <span>수정 {folder.mdfcnDt}</span>
                  <span className="h-5 w-px shrink-0 bg-krds-border-divider" aria-hidden />
                  <span>폴더 {folder.fldrSz}</span>
                </div>
              </div>
            </div>
            {/* 권한 버튼 — 대표자 & 파일첨부 진입 아닐 때만. 전체폭 navy(tertiary). */}
            {showPermBtn && (
              <Button
                variant="tertiary"
                onClick={() => onPerm?.(folder)}
                className="pointer-events-auto relative z-10 w-full"
              >
                권한
              </Button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
CabinetFolderList.displayName = 'CabinetFolderList'
