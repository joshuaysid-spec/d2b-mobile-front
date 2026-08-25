// 이행/적격심사결과 - '심사결과' 탭 (MUI-BD-10-T19(구 M18) 3억원미만공사, 설계서 02입찰 v1.83 slide267~269).
// C군 공사/용역 평점 grid(항목/배점/평점 + 경영상태·특별신인도·입찰가격점수 하위표) — 렌더는 공용 [[ImpltElgblRsltRubric]].
// ⚠️ 심사항목 영문 항목명 미표기(한글 라벨). 하위표 세부 배점은 표기 슬라이드 참조(상세설계 재확인). 심사평점은 내 업체 목업.
import { ImpltElgblRsltRubric } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRsltRubric'
import type { ImpltElgbSrngRubric } from '@/types/mock/bd'

const RUBRIC: ImpltElgbSrngRubric = {
  sections: [
    {
      field: '당해공사 수행능력',
      rows: [
        { item: '경영상태', allot: '10.0', score: '00' },
        { item: '특별신인도', allot: '+3 ~ 2.5', score: '00' },
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
    { field: '기타 결격여부', rows: [{ item: '기타 결격여부', allot: '-10.0', score: '해당없음' }] },
    {
      field: '경영상태 세부',
      rows: [
        { item: '부채비율 — 해당업체 비율 / 업체평균 비율', score: '00 %' },
        { item: '유동비율 — 해당업체 비율 / 업체평균 비율', score: '00 %' },
      ],
    },
    {
      field: '특별신인도 세부',
      rows: [
        { item: '시공실적', score: '00' },
        { item: '지체상금', score: '00' },
        { item: '하자보수', score: '00' },
        { item: '시공평가결과', score: '00' },
        { item: '우수업체지정', score: '00' },
      ],
    },
  ],
  tscr: '00.00 점',
  jgmtRsltNm: '적격',
}

export function ImpltElgblRslt_Krw300MCstrn() {
  return <ImpltElgblRsltRubric rubric={RUBRIC} />
}
ImpltElgblRslt_Krw300MCstrn.displayName = 'ImpltElgblRslt_Krw300MCstrn'
