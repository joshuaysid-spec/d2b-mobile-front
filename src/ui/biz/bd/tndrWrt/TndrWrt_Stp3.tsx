// 입찰서(견적서) 작성 - 투찰내역 (MUI-BD-06-M03, Figma 9973-63488 · 설계서 02입찰 slide123·129)
// 입찰서(견적서) 작성(M01)의 '투찰내역' 하위 탭 콘텐츠 — 컨테이너(TndrWrtPage)가 렌더하는 본문만 담당.
// ⚠️ 요약/탭(TabList)/하단 액션바는 페이지 소유 → 여기서 만들지 않는다.
// 구성(설계서 slide123): 페이지타이틀 + 투찰내역 데이터영역(dmt_bdngAmt) 입력 필드 —
//   입찰금액(₩)* 입력 → 입찰금액(원) 한글금액 자동 변환 표시. 단가제인 경우 입찰단가(₩)*·입찰단가(원)·입찰수량 노출.
//   입찰방법(bidMthdNm)이 단가제인 경우 금액/단가를 소수점 둘째자리까지 입력(slide123·129).
import { useState } from 'react'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

// 한글금액 변환용 자릿수 사전 — 설계서 예시(10,000,000,000 → '금 일백억 원')와 1:1.
const KOR_DIGITS = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
const KOR_SMALL = ['', '십', '백', '천'] // 그룹(4자리) 내 자리 단위
const KOR_BIG = ['', '만', '억', '조', '경'] // 4자리 그룹 단위

// 숫자 → 한글금액 문자열. 정수부만 변환하고 '금 … 원'으로 감싼다.
//   10000000000 → '금 일백억 원' · 199900000 → '금 일억구천구백구십만 원' · 0/음수 → ''
function numberToKoreanWon(value: number): string {
  const n = Math.floor(Math.abs(value))
  if (!Number.isFinite(n) || n === 0) return ''
  const digits = String(n)
  // 뒤에서 4자리씩 끊어 만/억/조 그룹으로 분리
  const groups: string[] = []
  for (let end = digits.length; end > 0; end -= 4) {
    groups.unshift(digits.slice(Math.max(0, end - 4), end))
  }
  let result = ''
  groups.forEach((g, i) => {
    if (Number(g) === 0) return
    const s = g.padStart(4, '0')
    let part = ''
    for (let j = 0; j < 4; j++) {
      const d = Number(s[j])
      if (d === 0) continue
      part += KOR_DIGITS[d] + KOR_SMALL[3 - j]
    }
    result += part + KOR_BIG[groups.length - 1 - i]
  })
  return `금 ${result} 원`
}

