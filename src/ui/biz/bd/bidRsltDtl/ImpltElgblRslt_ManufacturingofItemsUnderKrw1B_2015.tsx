// 이행/적격심사결과 - '심사결과' 탭 (MUI-BD-10-T09(구 M08) 10억원미만물품제조 2015년, 설계서 02입찰 v1.83 slide193~198).
// B군 채점 루브릭 — 유형 데이터만 소유, 렌더는 공용 [[ImpltElgblRsltRubric]].
// 설계서 화면명(영문ID)이 기본형 T08과 동일(ImpltElgblRslt_ManufacturingofItemsUnderKrw1B)이나, 명명 규칙(파일 1:1)상
//   연도 변형은 _2015 접미로 구분(명명 규칙 > 설계서). ⚠️ 배점 일부 ±(상세설계 재확인). 심사평점은 내 업체 목업.
import { ImpltElgblRsltRubric } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRsltRubric'
import type { ImpltElgbSrngRubric } from '@/types/mock/bd'

const RUBRIC: ImpltElgbSrngRubric = {
  sections: [
    {
      field: '(가) 당해물품 납품이행능력',
      allot: '50',
      rows: [
        { item: '1) 납품실적 — 계약목적물과 동등이상/유사물품', allot: '10', score: '00' },
        { item: '2) 기술실적 — 신용평가등급', allot: '30', score: '00' },
        { item: '3) 재무상태 — 기술인력보유/생산기술 축적정도', allot: '10', score: '00' },
      ],
    },
    { field: '(나) 입찰가격', allot: '50', rows: [{ item: '입찰가격', score: '00.00' }] },
    {
      field: '(다) 신인도',
      allot: '+3 ~ -5',
      rows: [
        { item: '1) 물품 품질정도 — 품질관리/기술보유/환경관리', score: '00' },
        { item: '2) 계약이행 성실도 — 하자발생/납품지연/부정당업자 제재', score: '00' },
      ],
    },
  ],
  tscr: '00.00 점',
  jgmtRsltNm: '적격',
}

export function ImpltElgblRslt_ManufacturingofItemsUnderKrw1B_2015() {
  return <ImpltElgblRsltRubric rubric={RUBRIC} />
}
ImpltElgblRslt_ManufacturingofItemsUnderKrw1B_2015.displayName =
  'ImpltElgblRslt_ManufacturingofItemsUnderKrw1B_2015'
