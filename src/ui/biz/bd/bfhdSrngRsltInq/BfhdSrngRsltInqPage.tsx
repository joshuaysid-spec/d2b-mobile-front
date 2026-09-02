// 사전심사(PQ) 신청조회(MUI-BD-02-M03) · 결과조회(MUI-BD-02-M02) — 02.입찰 v1.86 slide174·179(화면), 175·176(데이터영역).
// 두 화면은 구성(공고일반/업체내역/첨부파일/사전심사결과)이 동일하고 진입점·첨부 다운로드 유무만 달라
// 1 페이지 + mode 파라미터로 구성한다(CLAUDE.md '유사 화면 = 페이지를 함부로 나누지 않는다').
//   mode='aply' — MUI-BD-02-M03 사전심사(PQ)신청조회(2026-07-23 화면 추가). 첨부파일 다운로드 버튼 없음(slide174 목업).
//   mode='rslt' — MUI-BD-02-M02 사전심사(PQ)결과조회. 첨부파일 다운로드 버튼 노출(slide179 목업).
// 섹션 순서(설계서 주석 ①~⑤): 업무도움 → 공고일반 → 업체내역 → 첨부파일 → 사전심사결과.
// 처리조건:
//   ① 업무도움은 업무구분이 용역·공사인 경우에만 노출.
//   ②-1 공고일반의 '공사번호'는 용역인 경우 '조달번호'로 표기(prcmNo 동일 항목).
//   ⑤ 사전심사결과는 심사 완료면 합격/불합격, 심사중이면 '심사중'(점수·확정일시는 '-')
//      — v1.83 의 '결과 전 숨김'에서 v1.86 으로 변경됨.
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { Icon } from '@/ui/common/base/Icon'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

/** 진입 모드 — 'aply'=신청조회(M03) / 'rslt'=결과조회(M02). */
export type BfhdSrngInqMode = 'aply' | 'rslt'

// 공고일반 (dmt_bidPbancInfo, slide175) — 항목명/형식 설계서 그대로.
interface BidPbancInfo {
  pbancNo: string
  prcmNo: string
  orderInstNm: string
  rfrncNo: string
  cstrnSenm: string
  ctrtMthdNm: string
  bidMthdNm: string
  bgtAmt: string
  bfhdSrngEnfrcYn: string
  elgbSrngEnfrcYn: string
  bfhdSrngAplyDdlnDt: string
  bdopnDt: string
}
// 값은 설계서 목업(slide174·179, 2026-07-09 '공고일반 내역 전체 변경(PC항목변경 반영)') 그대로.
const PBANC_INFO: BidPbancInfo = {
  pbancNo: 'R0001-000',
  prcmNo: '2025-00001',
  orderInstNm: '방위사업청',
  rfrncNo: '2025R0001-000',
  cstrnSenm: '신축공사',
  ctrtMthdNm: '종합낙찰제',
  bidMthdNm: '종합낙찰제',
  bgtAmt: '500,000,000 원',
  bfhdSrngEnfrcYn: '대상',
  elgbSrngEnfrcYn: '비대상',
  bfhdSrngAplyDdlnDt: '2026-01-13 10:00:00',
  bdopnDt: '2026-01-15 10:00:00',
}

// 업체내역 (dmt_bzentyInfo, slide175). 주민등록번호는 개정에서 삭제됨(2026-07-01).
interface BzentyInfo {
  bzentyCd: string
  bzentyNm: string
  rprsvNm: string
  brno: string
  bzentyTelno: string
  bzentyAddr: string
}
const BZENTY_INFO: BzentyInfo = {
  bzentyCd: '00000',
  bzentyNm: '㈜업체명표기영역',
  rprsvNm: '홍길동',
  brno: '123-56-78901',
  bzentyTelno: '02-1234-5678',
  bzentyAddr: '서울특별시 용산구 한강대로 1',
}

