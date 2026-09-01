// 업체정보 추가등록 — 물품(내자) (MUI-CM-01-M05, DmstLctnColInfoAddRegPage).
//   설계서 00.공통 v0.85 slide156~158(문서 P155~157). ⚠️ 2026-06-19 개정 반영: 담당자 정보는 별도 등록(M22)으로
//   분리되어 이 화면에서 제거 · 탭 제거(단일 스크롤 폼).
//   웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 업체정보 추가 등록(물품(내자)).
//   구성(아코디언): 일반정보 · 대표품류 및 조합/단체 · 등록품목명세
//     + 유의사항(Infobox, 기본 닫힘) + 내자업체 제출서류 안내(Infobox, 기본 닫힘) + 조회 동의여부
//     → [취소][추가 등록 신청].
//   소유 팝업(컨테이너=이 페이지): P06 품류선택(KnditmChc) · P07 조합/단체(AsctGrpChc) · P08 등록대상품목(RegTrgtItemChc)
//     · P09 품목조회(ItemInq) · P13 행정정보공동이용사전동의서(PbamdsInfoJntUtztnBfhdWtcs) · MUI-CM-01-P14 확인팝업(Confirm — 별도 파일 없이 AlertModal 인라인 처리 확정).
//   ⚠️ 디자인(Figma) 없음 → 설계서(pptx)로 작업. 데이터=목업(설계서 항목명/형식), 저장=API 경계 스텁(console.log).
//   신청 흐름(slide152/175/177): 조회 동의 체크 → P13 사전동의서 → [동의하고 신청하기] → P14 확인 → 완료 토스트.
//     미동의 상태로 [추가 등록 신청] → 경고 모달(그대로 신청/닫기) → 그대로 신청 → P14 확인.
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { Checkbox } from '@/ui/common/base/Checkbox'
import { Card } from '@/ui/common/composites/Card'
import type { TableRow } from '@/ui/common/composites/Table'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Toast } from '@/ui/common/composites/Toast'
import { KnditmChc } from '@/ui/biz/cm/dmstLctnColInfoAddReg/KnditmChc'
import { AsctGrpChc } from '@/ui/biz/cm/dmstLctnColInfoAddReg/AsctGrpChc'
import { RegTrgtItemChc, type RegTrgtItemChcHandle } from '@/ui/biz/cm/dmstLctnColInfoAddReg/RegTrgtItemChc'
import { ItemInq } from '@/ui/biz/cm/dmstLctnColInfoAddReg/ItemInq'
import { PbamdsInfoJntUtztnBfhdWtcs } from '@/ui/biz/cm/dmstLctnColInfoAddReg/PbamdsInfoJntUtztnBfhdWtcs'
import type {
  MockAddRegItemRow,
  MockKnditmChcItem,
  MockAsctGrpChcItem,
  MockRegTrgtItemChcItem,
  MockItemInqDetail,
} from '@/types/mock/cm'

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

