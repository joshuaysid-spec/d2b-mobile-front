// 이행/적격심사결과 - '심사결과' 탭 (MUI-BD-10-T10(구 M09) 10억원미만물품구매, 설계서 02입찰 v1.83 slide202~204).
// B군 채점 루브릭 — 유형 데이터만 소유, 렌더는 공용 [[ImpltElgblRsltRubric]]. (연도 변형: 2015년=T11·2018년=T13 별 파일)
// ⚠️ 심사항목 영문 항목명 미표기(한글 라벨). 배점 일부 ±(상세설계 재확인). 심사평점은 내 업체 목업.
import { ImpltElgblRsltRubric } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRsltRubric'
import type { MockImpltElgbSrngRubric } from '@/types/mock/bd'

const RUBRIC: MockImpltElgbSrngRubric = {
  sections: [
    {
      field: '(가) 당해물품 납품이행능력',
      allot: '30',
      rows: [{ item: '1) 재무상태 — 신용평가등급에 의한 평가', allot: '30', score: '00' }],
    },
    { field: '(나) 입찰가격', allot: '70', rows: [{ item: '입찰가격', score: '00.00' }] },
    {
      field: '(다) 신인도',
      rows: [
        { item: '1) 계약이행 성실도 — 하자발생/납품지연', allot: '+1.15 ~ -3', score: '00' },
        {
          item: '2) 기타 — 성실납세/중점관리대상/비상대비/가족친화 사회환경/고용창출/장애인고용 우수',
          allot: '+3 ~ -5',
          score: '00',
        },
      ],
    },
  ],
  tscr: '00.00 점',
  jgmtRsltNm: '적격',
}

export function ImpltElgblRslt_PurchaseofItemsUnderKrw1B() {
  return <ImpltElgblRsltRubric rubric={RUBRIC} />
}
ImpltElgblRslt_PurchaseofItemsUnderKrw1B.displayName = 'ImpltElgblRslt_PurchaseofItemsUnderKrw1B'
