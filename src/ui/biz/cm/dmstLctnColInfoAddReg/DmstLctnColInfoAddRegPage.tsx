// 업체정보 추가등록 — 물품(내자) (MUI-CM-01-M05, DmstLctnColInfoAddRegPage). 설계서 slide150~152(문서 P149~151).
//   웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 업체정보 추가 등록(물품(내자)).
//   구성(아코디언): 일반정보 · 대표품류 및 조합/단체 · 등록품목명세 + 유의사항(Infobox) + 조회 동의여부 → [추가 등록 신청][취소].
//   소유 팝업(컨테이너=이 페이지): P06 품류선택(KnditmChc) · P07 조합/단체(AsctGrpChc) · P08 등록대상품목(RegTrgtItemChc)
//     · P09 품목조회(ItemInq) · P13 행정정보공동이용사전동의서(PbamdsInfoJntUtztnBfhdWtcs) · MUI-CM-01-P14 확인팝업(Confirm — 별도 파일 없이 AlertModal 인라인 처리 확정).
//   ⚠️ 디자인(Figma) 없음 → 설계서(pptx)로 작업. 데이터=목업(설계서 항목명/형식), 저장=API 경계 스텁(console.log).
//   신청 흐름(slide152/175/177): 조회 동의 체크 → P13 사전동의서 → [동의하고 신청하기] → P14 확인 → 완료 토스트.
//     미동의 상태로 [추가 등록 신청] → 경고 모달(그대로 신청/닫기) → 그대로 신청 → P14 확인.
import { useMemo, useRef, useState } from 'react'
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
import { KnditmChc } from '@/ui/biz/cm/dmstLctnColInfoAddReg/KnditmChc'
import { AsctGrpChc } from '@/ui/biz/cm/dmstLctnColInfoAddReg/AsctGrpChc'
import { RegTrgtItemChc, type RegTrgtItemChcHandle } from '@/ui/biz/cm/dmstLctnColInfoAddReg/RegTrgtItemChc'
import { ItemInq } from '@/ui/biz/cm/dmstLctnColInfoAddReg/ItemInq'
import { PbamdsInfoJntUtztnBfhdWtcs } from '@/ui/biz/cm/dmstLctnColInfoAddReg/PbamdsInfoJntUtztnBfhdWtcs'
import type {
  AddRegItemRow,
  KnditmChcItem,
  AsctGrpChcItem,
  RegTrgtItemChcItem,
  ItemInqDetail,
} from '@/types/cm'

// 본/지사(bplcSecd) 코드 — 설계서 상세(BzentyGnrlInfo bplcSecd '1-본사') 관례.
const BPLC_OPTIONS = [
  { value: '1', label: '본사' },
  { value: '2', label: '지사' },
]
// 업태(bzstat) — slide150 업태 선택: 제조(11)/판매(12)/조합및단체(13)/용역(14)/벤처제조(15)/벤처판매(16)/벤처용역(17).
const BZSTAT_OPTIONS = [
  { value: '11', label: '제조' },
  { value: '12', label: '판매' },
  { value: '13', label: '조합및단체' },
  { value: '14', label: '용역' },
  { value: '15', label: '벤처제조' },
  { value: '16', label: '벤처판매' },
  { value: '17', label: '벤처용역' },
]

// 등록품목명세 초기 목업 (설계서 slide151 예시 — 항목명/형식 그대로). 추후 API: cmService.getRegItemList.
const INITIAL_ITEMS: AddRegItemRow[] = [
  {
    id: '1',
    itemCd: '1001100001',
    knditmCd: '60',
    knditmCdNm: '총탄',
    itemCdNm: '이불',
    itemRgstrtSecdNm: '제조',
    itemRgstrtRqmtNm: '공장등록',
    itemRvwRsltCn: '적격',
    aprvYmd: '9999-12-31',
    expryYmd: '9999-12-31',
    rnwlReqYmd: '9999-12-31',
    rcptSttsNm: '신청',
  },
  {
    id: '2',
    itemCd: '1234567890',
    knditmCd: '05',
    knditmCdNm: '피복',
    itemCdNm: '물컵',
    itemRgstrtSecdNm: '제조',
    itemRgstrtRqmtNm: '공장등록',
    itemRvwRsltCn: '적격',
    aprvYmd: '9999-12-31',
    expryYmd: '9999-12-31',
    rnwlReqYmd: '9999-12-31',
    rcptSttsNm: '신청',
  },
]
const TOTAL_ITEMS = 258 // 더보기(10/258) 시연용 총건수(설계서 slide151)

