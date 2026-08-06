// 입찰참가신청서작성 - 서약서동의(MUI-BD-04-M01) 서약서 MUI-BD-04-P02·P03·P04 통합 콘텐츠.
// 바텀시트 콘텐츠 전용 컴포넌트 — 컨테이너(BottomSheet)/footer 는 부모(WrotAgrePage)가 소유.
// 서약서 3종은 구조가 동일(본문 단락 + 하단 '동의 선택' 라디오)하고 내용만 달라 1개 컴포넌트 + 데이터 3건으로 구성.
// 본문 텍스트는 설계서(서약서 P02~P04 · slide91) 원문 그대로.
// ※ v1.83 목록표(slide59)의 P04 설명 '행정정보공동이용동의서'는 오기 — P04 디자인(slide99)은
//   '하도급대금의 지급관련 확인 및 확약서'로 코드(w_p04)와 일치. 디자인 슬라이드가 정본.
// '동의 선택' 라디오는 부모 제어(controlled) — 필수 서약서의 '저장 후 닫기' 검증(동의함 체크 강제)을
// footer 소유자(부모 페이지)가 해야 하므로 선택값을 부모가 소유한다.
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'

export interface WrotData {
  /** 안정적 고유 식별자(서약서 화면 P번호). */
  id: string
  /** 서약서 제목 — 바텀시트 title + 서약서 동의 체크리스트 라벨에 공용. */
  title: string
  /** 본문 단락(여러 줄). 설계서 원문 그대로. */
  body: string[]
  /**
   * 하단 '동의 선택' 라디오 형태.
   *   'agree'  — 동의안함/동의함 (기본값 동의안함). P02·P03
   *   'select' — 선택1/선택2. P04 하도급대금 지급관련 확약서
   */
  variant: 'agree' | 'select'
  /** 본문 하단 서명블록(있을 때만). 설계서 각 서약서 끝 텍스트 — P02·P03. */
  signature?: string[]
}

// 서약서 3건 — 설계서 서약서 P02~P04 본문 원문(slide91).
export const WROTS: WrotData[] = [
  {
    id: 'w_p02',
    title: "'조세포탈' 사실이 없음을 확약하는 서약서",
    variant: 'agree',
    body: [
      '당사는 [국가계약법] 제27조의5 제1항에 따른 조세포탈 등을 한 자가 아님을 서약합니다. 만일 다음 각 호의 사유에 해당되어 유죄판결이 확정된 날부터 2년이 지나지 않은 사실이 발견된 때에는 계약의 해제ㆍ해지를 당하는 등의 불이익을 감수하겠으며, 「국가계약법 시행령」제76조제1항제1호가목에 따라 부정당업자의 입찰참가자격제한 처분을 받겠습니다.',
      '[조세범처벌법] 제3조에 따른 조세 포탈세액이나 환급·공제받은 세액이 5억원 이상인 자',
      '[관세법] 제270조에 따른 부정한 방법으로 관세를 감면받거나 면탈하거나 환급받은 세액이 5억원 이상인 자',
      '[지방세기본법] 제102조에 따른 지방세 포탈세액이나 환급·공제 세액이 5억원 이상인 자',
      '[국제조세조정에 관한 법률] 제53조에 따른 해외금융계좌의 신고의무를 위반하고, 그 신고의무 위반금액이 같은 법 제16조제1항에 따른 금액을 초과하는 자',
      '[외국환거래법] 제18조에 따른 자본거래의 신고의무를 위반하고, 그 신고의무 위반금액이 같은 법 제29조제1항제3호에 해당하는 자',
      "또한, 당사는 계약담당공무원이 요구할 경우 '조세포탈'을 한 사실이 없음을 입증하는 증빙서류(범죄경력자료 회보서나 판결문 등)를 즉시 제출할 것을 서약합니다.",
    ],
    signature: [
      'YYYY 년 MM 월 DD 일',
      '서약자 : ###(업체담당자명) [업체명]',
      '방위사업청장 귀하 OR #### 부대 귀하',
    ],
  },
  {
    id: 'w_p03',
    title: '청렴 계약 이행 서약서',
    variant: 'agree',
    body: [
      "우리회사는 [부패없는 투명한 기업경영과 공정한 행정]이 사회발전과 국가 경쟁력에 중요한 관건이 됨을 깊이 인식하며, 국제적으로도 OECD 뇌물방지 협약이 발효되고 부패기업 및 국가에 대한 제재가 강화되는 추세에 맞추어 청렴계약 취지에 적극적으로 호응하여 '#####(발주기관명)'이(가) 발주하는 모든 공사, 용역, 물품구매 등의 입찰에 참여함에 있어 우리 회사의 임·직원과 대리인은 입찰가격의 사전협의나 특정인의 낙찰을 위한 담합 및 다른업체와 협정·결의·협의하여 입찰의 자유경쟁을 부당하게 저해하는 일체의 불공정한 행위를 하지 않겠습니다. 만약 이를 지키지 않을 경우 귀부대에서 조치하는 '독점규제및공정거래에관한법률'에 따른 공정거래위원회고발 및 형사고발과 당해 입찰 및 낙찰취소나 계약해지에 대하여 일체의 이의를 제기하지 않겠습니다.",
      '입찰, 계약체결 및 계약이행과정(준공, 납품이후를 포함)에서 관계공무원에게 직·간접적으로 금품, 향응 등의 뇌물을 제공하거나 제공함을 약속하지 않겠습니다. 만약 이를 지키지 않을 경우 귀부대에서 조치하는 당해 입찰 및 낙찰취소나 계약해지에 대하여 일체의 이의를 제기하지 않겠습니다.',
      '공정한 직무수행을 방해하는 알선·청탁을 통하여 입찰 또는 계약과 관련한 특정정보의 제공을 요구하거나 받는 행위를 하지 않겠습니다. 만약 이를 지키지 않을 경우 귀부대에서 조치하는 당해 입찰 및 낙찰취소나 계약해지에 대하여 일체의 이의를 제기하지 않겠습니다.',
      '우리회사 임·직원이 관계공무원에게 뇌물을 제공하거나 담합 등 불공정 행위를 하지 않도록 하고, 내부 비리 제보자에 대해서도 일체의 불이익을 받지 않도록 노력하겠습니다.',
      '본 건과 관련한 하도급 계약의 체결 및 이행에 있어서 원도급자로서의 우월한 지위를 이용하여 하도급자에게로부터 금품을 수수하거나 부당 또는 불공정한 행위를 하지 아니하겠습니다.',
      '위 청렴계약이행 서약은 상호 신뢰를 바탕으로 한 약속으로서 반드시 지킬 것이며, 우리회사가 낙찰자로 결정될 시, 이 서약 내용을 그대로 계약특수조건으로 계약하여 이행하고, 불이행시 귀부대가 입찰참가 자격제한, 입찰 및 낙찰 취소, 계약해제(해지) 등의 조치 또는 우리 회사를 배제하는 입찰에 관한 조치를 하더라도 우리 회사는 귀부대를 상대로 손해배상을 청구하거나 민·형사상 이의를 제기하지 않을 것을 서약합니다.',
    ],
    signature: [
      'YYYY 년 MM 월 DD 일',
      '서약자 : ###(업체담당자명) [업체명]',
      '#####(발주기관명) 귀하',
    ],
  },
  {
    id: 'w_p04',
    title: '하도급대금의 지급관련 확인 및 확약서',
    variant: 'select',
    body: [
      '[선택 1] 당사는 해당입찰의 공고일로부터 1년이내 「건설산업기본법」 제34조 제1항 또는 「하도급거래 공정화에 관한 법률」 제13조 제1항이나 제3항을 위반한 사실이 없습니다.',
      '[선택 2] 당사는 해당입찰의 공고일로부터 1년이내 「건설산업기본법」 제34조 제1항 또는 「하도급거래 공정화에 관한 법률」 제13조 제1항이나 제3항을 위반한 사실이 있으므로, 본 입찰에 계약상대자로 결정되어 계약시 「국가계약법」 제15조 제1항에 따른 대가 지급 시 하도급대금은 발주기관이 하수급인에게 직접 지급하는 것을 합의할 것을 확약합니다.',
    ],
  },
]

