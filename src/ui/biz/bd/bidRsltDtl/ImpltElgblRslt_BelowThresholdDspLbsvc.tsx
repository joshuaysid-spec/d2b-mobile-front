// 이행/적격심사결과 - '심사결과' 탭 (MUI-BD-10-T21(구 M20) 고시금액미만폐기물용역, 설계서 02입찰 v1.83 slide279~282).
// C군 공사/용역 평점 grid(항목/배점/평점 + 이행실적 수집운반·중간처리·최종처리 하위표) — 렌더는 공용 [[ImpltElgblRsltRubric]].
// ⚠️ 심사항목 영문 항목명 미표기(한글 라벨). 배점 ±(상세설계 재확인). 심사평점은 내 업체 목업.
import { ImpltElgblRsltRubric } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRsltRubric'
import type { ImpltElgbSrngRubric } from '@/types/bd'

const RUBRIC: ImpltElgbSrngRubric = {
  sections: [
    {
      field: '당해공사 수행능력',
      allot: '30.0',
      rows: [
        { item: '이행능력 — 이행실적', allot: '8.0', score: '00' },
        { item: '이행능력 — 기술능력', allot: '4.0', score: '00' },
        { item: '이행능력 — 수행능력', allot: '8.0', score: '00' },
        { item: '경영상태', allot: '10.0', score: '00' },
        { item: '특별신인도', allot: '0 ~ -6', score: '00' },
      ],
    },
    { field: '입찰가격', rows: [{ item: '입찰가격', allot: '70.0', score: '00.00' }] },
    { field: '기타 결격여부', rows: [{ item: '기타 결격여부', allot: '-45.0', score: '해당없음' }] },
    {
      field: '이행실적 세부 (8점)',
      rows: [
        { item: '수집·운반 — 실적비율 100%↑ / 80~100% / 80%↓', allot: '3.0 / 2.6 / 2.2', score: '00' },
        { item: '중간처리 — 실적비율 100%↑ / 80~100% / 80%↓', allot: '3.0 / 2.6 / 2.2', score: '00' },
        { item: '최종처리 — 실적비율 100%↑ / 80~100% / 80%↓', allot: '2.0 / 1.6 / 1.2', score: '00' },
      ],
    },
  ],
  tscr: '00.00 점',
  jgmtRsltNm: '적격',
}

export function ImpltElgblRslt_BelowThresholdDspLbsvc() {
  return <ImpltElgblRsltRubric rubric={RUBRIC} />
}
ImpltElgblRslt_BelowThresholdDspLbsvc.displayName = 'ImpltElgblRslt_BelowThresholdDspLbsvc'
