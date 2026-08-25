// 이행/적격심사결과 - '심사결과' 탭 (MUI-BD-10-T08(구 M07) 10억원미만물품제조, 설계서 02입찰 v1.83 slide185~189).
// B군 채점 루브릭 — 유형 데이터만 소유, 렌더는 공용 [[ImpltElgblRsltRubric]]. (연도 변형: 2015년=T09·2018년=T12 별 파일)
// ⚠️ 심사항목 영문 항목명 미표기(한글 라벨). 배점 일부 ±(상세설계 재확인). 심사평점은 내 업체 목업.
import { ImpltElgblRsltRubric } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRsltRubric'
import type { MockImpltElgbSrngRubric } from '@/types/mock/bd'

const RUBRIC: MockImpltElgbSrngRubric = {
  sections: [
    {
      field: '(가) 당해물품 납품이행능력',
      allot: '45',
      rows: [
        { item: '1) 납품실적 — 계약목적물과 동등이상/유사물품', allot: '10', score: '00' },
        { item: '2) 기술실적 — 기술인력보유', allot: '7', score: '00' },
        { item: '3) 재무상태 — 신용평가등급', allot: '25', score: '00' },
      ],
    },
    { field: '(나) 입찰가격', rows: [{ item: '입찰가격', score: '00.00' }] },
    {
      field: '(다) 신인도',
      allot: '+3 ~ -3',
      rows: [
        { item: '1) 물품 품질정도 — 품질관리/기술보유/환경관리', score: '00' },
        { item: '2) 계약이행 성실도 — 하자발생/납품지연/노사협력관계', score: '00' },
      ],
    },
  ],
  tscr: '00.00 점',
  jgmtRsltNm: '적격',
}

export function ImpltElgblRslt_ManufacturingofItemsUnderKrw1B() {
  return <ImpltElgblRsltRubric rubric={RUBRIC} />
}
ImpltElgblRslt_ManufacturingofItemsUnderKrw1B.displayName = 'ImpltElgblRslt_ManufacturingofItemsUnderKrw1B'
