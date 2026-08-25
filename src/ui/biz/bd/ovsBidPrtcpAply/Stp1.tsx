// 스탭1 일반정보 (MUI-BD-04-T72(구 M72 — v1.83 재편) OvsBidPrtcpAplyPage_Stp1 · 설계서 slide333 · 데이터 slide338).
// 호스트 페이지(OvsBidPrtcpAplyPage)의 '일반정보' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바는 페이지 소유.
// 구성: 일반정보 Table(dm_bscPbancInfo: 공고번호·개찰일시·입찰보증금 총액[달러금액])
//   → 공지사항 Infobox → 신청업체 Table(dm_sbtInfo) → 입찰보증금 납입 서약문 박스(설계서 slide333 원문).
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockBidPrgrsItem, MockOvsBscPbancInfo, MockOvsSbtInfo } from '@/types/mock/bd'

// 공고일반(dm_bscPbancInfo) — 입찰보증금총액은 달러금액(설계서 slide338 비고).
const MOCK_BSC_PBANC_INFO: MockOvsBscPbancInfo = {
  pbancNo: 'EFD0007',
  pbancOd: '25',
  bdopnYmd: '2025-12-24 10:30',
  bidGrnteAmt: 'USD 511.18',
}

// 신청업체(dm_sbtInfo) — 설계서 slide333 표시값 형식 그대로.
const MOCK_SBT_INFO: MockOvsSbtInfo = {
  sbtBzentyCd: '7001',
  sbtBzentyNm: 'FA무역대리점',
  sbtRprsvNm: '홍길동',
  sbtTlno: '02-1234-5678',
  sbtFxno: '02-2345-6789',
  sbtBzmnNo: '123-45-67890',
  sbtAddr: '서울특별시 종로구 세종대로 209',
}

// 입찰보증금 납입 서약문(설계서 slide333 원문, 2026-07-01 화면 수정 반영).
const GRNTE_OATH =
  '본인은 낙찰 후 계약을 체결하지 아니하거나 서류제출 기피 등 귀사로부터 상기 입찰보증금을 한도로 해당품목 입찰보증금액의 납입 요청 이견 없이 30일 이내 납부할 것을 서약합니다'

export function Stp1({ detail }: { detail: MockBidPrgrsItem }) {
  // 일반정보(dm_bscPbancInfo) — 공고번호는 상세 항목(pbancNo), 나머지 목업.
  const pbancRows: TableRow[] = [
    { label: '공고번호', value: detail.pbancNo },
    { label: '개찰일시', value: MOCK_BSC_PBANC_INFO.bdopnYmd },
    { label: '입찰보증금 총액', value: MOCK_BSC_PBANC_INFO.bidGrnteAmt, type: 'number' },
  ]

  // 신청업체(dm_sbtInfo)
  const sbtRows: TableRow[] = [
    { label: '업체코드', value: MOCK_SBT_INFO.sbtBzentyCd },
    { label: '업체명', value: MOCK_SBT_INFO.sbtBzentyNm },
    { label: '대표자', value: MOCK_SBT_INFO.sbtRprsvNm },
    { label: '전화번호', value: MOCK_SBT_INFO.sbtTlno },
    { label: '팩스', value: MOCK_SBT_INFO.sbtFxno },
    { label: '사업자등록번호', value: MOCK_SBT_INFO.sbtBzmnNo },
    { label: '주소', value: MOCK_SBT_INFO.sbtAddr },
  ]

  return (
    <>
      {/* 일반정보 — 공고번호/개찰일시/입찰보증금 총액(달러). 탭명과 중복되는 큰 타이틀은 제거(260709) */}
      <SectionTitle as="h3" topDivider>
        일반정보
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={pbancRows} />
      </div>

      {/* 공지사항(설계서 slide333) */}
      <Infobox
        title="공지사항"
        items={['공고문 및 첨부문서의 공지사항을 확인한 후 입찰참가신청을 진행하시기 바랍니다.']}
      />

      {/* 신청업체 — 로그인 조달업체 정보 */}
      <SectionTitle as="h3" topDivider>
        신청업체
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={sbtRows} />
      </div>

      {/* 입찰보증금 납입 서약문 — 설계서 slide333 원문 */}
      <div className="px-4 pb-4">
        <div className="flex flex-col gap-krds-5 rounded-[12px] bg-krds-bg-blue-pastel p-krds-8">
          <p className="text-left text-[15px] leading-relaxed text-krds-text-info wrap-break-word">
            {GRNTE_OATH}
          </p>
        </div>
      </div>
    </>
  )
}
Stp1.displayName = 'Stp1'