// 사전심사결과 (dmt_bfhdSrngRslt, slide176). srngPassYn 이 비면 심사중.
interface BfhdSrngRslt {
  /** 심사점수 (bfhdSrngScr, 5,2) */
  bfhdSrngScr: string
  /** 합격여부 (srngPassYn, 1) — 미확정(심사중)이면 빈 값 */
  srngPassYn: string
  /** 심사확정일시 (bfhdSrngCfmtnDt) */
  bfhdSrngCfmtnDt: string
}
const SRNG_RSLT: Record<BfhdSrngInqMode, BfhdSrngRslt> = {
  // 신청조회 — 아직 심사 전(slide174 목업: '-' / 심사중 / '-')
  aply: { bfhdSrngScr: '', srngPassYn: '', bfhdSrngCfmtnDt: '' },
  // 결과조회 — 심사 완료(slide179 목업)
  rslt: { bfhdSrngScr: '99', srngPassYn: '합격', bfhdSrngCfmtnDt: '2025-12-24 10:30' },
}

// 첨부파일 (dlt_atchFileList, slide176) — 첨부서류명(adocNm) + 첨부파일명(fileNm) + 파일크기(fileSz).
interface AtchFile {
  /** 목록 key — 파일명은 중복 가능하므로 고유 id 사용 */
  id: string
  /** 첨부서류명 (adocNm) */
  adocNm: string
  /** 첨부파일명 (fileNm) */
  fileNm: string
  /** 파일크기 (fileSz) — 대괄호 없이 */
  fileSz: string
}
const ATCH_FILES: AtchFile[] = [
  { id: 'pq-1', adocNm: '첨부서류명', fileNm: '사전심사신청서.hwp', fileSz: '786KB' },
  { id: 'pq-2', adocNm: '첨부서류명', fileNm: '심사결과통지서.pdf', fileSz: '1.2MB' },
]

// 직접 URL 진입(state 없음) 대비 fallback — 업무구분 분기(업무도움 노출·조달번호 라벨)에 사용.
const FALLBACK_TASK_SE_NM = '공사'

