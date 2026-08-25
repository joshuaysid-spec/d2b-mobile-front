// 입찰서(견적서) 작성 - 일반정보 (MUI-BD-06-M01, Figma 9973-62571 · 설계서 02입찰 slide121·128)
// 컨테이너(TndrWrtPage)가 요약/탭/하단버튼/FAB 를 소유 — 이 컴포넌트는 스텝1 '일반정보' 탭 본문만 렌더한다.
// 구성: 일반정보(SectionTitle+Table) → 업체내역(SectionTitle+Table). 탭명과 중복되는 큰 타이틀은 제거(260709).
// 항목명/형식은 데이터영역(slide128 dmt_bidPbancInfo·dmt_bzentyInfo) 그대로 — 공고 식별값은 상세 항목, 나머지 목업(slide121 예시값).
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

export function TndrWrt_Stp1({ detail }: { detail: MockBidPrgrsItem }) {
  // 공고 일반정보(slide128 dmt_bidPbancInfo) — 공고 식별값은 상세 항목, 나머지 slide121 예시값 목업.
  // 조건부 항목(목업 생략):
  //   - 낙찰자기준: 입찰방법(bidMthdNm)이 'H(내역입찰(설계시공일괄입찰))'인 경우만 표시.
  //   - 총수량/단가제유형: 입찰방법이 단가제면 단가제유형, 그 외 총수량 표기(slide121). 여기선 총수량 예시값.
  const pbancRows: TableRow[] = [
    { label: '공고번호', value: detail.pbancNo },
    { label: '판단번호', value: detail.prcmNo },
    { label: '발주기관', value: '육군 탄약지원사령부' },
    { label: '통합참조번호', value: detail.rfrncNo },
    { label: '집행유형', value: '제조' },
    { label: '개찰일시', value: '2025-12-24 10:30' },
    { label: '계약방법', value: '일반확정계약' },
    { label: '입찰방법', value: detail.bidMthdNm },
    { label: '총수량/단가제유형', value: '1 AY' },
    { label: '예산금액', value: '619,520,000 원', type: 'number' },
    { label: '낙찰자결정방법', value: '적격심사제' },
    { label: '적격심사 여부', value: '대상' },
    { label: '기초예비가격', value: '619,520,000 원', type: 'number' },
    { label: '사정률(%)', value: '±2 %' },
    { label: '업체입찰보증금', value: '30,976,000 원', type: 'number' },
    { label: '2단계경쟁 전자파일 제출 가능', value: '대상' },
  ]

  // 업체내역(slide128 dmt_bzentyInfo · slide121 예시값)
  const bzentyRows: TableRow[] = [
    { label: '업체코드', value: '00000' },
    { label: '업체명', value: '㈜업체명표기영역' },
    { label: '대표자', value: '홍길동' },
    { label: '주민등록번호', value: '800123-2******' },
    { label: '사업자등록번호', value: '123-56-78901' },
    { label: '전화번호', value: '02-1234-5678' },
    { label: '주소', value: '서울특별시 용산구 이태원로 22' },
  ]

  return (
    <>
      {/* 페이지 타이틀 */}
      {/* 공지사항 영역 — 설계서상 "공지사항이 있는 경우 표시" 조건부. 목업 생략. */}

      {/* 일반정보 섹션 */}
      <SectionTitle as="h3" topDivider>
        일반정보
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={pbancRows} />
      </div>

      {/* 업체내역 섹션 */}
      <SectionTitle as="h3" topDivider>
        업체내역
      </SectionTitle>
      <div className="px-4 py-4">
        <Table rows={bzentyRows} />
      </div>
    </>
  )
}
TndrWrt_Stp1.displayName = 'TndrWrt_Stp1'
