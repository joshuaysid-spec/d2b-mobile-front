// 이행/적격심사결과 - '심사결과' 탭 (MUI-BD-10-T15(구 M14) 고시금액이상 10억원미만(중기청), 설계서 02입찰 v1.83 slide239~246).
// B군 채점 루브릭 — 유형 데이터만 소유, 렌더는 공용 [[ImpltElgblRsltRubric]].
// ⚠️ 심사항목 영문 항목명 미표기(한글 라벨). 배점 일부 ±(상세설계 재확인). 심사평점은 내 업체 목업.
import { ImpltElgblRsltRubric } from '@/ui/biz/bd/bidRsltDtl/ImpltElgblRsltRubric'
import type { ImpltElgbSrngRubric } from '@/types/bd'

const RUBRIC: ImpltElgbSrngRubric = {
  sections: [
    {
      field: 'I. 당해물품납품이행능력',
      rows: [
        { item: '1) 납품실적 — 가. 계약목적물과 동등이상물품 / 나. 유사물품', allot: '5', score: '00' },
        { item: '2) 기술능력 — 가. 기술평가등급', allot: '5', score: '00' },
        { item: '3) 경영상태 — 가. 신용평가등급(회사채·기업신용평가)', allot: '30', score: '00' },
      ],
    },
    { field: 'II. 입찰가격', allot: '60', rows: [{ item: '입찰가격', score: '00.00' }] },
    {
      field: 'III. 신인도',
      allot: '+3 ~ -2',
      rows: [
        { item: '1. 품질관리 등 신뢰정도 — 가. 고도인증 / 나. 녹색·일반인증 / 다. 영세기업 지원', allot: '1.5 / 0.75 / 3.0', score: '00' },
        { item: '라. 기타(여성기업·장애인기업 및 장애인고용 우수기업 지원 등)', allot: '3.0', score: '00' },
      ],
    },
    { field: 'IV. 결격사유', rows: [{ item: '당해물품 납품이행능력 결격여부', score: '해당없음' }] },
  ],
  tscr: '00.00 점',
  jgmtRsltNm: '적격',
}

export function ImpltElgblRslt_ThresholdKrw1B() {
  return <ImpltElgblRsltRubric rubric={RUBRIC} />
}
ImpltElgblRslt_ThresholdKrw1B.displayName = 'ImpltElgblRslt_ThresholdKrw1B'
