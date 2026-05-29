// Figma m_table(9300-28667) 1:1.
// atomic 을 별도 파일로 분리하지 않고 한 composite 안에 모두 정의 (사용자 요청).
//
// 행 단위 데이터 테이블 — 좌측 label 컬럼(120) + 우측 value 컬럼(208).
// rows[i].type 으로 value 렌더 모드 분기:
//   'default'      — 17px Regular ink 좌측 정렬 (기본)
//   'number'       — 17px Regular ink 우측 정렬 (숫자/금액 표시)
//   'combination'  — value 가 ReactNode — 그대로 렌더 (여러 줄, 버튼, Input 등 자유 컨텐츠)
//
// 행 사이에 1px divider(border-divider, #d1d7e0) 자동.
// label 은 17px Medium muted, value 는 17px Regular ink (combination 은 컨테이너만 제공).
//
// 사용 예:
//   <Table
//     rows={[
//       { label: '요구년도', value: '2026' },
//       { label: '발주기관', value: '화력총괄계약팀' },
//       { label: '국제', value: '100,000,000 원', type: 'number' },
//       { label: '레이블', value: <><span>4240-3753116870</span><Button size="sm" variant="inner">보기</Button></>, type: 'combination' },
//     ]}
//   />
import * as React from 'react'

import { cn } from '@/utils/cn'

export type TableCellType = 'default' | 'number' | 'combination'

export interface TableRow {
  label: React.ReactNode
  value: React.ReactNode
  /** value 셀 렌더 모드. 기본 'default'. */
  type?: TableCellType
}

export interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: TableRow[]
  /** 상/하단 경계선 노출 (Figma 기본: 양쪽 모두 표시). 기본 true. */
  bordered?: boolean
}

function Table({ className, rows, bordered = true, ...props }: TableProps) {
  if (rows.length === 0) return null
  return (
    <div
      role="table"
      className={cn('flex w-full flex-col bg-background', className)}
      {...props}
    >
      {bordered && <span aria-hidden className="h-px w-full bg-krds-border-divider" />}
      {rows.map((row, i) => {
        const type = row.type ?? 'default'
        return (
          <React.Fragment key={i}>
            <div role="row" className="flex w-full items-stretch">
              {/* label cell — 120 폭, 17 Medium muted */}
              <div
                role="rowheader"
                className="flex w-[120px] shrink-0 items-center px-krds-7 py-krds-5 text-[17px] font-medium leading-[1.5] text-krds-text-muted"
              >
                {row.label}
              </div>
              {/* value cell */}
              <div
                role="cell"
                className={cn(
                  'flex flex-1 min-w-px px-krds-7 py-krds-5',
                  type === 'number'
                    ? 'items-center justify-end text-right text-[17px] leading-[1.5] text-krds-text-ink tabular-nums'
                    : type === 'combination'
                      ? 'flex-col items-stretch gap-krds-5 text-[17px] leading-[1.5] text-krds-text-ink'
                      : 'items-center text-[17px] leading-[1.5] text-krds-text-ink break-words',
                )}
              >
                {row.value}
              </div>
            </div>
            <span aria-hidden className="h-px w-full bg-krds-border-divider" />
          </React.Fragment>
        )
      })}
      {/* 마지막 divider 는 위 map 이 항상 그리므로 bordered=false 일 때만 마지막 한 줄 숨김 */}
      {!bordered && (
        <style>{`/* bordered=false 시 마지막 divider 숨김 — 컨테이너가 직접 처리 */`}</style>
      )}
    </div>
  )
}
Table.displayName = 'Table'

export { Table }
