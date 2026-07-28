// 이행/적격심사결과 - '심사결과' 탭 (MUI-BD-10-T20(구 M19) 고시금액미만용역, 설계서 02입찰 v1.83 slide274~275).
// C군 공사/용역 평점 grid(항목/배점/평점 + 입찰가격점수·특별신인도·신용평가 하위표) — 렌더는 공용 [[ImpltElgblRsltRubric]].
// ⚠️ 심사항목 영문 항목명 미표기(한글 라벨). 배점 ±(상세설계 재확인). 심사평점은 내 업체 목업.
import { ImpltElgblRsltRubric } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRsltRubric'
import type { ImpltElgbSrngRubric } from '@/types/bd'

const RUBRIC: ImpltElgbSrngRubric = {
  sections: [
    {
      field: '당해공사 수행능력',
      rows: [
        { item: '경영상태', allot: '10.0', score: '00' },
        { item: '특별신인도', allot: '2.0', score: '00' },
        { item: '소계', allot: '10.0', score: '00' },
      ],
    },
    {
      field: '입찰가격',
      rows: [
        {
          item: '입찰가격 (가격점수산식: 90 – 20 × {(88/100 – 입찰가격/예정가격) × 100})',
          allot: '90.0',
          score: '00.00',
        },
      ],
    },
    { field: '기타 결격여부', rows: [{ item: '기타 결격여부', allot: '-25.0', score: '해당없음' }] },
    {
      field: '특별신인도 세부',
      rows: [
        { item: '3년간 시공실적 (추정금액 1배 이상 등급별 가점)', score: '00' },
      ],
    },
    {
      field: '신용평가',
      allot: '10',
      rows: [{ item: '회사채·기업신용평가 등급', score: '00' }],
    },
  ],
  tscr: '00.00 점',
  jgmtRsltNm: '적격',
}

export function ImpltElgblRslt_BelowThresholdLbsvc() {
  return <ImpltElgblRsltRubric rubric={RUBRIC} />
}
ImpltElgblRslt_BelowThresholdLbsvc.displayName = 'ImpltElgblRslt_BelowThresholdLbsvc'
