// 보증서 확인 풀팝업 — MUI-CT-01-M73 (Figma 10020-155270). 바로가기 바텀시트 '보증서 확인'에서 진입.
// 데이터영역은 국외 보증서 탭(T73, 설계서 slide160~161)과 동일: dm_ctrtInfo + dm_wtgrInfo(반복).
// ⚠️ 설계서 화면목록에 M73 영문 ID 미기재(Figma 신규 채번) — 임시 파일명 GrnteCnfrm(보증서 확인), 확정 시 교체.
// 구성: 계약 정보 Table + 보증서 정보 Table(여러 건 반복) + 이용안내(HelpDisclosure) + footer 닫기.
import { ctQueries } from '@/queries/bds/ct/queries'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { CtrtGrnteInfo } from '@/types/ct'

export interface GrnteCnfrmFullPopupProps {
  /** 계약 식별자 — 부모 상세 페이지가 navigate state 에서 받아 전달. */
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 보증서 1건 → 표 행(slide161 dm_wtgrInfo 순서).
function wtgrRows(w: CtrtGrnteInfo): TableRow[] {
  return [
    { label: '계약업체', value: w.ctrtBzentyCd },
    { label: '업체구분', value: w.bzentySeCd },
    { label: '납부방법', value: w.payMthdCd },
    { label: '납부일자', value: w.payYmd },
    { label: '보증서증권번호', value: w.wtgrScrtNo },
    { label: '보증시작일자', value: w.grnteBgngYmd },
    { label: '보증종료일자', value: w.grnteEndYmd },
    { label: '보증금', value: `${w.grnteAmt.toLocaleString()} 원`, type: 'number' },
    { label: '보증기관명', value: w.grnteInstNm },
    { label: '보증금면제사유', value: w.depsExmptnRsnCd ?? '-' },
    { label: '계약일자', value: w.ctrtYmd },
  ]
}

export function GrnteCnfrmFullPopup({ id, open, onOpenChange }: GrnteCnfrmFullPopupProps) {
  const { data } = ctQueries.useSelectCtrtGrntes(id, open)

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="보증서 확인"
      footer={
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col">
        {/* 계약 정보 (dm_ctrtInfo) */}
        <section className="flex flex-col">
          <SectionTitle as="h3">계약 정보</SectionTitle>
          <div className="px-4 pb-krds-8">
            <Table
              rows={[
                { label: '계약번호', value: data?.ctrtInfo.ctrtNo ?? '-' },
                { label: '계약일자', value: data?.ctrtInfo.ctrtYmd ?? '-' },
              ]}
            />
          </div>
        </section>

        {/* 보증서 정보 (dm_wtgrInfo — 여러 건 반복) */}
        <section className="flex flex-col">
          <SectionTitle as="h3" topDivider>
            보증서 정보
          </SectionTitle>
          <div className="flex flex-col gap-krds-8 px-4 pb-krds-8">
            {(data?.wtgrInfos ?? []).map((w) => (
              <Table key={w.id} rows={wtgrRows(w)} />
            ))}
          </div>
        </section>

        {/* 이용안내 (Figma 155270 하단 disclosure) */}
        <HelpDisclosure
          title="이용안내"
          items={[
            "보증회사에 보증서 발급 요청 시 조회하는 계약번호(계약참조번호)는 'dapa'+계약번호+계약차수 입니다. (Ex. Dapa2008xxx00100)",
          ]}
        />
      </div>
    </FullPopup>
  )
}
GrnteCnfrmFullPopup.displayName = 'GrnteCnfrmFullPopup'