// 등록품목명세 초기 목업 (설계서 slide151 예시 — 항목명/형식 그대로). 추후 API: cmService.selectRegItemList.
const INITIAL_ITEMS: MockAddRegItemRow[] = [
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
  // 적격여부 필터(전체/적격/부적격/만료/만료예정, v0.87) 시연용 — 만료·만료예정 상태 품목.
  {
    id: '3',
    itemCd: '2001100003',
    knditmCd: '05',
    knditmCdNm: '피복',
    itemCdNm: '전투화',
    itemRgstrtSecdNm: '제조',
    itemRgstrtRqmtNm: '공장등록',
    itemRvwRsltCn: '만료',
    aprvYmd: '2024-03-15',
    expryYmd: '2026-03-14',
    rnwlReqYmd: '-',
    rcptSttsNm: '승인',
  },
  {
    id: '4',
    itemCd: '2001100004',
    knditmCd: '60',
    knditmCdNm: '총탄',
    itemCdNm: '방탄모',
    itemRgstrtSecdNm: '판매',
    itemRgstrtRqmtNm: '공장등록',
    itemRvwRsltCn: '만료예정',
    aprvYmd: '2024-10-01',
    expryYmd: '2026-09-30',
    rnwlReqYmd: '-',
    rcptSttsNm: '승인',
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
  const [knditm, setKnditm] = useState<MockKnditmChcItem | null>(null) // 대표품류(P06)
  const [bzstat, setBzstat] = useState('') // 업태
  const [asctGrp, setAsctGrp] = useState<MockAsctGrpChcItem | null>(null) // 조합/단체(P07)

  // ── 등록품목명세 (slide157) ──
  const [items, setItems] = useState<MockAddRegItemRow[]>(INITIAL_ITEMS)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [itemKeyword, setItemKeyword] = useState('') // 품목 코드 검색
  const [rvwRslt, setRvwRslt] = useState('all') // 적격상태(전체/적격/부적격)

  // ── 팝업/상태 ──
  const [sheet, setSheet] = useState<SheetKind>(null)
  const [itemInqDetail, setItemInqDetail] = useState<MockItemInqDetail | null>(null)
  const [agreeOpen, setAgreeOpen] = useState(false) // P13 사전동의서
  const [agreed, setAgreed] = useState(false) // 조회 동의여부
  const [warnOpen, setWarnOpen] = useState(false) // 미동의 경고 모달
  const [confirmOpen, setConfirmOpen] = useState(false) // P14 확인
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const regTrgtRef = useRef<RegTrgtItemChcHandle>(null)

  // 등록품목 검색(목업 필터, slide157 '아래 목록에서 검색') — 품명/품목코드 부분일치 + 적격상태.
  const visibleItems = useMemo(() => {
    const kw = itemKeyword.trim()
    return items.filter((it) => {
      const byKw = !kw || it.itemCdNm.includes(kw) || it.itemCd.includes(kw)
      const byRslt = rvwRslt === 'all' || it.itemRvwRsltCn === rvwRslt
      return byKw && byRslt
    })
  }, [items, itemKeyword, rvwRslt])

  const toggleItem = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  // 등록품목명세 버튼 동작(설계서 slide151) — 목업 상태 변경.
  const handleAddItems = (picked: MockRegTrgtItemChcItem[]) => {
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
  const openItemInq = (row: MockAddRegItemRow) => {
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
    // 추후 API: cmService.insertBzentyDmscptInfoAddReg({ ... })
    setToastMsg('신청 완료되었습니다.')
    window.setTimeout(() => navigate(-1), 1200)
  }

  // 표 행 — 설계서 slide157 컬럼 순서(순번 → 품목코드 → … → 접수상태). rnum 은 목록 표시 순번.
  function itemRows(d: MockAddRegItemRow, rnum: number): TableRow[] {
    return [
      { label: '순번', value: String(rnum) },
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
      // 품명은 카드 타이틀로 승격(Figma 10020:85034) — 행에서 제외.
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
            {/* 신청 건수 제한 안내 (slide157) */}
            <p className="text-[15px] leading-relaxed text-krds-text-muted">
              1회 등록품목 신청은 30개 이내로 신청해주시기 바랍니다.
            </p>

            {/* 검색 — 품목 코드 + 적격상태(slide157 '품목 명세 내역 중에서 검색') */}
            <div className="flex flex-col gap-krds-5">
              <InputLabel htmlFor="m05-itemKeyword">품목 코드</InputLabel>
              <InputBox
                id="m05-itemKeyword"
                value={itemKeyword}
                placeholder="검색 코드를 입력해주세요"
                onChange={(e) => setItemKeyword(e.target.value)}
                onClear={() => setItemKeyword('')}
              />
            </div>
            <div className="flex flex-col gap-krds-5">
              <InputLabel>적격상태</InputLabel>
              <SelectBox
                placeholder="전체"
                value={rvwRslt}
                onValueChange={setRvwRslt}
                items={[
                  // v0.87(인쇄본 160쪽) 적격여부 필터 — 전체/적격/부적격/만료/만료예정(기본 전체).
                  { value: 'all', label: '전체' },
                  { value: '적격', label: '적격' },
                  { value: '부적격', label: '부적격' },
                  { value: '만료', label: '만료' },
                  { value: '만료예정', label: '만료예정' },
                ]}
              />
            </div>
            {/* 버튼 — 신규 추가(P08)/선택 삭제/선택 갱신/초기화 */}
            <div className="flex flex-wrap gap-krds-4">
              <Button variant="primary" size="sm" onClick={() => setSheet('regtrgt')}>
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

            {/* 품목 목록 — [선택] 토글 + [보기](P09) + 품목코드 링크(P09). 목업. */}
            <div className="flex flex-col gap-krds-8">
              {visibleItems.map((it, i) => {
                const on = selectedIds.includes(it.id)
                return (
                  <Card
                    key={it.id}
                    title={it.itemCdNm}
                    titleTrailing={
                      <Checkbox
                        variant="box"
                        checked={on}
                        onCheckedChange={() => toggleItem(it.id)}
                        aria-label={`${it.itemCdNm} 선택`}
                      />
                    }
                    rows={itemRows(it, i + 1)}
                  />
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

      {/* 유의사항 (slide158) — 기본 닫힘(Infobox 기본값). 문구는 설계서 원문 그대로. */}
      <div className="px-4 pt-4">
        <Infobox
          title="유의사항"
          collapsible
          items={[
            '등록하시려는 품목이 상단에 이미 등록되어진 상태라면 별도로 추가하실 필요가 없습니다.',
            '신규 품목은 우측의 추가 버튼을 이용해 리스트에 추가 후 접수해 주시면 됩니다.',
            '삭제, 갱신이 필요한 경우에는 선택에 체크 후 우측의 해당업무(삭제 혹은 갱신) 버튼을 꼭 클릭하신 후 접수해 주시기 바랍니다.',
            '부적격 품목을 재신청하실 경우는 먼저 해당 품목을 삭제하신 후 저장하시고 조달담당자의 승인을 받으신 다음 재신청하셔야 합니다. 좌측메뉴 중 등록품목 신청조회 코너에서 품목삭제 신청서의 진행상태가 [승인]으로 확정된 후에 재신청하셔야 합니다.',
            '만료된 품목을 재신청하실 경우는 먼저 해당 품목을 삭제하신 후 저장하시고 조달담당자의 승인을 받으신 다음 재신청하셔야 합니다. 좌측메뉴 중 추가정보신청조회 코너에서 품목삭제 신청서의 진행상태가 [승인]으로 확정된 후에 재신청하셔야 합니다.',
            '2016년 11월 30일까지(유예기간)는 만료일자와 상관없이 갱신신청이 가능합니다.',
            '갱신은 만료전 90일부터 가능하며, 만료된 건은 삭제 후 추가(신규신청)해 주시기 바랍니다.',
          ]}
        />
      </div>

      {/* 내자업체 제출서류 안내 (slide158) — 기본 닫힘. 연락처 + 제출서류 + 조회 가능 업체 안내. */}
      <div className="px-4 pt-4">
        <Infobox
          title="내자업체 제출서류 안내"
          collapsible
          items={[
            '(전화) 02-2079-6915,6925 (팩스번호) 02-773-7587',
            '인,허가증 사본 - 1부 (해당품목 제출)',
            '해당 공무원이 행정정보공동이용센터(www.share.go.kr)에서 직접 조회가 가능한 업체는 별도 제출 불필요',
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

      {/* P08 등록대상품목선택 — Figma 10020:84985 풀팝업(구 바텀시트 → FullPopup, 260828 재대조).
          footer [취소][확인](확인=ref.apply). 품목코드 클릭 → 품목상세정보(P09). */}
      <FullPopup
        open={sheet === 'regtrgt'}
        onOpenChange={(o) => !o && setSheet(null)}
        title="등록대상품목선택"
        footer={
          <ButtonGroup
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setSheet(null) },
              { label: '확인', variant: 'primary', onClick: () => regTrgtRef.current?.apply() },
            ]}
          />
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
      </FullPopup>

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
        description={
          // v0.87 검토 43번 — "신청서를 접수합니다." 뒤 줄바꿈(아이콘은 퍼블리싱대로 유지).
          <span className="whitespace-pre-line">
            {'신청서를 접수합니다.\n오기재된 사항이 없는지 모두 확인하셨나요?'}
          </span>
        }
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