const AGREE_OPTIONS = [
  { value: '동의안함', label: '동의안함' },
  { value: '동의함', label: '동의함' },
]
const SELECT_OPTIONS = [
  { value: '선택1', label: '선택1' },
  { value: '선택2', label: '선택2' },
]

/** agree 변형의 '동의함' 값 — 부모의 필수 서약서 저장 검증에 사용. */
export const WROT_AGREE_VALUE = AGREE_OPTIONS[1].value

/** 서약서 열람 시작 시 기본 선택값 — agree=동의안함 / select=선택1 (각 옵션의 첫 항목). */
export function getWrotDefaultChoice(wrot: WrotData) {
  return (wrot.variant === 'select' ? SELECT_OPTIONS : AGREE_OPTIONS)[0].value
}

export interface WrotAgreFormProps {
  wrot: WrotData
  /** '동의 선택' 라디오 값(부모 소유). */
  choice: string
  onChoiceChange: (value: string) => void
}

export function WrotAgreForm({ wrot, choice, onChoiceChange }: WrotAgreFormProps) {
  const options = wrot.variant === 'select' ? SELECT_OPTIONS : AGREE_OPTIONS

  return (
    <div className="flex flex-col gap-krds-7 py-2">
      {/* 본문 단락 — 설계서 원문 */}
      <div className="flex flex-col gap-krds-5 text-[17px] leading-normal text-krds-text-ink">
        {wrot.body.map((p, i) => (
          <p key={`${wrot.id}-${i}`} className="wrap-break-word">
            {p}
          </p>
        ))}
      </div>

      {/* 서명블록 — P02·P03 (설계서 끝 텍스트) */}
      {wrot.signature && (
        <div className="flex flex-col gap-krds-2 text-center text-[17px] leading-normal text-krds-text-ink">
          {wrot.signature.map((line, i) => (
            <p key={`${wrot.id}-sig-${i}`} className="wrap-break-word">
              {line}
            </p>
          ))}
        </div>
      )}

      {/* 동의 선택 */}
      <div className="flex flex-col gap-krds-5">
        <p className="text-[17px] font-bold leading-normal text-krds-text-ink">동의 선택</p>
        <RadioButtonGroup items={options} value={choice} onValueChange={onChoiceChange} />
      </div>
    </div>
  )
}
WrotAgreForm.displayName = 'WrotAgreForm'
