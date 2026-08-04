// Figma m_file_download(9300-36444) — 다운로드 파일 리스트.
// 파일 행(파일명 + 용량 박스 + 다운로드 아이콘 버튼) N개 + 구분선 + '일괄 다운로드' 버튼.
// 업로드 변형: 항목에 onRemove 를 주면 다운로드 버튼 옆에 X(삭제) 아이콘 버튼이 추가된다
//   (onDownload 없이 onRemove 만 주면 삭제 버튼만 — 업로드 목록 용도).
//   업로드 진행 표시: status('waiting'|'uploading'|'error')로 행 우측에 상태 라벨,
//   실패 행은 onRetry 로 재업로드 아이콘 버튼 노출 — 순차(1건씩) 업로드 화면 공통.
//   하단 버튼은 onDownloadAll(다운로드 변형) 또는 onAddFile(업로드 변형) 로 — 구분선 + 풀폭 버튼.
// 데이터 무소유 — 사용처가 files / onDownloadAll / onAddFile 주입.
import * as React from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { SectionDivider } from '@/ui/common/base/SectionDivider'
import { cn } from '@/utils/cn'

export interface FileDownloadItem {
  /** 식별자(고유). 없으면 인덱스 사용 — 동적 목록이면 반드시 지정(파일명은 중복 가능). */
  id?: string | number
  /** 파일명 (예: '첨부파일명.hwp') */
  name: string
  /** 용량 — 대괄호 없이 (예: '786KB'). 표시 시 [ ] 로 감쌈. */
  size?: string
  /** 개별 다운로드 클릭 */
  onDownload?: () => void
  /** 개별 삭제(X) 클릭 — 주어지면 다운로드 버튼 옆에 X 아이콘 버튼 노출(업로드 목록 용도). */
  onRemove?: () => void
  /** 업로드 진행 상태 — 지정 시 행 우측에 상태 라벨 표시(순차 업로드 목록 용도). */
  status?: 'waiting' | 'uploading' | 'error'
  /** 재업로드 클릭 — 실패(status='error') 행에서 재시도 아이콘 버튼 노출. */
  onRetry?: () => void
}

const STATUS_LABEL = { waiting: '대기', uploading: '업로드 중…', error: '실패' } as const

export interface FileDownloadListProps extends React.HTMLAttributes<HTMLDivElement> {
  files: FileDownloadItem[]
  /** '일괄 다운로드' 클릭. 미주입 시 버튼 미노출. */
  onDownloadAll?: () => void
  /** 일괄 다운로드 버튼 라벨. 기본 '일괄 다운로드'. */
  downloadAllLabel?: React.ReactNode
  /** '파일 추가' 클릭(업로드 변형). 미주입 시 버튼 미노출. */
  onAddFile?: () => void
  /** 파일 추가 버튼 라벨. 기본 '파일 추가'. */
  addFileLabel?: React.ReactNode
  /** 행 아이콘(다운로드/삭제) 크기(px). 기본 23. */
  iconSize?: number
}

// 행 우측 아이콘 버튼 공통 스타일 (48×48 정사각, border-primary) — 다운로드/삭제 동일.
// ⚠️ w-12!/min-w-12! 는 Table value 셀의 `[&_button]:w-fit [&_button]:min-w-[74px]`(Figma 보기/선택 버튼 규칙)를
//    되돌리기 위한 것. 그 규칙은 자손 선택자라 size-12 보다 우선해 첨부파일 행에서 아이콘 버튼이 74px 로 늘어난다
//    (첨부파일을 Table 안에 넣는 화면이 다수 — 신청내역상세·사전심사·입찰결과 등).
const ROW_ICON_BUTTON = cn(
  'flex size-12 w-12! min-w-12! shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-primary bg-background text-krds-text-primary',
  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2 active:bg-krds-action-pressed',
)

function FileRow({
  name,
  size,
  onDownload,
  onRemove,
  status,
  onRetry,
  iconSize = 23,
}: FileDownloadItem & { iconSize?: number }) {
  return (
    <div className="flex w-full items-center gap-krds-5">
      {/* 파일명 + 용량 (읽기전용 회색 박스) */}
      <div className="flex h-12 min-w-px flex-1 items-center gap-krds-3 overflow-hidden rounded-krds-8 border border-krds-border-disabled bg-krds-bg-disabled-soft px-krds-5">
        <span className="truncate text-[17px] leading-normal text-krds-text-ink">{name}</span>
        {size && (
          <span className="shrink-0 text-[17px] leading-normal text-krds-text-muted">
            [{size}]
          </span>
        )}
        {status && (
          <span
            role="status"
            className={cn(
              'ml-auto shrink-0 text-[15px] leading-normal',
              status === 'error' ? 'text-krds-feedback-danger' : 'text-krds-text-muted',
            )}
          >
            {STATUS_LABEL[status]}
          </span>
        )}
      </div>
      {/* 재업로드 아이콘 버튼 — 실패 행만 */}
      {status === 'error' && onRetry && (
        <button
          type="button"
          aria-label={`${name} 재업로드`}
          onClick={onRetry}
          className={ROW_ICON_BUTTON}
        >
          <Icon name="Refresh" size={iconSize} aria-hidden />
        </button>
      )}
      {/* 다운로드 아이콘 버튼 */}
      {onDownload && (
        <button
          type="button"
          aria-label={`${name} 다운로드`}
          onClick={onDownload}
          className={ROW_ICON_BUTTON}
        >
          <Icon name="Download" size={iconSize} aria-hidden />
        </button>
      )}
      {/* 삭제(X) 아이콘 버튼 — onRemove 있을 때만 */}
      {onRemove && (
        <button
          type="button"
          aria-label={`${name} 삭제`}
          onClick={onRemove}
          className={ROW_ICON_BUTTON}
        >
          <Icon name="Close" size={iconSize} aria-hidden />
        </button>
      )}
    </div>
  )
}

function FileDownloadList({
  className,
  files,
  onDownloadAll,
  downloadAllLabel = '일괄 다운로드',
  onAddFile,
  addFileLabel = '파일 추가',
  iconSize,
  ...props
}: FileDownloadListProps) {
  return (
    <div className={cn('flex w-full flex-col gap-krds-8', className)} {...props}>
      <div className="flex w-full flex-col gap-krds-5">
        {files.map((file, i) => (
          <FileRow key={file.id ?? i} {...file} iconSize={iconSize} />
        ))}
      </div>
      {/* 하단 버튼 — 구분선 + 풀폭 버튼. 다운로드 변형(일괄 다운로드) / 업로드 변형(파일 추가) */}
      {onDownloadAll && (
        <>
          <SectionDivider />
          <Button variant="inner" className="w-full" onClick={onDownloadAll}>
            {downloadAllLabel}
          </Button>
        </>
      )}
      {onAddFile && (
        <>
          <SectionDivider />
          <Button variant="inner" className="w-full" onClick={onAddFile}>
            {addFileLabel}
          </Button>
        </>
      )}
    </div>
  )
}
FileDownloadList.displayName = 'FileDownloadList'

export { FileDownloadList }
