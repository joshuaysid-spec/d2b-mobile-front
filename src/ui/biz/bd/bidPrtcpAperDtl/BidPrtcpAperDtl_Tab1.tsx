// 입찰진행상세 - 입찰참가신청조회 일반정보 (MUI-BD-04-T01, 설계서 영문ID BidPrtcpAperDtl_Tab1 · slide182·183).
// 호스트 페이지(BidPrtcpAperDtlPage)의 '1. 일반정보' 탭 본문만 담당 — 요약/탭/하단 액션바는 페이지 소유.
// 구성(설계서 slide182·183): 일반정보 Table → 업체내역 Table → 입찰공고 첨부서류(FileDownloadList 다운로드).
//   ⚠️ slide183 은 탭 하이라이트가 '1. 일반정보' 인 연속 슬라이드라 업체내역·입찰공고 첨부서류를 이 탭에 둔다
//      (슬라이드 머리글의 T02 표기는 구간 표기 오기로 판단).
// 항목명/형식은 작성판 일반정보(M05, dmt_bidPbancInfo·dmt_bzentyInfo)와 동일 — 조회판은 값 표시만 한다.
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { BidPrgrsItem } from '@/types/mock/bd'

// 입찰공고 첨부서류(설계서 slide183) — 다운로드 전용.
const PBANC_FILES: FileDownloadItem[] = [
  { id: 'f1', name: '제안요청서.hwp', size: '786KB' },
  { id: 'f2', name: '공고문.hwp', size: '786KB' },
]

export function BidPrtcpAperDtl_Tab1({ detail }: { detail: BidPrgrsItem }) {
  // 일반정보(dmt_bidPbancInfo) — 공고 식별값은 상세 항목, 나머지는 설계서 slide182 예시 형식 목업.
  const pbancRows: TableRow[] = [
    { label: '공고번호', value: detail.pbancNo },
    { label: '판단번호', value: detail.prcmNo },
    { label: '발주기관', value: '육군 탄약지원사령부' },
    { label: '통합참조번호', value: detail.rfrncNo },
    { label: '집행유형', value: '제조' },
    { label: '개찰일시', value: '2025-12-24 10:30' },
    { label: '계약방법', value: '일반확정계약' },
    { label: '입찰방법', value: detail.bidMthdNm },
    { label: '총수량', value: '1 AY', type: 'number' },
    { label: '예산금액', value: '619,520,000 원', type: 'number' },
    { label: '낙찰자결정방법', value: '적격심사제' },
    { label: '적격심사 여부', value: '대상' },
    { label: '낙찰자 기준', value: '-' },
  ]

  // 업체내역(dmt_bzentyInfo, 설계서 slide182)
  const bzentyRows: TableRow[] = [
    { label: '업체코드', value: '00000' },
    { label: '업체명', value: '㈜업체명표기영역' },
    { label: '대표자', value: '홍길동' },
    { label: '사업자등록번호', value: '123-56-78901' },
    { label: '전화번호', value: '02-1234-5678' },
    { label: '주소', value: '서울특별시 노량진구 노량진로 18로' },
  ]

  return (
    <>
      <SectionTitle as="h3" topDivider>
        일반정보
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={pbancRows} />
      </div>

      <SectionTitle as="h3" topDivider>
        업체내역
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={bzentyRows} />
      </div>

      <SectionTitle as="h3" topDivider info={`총 ${PBANC_FILES.length}건`} className="bg-white">
        입찰공고 첨부서류
      </SectionTitle>
      <div className="px-4 py-4">
        {/* 일괄 다운로드 버튼 미노출 — onDownloadAll 미주입(개별 다운로드만) */}
        <FileDownloadList
          files={PBANC_FILES.map((f) => ({
            ...f,
            onDownload: () => console.log('[T01] 다운로드', f.name), // 추후 API: fbService.download
          }))}
        />
      </div>
    </>
  )
}
BidPrtcpAperDtl_Tab1.displayName = 'BidPrtcpAperDtl_Tab1'
