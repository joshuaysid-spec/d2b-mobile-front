// 고객센터 게시판 상세 공용 뷰 — 공지사항/자료실/시스템개선안내 상세(MUI-CM-04-M02·M22·M24·M26·M28·M30·M32).
// Figma 10020-82258 기준. 구조가 동일해 이 뷰로 조립하고, 각 상세(설계서 영문 화면 ID)는 slot/데이터만 주입.
//
// 구성(위→아래): 상단(배지+제목+날짜 — card list와 동일) → 메타(작성자/담당부서/구분/게시기간, 설계서 slide224)
//   → 내용(bbsCn) → 첨부파일(총 N건 + FileDownloadList) → 목록 버튼 → 이전글/다음글.
import type { ReactNode } from 'react'

import { SectionDivider } from '@/ui/common/base/SectionDivider'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'

/** 이전글/다음글 이동 대상 — null 이면 '없습니다' 표시. */
export interface BoardDetailSibling {
  title: ReactNode
  onClick: () => void
}

export interface BoardDetailViewProps {
  /** 상단 배지(긴급/구분 등) — card list와 동일. */
  badges: ReactNode
  /** 제목(bbsTtl/rpstrTtl). */
  title: ReactNode
  /** 상단 날짜(작성일자) — card list와 동일. */
  date: ReactNode
  /** 메타 정보 행(작성자/담당부서/구분/게시기간 등, 설계서). 없으면 미표시. */
  metaRows?: { label: ReactNode; value: ReactNode }[]
  /** 본문 내용(bbsCn). 여러 줄은 그대로 펼쳐서 표시. */
  content: ReactNode
  /** 첨부파일 목록. 비어있으면 첨부 섹션 미표시. */
  files?: FileDownloadItem[]
  /** 이전글 — null 이면 '이전글이 없습니다'. */
  prev: BoardDetailSibling | null
  /** 다음글 — null 이면 '다음글이 없습니다'. */
  next: BoardDetailSibling | null
}

// 이전글/다음글 한 줄 — 라벨 + 제목(클릭 시 이동) 또는 '없습니다'.
function SiblingRow({ label, sibling }: { label: string; sibling: BoardDetailSibling | null }) {
  return (
    <div className="flex flex-col gap-krds-3">
      <span className="text-[17px] leading-normal text-krds-text-muted">{label}</span>
      {sibling ? (
        <button
          type="button"
          onClick={sibling.onClick}
          className="truncate text-left text-[19px] font-medium leading-normal text-krds-text-ink focus-visible:outline-hidden active:opacity-70"
        >
          {sibling.title}
        </button>
      ) : (
        <span className="text-[19px] font-medium leading-normal text-krds-text-ink">
          {label}이 없습니다
        </span>
      )}
    </div>
  )
}

export function BoardDetailView({
  badges,
  title,
  date,
  metaRows,
  content,
  files,
  prev,
  next,
}: BoardDetailViewProps) {
  return (
    <div className="flex w-full flex-col">
      {/* 상단 — 배지 + 제목 + 날짜 (card list와 동일) */}
      <div className="flex flex-col gap-krds-5 px-4 py-4">
        <div className="flex flex-wrap items-start gap-krds-5">{badges}</div>
        <span className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
          {title}
        </span>
        <span className="text-[17px] leading-normal text-krds-text-muted">{date}</span>
      </div>

      {/* 메타 — 작성자/담당부서/구분/게시기간 (설계서 slide224) */}
      {metaRows && metaRows.length > 0 && (
        <>
          <SectionDivider />
          <dl className="flex flex-col gap-krds-5 px-4 py-4">
            {metaRows.map((row, i) => (
              <div key={i} className="flex items-baseline gap-krds-7">
                <dt className="w-[88px] shrink-0 text-[17px] leading-normal text-krds-text-muted">
                  {row.label}
                </dt>
                <dd className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-ink wrap-break-word">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}

      {/* 내용(bbsCn) — 여러 줄 그대로 표시 */}
      <SectionDivider />
      <div className="whitespace-pre-wrap px-4 py-4 text-[17px] leading-normal text-krds-text-ink wrap-break-word">
        {content}
      </div>

      {/* 첨부파일 — 파란 바(총 N건) + 파일 목록 */}
      {files && files.length > 0 && (
        <div className="flex flex-col">
          <div className="flex h-14 items-center gap-krds-7 border-t border-krds-border-divider bg-krds-bg-primary-faint px-4">
            <span className="min-w-px flex-1 text-[19px] font-bold leading-normal text-krds-text-ink">
              첨부파일
            </span>
            <span className="shrink-0 text-[17px] leading-normal text-krds-text-primary-active">
              총 {files.length}건
            </span>
          </div>
          <div className="px-4 py-4">
            <FileDownloadList files={files} />
          </div>
        </div>
      )}

      {/* 이전글 / 다음글 */}
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        <SiblingRow label="이전글" sibling={prev} />
        <SectionDivider />
        <SiblingRow label="다음글" sibling={next} />
      </div>
    </div>
  )
}
BoardDetailView.displayName = 'BoardDetailView'
