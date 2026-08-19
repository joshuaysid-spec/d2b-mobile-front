// 물품전자계약진행상세 - '반송/취소 사유' 탭 콘텐츠 (MUI-CT-01-T03, Figma 10020-154930/154972).
// 설계서 slide26·29(1.4 rjctRsn) — ⚠️ 화면목록(slide6)의 T03 은 '계약특수조건'이나 레이아웃(slide26)·Figma
// 탭바는 '반송/취소 사유'다(M03 탭에 특수조건 없음) — 레이아웃 기준. 영문 ID 미기재 → 상위 화면 ID 파생(_RjctRsn).
// 구성: 업무도움(HelpDisclosure, [필독] 전자수입인지 안내) + 사유 블록(타이틀+본문 박스, 세로 제한 없음)
//   + 하단 PC 안내 불릿. 데이터: ctQueries.useSelectCtrtRjctRsns — 단계별 타이틀(낙찰단가/제출서류/계약서 반송·계약 취소).
import { ctQueries } from '@/queries/bds/ct/ctQueries'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'

export function CmdtyElctrCtrtPrgrsDtl_RjctRsn({ id }: { id: string }) {
  const { data: reasons = [] } = ctQueries.useSelectCtrtRjctRsns(id)

  return (
    <div className="flex flex-col pb-[72px]">
      {/* 업무도움 — 전자수입인지 필독 안내(slide26 1]) */}
      <HelpDisclosure
        items={[
          '[필독] 기획재정부에 납부하신 경우 전자수입인지 [구매/확인] 버튼 클릭 시 구매요청서에서 기납부금액 확인 후 닫기를 하셔야 정상납부처리가 됩니다.',
          'PC 버전에서 업무처리를 할 수 있습니다.',
        ]}
      />

      {/* 반송/취소 사유 블록 — 본문은 하단으로 확장 표시(박스 세로 크기 제한 없음, slide26 2]) */}
      <div className="flex flex-col gap-8 px-4 pt-8">
        {reasons.map((r) => (
          <section key={r.id} className="flex flex-col gap-krds-5">
            <h3 className="text-krds-body-md font-bold text-krds-text-ink">{r.title}</h3>
            <div className="rounded-krds-8 border border-krds-border-field p-4 text-krds-body-md text-krds-text-ink">
              {r.rjctRsn}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
CmdtyElctrCtrtPrgrsDtl_RjctRsn.displayName = 'CmdtyElctrCtrtPrgrsDtl_RjctRsn'
