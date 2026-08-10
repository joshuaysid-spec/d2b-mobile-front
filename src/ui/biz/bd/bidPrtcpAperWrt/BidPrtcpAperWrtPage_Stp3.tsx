// 입찰참가신청서작성 - 공종 및 면허 (MUI-BD-04-M07, 설계서 slide100~).
// 신청서 마법사의 '공종 및 면허' 스텝 탭 콘텐츠(업무구분=공사 + 공종정보 보유 시 노출. 여기선 목업 표시).
// 요약/스텝/탭/하단 액션바는 페이지 소유 — 이 컴포넌트는 섹션(공종 카드 반복)만 렌더(탭명 반복 타이틀 없음).
// 라벨/안내문구는 설계서 텍스트 그대로, 시공능력평가액 형식도 설계서대로.
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Button } from '@/ui/common/base/Button'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { Infobox } from '@/ui/common/composites/Infobox'
import type { BidPrgrsItem } from '@/types/bd'

// 공종 및 면허정보 목업 — 라벨 한글 그대로, 값은 설계서 형식.
interface CnstwkRow {
  id: string // 안정적 key
  no: string // 번호
  cnstwkNm: string // 공종명·업종코드
  lcnsInfo: string // 면허정보
  admDspsInstSe: string // 행정처분기관구분
  regDt: string // 등록일자
  cnstrcAbltEvlAmt: string // 시공능력평가액
  stdYr: string // 기준년도
}

const MOCK_CNSTWKS: CnstwkRow[] = [
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

function cnstwkRows(row: CnstwkRow): TableRow[] {
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

export function BidPrtcpAperWrtPage_Stp3({ detail }: { detail: BidPrgrsItem }) {
  return (
    <>
      <SectionTitle as="h3" topDivider info={`총 ${MOCK_CNSTWKS.length}건`} className="bg-white">
        공종 및 면허정보
      </SectionTitle>

      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {MOCK_CNSTWKS.map((row) => (
          <Table key={row.id} rows={cnstwkRows(row)} />
        ))}

        {/* 더보기 — 클릭 시 다음 페이지 로드(추후 API). */}
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => console.log('[M07] 공종및면허 더보기', detail.pbancNo)}
          // 추후 API: bdService.getCnstwkLcnsList(pbancNo, page)
        >
          더보기 (10/100)
        </Button>
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
          onClick={() => console.log('[M07] 나라장터 바로가기', 'http://www.g2b.go.kr')}
          // 추후 API: window.open('http://www.g2b.go.kr')
        >
          나라장터 바로가기
        </Button>
      </div>
    </>
  )
}
BidPrtcpAperWrtPage_Stp3.displayName = 'BidPrtcpAperWrtPage_Stp3'