type SheetKind = 'knditm' | 'asct' | 'regtrgt' | 'itemInq' | null

export function DmstLctnColInfoAddRegPage() {
  const navigate = useNavigate()

  // ── 일반정보 (slide150) ──
  const [bplcSecd, setBplcSecd] = useState('1') // 본/지사
  const [isoYn, setIsoYn] = useState('') // ISO 인증여부 여/부
  const [rprsvEngNm, setRprsvEngNm] = useState('') // 대표자명(영문)
  const [addrEng, setAddrEng] = useState('') // 주소(영문)

  // ── 대표품류 및 조합/단체 (slide150) ──
  const [knditm, setKnditm] = useState<KnditmChcItem | null>(null) // 대표품류(P06)
  const [bzstat, setBzstat] = useState('') // 업태
  const [asctGrp, setAsctGrp] = useState<AsctGrpChcItem | null>(null) // 조합/단체(P07)

  // ── 등록품목명세 (slide151) ──
  const [items, setItems] = useState<AddRegItemRow[]>(INITIAL_ITEMS)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [itemKeyword, setItemKeyword] = useState('')

  // ── 팝업/상태 ──
  const [sheet, setSheet] = useState<SheetKind>(null)
  const [itemInqDetail, setItemInqDetail] = useState<ItemInqDetail | null>(null)
  const [agreeOpen, setAgreeOpen] = useState(false) // P13 사전동의서
  const [agreed, setAgreed] = useState(false) // 조회 동의여부
  const [warnOpen, setWarnOpen] = useState(false) // 미동의 경고 모달
  const [confirmOpen, setConfirmOpen] = useState(false) // P14 확인
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const regTrgtRef = useRef<RegTrgtItemChcHandle>(null)

  // 등록품목 검색(목업 필터) — 품명/품목코드 부분일치.
  const visibleItems = useMemo(() => {
    const kw = itemKeyword.trim()
    if (!kw) return items
    return items.filter((it) => it.itemCdNm.includes(kw) || it.itemCd.includes(kw))
  }, [items, itemKeyword])

  const toggleItem = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  // 등록품목명세 버튼 동작(설계서 slide151) — 목업 상태 변경.
  const handleAddItems = (picked: RegTrgtItemChcItem[]) => {
    setItems((prev) => [
      ...prev,
      ...picked.map((p, i) => ({
        id: `new-${Date.now()}-${i}`,
        itemCd: p.itemCd,
        knditmCd: p.knditmCd,
        knditmCdNm: p.knditmCdNm,
        itemCdNm: p.itemCdNm,
        itemRgstrtSecdNm: '제조',
        itemRgstrtRqmtNm: p.itemRgstrtRqmtNm,
        itemRvwRsltCn: '적격',
        aprvYmd: '-',
        expryYmd: '-',
        rnwlReqYmd: '-',
        rcptSttsNm: '신청',
      })),
    ])
    setSheet(null)
    console.log('[M05] 등록대상 품목 추가', picked.map((p) => p.itemCd))
  }
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      setToastMsg('선택 항목이 없습니다.')
      return
    }
    setItems((prev) => prev.filter((it) => !selectedIds.includes(it.id)))
    setSelectedIds([])
    console.log('[M05] 선택 삭제')
  }
  const handleRenewSelected = () => {
    if (selectedIds.length === 0) {
      setToastMsg('선택 항목이 없습니다.')
      return
    }
    // 선택 갱신 — 접수상태 임시 변경(slide151 '임시 변경, 갱신 접수 신청 필요').
    setItems((prev) =>
      prev.map((it) => (selectedIds.includes(it.id) ? { ...it, rcptSttsNm: '갱신신청' } : it)),
    )
    setSelectedIds([])
    console.log('[M05] 선택 갱신')
  }
  const handleResetItems = () => {
    setItems(INITIAL_ITEMS)
    setSelectedIds([])
    setToastMsg('초기화 되었습니다.')
    console.log('[M05] 등록품목명세 초기화')
  }
  // 품목코드 클릭 → 품목 조회(P09) 시트. 업종코드/명은 잠정 목업(설계서 slide167 표기).
  const openItemInq = (row: AddRegItemRow) => {
    setItemInqDetail({ itemCd: row.itemCd, bzstatCd: '1234', bzstatNm: '제조업' })
    setSheet('itemInq')
  }

  // ── 신청 흐름 ──
  // 조회 동의 체크박스 토글 — 체크 시 P13 사전동의서 호출(slide152), 해제 시 동의 취소.
  const handleAgreeToggle = (checked: boolean) => {
    if (checked) setAgreeOpen(true)
    else setAgreed(false)
  }
  // P13 [동의하고 신청하기] — 동의 확정 + P14 확인으로 진행.
  const handleAgreeAndApply = () => {
    setAgreed(true)
    setAgreeOpen(false)
    setConfirmOpen(true)
  }
  // 하단 [추가 등록 신청] — 동의 시 바로 P14, 미동의 시 경고 모달(그대로 신청/닫기).
  const handleApplyClick = () => {
    if (agreed) setConfirmOpen(true)
    else setWarnOpen(true)
  }
  // P14 확인 — 신청 접수(스텁) → 완료 토스트 → 목록 이동.
  const handleConfirmApply = () => {
    console.log('[M05] 추가 등록 신청', { bplcSecd, isoYn, rprsvEngNm, addrEng, knditm, bzstat, asctGrp, items, agreed })
    // 추후 API: cmService.applyAddReg({ ... })
    setToastMsg('신청 완료되었습니다.')
    window.setTimeout(() => navigate(-1), 1200)
  }

  function itemRows(d: AddRegItemRow): TableRow[] {
    return [
      {
        label: '품목코드',
        // 품목코드 클릭 → 품목 조회(P09). 클릭 요소는 button(전역 cursor·a11y 규칙 커버).
        value: (
          <button
            type="button"
            className="text-left text-krds-text-primary-active underline-offset-2 hover:underline"
            onClick={() => openItemInq(d)}
          >
            {d.itemCd}
          </button>
        ),
      },
      { label: '품류코드/명', value: `${d.knditmCd} / ${d.knditmCdNm}` },
      { label: '품명', value: d.itemCdNm },
      { label: '구분', value: d.itemRgstrtSecdNm },
      { label: '등록요건', value: d.itemRgstrtRqmtNm },
      { label: '적격여부', value: d.itemRvwRsltCn },
      { label: '승인일자', value: d.aprvYmd },
      { label: '만료일자', value: d.expryYmd },
      { label: '갱신요청일', value: d.rnwlReqYmd },
      { label: '접수상태', value: d.rcptSttsNm },
    ]
  }

  return (
    <div className="flex w-full flex-col">
      <Accordion type="multiple" defaultValue={['gnrl', 'knditm', 'reg']} className="w-full">
        {/* ── 일반정보 ── */}
        <AccordionSection value="gnrl" title="일반정보" borderTop={false}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-krds-5">
              <InputLabel required>본/지사</InputLabel>
              <SelectBox
                placeholder="선택해주세요."
                value={bplcSecd}
                onValueChange={setBplcSecd}
                items={BPLC_OPTIONS}
              />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel>본사 사업자번호</InputLabel>
              {/* 본사 사업자번호 — 자동표시(read-only). 3-2-5 자리(slide150). */}
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
              <InputLabel htmlFor="m05-rprsvEng">대표자명(영문)</InputLabel>
              <InputBox
                id="m05-rprsvEng"
                inputType="english"
                value={rprsvEngNm}
                placeholder="입력해주세요."
                onChange={(e) => setRprsvEngNm(e.target.value)}
                onClear={() => setRprsvEngNm('')}
              />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="m05-addrEng">주소(영문)</InputLabel>
              <InputBox
                id="m05-addrEng"
                inputType="english"
                value={addrEng}
                placeholder="입력해주세요."
                onChange={(e) => setAddrEng(e.target.value)}
                onClear={() => setAddrEng('')}
              />
            </div>
          </div>
        </AccordionSection>

        {/* ── 대표품류 및 조합/단체 ── */}
        <AccordionSection value="knditm" title="대표품류 및 조합/단체">
          <div className="flex flex-col gap-4">
            {/* 대표품류 — 선택 트리거(→ P06) */}
            <div className="flex flex-col gap-krds-5">
              <InputLabel>대표품류</InputLabel>
              <div className="flex items-end gap-krds-5">
                <InputBox
                  readOnly
                  className="flex-1"
                  value={knditm ? `${knditm.knditmCd} / ${knditm.knditmCdNm}` : ''}
                  placeholder="선택해주세요."
                  onChange={() => {}}
                />
                <Button variant="secondary" onClick={() => setSheet('knditm')}>
                  선택
                </Button>
              </div>
            </div>
            {/* 업태 */}
            <div className="flex flex-col gap-krds-5">
              <InputLabel>업태</InputLabel>
              <SelectBox
                placeholder="선택해주세요."
                value={bzstat}
                onValueChange={setBzstat}
                items={BZSTAT_OPTIONS}
              />
            </div>
            {/* 조합/단체 — 선택 트리거(→ P07) */}
            <div className="flex flex-col gap-krds-5">
              <InputLabel>조합/단체</InputLabel>
              <div className="flex items-end gap-krds-5">
                <InputBox
                  readOnly
                  className="flex-1"
                  value={asctGrp ? asctGrp.asctCdNm : ''}
                  placeholder="선택해주세요."
                  onChange={() => {}}
                />
                <Button variant="secondary" onClick={() => setSheet('asct')}>
                  선택
                </Button>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* ── 등록품목명세 ── */}
        <AccordionSection value="reg" title="등록품목명세" titleInfo={`총 ${items.length}건`}>
          <div className="flex flex-col gap-4">
            {/* 검색 — 아래 목록에서 검색(slide151) */}
            <InputBox
              value={itemKeyword}
              placeholder="코드를 입력해주세요"
              onChange={(e) => setItemKeyword(e.target.value)}
              onClear={() => setItemKeyword('')}
            />
            {/* 버튼 — 신규 추가(P08)/선택 삭제/선택 갱신/초기화 */}
            <div className="flex flex-wrap gap-krds-4">
              <Button variant="primary" size="sm" onClick={() => setSheet('regtrgt')}>
                <Icon name="Add" size={18} aria-hidden />
                신규 추가
              </Button>
              <Button variant="secondary" size="sm" onClick={handleDeleteSelected}>
                선택 삭제
              </Button>
              <Button variant="secondary" size="sm" onClick={handleRenewSelected}>
                선택 갱신
              </Button>
              <Button variant="secondary" size="sm" onClick={handleResetItems}>
                초기화
              </Button>
            </div>

            {/* 품목 목록 — 선택 토글 + 품목코드 링크(P09). 목업. */}
            <div className="flex flex-col gap-krds-8">
              {visibleItems.map((it) => {
                const on = selectedIds.includes(it.id)
                return (
                  <div key={it.id} className="flex flex-col gap-krds-5">
                    <Checkbox
                      variant="box"
                      checked={on}
                      onCheckedChange={() => toggleItem(it.id)}
                      label={`${it.itemCdNm} 선택`}
                    />
                    <Table rows={itemRows(it)} />
                  </div>
                )
              })}
              {visibleItems.length === 0 && (
                <p className="py-6 text-center text-krds-body-md text-krds-text-subtle">
                  등록품목이 없습니다.
                </p>
              )}
            </div>

            {/* 더보기 (loaded/258 — 스텁) */}
            <Button variant="secondary" className="w-full" onClick={() => console.log('[M05] 더보기')}>
              더보기 ({Math.min(items.length, 10)}/{TOTAL_ITEMS})
            </Button>
          </div>
        </AccordionSection>
      </Accordion>

      {/* 유의사항 (slide152) */}
      <div className="px-4 pt-4">
        <Infobox
          title="유의사항"
          collapsible
          items={[
            '등록하시려는 품목이 상단에 이미 등록되어진 상태라면 별도로 추가하실 필요가 없습니다.',
            '신규 품목은 우측의 추가 버튼을 이용해 리스트에 추가 후 접수해 주시면 됩니다.',
            '삭제, 갱신이 필요한 경우에는 선택에 체크 후 해당업무(삭제 혹은 갱신) 버튼을 클릭하신 후 접수해 주시기 바랍니다.',
            '갱신은 만료전 90일부터 가능하며, 만료된 건은 삭제 후 추가(신규신청)해 주시기 바랍니다.',
          ]}
        />
      </div>

      {/* 조회 동의여부 (slide152) — 체크 시 P13 사전동의서 호출 */}
      <div className="flex flex-col gap-krds-5 px-4 pt-4">
        <InputLabel>공장등록증명서 또는 사업자등록증명원 조회 동의여부</InputLabel>
        <Checkbox
          variant="box"
          checked={agreed}
          onCheckedChange={(c) => handleAgreeToggle(c === true)}
          label="조회 동의"
        />
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
      {/* P06 품류선택 — 결과 클릭 시 반환 + 시트 닫힘 */}
      <BottomSheet open={sheet === 'knditm'} onOpenChange={(o) => !o && setSheet(null)} title="품류 선택">
        <KnditmChc
          onSelect={(item) => {
            setKnditm(item)
            setSheet(null)
          }}
        />
      </BottomSheet>

      {/* P07 조합/단체 선택 */}
      <BottomSheet open={sheet === 'asct'} onOpenChange={(o) => !o && setSheet(null)} title="조합/단체 선택">
        <AsctGrpChc
          onSelect={(item) => {
            setAsctGrp(item)
            setSheet(null)
          }}
        />
      </BottomSheet>

      {/* P08 등록대상 품목 선택 — footer [적용하기](ref.apply) */}
      <BottomSheet
        open={sheet === 'regtrgt'}
        onOpenChange={(o) => !o && setSheet(null)}
        title="등록대상 품목 선택"
        footer={
          <Button variant="primary" className="w-full" onClick={() => regTrgtRef.current?.apply()}>
            적용하기
          </Button>
        }
      >
        <RegTrgtItemChc
          ref={regTrgtRef}
          onApply={handleAddItems}
          onDetail={(item) => {
            setItemInqDetail({ itemCd: item.itemCd, bzstatCd: '1234', bzstatNm: '제조업' })
            setSheet('itemInq')
          }}
        />
      </BottomSheet>

      {/* P09 품목 조회(품목상세정보) — footer [닫기] */}
      <BottomSheet
        open={sheet === 'itemInq'}
        onOpenChange={(o) => !o && setSheet(null)}
        title="품목상세정보"
        footer={
          <Button variant="primary" className="w-full" onClick={() => setSheet(null)}>
            닫기
          </Button>
        }
      >
        {itemInqDetail && <ItemInq detail={itemInqDetail} />}
      </BottomSheet>

      {/* P13 행정정보공동이용 사전동의서 (FullPopup) */}
      <PbamdsInfoJntUtztnBfhdWtcs open={agreeOpen} onOpenChange={setAgreeOpen} onAgree={handleAgreeAndApply} />

      {/* 미동의 경고 모달 (slide152) — [그대로 신청][닫기] */}
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
DmstLctnColInfoAddRegPage.displayName = 'DmstLctnColInfoAddRegPage'
