// 이행/적격심사결과 - '심사결과' 탭 (MUI-BD-10-T11(구 M10) 10억원미만물품구매 2015년, 설계서 02입찰 v1.83 slide208~211).
// B군 채점 루브릭 — 유형 데이터만 소유, 렌더는 공용 [[ImpltElgblRsltRubric]].
// 설계서 화면명(영문ID)이 기본형 T10과 동일이나 명명 규칙(파일 1:1)상 _2015 접미로 구분. ⚠️ 배점 ±(재확인). 심사평점 목업.
import { ImpltElgblRsltRubric } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRsltRubric'
import type { ImpltElgbSrngRubric } from '@/types/mock/bd'

const RUBRIC: ImpltElgbSrngRubric = {
  sections: [
    {
      field: '(가) 당해물품 납품이행능력',
      allot: '30',
      rows: [{ item: '1) 경영상태 — 신용평가등급', allot: '30', score: '00' }],
    },
    { field: '(나) 입찰가격', allot: '70', rows: [{ item: '입찰가격', score: '00.00' }] },
    {
      field: '(다) 신인도',
      rows: [
        {
          item: '1) 계약이행 성실도 — 품질하자/납품지연/부정당업자 제재',
          allot: '+1.15 ~ -5',
          score: '00',
        },
        {
          item: '2) 사회적책임 등 신뢰정도 — 혁신형중기/노사협력/비상대비/장애인/가족친화/고용창출/여성기업/사회적기업/모범납세',
          allot: '+3 ~ -5',
          score: '00',
        },
      ],
    },
  ],
  tscr: '00.00 점',
  jgmtRsltNm: '적격',
}

export function ImpltElgblRslt_PurchaseofItemsUnderKrw1B_2015() {
  return <ImpltElgblRsltRubric rubric={RUBRIC} />
}
ImpltElgblRslt_PurchaseofItemsUnderKrw1B_2015.displayName =
  'ImpltElgblRslt_PurchaseofItemsUnderKrw1B_2015'
