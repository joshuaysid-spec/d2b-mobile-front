// 환율정보 조회 (MUI-BD-01-M74, 설계서 slide57·58 / 영문 ovsExchrtListPopup).
// 입찰공고 상세 플로팅(+) → 바로가기 → '환율정보 바로가기' 로 진입하는 풀페이지 팝업(FullPopup).
// 조회일자(crtrYmd, 초기값 당일) 기준으로 공시 환율을 조회. 미국환(기준) 최상단 고정, 10개씩 더보기.
// 데이터는 목업(설계서 항목명/예시값 그대로) — 추후 bdService.getExchangeRates(crtrYmd) 로 대체.
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

import { Button } from '@/ui/common/base/Button'
import { DateInput } from '@/ui/common/composites/DateInput'
import { FullPopup } from '@/ui/common/composites/FullPopup'

// 조회결과 1건 (dl_resultList, 설계서 slide58 데이터영역)
interface OvsExchrtItem {
  no: number // 순번
  ntnNm: string // 국가 (예: 'US-미국')
  crncNm: string // 화폐(화폐구분) (예: 'USD-미 달러')
  ttsrt: string // 매도율
  trdStdrt: string // 기준율 (KRW 고정 표기)
  usdExrt: string // 달러환산율 (USD 고정 표기)
}

// 목업 — 설계서 예시값 기반. US(미국환)이 기준이라 최상단 고정. 추후 API 로 대체.
const MOCK_RATES: OvsExchrtItem[] = [
  { no: 1, ntnNm: 'US-미국', crncNm: 'USD-미 달러', ttsrt: '0.00', trdStdrt: '1,464.30', usdExrt: '1.0000' },
  { no: 2, ntnNm: 'NO-노르웨이', crncNm: 'NOK-노르웨이 크로네', ttsrt: '0.00', trdStdrt: '151.33', usdExrt: '0.1033' },
  { no: 3, ntnNm: 'NZ-뉴질랜드', crncNm: 'NZD-뉴질랜드 달러', ttsrt: '0.00', trdStdrt: '863.28', usdExrt: '0.5896' },
  { no: 4, ntnNm: 'TW-대만', crncNm: 'TWD-뉴 타이완 달러', ttsrt: '0.00', trdStdrt: '46.08', usdExrt: '0.0315' },
  { no: 5, ntnNm: 'DK-덴마크', crncNm: 'DKK-덴마크 크로네', ttsrt: '0.00', trdStdrt: '228.55', usdExrt: '0.1561' },
  { no: 6, ntnNm: 'DE-독일', crncNm: 'EUR-유로', ttsrt: '0.00', trdStdrt: '1,705.42', usdExrt: '1.1651' },
  { no: 7, ntnNm: 'RU-러시아', crncNm: 'RUB-러시아 루블', ttsrt: '0.00', trdStdrt: '18.62', usdExrt: '0.0127' },
  { no: 8, ntnNm: 'MY-말레이시아', crncNm: 'MYR-말레이시아 링깃', ttsrt: '0.00', trdStdrt: '345.71', usdExrt: '0.2362' },
  { no: 9, ntnNm: 'MX-멕시코', crncNm: 'MXN-멕시코 페소', ttsrt: '0.00', trdStdrt: '79.34', usdExrt: '0.0542' },
  { no: 10, ntnNm: 'US-미국', crncNm: 'USD-미 달러(군납)', ttsrt: '0.00', trdStdrt: '1,464.30', usdExrt: '1.0000' },
  { no: 11, ntnNm: 'GB-영국', crncNm: 'GBP-영국 파운드', ttsrt: '0.00', trdStdrt: '1,968.11', usdExrt: '1.3441' },
  { no: 12, ntnNm: 'JP-일본', crncNm: 'JPY-일본 엔(100)', ttsrt: '0.00', trdStdrt: '973.55', usdExrt: '0.6648' },
  { no: 13, ntnNm: 'CN-중국', crncNm: 'CNY-위안화', ttsrt: '0.00', trdStdrt: '205.18', usdExrt: '0.1401' },
  { no: 14, ntnNm: 'CH-스위스', crncNm: 'CHF-스위스 프랑', ttsrt: '0.00', trdStdrt: '1,830.77', usdExrt: '1.2503' },
]

const PAGE_STEP = 10 // 더보기 10개씩(설계서)

export interface OvsExchrtListFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OvsExchrtListFullPopup({ open, onOpenChange }: OvsExchrtListFullPopupProps) {
  const today = dayjs().format('YYYY-MM-DD')
  const [crtrYmd, setCrtrYmd] = useState(today) // 조회일자 — 초기값 당일(설계서)
  const [visible, setVisible] = useState(PAGE_STEP) // 더보기 노출 개수

  // 조회결과(목업) — 미국환 기준 최상단 고정 후 순번 순. 추후 bdService.getExchangeRates(crtrYmd).
  const list = MOCK_RATES
  const total = list.length
  const visibleList = useMemo(() => list.slice(0, visible), [list, visible])

  // 검색 — 조회일자 기준 재조회(스텁). 실제로는 list 가 API 응답으로 교체됨.
  const handleSearch = () => {
    setVisible(PAGE_STEP)
    console.log('[M74] 환율정보 조회', { crtrYmd }) // 추후 API: bdService.getExchangeRates(crtrYmd)
  }
  const handleLoadMore = () => setVisible((v) => v + PAGE_STEP)

  return (
    <FullPopup open={open} onOpenChange={onOpenChange} title="환율정보 조회">
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {/* 조회일자(crtrYmd) — 직접입력 + 날짜설정(P06). 초기값 당일. */}
        <div className="flex items-end gap-krds-5">
          <div className="min-w-px flex-1">
            <DateInput label="조회일자" value={crtrYmd} onChange={setCrtrYmd} />
          </div>
          <Button variant="primary" onClick={handleSearch}>
            검색
          </Button>
        </div>

        {/* 총 건수 */}
        <p className="text-krds-body-sm text-krds-text-primary-active">총 {total}건</p>

        {/* 조회결과 — 통화별 카드(순번 + 국가/화폐 + 매도율/기준율 KRW/달러환산율 USD) */}
        <ul className="flex flex-col gap-krds-5">
          {visibleList.map((it) => (
            <li
              key={it.no}
              className="flex flex-col gap-krds-3 rounded-krds-8 border border-krds-border-divider p-krds-6"
            >
              <div className="flex items-center gap-krds-3">
                <span className="text-krds-body-sm text-krds-text-muted">{it.no}</span>
                <span className="text-[17px] font-bold text-krds-text-ink">{it.ntnNm}</span>
                <span className="text-krds-body-md text-krds-text-muted">{it.crncNm}</span>
              </div>
              <dl className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <dt className="text-krds-body-md text-krds-text-muted">매도율</dt>
                  <dd className="text-krds-body-md text-krds-text-ink">{it.ttsrt}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-krds-body-md text-krds-text-muted">기준율</dt>
                  <dd className="text-krds-body-md text-krds-text-ink">{it.trdStdrt} KRW</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-krds-body-md text-krds-text-muted">달러환산율</dt>
                  <dd className="text-krds-body-md text-krds-text-ink">{it.usdExrt} USD</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        {/* 더보기 — 10개씩 추가 */}
        {visible < total && (
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({visibleList.length}/{total}건)
          </Button>
        )}
      </div>
    </FullPopup>
  )
}
OvsExchrtListFullPopup.displayName = 'OvsExchrtListFullPopup'