export function BfhdSrngRsltInqPage({ mode = 'rslt' }: { mode?: BfhdSrngInqMode }) {
  // 입찰진행 상세(M02)에서 넘어온 항목 — 업무구분 분기용(없으면 fallback).
  const detail = useLocation().state as MockBidPrgrsItem | null
  const taskSeNm = detail?.taskSeNm ?? FALLBACK_TASK_SE_NM
  const isLbsvc = taskSeNm === '용역'
  // ① 업무도움은 용역·공사인 경우에만 노출(설계서 주석 1).
  const showHelp = isLbsvc || taskSeNm === '공사'

  const rslt = SRNG_RSLT[mode]
  // ⑤ 심사 완료(합격여부 있음)면 결과 그대로, 심사중이면 '심사중' + 점수·확정일시 '-'.
  const isSrngDone = rslt.srngPassYn !== ''

  const pbancRows: TableRow[] = [
    { label: '공고번호', value: PBANC_INFO.pbancNo },
    // ②-1 용역이면 '조달번호'로 표기(같은 항목 prcmNo).
    { label: isLbsvc ? '조달번호' : '공사번호', value: PBANC_INFO.prcmNo },
    { label: '발주기관', value: PBANC_INFO.orderInstNm },
    { label: '통합참조번호', value: PBANC_INFO.rfrncNo },
    { label: '공사구분', value: PBANC_INFO.cstrnSenm },
    { label: '계약방법', value: PBANC_INFO.ctrtMthdNm },
    { label: '입찰방법', value: PBANC_INFO.bidMthdNm },
    { label: '예산금액', value: PBANC_INFO.bgtAmt, type: 'number' },
    { label: '사전심사', value: PBANC_INFO.bfhdSrngEnfrcYn },
    { label: '적격심사', value: PBANC_INFO.elgbSrngEnfrcYn },
    { label: '신청마감일시', value: PBANC_INFO.bfhdSrngAplyDdlnDt },
    { label: '개찰일시', value: PBANC_INFO.bdopnDt },
  ]

  const bzentyRows: TableRow[] = [
    { label: '업체코드', value: BZENTY_INFO.bzentyCd },
    { label: '업체명', value: BZENTY_INFO.bzentyNm },
    { label: '대표자', value: BZENTY_INFO.rprsvNm },
    { label: '사업자등록번호', value: BZENTY_INFO.brno },
    { label: '전화번호', value: BZENTY_INFO.bzentyTelno },
    { label: '주소', value: BZENTY_INFO.bzentyAddr },
  ]

  // 라벨 '심사확정일시'는 데이터영역(bfhdSrngCfmtnDt) 표기를 따른다(목업 라벨 '심사확정일자'는 표기 흔들림).
  const rsltRows: TableRow[] = [
    { label: '심사점수', value: isSrngDone ? rslt.bfhdSrngScr : '-', type: 'number' },
    { label: '합격여부', value: isSrngDone ? rslt.srngPassYn : '심사중' },
    { label: '심사확정일시', value: isSrngDone ? rslt.bfhdSrngCfmtnDt : '-' },
  ]

  const screenNm = mode === 'aply' ? '사전심사(PQ) 신청조회' : '사전심사(PQ) 결과조회'

  const downloadFile = fbQueries.useDownloadFile()
  const [toast, setToast] = useState<string | null>(null) // 다운로드 실패 토스트(null=닫힘)

  // 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
  // ⚠️ 임시 GUID(행 id) — 백엔드 응답에 파일 GUID 확정 시 교체.
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      setToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* 요약 헤더 — badges(업무구분/계약방식/심사/참가유형) + 공고번호 + 출력 + 공고명 (Figma 9300-38197) */}
      <SummaryInfo
        badges={[
          { label: taskSeNm },
          { label: detail?.ctrtMthdNm ?? '경쟁입찰' },
          { label: '사전심사' },
          { label: '입찰참가' },
        ]}
        subtitle={detail?.pbancNo ?? '긴급공고 LDG0097-1'}
        title={detail?.bidNm ?? '특수작전용대물타격무인항공기'}
        actions={
          <button
            type="button"
            aria-label="출력"
            onClick={() => console.log('[M02-PQ] 출력')}
            className="flex size-[37px] shrink-0 items-center justify-center rounded-krds-8 border border-krds-border-field bg-background text-krds-text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
          >
            <Icon name="Print" size={24} aria-hidden />
          </button>
        }
      />

      <PageTitle as="h2" className="sr-only">
        {screenNm}
      </PageTitle>

      {/* ① 업무도움 — 용역·공사인 경우에만 노출 */}
      {showHelp && (
        <div className="px-4 pb-4">
          <Infobox
            title="업무도움"
            items={[
              mode === 'aply'
                ? '제출한 사전심사(PQ) 신청 내역을 조회하는 화면입니다.'
                : '사전심사(PQ) 신청 현황 및 심사결과를 조회하는 화면입니다.',
            ]}
          />
        </div>
      )}

      <Accordion
        type="multiple"
        defaultValue={['pbanc', 'bzenty', 'atch', 'result']}
        className="w-full"
      >
        {/* ② 공고일반 */}
        <AccordionSection value="pbanc" title="공고일반" borderTop={false}>
          <Table rows={pbancRows} />
        </AccordionSection>
        {/* ③ 업체내역 */}
        <AccordionSection value="bzenty" title="업체내역">
          <Table rows={bzentyRows} />
        </AccordionSection>
        {/* ④ 첨부파일 — 첨부서류명 + 파일칩. 다운로드 버튼은 결과조회(M02)만(slide174 목업엔 없음) */}
        <AccordionSection value="atch" title="첨부파일" titleInfo={`총 ${ATCH_FILES.length}건`}>
          <div className="flex flex-col gap-krds-8">
            {ATCH_FILES.map((f) => (
              <div key={f.id} className="flex flex-col gap-krds-3">
                <span className="text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                  {f.adocNm}
                </span>
                <FileDownloadList
                  files={[
                    {
                      id: f.id,
                      name: f.fileNm,
                      size: f.fileSz,
                      onDownload:
                        mode === 'rslt'
                          ? () => handleDownload(f.id, f.fileNm)
                          : undefined,
                    },
                  ]}
                />
              </div>
            ))}
          </div>
        </AccordionSection>
        {/* ⑤ 사전심사결과 — 심사중이면 '심사중' 표기 */}
        <AccordionSection value="result" title="사전심사결과">
          <Table rows={rsltRows} />
        </AccordionSection>
      </Accordion>

      {/* 다운로드 실패 토스트 */}
      <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
        {toast}
      </Toast>
    </div>
  )
}
BfhdSrngRsltInqPage.displayName = 'BfhdSrngRsltInqPage'
