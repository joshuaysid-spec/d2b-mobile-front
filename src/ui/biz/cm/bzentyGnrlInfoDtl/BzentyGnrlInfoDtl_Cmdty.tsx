// 업체정보 상세 - '물품(내자)' 탭 콘텐츠 (MUI-CM-01-T02, 설계서 v0.86 slide132~133 / Figma 10020:82844·82894).
// 260827 Figma 리디자인 반영: 섹션 카드(InfoAccordionCard) 3장 + 제출서류 안내(HelpDisclosure)
//   + [조달원확인서 신청] 풀폭 버튼(설계서 이벤트 btn_sosCnfdocAply — P03 팝업, 현재 스텁).
//   등록품목명세는 품목적부판정을 품목코드 행 우측 뱃지로 표시(Figma), 접힘 시 4행 + 더보기.
// 데이터는 목업(설계서 데이터영역 항목명·형식 그대로) — 추후 API(cmService.selectBzentyDmscptInfo)로 대체.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ROUTES } from '@/constants/routes'
import type { RegTrgtItem, PicInfo, KnditmAsctGrp } from '@/types/mock/cm'
import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Toast } from '@/ui/common/composites/Toast'
import { DmstSosCnfdocAply } from '@/ui/biz/cm/dmstSosCnfdocList/DmstSosCnfdocAply'
import {
  dmstSosCnfdocAplySchema,
  type DmstSosCnfdocAplyForm,
} from '@/ui/biz/cm/dmstSosCnfdocList/DmstSosCnfdocAply.schema'
import {
  InfoAccordionCard,
  type InfoCardRowInput,
} from '@/ui/biz/cm/bzentyInfo/InfoAccordionCard'

// ── 등록품목명세 (dl_regTrgtItemList) — 설계서 slide132/133 예시값 ────────────
const REG_ITEMS: RegTrgtItem[] = [
  {
    itemCd: '1001100001',
    knditmCd: '60',
    knditmCdNm: '총탄',
    itemRgstrtSecdNm: '제조',
    itemCdNm: '이불',
    itemRgstrtRqmtNm: '해당업종 사업자/공장등록',
    itemRvwRsltCn: '적격',
  },
]

// ── 담당자정보 (dm_picInfo) — 설계서 slide132/133 예시값 ─────────────────────
const PIC_INFO: PicInfo = {
  picNm: '김길동',
  picEntlno: '02-1234-5678',
  picFxno: '02-2345-6789',
  picEmlAddr: 'abcde@dapa.go.kr',
}

// ── 대표품류 및 조합/단체 (dm_knditmListAsctGrpList) — 설계서 slide132/133 예시값 ──
const ASCT_GRP_LIST: KnditmAsctGrp[] = [
  {
    knditmCd: '05',
    knditmCdNm: '05 / 피복',
    bzstatCdNm: '제조',
    asctCd: '001',
    asctCdNm: '한국피복공업협동조합',
  },
]

// 담당자정보 — 라벨은 Figma 표기(연락처/이메일/팩스).
function picRows(d: PicInfo): InfoCardRowInput[] {
  return [
    { label: '담당자명', value: d.picNm },
    { label: '연락처', value: d.picEntlno },
    { label: '이메일', value: d.picEmlAddr },
    { label: '팩스', value: d.picFxno },
  ]
}

function asctRows(list: KnditmAsctGrp[]): InfoCardRowInput[] {
  return list.flatMap((a, i): InfoCardRowInput[] => [
    ...(i > 0 ? ['divider' as const] : []),
    { label: '대표품류', value: a.knditmCdNm },
    { label: '업태', value: a.bzstatCdNm },
    { label: '조합/단체', value: a.asctCdNm },
  ])
}

// 등록품목명세 — 품목적부판정(itemRvwRsltCn)은 품목코드 행 우측 뱃지(Figma). 다건은 divider.
//   Figma 라벨 '품목코드/명'은 값이 품류(60/총탄)라 설계서 표기(품류코드/명)를 유지.
function regItemRows(list: RegTrgtItem[]): InfoCardRowInput[] {
  return list.flatMap((d, i): InfoCardRowInput[] => [
    ...(i > 0 ? ['divider' as const] : []),
    {
      label: '품목코드',
      value: d.itemCd,
      badge: (
        <Badge type="pastel" color="blue">
          {d.itemRvwRsltCn}
        </Badge>
      ),
    },
    { label: '품류코드/명', value: `${d.knditmCd}/${d.knditmCdNm}` },
    { label: '구분', value: d.itemRgstrtSecdNm },
    { label: '품명', value: d.itemCdNm },
    { label: '등록요건', value: d.itemRgstrtRqmtNm },
  ])
}

