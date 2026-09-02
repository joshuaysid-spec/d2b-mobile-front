// 추가정보 신청내역상세 — 국내소재상사 신청정보 탭 (MUI-CM-01-T06, addRegInfoAplyDtl_DmsAgt). 설계서 slide144·145(문서 P143·144).
//   웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 추가정보 신청 목록 > 상세.
//   접수한 신청 데이터를 읽기전용으로 표시(아코디언 + Table). 구성: 일반정보 · 법인/개인 구분 · 보안측정인원 · FSC · 영업정보.
//   ⚠️ 국내소재상사(T06)는 설계서에 데이터영역(항목명 영문) 표가 없어 화면 표기 기준 잠정 영문키(types/cm 참고).
//   데이터=목업(설계서 slide144·145 예시값) — 추후 API: cmService.selectBzentyInfoAddRegAplyDtl. (2026-07-01 개정: 주민등록번호 삭제)
// 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
import { useState } from 'react'

import type { MockScrtyMsrmtPrsn, MockDmsAgtFscCode } from '@/types/mock/cm'
import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'

// 보안측정인원 — slide144 예시값(홍길동/적격/2022-02-02/증명서.pdf).
const PERSONS: MockScrtyMsrmtPrsn[] = [
  { id: '1', prsnNm: '홍길동', qualYn: '적격', scrtMsrYmd: '2022-02-02', fileName: '증명서.pdf' },
]
// 법인/개인 구분 — slide144 예시값.
const CORP = {
  corpIndvSe: '법인',
  corpRgstOrgnNm: '기관명 표시',
  corpRgstYmd: '등기일자 표시',
  corpRgstPrps: '등기목적 표시',
  hdlItemNm: '물품 공급업 / 군수품 무역대리업',
  bzstatNm: '테스트',
  bzrnoRgstOrgnNm: '방위사업청',
  scrtMsrUnitNm: '보안측정 비대상',
  scrtMsrYmd: '2026-02-03',
  scrtMsrRslt: '적격',
}
// FSC — slide145 예시값(0001/테스트).
const FSC_LIST: MockDmsAgtFscCode[] = [{ fscCd: '0001', gunGrdNm: '테스트' }]
// 영업정보 — slide145 예시값.
const SALE = {
  anlSaleAmt: '0 천원',
  astScl: '3,000,000 천원',
  lncLmt: '0 천원',
  bankNm: '농협은행',
  brnchNm: '과천 지점',
  mlsplyFrstPtcpYmd: '2020-03-01',
  trnsPrd: '2020-03-01 ~ 2025-12-31',
  dunsNo: '123-45-67890',
}
// 일반정보 — slide144 예시값.
const GNRL = {
  bplcSecd: '1-본사',
  brno: '123-45-67890',
  isoYn: '여 / 부',
  rprsvEngNm: 'Hong Gildong',
  addrEng: '102, 11st, jonglo-gu, seoul, korea',
}

function personRows(d: MockScrtyMsrmtPrsn, onDownload: (guid: string, fileNm: string) => void): TableRow[] {
  return [
    { label: '성명', value: d.prsnNm },
    { label: '적격여부', value: d.qualYn },
    { label: '보안측정일', value: d.scrtMsrYmd },
    {
      label: '첨부파일',
      value: (
        <FileDownloadList
          files={[{ id: d.id, name: d.fileName, onDownload: () => onDownload(d.id, d.fileName ?? '') }]}
        />
      ),
    },
  ]
}

export function AddRegInfoAplyDtl_DmsAgt() {
  const downloadFile = fbQueries.useDownloadFile()
  const [toast, setToast] = useState<string | null>(null) // 다운로드 실패 토스트(null=닫힘)

  // 다운로드 — guid 로 Blob 수신 → 원본 파일명으로 저장. 실패는 토스트 안내.
  // ⚠️ 임시 GUID(행 id) — 백엔드 응답에 파일 GUID 확정 시 교체.
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      setToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <>
    <Accordion type="multiple" defaultValue={['scrt', 'corp', 'fsc', 'sale', 'gnrl']} className="w-full">
      <AccordionSection value="gnrl" title="일반정보" borderTop={false}>
        <Table
          rows={[
            { label: '본/지사', value: GNRL.bplcSecd },
            { label: '사업자번호', value: GNRL.brno },
            { label: 'ISO 인증여부', value: GNRL.isoYn },
            { label: '대표자명(영문)', value: GNRL.rprsvEngNm },
            { label: '주소(영문)', value: GNRL.addrEng },
          ]}
        />
      </AccordionSection>

      <AccordionSection value="corp" title="법인/개인 구분">
        <Table
          rows={[
            { label: '법인/개인 구분', value: CORP.corpIndvSe },
            { label: '법인등기기관', value: CORP.corpRgstOrgnNm },
            { label: '법인등기일자', value: CORP.corpRgstYmd },
            { label: '법인등기목적', value: CORP.corpRgstPrps },
            { label: '사업등록(취급)종목', value: CORP.hdlItemNm },
            { label: '업태', value: CORP.bzstatNm },
            { label: '사업자등록기관', value: CORP.bzrnoRgstOrgnNm },
            { label: '보안측정부대', value: CORP.scrtMsrUnitNm },
            { label: '보안측정일자', value: CORP.scrtMsrYmd },
            { label: '보안측정결과', value: CORP.scrtMsrRslt },
          ]}
        />
      </AccordionSection>

      <AccordionSection value="scrt" title="보안측정인원">
        <div className="flex flex-col gap-krds-8">
          {PERSONS.map((p) => (
            <Table key={p.id} rows={personRows(p, handleDownload)} />
          ))}
        </div>
      </AccordionSection>

      <AccordionSection value="fsc" title="FSC">
        <div className="flex flex-col gap-krds-8">
          {FSC_LIST.map((f) => (
            <Table
              key={f.fscCd}
              rows={[
                { label: 'FSC', value: f.fscCd },
                { label: '군급명', value: f.gunGrdNm },
              ]}
            />
          ))}
        </div>
      </AccordionSection>

      <AccordionSection value="sale" title="영업정보">
        <Table
          rows={[
            { label: '연간매출액', value: SALE.anlSaleAmt },
            { label: '자산규모', value: SALE.astScl },
            { label: '여신한도', value: SALE.lncLmt },
            { label: '주거래은행', value: `${SALE.bankNm} ${SALE.brnchNm}` },
            { label: '군납최초참여일', value: SALE.mlsplyFrstPtcpYmd },
            { label: '거래기간', value: SALE.trnsPrd },
            { label: "Dun's Number", value: SALE.dunsNo },
          ]}
        />
      </AccordionSection>
    </Accordion>

    {/* 다운로드 실패 토스트 */}
    <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
      {toast}
    </Toast>
  </>
  )
}
AddRegInfoAplyDtl_DmsAgt.displayName = 'AddRegInfoAplyDtl_DmsAgt'
