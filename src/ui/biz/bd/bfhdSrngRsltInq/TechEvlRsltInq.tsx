// 기술평가결과조회 (MUI-BD-07-P01, 설계서 영문ID TechEvlRsltInq · slide82·83).
// 접속: 홈 > 입찰진행 > 상세 > 기술평가결과조회. 입찰진행 상세(M02)의 기술평가 '내용 보기' → 바텀시트.
// 디자인: Figma m_table(구분/내용 테이블) 기준 — 요약(공고) + 기술평가 결과 표.
// ⚠️ 바텀시트 콘텐츠 전용 — 컨테이너(BottomSheet title/footer/open)는 부모(상세 페이지)가 소유, 여기엔 본문만.
//    읽기전용 조회라 제출 없음(footer=닫기, 부모 소유). (생산능력서류제출 P06 와 동일 패턴)
// 항목명: 설계서 데이터영역 그대로 — 공고번호 pbancNo · 통합참조번호 rfrncNo · 공사번호 prcmNo · 공사명 bidNm ·
//    발주기관 orderInstNm · 계약방법 ctrtMthdNm · 견적서제출마감일시 tndrSbmsnDdlnDt ·
//    기술평가점수 techEvlScr(8,5) · 기술평가결과 techEvlPasYn(통과여부 → 합격/불합격). 데이터는 목업(상세 항목 기반).
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { BidPrgrsItem } from '@/types/bd'

export interface TechEvlRsltInqProps {
  /** 상세에서 넘어온 항목 — 공고 식별/표시값 시드. */
  detail: BidPrgrsItem
}

export function TechEvlRsltInq({ detail }: TechEvlRsltInqProps) {
  // 기술평가 결과(dmt_bidPbancInfo + dmt_techEvlRslt) — 공고 식별값은 상세 항목, 평가결과는 목업.
  const rows: TableRow[] = [
    { label: '공고번호', value: detail.pbancNo },
    { label: '통합참조번호', value: detail.rfrncNo },
    { label: '공사번호', value: detail.prcmNo },
    { label: '공사명', value: detail.bidNm },
    { label: '발주기관', value: '방위사업청' },
    { label: '계약방법', value: detail.ctrtMthdNm },
    { label: '견적서제출마감일시', value: detail.tndrSbmsnDdlnDt },
    { label: '기술평가점수', value: '77.30000', type: 'number' },
    { label: '기술평가결과', value: '합격' },
  ]

  return (
    <div className="flex flex-col gap-krds-7">
      <SummaryInfo
        flushX
        badges={[
          { key: 'task', label: detail.taskSeNm },
          { key: 'ctrt', label: detail.ctrtMthdNm },
          { key: 'bfhd', label: '사전심사' },
          { key: 'apfr', label: '입찰참가' },
        ]}
        subtitle={detail.pbancNo}
        title={detail.bidNm}
      />
      <Table rows={rows} />
    </div>
  )
}
TechEvlRsltInq.displayName = 'TechEvlRsltInq'
