// 이행/적격심사결과 - '심사결과' 탭 (MUI-BD-10-T07(구 M06) 10억원미만물품(중기청), 설계서 02입찰 v1.83 slide177~180).
// B군 채점 루브릭(심사분야→심사항목→배점→심사평점). 유형 데이터만 소유하고 렌더는 공용 [[ImpltElgblRsltRubric]].
// ⚠️ 심사항목은 설계서에 영문 항목명 미표기(한글 라벨만). 배점은 콘텐츠 슬라이드 값(일부 ± — 상세설계 시 재확인).
// 심사평점(score)은 "내 업체 점수" 목업(추후 scwin.getImpltElgbSrngRsltDtlInfo).
import { ImpltElgblRsltRubric } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRsltRubric'
import type { ImpltElgbSrngRubric } from '@/types/bd'

const RUBRIC: ImpltElgbSrngRubric = {
  sections: [
    {
      field: 'I. 당해물품납품이행능력',
      allot: '70',
      rows: [{ item: '1) 경영상태 — 신용평가등급(회사채·기업신용평가)', allot: '30', score: '00' }],
    },
    { field: 'II. 입찰가격', rows: [{ item: '입찰가격', score: '00.00' }] },
    {
      field: 'III. 신인도',
      allot: '+3 ~ -2',
      rows: [
        { item: '가. 기술 및 디자인 인증보유', allot: '1', score: '00' },
        { item: '나. 품질보증', allot: '1', score: '00' },
        { item: '다. 환경관리', allot: '1', score: '00' },
        { item: '라. 사후관리', allot: '1', score: '00' },
        { item: '마. 영세기업 지원', allot: '1', score: '00' },
        { item: '바. 기타', allot: '1.5', score: '00' },
        { item: '2. 계약이행 성실도 — 가. 납품지연', allot: '-2.0', score: '00' },
      ],
    },
    {
      field: 'IV. 결격사유',
      rows: [{ item: '당해물품 납품이행능력 결격여부(부도·파산 등)', score: '해당없음' }],
    },
  ],
  tscr: '00.00 점',
  jgmtRsltNm: '적격',
}

export function ImpltElgblRslt_ItemsUnderKrw1B() {
  return <ImpltElgblRsltRubric rubric={RUBRIC} />
}
ImpltElgblRslt_ItemsUnderKrw1B.displayName = 'ImpltElgblRslt_ItemsUnderKrw1B'
