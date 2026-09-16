// 입찰결과상세 - '입찰결과' 탭 (MUI-BD-09-T03(구 M03 — v1.83 재편), 설계서 02.입찰 v1.88 slide238).
// 입찰결과 목록 — "내 업체 정보만 표시"(설계서). 항목당 표(순번/차수/업체코드/사업자등록번호/업체명/대표자/
// 결과 + 기술점수[보기]·첨부서류[다운로드]·서약서[보기]) + 더보기(10개씩). 데이터는 목업(추후 bdService.selectBidRslt).
// slide245 이벤트표(2026-08-18 버튼 추가): 복수예가조회(P02)·동가낙찰결과(P03)는 개찰 건 단위라 목록 하단 버튼,
// 기술점수(P04, scwin.grid_onclick)는 업체 행 단위라 행 내 버튼, 첨부파일 다운로드는 첨부서류 행 버튼.
import { useState } from 'react'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { Button } from '@/ui/common/base/Button'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { showToast } from '@/stores/authStore'
import { PrprcFullPopup } from '@/ui/biz/bd/bidRsltDtl/PrprcFullPopup'
import { SmprcScsbdRsltFullPopup } from '@/ui/biz/bd/bidRsltDtl/SmprcScsbdRsltFullPopup'
import { EvlMbcmtTechEvlScrDtlFullPopup } from '@/ui/biz/bd/bidRsltDtl/EvlMbcmtTechEvlScrDtlFullPopup'

interface BidResultRow {
  id: string
  seq: string // 순번
  cycle: string // 차수
  bizCode: string // 업체코드
  bizRegNo: string // 사업자등록번호
  bizName: string // 업체명
  ceo: string // 대표자
  result: string // 결과
}

// 설계서 slide238 데이터영역 — 목업(자사 정보, 추후 API 매핑).
const RESULT_BASE: Omit<BidResultRow, 'id' | 'seq'> = {
  cycle: '01',
  bizCode: '123',
  bizRegNo: '111-11-11111',
  bizName: '테스트',
  ceo: '홍길동',
  result: '1순위',
}
const TOTAL = 258
const MOCK_RESULTS: BidResultRow[] = Array.from({ length: TOTAL }, (_, i) => ({
  ...RESULT_BASE,
  id: String(i + 1),
  seq: String(i + 1),
}))

// 행 안 액션 셀 — 좌측 라벨 + 우측 버튼.
const actionCell = (label: string, action: string, onClick: () => void) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-krds-text-subtle">{label}</span>
    <Button size="sm" variant="inner" onClick={onClick}>
      {action}
    </Button>
  </div>
)

const PAGE_SIZE = 10

export interface BidRsltDtlProps {
  /** 개찰 건 식별자 — 입찰결과상세 페이지가 navigate state 에서 받아 전달(팝업 조회에 사용). */
  id: string
}

export function BidRsltDtl({ id }: BidRsltDtlProps) {
  const [page, setPage] = useState(1)
  const [prprcOpen, setPrprcOpen] = useState(false) // 복수예비가격(P02)
  const [smprcOpen, setSmprcOpen] = useState(false) // 동가낙찰결과(P03)
  // 기술점수(P04) — 행 단위라 어느 업체 행인지 같이 보관(null = 닫힘).
  const [techEvlId, setTechEvlId] = useState<string | null>(null)

  const downloadFile = fbQueries.useDownloadFile()

  // 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
  // ⚠️ 임시 GUID(행 id) — 백엔드 응답에 파일 GUID 확정 시 교체(slide245 scwin.btn_atchFileNm_onclick).
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      showToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  const total = MOCK_RESULTS.length
  const loaded = Math.min(page * PAGE_SIZE, total)
  const visible = MOCK_RESULTS.slice(0, loaded)

  const handleLoadMore = () => {
    setPage((p) => p + 1)
    console.log('[BidRsltDtl] 입찰결과 더보기') // 추후 API: bdService.selectBidRslt(page+1)
  }

  const resultRows = (it: BidResultRow): TableRow[] => [
    { label: '순번', value: it.seq, type: 'number' },
    { label: '차수', value: it.cycle },
    { label: '업체코드', value: it.bizCode },
    { label: '사업자등록번호', value: it.bizRegNo },
    { label: '업체명', value: it.bizName },
    { label: '대표자', value: it.ceo },
    { label: '결과', value: it.result },
    {
      label: '기술점수',
      value: actionCell('평가위원별 점수', '보기', () => setTechEvlId(it.id)),
      type: 'combination',
    },
    {
      label: '첨부서류',
      value: actionCell('첨부서류', '다운로드', () =>
        handleDownload(it.id, `첨부서류_${it.seq}.hwp`),
      ),
      type: 'combination',
    },
    {
      label: '서약서',
      value: actionCell('서약서', '보기', () =>
        console.log('[BidRsltDtl] 입찰결과 서약서 보기', it.id),
      ),
      type: 'combination',
    },
  ]

  return (
    <>
      <Accordion
        key={loaded}
        type="multiple"
        defaultValue={visible.map((it) => it.id)}
        className="w-full"
      >
        {visible.map((it, i) => (
          <AccordionSection
            key={it.id}
            value={it.id}
            title={`입찰결과 (순번 ${it.seq})`}
            borderTop={i > 0}
          >
            <Table rows={resultRows(it)} />
          </AccordionSection>
        ))}
      </Accordion>
      {loaded < total && (
        <div className="px-4 pb-4 pt-krds-7">
          <Button variant="secondary" className="w-full" onClick={handleLoadMore}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}

      {/* 개찰 건 단위 조회 버튼 (slide245 이벤트표) */}
      <div className="px-4 pb-6 pt-krds-7">
        <ButtonGroup
          layout="split"
          items={[
            { label: '복수예가조회', variant: 'secondary', onClick: () => setPrprcOpen(true) },
            { label: '동가낙찰결과', variant: 'secondary', onClick: () => setSmprcOpen(true) },
          ]}
        />
      </div>

      <PrprcFullPopup id={id} open={prprcOpen} onOpenChange={setPrprcOpen} />
      <SmprcScsbdRsltFullPopup id={id} open={smprcOpen} onOpenChange={setSmprcOpen} />
      <EvlMbcmtTechEvlScrDtlFullPopup
        bidRsltId={techEvlId ?? ''}
        open={techEvlId !== null}
        onOpenChange={(next) => !next && setTechEvlId(null)}
      />
    </>
  )
}
BidRsltDtl.displayName = 'BidRsltDtl'
