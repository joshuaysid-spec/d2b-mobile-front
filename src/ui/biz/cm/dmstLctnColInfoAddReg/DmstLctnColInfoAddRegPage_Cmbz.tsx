// 업체정보 추가등록 — 국내소재상사 (MUI-CM-01-M23, dmstLctnColInfoAddReg_Cmbz). 설계서 slide156~157(문서 P155~156).
//   웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 업체정보 추가 등록(국내소재상사).
//   구성(아코디언): 일반정보 · 법인/개인 구분 · 보안측정인원 · FSC · 영업정보 + 제출서류 안내(Infobox) + 조회 동의여부 → [추가 등록 신청][취소].
//   소유 팝업(컨테이너=이 페이지): P10 보안측정인원등록(ScrtyMsrmtPrsnlReg) · P11 FSC선택(FSCChc) · P12 주거래은행선택(BankChc) · MUI-CM-01-P14 확인팝업(Confirm — 별도 파일 없이 AlertModal 인라인 처리 확정).
//   ⚠️ 국내소재상사(T04/M23)는 설계서에 데이터영역(항목명 영문) 표가 없어 화면 표기 기준 잠정 영문키(types/cm 참고).
//      디자인(Figma) 없음 → 설계서(pptx)로 작업. 데이터=목업, 저장=API 경계 스텁(console.log). (2026-07-01 개정: 주민등록번호 삭제)
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { Checkbox } from '@/ui/common/base/Checkbox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Toast } from '@/ui/common/composites/Toast'
import { ScrtyMsrmtPrsnlReg, type ScrtyMsrmtPrsnlRegHandle } from '@/ui/biz/cm/dmstLctnColInfoAddReg/ScrtyMsrmtPrsnlReg'
import { FSCChc, type FSCChcHandle } from '@/ui/biz/cm/dmstLctnColInfoAddReg/FSCChc'
import { BankChc } from '@/ui/biz/cm/dmstLctnColInfoAddReg/BankChc'
import type { ScrtyMsrmtPrsn, DmsAgtFscCode, BankChcItem } from '@/types/cm'

const BPLC_OPTIONS = [
  { value: '1', label: '본사' },
  { value: '2', label: '지사' },
]
const BZSTAT_OPTIONS = [
  { value: '제조', label: '제조' },
  { value: '판매', label: '판매' },
  { value: '용역', label: '용역' },
]

// 보안측정인원 초기 목업 (slide156 예시 — 홍길동/적격/2022-02-02/증명서.pdf). 추후 API.
const INITIAL_PERSONS: ScrtyMsrmtPrsn[] = [
  { id: '1', prsnNm: '홍길동', qualYn: '적격', scrtMsrYmd: '2022-02-02', fileName: '증명서.pdf' },
]
// FSC 초기 목업 (slide157 예시 — 0001/테스트). 추후 API.
const INITIAL_FSC: DmsAgtFscCode[] = [{ fscCd: '0001', gunGrdNm: '테스트' }]

type SheetKind = 'scrt' | 'fsc' | 'bank' | null