// 천단위 콤마(정수). inputType='numeric' 과 함께 사용 — 숫자만 넘어온 문자열에 콤마만 삽입.
function formatThousands(raw: string): string {
  return raw
    .replace(/[^0-9]/g, '')
    .replace(/^0+(?=\d)/, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 천단위 콤마 + 소수점 둘째자리까지(단가제). inputType='text' 와 함께 사용 — 숫자·점 1개만 허용.
function formatDecimal2(raw: string): string {
  let s = raw.replace(/[^0-9.]/g, '')
  const dot = s.indexOf('.')
  if (dot !== -1) s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, '') // 점 1개만
  const [int = '', dec] = s.split('.')
  const intFmt = int.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (dec === undefined) return intFmt
  return `${intFmt === '' ? '0' : intFmt}.${dec.slice(0, 2)}`
}

// 콤마 포함 표시 문자열 → 숫자
const toNumber = (v: string) => Number(v.replace(/,/g, ''))

export function TndrWrt_Stp3({ detail }: { detail: MockBidPrgrsItem }) {
  // 단가제인 경우 입찰단가/입찰수량 노출 + 금액을 소수점 둘째자리까지 입력(설계서 slide123).
  const isUntprc = detail.bidMthdNm?.includes('단가제')

  // 투찰내역 데이터영역(dmt_bdngAmt) — 항목명(영문) 그대로. 표시값은 콤마 포함 문자열로 보관.
  const [bdngAmt, setBdngAmt] = useState('') // 입찰금액(₩)
  const [bdngUntprc, setBdngUntprc] = useState('') // 입찰단가(₩)
  const [bdngQty, setBdngQty] = useState('') // 입찰수량

  // 파생값 — 입력 금액/단가를 한글금액으로 자동 변환(bdngAmtKor / bdngUntprcKor).
  const bdngAmtKor = bdngAmt ? numberToKoreanWon(toNumber(bdngAmt)) : ''
  const bdngUntprcKor = bdngUntprc ? numberToKoreanWon(toNumber(bdngUntprc)) : ''

  // 금액 입력: 단가제=소수 허용(text+format), 총액제=정수(numeric+콤마).
  const amtInputType = isUntprc ? 'text' : 'numeric'
  const amtFormat = isUntprc ? formatDecimal2 : formatThousands

  // 추후 API: 입찰금액/단가/수량은 페이지(TndrWrtPage) 제출 시 전송 — bdService.insertTndrSbmsn
  //   (투찰금액 검증·암호화·입찰차수별 키 생성, 설계서 slide130·131).

  return (
    <>
      <div className="flex flex-col gap-4 px-4 py-4">
        {/* 입찰금액(₩) * — 숫자 입력, 우측 '원' 접미 */}
        <div className="flex flex-col gap-krds-5">
          <InputLabel htmlFor="bdngAmt" required>
            입찰금액(₩)
          </InputLabel>
          <div className="flex items-center gap-krds-3">
            <InputBox
              id="bdngAmt"
              className="flex-1"
              inputType={amtInputType}
              inputMode={isUntprc ? 'decimal' : 'numeric'}
              format={amtFormat}
              value={bdngAmt}
              placeholder="입력해주세요."
              onChange={(e) => setBdngAmt(e.target.value)}
              onClear={() => setBdngAmt('')}
            />
            <span className="shrink-0 text-krds-body-md text-krds-text-ink">원</span>
          </div>
        </div>

        {/* 입찰금액(원) — 읽기전용, 입력 금액의 한글금액 자동 표시 */}
        <div className="flex flex-col gap-krds-5">
          <InputLabel htmlFor="bdngAmtKor">입찰금액(원)</InputLabel>
          <InputBox id="bdngAmtKor" value={bdngAmtKor || '-'} disabled readOnly />
        </div>

        {/* 단가제인 경우에만: 입찰단가(₩)*·입찰단가(원)·입찰수량 (설계서 slide123·129) */}
        {isUntprc && (
          <>
            {/* 입찰단가(₩) * — 단가제, 소수점 둘째자리까지 */}
            <div className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="bdngUntprc" required>
                입찰단가(₩)
              </InputLabel>
              <div className="flex items-center gap-krds-3">
                <InputBox
                  id="bdngUntprc"
                  className="flex-1"
                  inputMode="decimal"
                  format={formatDecimal2}
                  value={bdngUntprc}
                  placeholder="입력해주세요."
                  onChange={(e) => setBdngUntprc(e.target.value)}
                  onClear={() => setBdngUntprc('')}
                />
                <span className="shrink-0 text-krds-body-md text-krds-text-ink">원</span>
              </div>
            </div>

            {/* 입찰단가(원) — 읽기전용, 입력 단가의 한글금액 자동 표시(미입력 시 '-') */}
            <div className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="bdngUntprcKor">입찰단가(원)</InputLabel>
              <InputBox id="bdngUntprcKor" value={bdngUntprcKor || '-'} disabled readOnly />
            </div>

            {/* 입찰수량 — 단가제, 숫자 입력 */}
            <div className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="bdngQty">입찰수량</InputLabel>
              <InputBox
                id="bdngQty"
                inputMode="decimal"
                format={formatDecimal2}
                value={bdngQty}
                placeholder="입력해주세요."
                onChange={(e) => setBdngQty(e.target.value)}
                onClear={() => setBdngQty('')}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}
TndrWrt_Stp3.displayName = 'TndrWrt_Stp3'
