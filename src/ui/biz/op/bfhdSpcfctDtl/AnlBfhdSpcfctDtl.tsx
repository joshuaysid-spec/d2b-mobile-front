// 연관 사전규격상세 콘텐츠 (MUI-OP-01-P13, 설계서 slide54). 컨테이너(BottomSheet)는 부모가 소유.
// 타 메뉴 상세화면(조달계획 상세 '연관정보', slide28)에서 연관된 사전규격을 조회한다.
// 구성: 발주기관 규격서(Table) + 업체의견 목록(카드 + 더보기) + 첨부파일(FileDownloadList).
//   - 의견 등록 버튼 없음(설계서 slide54) — 읽기 전용.
//   - 비공개 의견은 작성자만 접근 → '비공개 글입니다.' 안내(스텁).
// 데이터는 목업 — 추후 API(opService.selectSpecDtl/selectOpinions)로 대체.
import { useState, type ReactNode } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import {
  FileDownloadList,
  type FileDownloadItem,
} from '@/ui/common/composites/FileDownloadList'
import {
  BfhdSpcfctDtl_OpnnCard,
  type OpinionData,
} from '@/ui/biz/op/bfhdSpcfctDtl/BfhdSpcfctDtl_OpnnCard'
import { BfhdSpcfctDtl_OpnnDtlFullPopup } from '@/ui/biz/op/bfhdSpcfctDtl/BfhdSpcfctDtl_OpnnDtlFullPopup'

// 발주기관 규격서 (목업 — slide54)
const SPEC_ROWS: TableRow[] = [
  { label: '요구년도', value: '2026' },
  { label: '판단번호', value: '2026-00590' },
  { label: '발주기관', value: '제9911부대' },
  { label: '예산액', value: '000,000,000 원', type: 'number' },
  { label: '의견접수 시작일', value: '2026-03' },
  { label: '의견접수 종료일', value: '2026-06' },
  { label: '담당자', value: '홍길동' },
  { label: '담당자 연락처', value: '02-1234-5678' },
]

// 업체의견 목록 (목업 — slide54). 총건수는 설계서 더보기 표기(10/258) 기준.
const OPINION_TOTAL = 258
const MOCK_OPINIONS: { id: string; opinion: OpinionData }[] = [
  {
    id: '1',
    opinion: {
      isPublic: false,
      company: '㈜미래회사',
      title: '업체의 의견이 있습니다',
      name: '비공개',
      datetime: '2026-01-03 14:50',
    },
  },
  {
    id: '2',
    opinion: {
      isPublic: true,
      company: '㈜미래회사',
      title: '업체의 의견이 있습니다',
      name: '홍길동',
      datetime: '2026-01-03 14:50',
    },
  },
]

// 첨부파일 (목업 — slide54)
const FILES: FileDownloadItem[] = [
  { id: '1', name: '첨부파일1.PDF', size: '786KB' },
  { id: '2', name: '첨부파일2.hwp', size: '1.2MB' },
]

function SectionHeading({ children }: { children: ReactNode }) {
  return <h3 className="text-[17px] font-bold leading-normal text-krds-text-ink">{children}</h3>
}

export function AnlBfhdSpcfctDtl() {
  // 업체의견 상세(MUI-OP-01-P14) — 공개 의견 클릭 시.
  const [detailOpen, setDetailOpen] = useState(false)

  const handleOpinionClick = (opinion: OpinionData) => {
    // 비공개 정보는 작성자만 접근 — 안내 모달(스텁, 설계서 slide54)
    if (!opinion.isPublic) {
      console.log('[P13] 비공개 글입니다.')
      return
    }
    setDetailOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <SectionHeading>발주기관 규격서</SectionHeading>
        <Table rows={SPEC_ROWS} />
      </section>

      <section className="flex flex-col gap-2">
        <SectionHeading>업체의견 목록 - 총 {OPINION_TOTAL.toLocaleString()}건</SectionHeading>
        <div className="flex flex-col gap-krds-7">
          {MOCK_OPINIONS.map(({ id, opinion }) => (
            <BfhdSpcfctDtl_OpnnCard
              key={id}
              opinion={opinion}
              onOpinionClick={() => handleOpinionClick(opinion)}
            />
          ))}
        </div>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => console.log('[P13] 업체의견 더보기')}
        >
          더보기 ({MOCK_OPINIONS.length}/{OPINION_TOTAL})
        </Button>
      </section>

      <section className="flex flex-col gap-2">
        <SectionHeading>첨부파일 - 총 {FILES.length}건</SectionHeading>
        <FileDownloadList files={FILES} />
      </section>

      {/* 업체의견 상세 (P14) — 연관 조회라 수정/삭제 없음(읽기 전용) */}
      <BfhdSpcfctDtl_OpnnDtlFullPopup
        open={detailOpen}
        onOpenChange={setDetailOpen}
        variant="opinion"
      />
    </div>
  )
}
AnlBfhdSpcfctDtl.displayName = 'AnlBfhdSpcfctDtl'
