// 인지세 확인 풀팝업 — MUI-CT-01-M74 (Figma 10020-155318). 바로가기 바텀시트 '인지세 확인'에서 진입.
// 데이터영역은 국외 인지세 탭(T74, 설계서 slide162~163)과 동일: dm_ctrtInfo + dl_stmtxPayInfo + dm_payAmt.
// ⚠️ 설계서 화면목록에 M74 영문 ID 미기재(Figma 신규 채번) — 임시 파일명 StmtxCnfrm(인지세 확인), 확정 시 교체.
// 구성: 계약 정보 + 인지세 정보(반복) + 납부금액 정보 + 유의사항(HelpDisclosure) + footer 닫기.
import { ctQueries } from '@/queries/cts/ct/ctQueries'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockCtrtStmtxPayInfo } from '@/types/mock/ct'

export interface StmtxCnfrmFullPopupProps {
  /** 계약 식별자 — 부모 상세 페이지가 navigate state 에서 받아 전달. */
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 납부정보 1건 → 표 행(slide163 dl_stmtxPayInfo 순서).
function payInfoRows(p: MockCtrtStmtxPayInfo): TableRow[] {
  return [
    { label: '계약번호', value: p.ctrtNo },
    { label: '사용여부', value: p.useYn },
    { label: '업체코드', value: p.bzentyCd },
    { label: '업체명', value: p.bzentyNm },
    { label: '사업자번호', value: p.enbrno },
    { label: '납부번호', value: p.payNo },
    { label: '납부일자', value: p.payYmd },
    { label: '납부금액', value: `${p.payAmt.toLocaleString()} 원`, type: 'number' },
    { label: '비고', value: p.rmrkCn ?? '-' },
  ]
}

export function StmtxCnfrmFullPopup({ id, open, onOpenChange }: StmtxCnfrmFullPopupProps) {
  const { data } = ctQueries.useSelectCtrtStmtx(id, open)

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="인지세 확인"
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
                { label: '계약년도', value: data?.ctrtInfo.ctrtYr ?? '-' },
                { label: '계약번호', value: data?.ctrtInfo.ctrtNo ?? '-' },
                { label: '계약차수', value: data?.ctrtInfo.ctrtOd ?? '-' },
              ]}
            />
          </div>
        </section>

        {/* 인지세 정보 (dl_stmtxPayInfo — 여러 건 반복) */}
        <section className="flex flex-col">
          <SectionTitle as="h3" topDivider>
            인지세 정보
          </SectionTitle>
          <div className="flex flex-col gap-krds-8 px-4 pb-krds-8">
            {(data?.payInfos ?? []).map((p) => (
              <Table key={p.id} rows={payInfoRows(p)} />
            ))}
          </div>
        </section>

        {/* 납부금액 정보 (dm_payAmt) */}
        <section className="flex flex-col">
          <SectionTitle as="h3" topDivider>
            납부금액 정보
          </SectionTitle>
          <div className="px-4 pb-krds-8">
            <Table
              rows={[
                {
                  label: '납부대상액',
                  value: data ? `${data.payAmt.payTrgtAmt.toLocaleString()} 원` : '-',
                  type: 'number',
                },
                {
                  label: '납부액',
                  value: data ? `${data.payAmt.payAmt.toLocaleString()} 원` : '-',
                  type: 'number',
                },
                {
                  label: '부족액',
                  value: data ? `${data.payAmt.unpaidAmt.toLocaleString()} 원` : '-',
                  type: 'number',
                },
              ]}
            />
          </div>
        </section>

        {/* 유의사항 (slide162) */}
        <HelpDisclosure
          title="유의사항"
          defaultOpen
          items={[
            '[인지세 납부방법] 인지세 납부는 전자수입인지구매 또는 기획재정부 전자수입인지 구매사이트(www.edoc-revenuestamp.or.kr)에서 가능합니다.',
            '[필독] 기획재정부에 납부하신 경우 전자수입인지구매 버튼 클릭 시 구매요청서에서 기납부금액 확인 후 닫기를 하셔야 정상납부처리가 됩니다.',
            '[인지세 환급방법] PC 버전 - 국외 > 인지세관리 - 인지세 미사용 관리 탭에서 환급처리를 할 수 있습니다. 전산처리 후 환급은 관할세무서에서 가능합니다.',
            '인지세 업무는 PC 버전에서 사용할 수 있습니다.',
          ]}
        />
      </div>
    </FullPopup>
  )
}
StmtxCnfrmFullPopup.displayName = 'StmtxCnfrmFullPopup'
