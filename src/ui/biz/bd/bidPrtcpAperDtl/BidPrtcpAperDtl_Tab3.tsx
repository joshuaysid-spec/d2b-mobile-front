// 입찰진행상세 - 입찰참가신청조회 공종 및 면허 (MUI-BD-04-T03, 설계서 영문ID BidPrtcpAperDtl_Tab3 · slide185).
// 호스트 페이지(BidPrtcpAperDtlPage)의 '3. 공종 및 면허' 탭 본문만 담당 — 요약/탭/하단 액션바는 페이지 소유.
// 설계서 처리조건: 업무구분이 공사이고 공종정보가 있는 경우에만 목록 표시(여기선 목업 표시).
//   나라장터 바로가기 = http://www.g2b.go.kr.
// 항목명/형식은 작성판 공종및면허(M07)와 동일한 MockCnstwkLcnsRow — 조회판은 값 표시만 한다.
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockCnstwkLcnsRow } from '@/types/mock/bd'

// 나라장터(G2B) — 설계서 slide185 '나라장터바로가기는 http://www.g2b.go.kr'.
const G2B_URL = 'http://www.g2b.go.kr'

// 공종 및 면허정보 목업 — 값은 설계서 slide185 형식 그대로.
const MOCK_CNSTWKS: MockCnstwkLcnsRow[] = [
  {
    id: 'c1',
    no: '1',
    cnstwkNm: '건축공사업 (01)',
    lcnsInfo: '서울-01234',
    admDspsInstSe: '국토교통부',
    regDt: '2025-11-25',
    cnstrcAbltEvlAmt: '1,200,000,000 원',
    stdYr: '2025',
  },
  {
    id: 'c2',
    no: '2',
    cnstwkNm: '전기공사업 (02)',
    lcnsInfo: '서울-05678',
    admDspsInstSe: '산업통상자원부',
    regDt: '2025-11-25',
    cnstrcAbltEvlAmt: '850,000,000 원',
    stdYr: '2025',
  },
]

function cnstwkRows(row: MockCnstwkLcnsRow): TableRow[] {
  return [
    { label: '번호', value: row.no },
    { label: '공종명·업종코드', value: row.cnstwkNm },
    { label: '면허정보', value: row.lcnsInfo },
    { label: '행정처분기관구분', value: row.admDspsInstSe },
    { label: '등록일자', value: row.regDt },
    { label: '시공능력평가액', value: row.cnstrcAbltEvlAmt, type: 'number' },
    { label: '기준년도', value: row.stdYr },
  ]
}

export function BidPrtcpAperDtl_Tab3() {
  return (
    <>
      <SectionTitle as="h3" topDivider info={`총 ${MOCK_CNSTWKS.length}건`} className="bg-white">
        공종 및 면허정보
      </SectionTitle>

      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {MOCK_CNSTWKS.map((row) => (
          <Table key={row.id} rows={cnstwkRows(row)} />
        ))}
      </div>

      {/* 안내사항 — 설계서 문구 그대로. 탭 최하단 고정(전 탭 공통) */}
      <Infobox
        title="안내사항"
        items={[
          '상기 시공능력 평가액은 G2B(나라장터)에서 제공하는 자료입니다.',
          '시공능력평가액이 틀릴 경우 먼저 G2B(www.g2b.go.kr)에서 확인 후 수정 ☞ 방위사업청은 익일 반영',
          'G2B(나라장터)와 방위사업청이 틀릴 경우 방위사업청(1577-1118(①))으로 연락 해 주시기 바랍니다.',
        ]}
      />

      {/* 나라장터 바로가기 — 안내사항 아래 배치(안내문의 G2B 확인 동선과 이어짐) */}
      <div className="px-4 py-4">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => console.log('[T03] 나라장터 바로가기', G2B_URL)} // 추후: 하이브리드 브리지로 외부 브라우저 열기
        >
          나라장터 바로가기
        </Button>
      </div>
    </>
  )
}
BidPrtcpAperDtl_Tab3.displayName = 'BidPrtcpAperDtl_Tab3'