// 천단위 콤마(숫자 표시용).
const comma = (v: string) => v.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export function DmstLctnColInfoAddRegPage_Cmbz() {
  const navigate = useNavigate()

  // ── 일반정보 ──
  const [bplcSecd, setBplcSecd] = useState('1')
  const [isoYn, setIsoYn] = useState('')
  const [rprsvEngNm, setRprsvEngNm] = useState('')
  const [addrEng, setAddrEng] = useState('')

  // ── 법인/개인 구분 (slide156) ──
  const [corpIndvSe, setCorpIndvSe] = useState('corp') // 법인/개인
  const [corpRgstOrgnNm, setCorpRgstOrgnNm] = useState('') // 법인등기기관
  const [corpRgstYmd, setCorpRgstYmd] = useState('') // 법인등기일자
  const [corpRgstPrps, setCorpRgstPrps] = useState('') // 법인등기목적
  const [hdlItemNm, setHdlItemNm] = useState('') // 사업등록(취급)종목*
  const [bzstatNm, setBzstatNm] = useState('') // 업태*
  const [bzrnoRgstOrgnNm, setBzrnoRgstOrgnNm] = useState('') // 사업자등록기관*
  const [scrtMsrUnitNm, setScrtMsrUnitNm] = useState('') // 보안측정부대*
  const [scrtMsrYmd, setScrtMsrYmd] = useState('') // 보안측정일자*
  const [scrtMsrRslt, setScrtMsrRslt] = useState('') // 보안측정결과*

  // ── 보안측정인원 ──
  const [persons, setPersons] = useState<ScrtyMsrmtPrsn[]>(INITIAL_PERSONS)
  const [selectedPrsnIds, setSelectedPrsnIds] = useState<string[]>([])

  // ── FSC ──
  const [fscList, setFscList] = useState<DmsAgtFscCode[]>(INITIAL_FSC)
  const [selectedFscCds, setSelectedFscCds] = useState<string[]>([])

  // ── 영업정보 (slide157) ──
  const [anlSaleAmt, setAnlSaleAmt] = useState('') // 연간매출액(천원)
  const [astScl, setAstScl] = useState('') // 자산규모*(천원)
  const [lncLmt, setLncLmt] = useState('') // 여신한도(천원)
  const [bank, setBank] = useState<BankChcItem | null>(null) // 주거래은행*(P12)
  const [brnchNm, setBrnchNm] = useState('') // 지점
  const [mlsplyFrstPtcpYmd, setMlsplyFrstPtcpYmd] = useState('') // 군납최초참여일
  const [trnsPrdFrom, setTrnsPrdFrom] = useState('') // 거래기간 시작
  const [trnsPrdTo, setTrnsPrdTo] = useState('') // 거래기간 종료
  const [dunsNo, setDunsNo] = useState('') // Dun's Number

  // ── 팝업/상태 ──
  const [sheet, setSheet] = useState<SheetKind>(null)
  const [agreed, setAgreed] = useState(false)
  const [warnOpen, setWarnOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const scrtRef = useRef<ScrtyMsrmtPrsnlRegHandle>(null)
  const fscRef = useRef<FSCChcHandle>(null)

  const togglePrsn = (id: string) =>
    setSelectedPrsnIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const toggleFsc = (cd: string) =>
    setSelectedFscCds((p) => (p.includes(cd) ? p.filter((x) => x !== cd) : [...p, cd]))

  // 보안측정인원 버튼(slide156)
  const handleAddPerson = (person: ScrtyMsrmtPrsn) => {
    setPersons((prev) => [...prev, person])
    setSheet(null)
    console.log('[M23] 보안측정인원 추가', person)
  }
  const handleDeletePersons = () => {
    if (selectedPrsnIds.length === 0) return setToastMsg('선택 항목이 없습니다.')
    setPersons((prev) => prev.filter((p) => !selectedPrsnIds.includes(p.id)))
    setSelectedPrsnIds([])
  }
  const handleResetPersons = () => {
    setPersons(INITIAL_PERSONS)
    setSelectedPrsnIds([])
    setToastMsg('초기화 되었습니다.')
  }

  // FSC 버튼(slide157)
  const handleAddFsc = (picked: DmsAgtFscCode[]) => {
    setFscList((prev) => {
      const existing = new Set(prev.map((f) => f.fscCd))
      return [...prev, ...picked.filter((p) => !existing.has(p.fscCd))]
    })
    setSheet(null)
    console.log('[M23] FSC 추가', picked.map((p) => p.fscCd))
  }
  const handleDeleteFsc = () => {
    if (selectedFscCds.length === 0) return setToastMsg('선택 항목이 없습니다.')
    setFscList((prev) => prev.filter((f) => !selectedFscCds.includes(f.fscCd)))
    setSelectedFscCds([])
  }

  // 신청 흐름 — 미동의 시 경고(그대로 신청/닫기) → P14. 동의 시 바로 P14.
  const handleApplyClick = () => {
    if (agreed) setConfirmOpen(true)
    else setWarnOpen(true)
  }
  const handleConfirmApply = () => {
    console.log('[M23] 추가 등록 신청', {
      bplcSecd, isoYn, rprsvEngNm, addrEng, corpIndvSe, corpRgstOrgnNm, corpRgstYmd, corpRgstPrps,
      hdlItemNm, bzstatNm, bzrnoRgstOrgnNm, scrtMsrUnitNm, scrtMsrYmd, scrtMsrRslt,
      persons, fscList, anlSaleAmt, astScl, lncLmt, bank, brnchNm, mlsplyFrstPtcpYmd,
      trnsPrdFrom, trnsPrdTo, dunsNo, agreed,
    })
    // 추후 API: cmService.applyAddRegDmsAgt({ ... })
    setToastMsg('신청 완료되었습니다.')
    window.setTimeout(() => navigate(-1), 1200)
  }

  const personRows = (d: ScrtyMsrmtPrsn): TableRow[] => [
    { label: '성명', value: d.prsnNm || '-' },
    { label: '적격여부', value: d.qualYn || '-' },
    { label: '보안측정일', value: d.scrtMsrYmd || '-' },
    { label: '첨부파일', value: d.fileName || '-' },
  ]
  const fscRows = (d: DmsAgtFscCode): TableRow[] => [
    { label: 'FSC', value: d.fscCd },
    { label: '군급명', value: d.gunGrdNm },
  ]

  // 법인/개인 구분 필드는 '법인'일 때만 노출(slide156 화면).
  const isCorp = corpIndvSe === 'corp'

  return (
    <div className="flex w-full flex-col">
      <Accordion type="multiple" defaultValue={['gnrl', 'corp', 'scrt', 'fsc', 'sale']} className="w-full">
        {/* ── 일반정보 ── */}
        <AccordionSection value="gnrl" title="일반정보" borderTop={false}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-krds-5">
              <InputLabel required>본/지사</InputLabel>
              <SelectBox placeholder="선택해주세요." value={bplcSecd} onValueChange={setBplcSecd} items={BPLC_OPTIONS} />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel>본사 사업자번호</InputLabel>
              <InputBox disabled value="123-45-67890" onChange={() => {}} />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel required>ISO 인증여부</InputLabel>
              <RadioButtonGroup
                showIndicator
                value={isoYn}
                onValueChange={setIsoYn}
                items={[
                  { value: 'Y', label: '여' },
                  { value: 'N', label: '부' },
                ]}
              />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="m23-rprsvEng">대표자명(영문)</InputLabel>
              <InputBox id="m23-rprsvEng" inputType="english" value={rprsvEngNm} placeholder="입력해주세요." onChange={(e) => setRprsvEngNm(e.target.value)} onClear={() => setRprsvEngNm('')} />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="m23-addrEng">주소(영문)</InputLabel>
              <InputBox id="m23-addrEng" inputType="english" value={addrEng} placeholder="입력해주세요." onChange={(e) => setAddrEng(e.target.value)} onClear={() => setAddrEng('')} />
            </div>
          </div>
        </AccordionSection>

        {/* ── 법인/개인 구분 ── */}
        <AccordionSection value="corp" title="법인/개인 구분">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-krds-5">
              <InputLabel>법인/개인 구분</InputLabel>
              <RadioButtonGroup
                showIndicator
                value={corpIndvSe}
                onValueChange={setCorpIndvSe}
                items={[
                  { value: 'corp', label: '법인' },
                  { value: 'indv', label: '개인' },
                ]}
              />
            </div>
            {isCorp && (
              <>
                <div className="flex flex-col gap-krds-5">
                  <InputLabel htmlFor="m23-corpOrgn">법인등기기관</InputLabel>
                  <InputBox id="m23-corpOrgn" value={corpRgstOrgnNm} placeholder="입력해주세요." onChange={(e) => setCorpRgstOrgnNm(e.target.value)} onClear={() => setCorpRgstOrgnNm('')} />
                </div>
                <div className="flex flex-col gap-krds-5">
                  <InputLabel htmlFor="m23-corpYmd">법인등기일자</InputLabel>
                  <InputBox id="m23-corpYmd" value={corpRgstYmd} placeholder="yyyy-MM-dd" onChange={(e) => setCorpRgstYmd(e.target.value)} onClear={() => setCorpRgstYmd('')} />
                </div>
                <div className="flex flex-col gap-krds-5">
                  <InputLabel htmlFor="m23-corpPrps">법인등기목적</InputLabel>
                  <InputBox id="m23-corpPrps" value={corpRgstPrps} placeholder="입력해주세요." onChange={(e) => setCorpRgstPrps(e.target.value)} onClear={() => setCorpRgstPrps('')} />
                </div>
              </>
            )}
            <div className="flex flex-col gap-krds-5">
              <InputLabel required htmlFor="m23-hdlItem">사업등록(취급)종목</InputLabel>
              <InputBox id="m23-hdlItem" value={hdlItemNm} placeholder="입력해주세요." onChange={(e) => setHdlItemNm(e.target.value)} onClear={() => setHdlItemNm('')} />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel required>업태</InputLabel>
              <SelectBox placeholder="선택해주세요." value={bzstatNm} onValueChange={setBzstatNm} items={BZSTAT_OPTIONS} />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel required htmlFor="m23-bzrnoOrgn">사업자등록기관</InputLabel>
              <InputBox id="m23-bzrnoOrgn" value={bzrnoRgstOrgnNm} placeholder="입력해주세요." onChange={(e) => setBzrnoRgstOrgnNm(e.target.value)} onClear={() => setBzrnoRgstOrgnNm('')} />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel required htmlFor="m23-scrtUnit">보안측정부대</InputLabel>
              <InputBox id="m23-scrtUnit" value={scrtMsrUnitNm} placeholder="입력해주세요." onChange={(e) => setScrtMsrUnitNm(e.target.value)} onClear={() => setScrtMsrUnitNm('')} />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel required htmlFor="m23-scrtYmd">보안측정일자</InputLabel>
              <InputBox id="m23-scrtYmd" value={scrtMsrYmd} placeholder="yyyy-MM-dd" onChange={(e) => setScrtMsrYmd(e.target.value)} onClear={() => setScrtMsrYmd('')} />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel required htmlFor="m23-scrtRslt">보안측정결과</InputLabel>
              <InputBox id="m23-scrtRslt" value={scrtMsrRslt} placeholder="입력해주세요." onChange={(e) => setScrtMsrRslt(e.target.value)} onClear={() => setScrtMsrRslt('')} />
            </div>
            {/* 보안측정 비대상 안내(slide156) */}
            <p className="text-[15px] leading-relaxed text-krds-text-muted">
              보안측정 비대상 품목 취급업체는 부대명란에 “보안측정 비대상”, 측정일자란은 “입력당일일자”로 입력해 주십시오.
            </p>
          </div>
        </AccordionSection>

        {/* ── 보안측정인원 ── */}
        <AccordionSection value="scrt" title="보안측정인원" titleInfo={`총 ${persons.length}건`}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-krds-4">
              <Button variant="primary" size="sm" onClick={() => setSheet('scrt')}>
                <Icon name="Add" size={18} aria-hidden />
                신규 추가
              </Button>
              <Button variant="secondary" size="sm" onClick={handleDeletePersons}>
                선택 삭제
              </Button>
              <Button variant="secondary" size="sm" onClick={handleResetPersons}>
                초기화
              </Button>
            </div>
            <div className="flex flex-col gap-krds-8">
              {persons.map((p) => (
                <div key={p.id} className="flex flex-col gap-krds-5">
                  <Checkbox variant="box" checked={selectedPrsnIds.includes(p.id)} onCheckedChange={() => togglePrsn(p.id)} label={`${p.prsnNm || '인원'} 선택`} />
                  <Table rows={personRows(p)} />
                </div>
              ))}
              {persons.length === 0 && (
                <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">보안측정인원이 없습니다.</p>
              )}
            </div>
          </div>
        </AccordionSection>

        {/* ── FSC ── */}
        <AccordionSection value="fsc" title="FSC" titleInfo={`총 ${fscList.length}건`}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-krds-4">
              <Button variant="primary" size="sm" onClick={() => setSheet('fsc')}>
                <Icon name="Add" size={18} aria-hidden />
                FSC 추가
              </Button>
              <Button variant="secondary" size="sm" onClick={handleDeleteFsc}>
                선택 삭제
              </Button>
            </div>
            <div className="flex flex-col gap-krds-8">
              {fscList.map((f) => (
                <div key={f.fscCd} className="flex flex-col gap-krds-5">
                  <Checkbox variant="box" checked={selectedFscCds.includes(f.fscCd)} onCheckedChange={() => toggleFsc(f.fscCd)} label={`${f.gunGrdNm} 선택`} />
                  <Table rows={fscRows(f)} />
                </div>
              ))}
              {fscList.length === 0 && (
                <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">FSC가 없습니다.</p>
              )}
            </div>
          </div>
        </AccordionSection>

        {/* ── 영업정보 ── */}
        <AccordionSection value="sale" title="영업정보">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="m23-anlSale">연간매출액 (천원)</InputLabel>
              <InputBox id="m23-anlSale" inputType="numeric" format={comma} value={anlSaleAmt} placeholder="입력해주세요." onChange={(e) => setAnlSaleAmt(e.target.value)} onClear={() => setAnlSaleAmt('')} />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel required htmlFor="m23-astScl">자산규모 (천원)</InputLabel>
              <InputBox id="m23-astScl" inputType="numeric" format={comma} value={astScl} placeholder="입력해주세요." onChange={(e) => setAstScl(e.target.value)} onClear={() => setAstScl('')} />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="m23-lncLmt">여신한도 (천원)</InputLabel>
              <InputBox id="m23-lncLmt" inputType="numeric" format={comma} value={lncLmt} placeholder="입력해주세요." onChange={(e) => setLncLmt(e.target.value)} onClear={() => setLncLmt('')} />
            </div>
            {/* 주거래은행* — 선택 트리거(→ P12) + 지점 */}
            <div className="flex flex-col gap-krds-5">
              <InputLabel required>주거래은행</InputLabel>
              <div className="flex items-end gap-krds-5">
                <InputBox readOnly className="flex-1" value={bank ? bank.bankNm : ''} placeholder="은행 선택" onChange={() => {}} />
                <Button variant="secondary" onClick={() => setSheet('bank')}>
                  선택
                </Button>
              </div>
              <InputBox value={brnchNm} placeholder="지점" onChange={(e) => setBrnchNm(e.target.value)} onClear={() => setBrnchNm('')} />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="m23-mlsply">군납최초참여일</InputLabel>
              <InputBox id="m23-mlsply" value={mlsplyFrstPtcpYmd} placeholder="yyyy-MM-dd" onChange={(e) => setMlsplyFrstPtcpYmd(e.target.value)} onClear={() => setMlsplyFrstPtcpYmd('')} />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel>거래기간</InputLabel>
              <div className="flex items-center gap-krds-4">
                <InputBox className="flex-1" value={trnsPrdFrom} placeholder="yyyy-MM-dd" onChange={(e) => setTrnsPrdFrom(e.target.value)} onClear={() => setTrnsPrdFrom('')} />
                <span aria-hidden className="text-krds-text-muted">~</span>
                <InputBox className="flex-1" value={trnsPrdTo} placeholder="yyyy-MM-dd" onChange={(e) => setTrnsPrdTo(e.target.value)} onClear={() => setTrnsPrdTo('')} />
              </div>
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="m23-duns">Dun's Number</InputLabel>
              <InputBox id="m23-duns" value={dunsNo} placeholder="입력해주세요." onChange={(e) => setDunsNo(e.target.value)} onClear={() => setDunsNo('')} />
            </div>
          </div>
        </AccordionSection>
      </Accordion>

      {/* 제출서류 안내 (slide157) */}
      <div className="px-4 pt-4">
        <Infobox
          title="내자업체 제출서류 안내"
          collapsible={false}
          items={[
            '보안측정결과서 - 1부 (해당품목 제출)',
            '(전화) 02-2079-6915,6925',
          ]}
        />
      </div>

      {/* 조회 동의여부 (slide157) */}
      <div className="flex flex-col gap-krds-5 px-4 pt-4">
        <InputLabel>공장등록증명서 또는 사업자등록증명원 조회 동의여부</InputLabel>
        <Checkbox variant="box" checked={agreed} onCheckedChange={(c) => setAgreed(c === true)} label="조회 동의" />
        <p className="text-[15px] leading-relaxed text-krds-text-muted">
          동의여부에 체크하지 않는 경우 오프라인으로 서류를 제출하셔야 합니다.
        </p>
      </div>

      {/* 하단 액션 바 — [취소][추가 등록 신청] */}
      <div
        className="sticky bottom-0 z-30 mt-4 border-t border-krds-border-divider bg-background px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <ButtonGroup
          items={[
            { label: '취소', variant: 'secondary', onClick: () => navigate(-1) },
            { label: '추가 등록 신청', variant: 'primary', onClick: handleApplyClick },
          ]}
        />
      </div>

      {/* ── 소유 팝업 ── */}
      {/* P10 보안측정인원 등록 — footer [등록][닫기] */}
      <BottomSheet
        open={sheet === 'scrt'}
        onOpenChange={(o) => !o && setSheet(null)}
        title="보안측정인원 등록"
        footer={
          <ButtonGroup
            items={[
              { label: '닫기', variant: 'secondary', onClick: () => setSheet(null) },
              { label: '등록', variant: 'primary', onClick: () => scrtRef.current?.register() },
            ]}
          />
        }
      >
        <ScrtyMsrmtPrsnlReg ref={scrtRef} onRegister={handleAddPerson} />
      </BottomSheet>

      {/* P11 FSC 선택 — footer [등록][닫기] */}
      <BottomSheet
        open={sheet === 'fsc'}
        onOpenChange={(o) => !o && setSheet(null)}
        title="FSC 선택"
        footer={
          <ButtonGroup
            items={[
              { label: '닫기', variant: 'secondary', onClick: () => setSheet(null) },
              { label: '등록', variant: 'primary', onClick: () => fscRef.current?.register() },
            ]}
          />
        }
      >
        <FSCChc ref={fscRef} onRegister={handleAddFsc} />
      </BottomSheet>

      {/* P12 주거래은행 선택 — 결과 클릭 시 반환 + 시트 닫힘 */}
      <BottomSheet open={sheet === 'bank'} onOpenChange={(o) => !o && setSheet(null)} title="주거래은행 선택">
        <BankChc
          onSelect={(item) => {
            setBank(item)
            setSheet(null)
          }}
        />
      </BottomSheet>

      {/* 미동의 경고 모달 — [그대로 신청][닫기] */}
      <AlertModal
        open={warnOpen}
        onOpenChange={setWarnOpen}
        variant="info"
        title="동의여부 미체크"
        description="동의여부에 체크하지 않는 경우 오프라인으로 서류를 제출하셔야 합니다."
        secondaryAction={{ label: '닫기' }}
        primaryAction={{ label: '그대로 신청', onClick: () => setConfirmOpen(true) }}
      />

      {/* P14 확인 팝업 (slide177) — [취소][확인] */}
      <AlertModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="check"
        title="업체정보 추가등록 신청 확인"
        description="신청서를 접수합니다. 오기재된 사항이 없는지 모두 확인하셨나요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '확인', onClick: handleConfirmApply }}
      />

      {/* 토스트(초기화/신청 완료/선택 없음) */}
      <Toast open={toastMsg !== null} onClose={() => setToastMsg(null)}>
        {toastMsg}
      </Toast>
    </div>
  )
}
DmstLctnColInfoAddRegPage_Cmbz.displayName = 'DmstLctnColInfoAddRegPage_Cmbz'
