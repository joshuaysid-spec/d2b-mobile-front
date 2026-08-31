// Figma m_table(9300-28667) 1:1.
// atomic 을 별도 파일로 분리하지 않고 한 composite 안에 모두 정의 (사용자 요청).
//
// 행 단위 데이터 테이블 — 좌측 label 컬럼(120) + 우측 value 컬럼(208).
// rows[i].type 으로 value 렌더 모드 분기:
//   'default'      — 17px Regular ink 좌측 정렬 (기본)
//   'number'       — 17px Regular ink 우측 정렬 (숫자/금액 표시)
//   'date'         — value(string|number)를 yyyy-mm-dd 로 포맷해 표시 (숫자 8자리 미만이면 원본 그대로)
//   'combination'  — value 가 ReactNode — 그대로 렌더 (여러 줄, 버튼, Input 등 자유 컨텐츠)
//
// 행 사이에 1px divider(border-field, #c1d1ee) 자동.
// label 셀 배경 bg-primary-faint(#ecf1fa), 17px Medium muted, value 는 17px Regular ink (combination 은 컨테이너만 제공).
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

export type TableCellType = 'default' | 'number' | 'date' | 'combination'

/** 'date' 셀: 값에서 숫자만 추출해 앞 8자리를 yyyy-mm-dd 로. 8자리 미만(빈값·'-' 등)은 원본 유지. */
function formatDateValue(v: React.ReactNode): React.ReactNode {
  if (typeof v !== 'string' && typeof v !== 'number') return v
  const digits = String(v).replace(/\D/g, '')
  if (digits.length < 8) return v
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
}

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
      className={cn(
        'flex w-full flex-col bg-background',
        // 외곽선은 상/하 1px 만(border-y, 좌우 없음). 행/열 구분선은 cell 의 border 로 처리 →
        // 인접 경계가 같은 1px 선을 공유해 어디서도 2px 로 겹쳐 보이지 않는다(border-field #c1d1ee).
        bordered && 'border-y border-krds-border-field',
        className,
      )}
      {...props}
    >
      {rows.map((row, i) => {
        const type = row.type ?? 'default'
        return (
          <div
            role="row"
            key={i}
            className={cn(
              'flex w-full items-stretch',
              // 행 사이 구분선 — 첫 행 제외(외곽 top 과 겹쳐 2px 되는 것 방지)
              i > 0 && 'border-t border-krds-border-field',
            )}
          >
            {/* label cell — 120 폭, bg-primary-faint(#ecf1fa) · 우측 1px 구분선 · 17 Medium muted */}
            <div
              role="rowheader"
              className="flex w-[120px] shrink-0 items-center border-r border-krds-border-field bg-krds-bg-primary-faint px-krds-7 py-krds-5 text-[17px] font-medium leading-normal text-krds-text-muted"
            >
              {row.label}
            </div>
            {/* value cell */}
            <div
              role="cell"
              className={cn(
                // value 셀 안 버튼(보기/선택 등)은 콘텐츠 폭 + 최소 폭 74px (Figma).
                // combination 셀은 flex-col items-stretch 라 w-fit 가 없으면 버튼이 풀폭으로 늘어나
                // min-width 가 무의미해진다 → w-fit 로 콘텐츠 폭으로 줄이고 74px 를 하한으로 둔다.
                'flex flex-1 min-w-px px-krds-7 py-krds-5 [&_button]:w-fit [&_button]:min-w-[74px]',
                type === 'number'
                  ? 'items-center justify-end text-right text-[17px] leading-normal text-krds-text-ink tabular-nums'
                  : type === 'combination'
                    ? 'flex-col items-stretch gap-krds-5 text-[17px] leading-normal text-krds-text-ink'
                    : 'items-center text-[17px] leading-normal text-krds-text-ink wrap-break-word',
              )}
            >
              {type === 'date' ? formatDateValue(row.value) : row.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}
Table.displayName = 'Table'

export { Table }
