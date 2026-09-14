// 서약서 상세 — 청렴 계약 이행 서약서 (MUI-BD-04-P03 OvsProbWrotAgre · 설계서 slide331~332).
// 설계서에 '국내 화면과 동일함' — 본문/레이아웃은 국내 wrotAgrePage 의 WROTS(w_p03 청렴 계약 이행 서약서)를 재사용.
// 바텀시트 콘텐츠 전용 컴포넌트 — 컨테이너(BottomSheet)/footer(취소·저장 후 닫기)는 부모(OvsBidPrtcpAplyPage)가 소유.
// 국내(WrotAgreForm)와 차이: 서명블록을 dl_resultInfo 실값(서약일자=당일·담당자명·업체명·발주기관명)으로 표시하고,
//   동의 선택(동의안함/동의함, 기본 동의안함)을 부모로 끌어올려 저장 버튼 활성화(동의함 체크 시)를 구동한다(설계서 slide332).
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { WROTS } from '@/ui/biz/bd/wrotAgrePage/WrotAgreForm'
import type { MockOvsProbWrotAgreResultInfo } from '@/types/mock/bd'

// 동의 선택 옵션 — 기본값 동의안함(설계서 slide331).
const AGREE_OPTIONS = [
  { value: '동의안함', label: '동의안함' },
  { value: '동의함', label: '동의함' },
]

interface OvsProbWrotAgreProps {
  /** 서약서 데이터 영역(dl_resultInfo) — 서약일자·담당자명·업체명·발주기관명 */
  resultInfo: MockOvsProbWrotAgreResultInfo
  /** 동의 선택 값(부모 소유) — '동의안함' | '동의함' */
  choice: string
  /** 동의 선택 변경 — 부모가 저장 버튼 활성화에 사용 */
  onChoiceChange: (choice: string) => void
  /**
   * 본문 단락 — 미지정 시 청렴 계약 이행 서약서(WROTS w_p03) 원문.
   * 행정정보 공동이용 사전동의서(PC 개정 메모, 문구 미확보)처럼 다른 서약/동의서를 같은 레이아웃으로 띄울 때 주입.
   */
  body?: string[]
}

export function OvsProbWrotAgre({ resultInfo, choice, onChoiceChange, body: bodyProp }: OvsProbWrotAgreProps) {
  // 본문은 기본 국내 청렴 계약 이행 서약서(WROTS w_p03) 원문 재사용 — 설계서도 동일 원문(slide442).
  const body = bodyProp ?? WROTS.find((w) => w.id === 'w_p03')?.body ?? []

  return (
    <div className="flex flex-col gap-krds-7 py-2">
      {/* 본문 단락 — 설계서 원문(국내 WROTS 재사용) */}
      <div className="flex flex-col gap-krds-5 text-[17px] leading-normal text-krds-text-ink">
        {body.map((p, i) => (
          <p key={`wrot-${i}`} className="wrap-break-word">
            {p}
          </p>
        ))}
      </div>

      {/* 서명블록 — dl_resultInfo 실값 표시(서약일자=당일, 서약자/업체, 발주기관) */}
      <div className="flex flex-col gap-krds-2 text-center text-[17px] leading-normal text-krds-text-ink">
        <p className="wrap-break-word">{resultInfo.wrotAgreYmd}</p>
        <p className="wrap-break-word">
          서약자 : {resultInfo.picNm} [{resultInfo.sbtBzentyNm}]
        </p>
        <p className="wrap-break-word">{resultInfo.prcmRqtInstNm} 귀하</p>
      </div>

      {/* 동의 선택 — 기본값 동의안함. 동의함 선택 시 부모의 저장 버튼 활성화 */}
      <div className="flex flex-col gap-krds-5">
        <p className="text-[17px] font-bold leading-normal text-krds-text-ink">동의 선택</p>
        <RadioButtonGroup
          items={AGREE_OPTIONS}
          value={choice}
          onValueChange={(v) => {
            onChoiceChange(v)
            console.log('[P03] 서약서 동의 선택', v) // 추후 API: bdService.setOvsWrotChoice
          }}
        />
      </div>
    </div>
  )
}
OvsProbWrotAgre.displayName = 'OvsProbWrotAgre'
