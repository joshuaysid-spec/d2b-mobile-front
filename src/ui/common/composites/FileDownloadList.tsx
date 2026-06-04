// Figma m_file_download(9300-36444) — 다운로드 파일 리스트.
// 파일 행(파일명 + 용량 박스 + 다운로드 아이콘 버튼) N개 + 구분선 + '일괄 다운로드' 버튼.
// (업로드 변형 m_file_upload_list 의 추가/삭제·메시지는 미구현 — 다운로드 용도에 집중. 추후 확장.)
// 데이터 무소유 — 사용처가 files / onDownloadAll 주입.
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
}

export interface FileDownloadListProps extends React.HTMLAttributes<HTMLDivElement> {
  files: FileDownloadItem[]
  /** '일괄 다운로드' 클릭. 미주입 시 버튼 미노출. */
  onDownloadAll?: () => void
  /** 일괄 다운로드 버튼 라벨. 기본 '일괄 다운로드'. */
  downloadAllLabel?: React.ReactNode
}

function FileRow({ name, size, onDownload }: FileDownloadItem) {
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
      </div>
      {/* 다운로드 아이콘 버튼 (48×48, border-primary) */}
      <button
        type="button"
        aria-label={`${name} 다운로드`}
        onClick={onDownload}
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-primary bg-background text-krds-text-primary',
          'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2 active:bg-krds-action-pressed',
        )}
      >
        <Icon name="Download" size={20} aria-hidden />
      </button>
    </div>
  )
}

function FileDownloadList({
  className,
  files,
  onDownloadAll,
  downloadAllLabel = '일괄 다운로드',
  ...props
}: FileDownloadListProps) {
  return (
    <div className={cn('flex w-full flex-col gap-krds-8', className)} {...props}>
      <div className="flex w-full flex-col gap-krds-5">
        {files.map((file, i) => (
          <FileRow key={file.id ?? i} {...file} />
        ))}
      </div>
      {onDownloadAll && (
        <>
          <SectionDivider />
          <Button variant="inner" className="w-full" onClick={onDownloadAll}>
            {downloadAllLabel}
          </Button>
        </>
      )}
    </div>
  )
}
FileDownloadList.displayName = 'FileDownloadList'

export { FileDownloadList }
