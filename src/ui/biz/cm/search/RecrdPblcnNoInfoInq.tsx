// 조서발행번호정보조회 (MUI-EX-01-P06, 이행 설계서 04. v0.83 slide34~35).
// 조서발행번호를 입력·검색해 품목 정보(dlt_RecrdPblcnNoItemInfo)를 확인하고 → footer '조서발행번호 선택' 시 번호 반환.
// 검색필터의 '조서발행번호' selectionField(searchSheet:'recrdPblcnNo')에서 호출 — 검사및납품조서현황(P09) 등 이행 계열.
// 콘텐츠 전용 — BottomSheet 컨테이너/타이틀/footer([닫기/조서발행번호 선택])는 SearchFilter 셸이 슬롯으로 소유한다.
//   내부 [검색] 버튼은 설계서 원본대로 콘텐츠가 소유(검색 전엔 목록 없음). OvsCtrtNoInq(P79) 확정형 패턴.
// 항목명은 설계서 slide35 그대로: 검색(dmt_RecrdPblcnNo)=recrdPblcnNo /
//   결과(dlt_RecrdPblcnNoItemInfo)=no·prcmRqtNo·itemNm·ctrtQty·ctrtUntprc·ctrtAmt·dlvgdsCmptnQty·dlvgdsQty.
// 목록은 목업(추후 API: exService.getRecrdPblcnNoItemInfos 류로 대체).
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { SearchSheetHandle } from '@/types/search-filter'

// 조서발행번호 품목 정보 1건 (dlt_RecrdPblcnNoItemInfo, 설계서 slide35 항목명 그대로)
interface RecrdPblcnNoItemInfo {
  /** 번호 (no, 10) */
  no: number
  /** 조달요구번호 (prcmRqtNo, 15) */
  prcmRqtNo: string
  /** 품목명 (itemNm, 200) */
  itemNm: string
  /** 계약수량 (ctrtQty, 15,2) */
  ctrtQty: number
  /** 계약단가 (ctrtUntprc, 17,2) */
  ctrtUntprc: number
  /** 계약금액 (ctrtAmt, 17,2) */
  ctrtAmt: number
  /** 납품완료수량 (dlvgdsCmptnQty, 15,2) */
  dlvgdsCmptnQty: number
  /** 납품수량 (dlvgdsQty, 15,2) */
  dlvgdsQty: number
}

// 목업 결과 (설계서 slide34 목업값 형식) — 추후 API 로 대체.
const MOCK_RESULTS: RecrdPblcnNoItemInfo[] = Array.from({ length: 3 }, (_, i) => ({
  no: i + 1,
  prcmRqtNo: `00000000000000${i + 1}`,
  itemNm: '품명 정보 표시',
  ctrtQty: 100000,
  ctrtUntprc: 100000,
  ctrtAmt: 10000000000,
  dlvgdsCmptnQty: 10000,
  dlvgdsQty: 10000,
}))

// 품목 1건 → 표 행 (slide34 결과 표 순서).
function itemRows(it: RecrdPblcnNoItemInfo): TableRow[] {
  return [
    { label: '순번', value: String(it.no) },
    { label: '조달요구번호', value: it.prcmRqtNo },
    { label: '품명', value: it.itemNm },
    { label: '계약수량', value: it.ctrtQty.toLocaleString(), type: 'number' },
    { label: '계약단가', value: `${it.ctrtUntprc.toLocaleString()} 원`, type: 'number' },
    { label: '계약금액', value: `${it.ctrtAmt.toLocaleString()} 원`, type: 'number' },
    { label: '납품완료수량', value: it.dlvgdsCmptnQty.toLocaleString(), type: 'number' },
    { label: '납품수량', value: it.dlvgdsQty.toLocaleString(), type: 'number' },
  ]
}

export interface RecrdPblcnNoInfoInqProps {
  /** footer '조서발행번호 선택' 확정 시 호출 — 검색한 조서발행번호를 호출 필드로 반환(셸이 시트를 닫는다). */
  onSelect: (recrdPblcnNo: string) => void
}

const RecrdPblcnNoInfoInq = forwardRef<SearchSheetHandle, RecrdPblcnNoInfoInqProps>(
  ({ onSelect }, ref) => {
    const [recrdPblcnNo, setRecrdPblcnNo] = useState('')
    const [results, setResults] = useState<RecrdPblcnNoItemInfo[] | null>(null) // null = 검색 전
    const [searched, setSearched] = useState('') // 검색 확정된 조서발행번호(확정 반환값)

    const reset = useCallback(() => {
      setRecrdPblcnNo('')
      setResults(null)
      setSearched('')
    }, [])

    // 조서발행번호 검색(목업) — 추후 exService 실호출로 대체.
    const handleSearch = useCallback(() => {
      const no = recrdPblcnNo.trim()
      if (!no) return
      setResults(MOCK_RESULTS)
      setSearched(no)
      console.log('[P06] 조서발행번호정보조회 검색', { recrdPblcnNo: no })
    }, [recrdPblcnNo])

    // footer '조서발행번호 선택'(확정) — 검색 확정된 번호 반환. 검색 전엔 무시.
    const confirm = useCallback(() => {
      if (searched) onSelect(searched)
    }, [searched, onSelect])

    useImperativeHandle(ref, () => ({ reset, search: handleSearch, confirm }), [
      reset,
      handleSearch,
      confirm,
    ])

    return (
      <div className="flex flex-col gap-krds-7">
        {/* 검색 조건 (dmt_RecrdPblcnNo) */}
        <div className="flex flex-col gap-krds-7">
          <div className="flex items-center gap-krds-5">
            <InputLabel required className="w-[110px] shrink-0">
              조서발행번호
            </InputLabel>
            <InputBox
              value={recrdPblcnNo}
              placeholder="번호를 입력해주세요."
              className="min-w-px flex-1"
              onChange={(e) => setRecrdPblcnNo(e.target.value)}
              onClear={() => setRecrdPblcnNo('')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
            />
          </div>
          {/* 내부 검색 버튼 — 설계서 원본(primary + search 아이콘) */}
          <Button variant="primary" className="w-full" onClick={handleSearch}>
            <Icon name="Search" size={20} aria-hidden />
            검색
          </Button>
        </div>

        {/* 검색 결과 (dlt_RecrdPblcnNoItemInfo) — 품목 정보 표 반복(slide34) */}
        {results !== null && (
          <div className="flex flex-col gap-krds-5">
            <p className="text-krds-body-sm text-krds-text-primary-active">총 {results.length}건</p>
            {results.length === 0 ? (
              <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
                검색 결과가 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-krds-7">
                {results.map((it) => (
                  <Table key={`${searched}-${it.no}`} rows={itemRows(it)} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  },
)
RecrdPblcnNoInfoInq.displayName = 'RecrdPblcnNoInfoInq'

export { RecrdPblcnNoInfoInq }
