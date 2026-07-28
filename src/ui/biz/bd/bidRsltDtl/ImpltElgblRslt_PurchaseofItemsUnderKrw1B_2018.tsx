// 이행/적격심사결과 - '심사결과' 탭 (MUI-BD-10-T13(구 M12) 10억원미만물품구매 2018년, 설계서 02입찰 v1.83 slide224~227).
// B군 채점 루브릭 — 유형 데이터만 소유, 렌더는 공용 [[ImpltElgblRsltRubric]].
// ⚠️ 설계서 화면명(영문ID) 표기 `ImpltElgblRslt_PurchaseofItemsUnderkrw1B`(소문자 k)는 오타 → 파일/컴포넌트명 UnderKrw1B(대문자 K)로 교정.
//    명명 규칙(파일 1:1)상 기본형 T10과 _2018 접미로 구분. ⚠️ 배점 ±(재확인). 심사평점 목업.
import { ImpltElgblRsltRubric } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRsltRubric'
import type { ImpltElgbSrngRubric } from '@/types/bd'

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
          allot: '+3.7 ~ -4.2',
          score: '00',
        },
        {
          item: '2) 사회적책임 등 신뢰정도 — 고용창출/혁신적중기/장애인기업/여성기업지원/정책지원',
          allot: '+3.7 ~ -4.2',
          score: '00',
        },
      ],
    },
  ],
  tscr: '00.00 점',
  jgmtRsltNm: '적격',
}

export function ImpltElgblRslt_PurchaseofItemsUnderKrw1B_2018() {
  return <ImpltElgblRsltRubric rubric={RUBRIC} />
}
ImpltElgblRslt_PurchaseofItemsUnderKrw1B_2018.displayName =
  'ImpltElgblRslt_PurchaseofItemsUnderKrw1B_2018'