// 로그인 사용자(신청인) 자동완성 값 — P20 신청 팝업 read-only 표시(설계서 '신청인 정보 자동완성').
//   추후 authStore(로그인 업체 담당자)에서 주입. 현재는 목업(M19 와 동일).
const APPLICANT = { aplcntNm: '홍길동', aplcntTelno: '010-1234-5678' }

export function BzentyGnrlInfoDtl_Cmdty() {
  // 조달원확인서 신청(P20) — 설계서 이벤트 btn_sosCnfdocAply. 컨테이너(BottomSheet)는 탭이 소유,
  //   콘텐츠·폼 구성은 M19(DmstSosCnfdocListPage)의 P20 호스팅과 동일.
  //   신청 완료 시 국내조달원확인서신청목록(M19)으로 이동(사용자 확정 260828 — 시트 신청 → 목록 확인).
  const navigate = useNavigate()
  const [aplyOpen, setAplyOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const { control, handleSubmit, reset: resetForm } = useForm<DmstSosCnfdocAplyForm>({
    resolver: zodResolver(dmstSosCnfdocAplySchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { aplyRsn: '' },
  })
  const openAply = () => {
    resetForm({ aplyRsn: '' })
    setAplyOpen(true)
  }
  const onAplySubmit = (values: DmstSosCnfdocAplyForm) => {
    setAplyOpen(false)
    setToastOpen(true)
    console.log('[T02] 조달원확인서 신청', { ...APPLICANT, aplyRsn: values.aplyRsn })
    // 추후: cmService.insertDmstSosCnfdocAply({ aplcntNm, aplcntTelno, aplyRsn })
    // 완료 토스트 노출 후 목록(M19) 이동 — M05 신청 완료 이동과 동일 패턴.
    window.setTimeout(() => navigate(ROUTES.DMST_SOS_CNFDOC), 1200)
  }
  const onAplyInvalid = () => {
    document.getElementById('field-aplyRsn')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <>
      <div className="flex w-full flex-col gap-krds-8 px-4 py-5">
        <InfoAccordionCard title="담당자정보" rows={picRows(PIC_INFO)} />
        <InfoAccordionCard title="대표품류 및 조합/단체" rows={asctRows(ASCT_GRP_LIST)} />
        <InfoAccordionCard title="등록품목명세" rows={regItemRows(REG_ITEMS)} previewCount={4} />
      </div>

      {/* 물품[내자]업체 제출서류 (Figma m_help_disclosure — 공통 HelpDisclosure 1:1) */}
      <HelpDisclosure
        title="물품[내자]업체 제출서류"
        items={['공장등록증명서 - 1부 (관련업체만 제출)', '인,허가증사본 - 1부 (해당품목 제출)']}
      />

      {/* 조달원확인서 신청 (Figma 하단 풀폭 primary) → P20 신청사유 바텀시트 */}
      <div className="p-4">
        <Button variant="primary" className="w-full" onClick={openAply}>
          조달원확인서 신청
        </Button>
      </div>

      {/* 조달원 확인서 신청(P20) 바텀시트 — M19 와 동일 호스팅(타이틀·footer [취소][신청하기]). */}
      <BottomSheet
        open={aplyOpen}
        onOpenChange={setAplyOpen}
        title="조달원 확인서 신청서"
        footer={
          <ButtonGroup
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setAplyOpen(false) },
              { label: '신청하기', variant: 'primary', onClick: handleSubmit(onAplySubmit, onAplyInvalid) },
            ]}
          />
        }
      >
        <DmstSosCnfdocAply
          control={control}
          aplcntNm={APPLICANT.aplcntNm}
          aplcntTelno={APPLICANT.aplcntTelno}
        />
      </BottomSheet>

      {/* 신청 완료 토스트 */}
      <Toast open={toastOpen} onClose={() => setToastOpen(false)} duration={2000}>
        조달원 확인서 신청이 완료되었습니다.
      </Toast>
    </>
  )
}
BzentyGnrlInfoDtl_Cmdty.displayName = 'BzentyGnrlInfoDtl_Cmdty'
