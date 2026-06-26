// 입찰참가신청서작성 - 문의 및 동의(MUI-BD-04-M14) 동의서 P15~P20 통합 콘텐츠.
// 바텀시트 콘텐츠 전용 컴포넌트 — 컨테이너(BottomSheet)/footer 는 부모(BidPrtcpAperWrtPage_Stp7)가 소유.
// 동의서 6종은 구조가 동일(본문 단락 + 하단 '동의 선택' 라디오)하고 내용만 달라 1개 컴포넌트 + 데이터 6건으로 구성.
// 본문 텍스트는 설계서(동의서 P15~P20) 원문 그대로.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'

export interface AgreementData {
  /** 안정적 고유 식별자(동의서 화면 P번호). */
  id: string
  /** 동의서 제목 — 바텀시트 title + 약관동의 체크리스트 라벨에 공용. */
  title: string
  /** 본문 단락(여러 줄). 설계서 원문 그대로. */
  body: string[]
  /**
   * 하단 '동의 선택' 라디오 형태.
   *   'agree'  — 동의안함/동의함 (기본값 동의안함). P15·P16·P18·P19·P20
   *   'select' — 선택1/선택2. P17 하도급대금 지급관련 확약서
   */
  variant: 'agree' | 'select'
  /** P15 본문 하단 외부 시스템 바로가기 버튼(있을 때만). */
  link?: { label: string; url: string }
}

// 동의서 6건 — 설계서 동의서 P15~P20 본문 원문.
export const AGREEMENTS: AgreementData[] = [
  {
    id: 'p15',
    title: '국방규격 및 계약이행 가능성 확인 동의',
    variant: 'agree',
    body: [
      '본 입찰에 참여 시 계약목적물에 대한 규격(구매요구서 포함)을 반드시 열람하여 규격서상 각종 성능시험 요건을 확인하고, 납기 내 납품가능 여부 및 계약특수조건 등 확인하여 계약이행 가능성을 사전에 주의 깊게 판단 후 입찰에 참가하시기 바랍니다. 본 유의사항에도 불구하고 규격 미열람 등에 따라 발생하는 모든 책임은 입찰자에게 있습니다.',
    ],
    link: { label: '국방표준종합정보시스템 바로가기', url: 'https://www.dtaq.re.kr' },
  },
  {
    id: 'p16',
    title: '약관동의',
    variant: 'agree',
    body: [
      '국방전자조달시스템 이용에 관한 약관, 국방전자조달시스템 전자입찰 특별유의서, 행정정보 공동이용 사전동의서에 동의함',
      '유의사항 : 인증확인은 법인인증서만 사용 가능 등',
    ],
  },
  {
    id: 'p17',
    title: '하도급대금의 지급관련 확인 및 확약서',
    variant: 'select',
    body: [
      '[선택1] 당사는 해당입찰의 공고일로부터 1년이내 「건설산업기본법」 제34조 제1항 또는 「하도급거래 공정화에 관한 법률」 제13조 제1항이나 제3항을 위반한 사실이 없습니다.',
      '[선택2] 당사는 해당입찰의 공고일로부터 1년이내 「건설산업기본법」 제34조 제1항 또는 「하도급거래 공정화에 관한 법률」 제13조 제1항이나 제3항을 위반한 사실이 있으므로, 본 입찰에 계약상대자로 결정되어 계약시 「국가계약법」 제15조 제1항에 따른 대가 지급 시 하도급대금은 발주기관이 하수급인에게 직접 지급하는 것을 합의할 것을 확약합니다.',
    ],
  },
  {
    id: 'p18',
    title: '입찰보증금 지급확약서 동의문',
    variant: 'agree',
    body: [
      '상기 입찰에 참여함에 있어 낙찰된 이후 정당한 의무를 이행하지 못하여 입찰보증금을 국고에 귀속하여야 할 사유가 발생하였을 경우에는 국가를 당사자로 하는 계약에 관한 법률 시행령 제38조제2항에 의거 입찰보증금을 지체없이 현금으로 귀 부대(기관)에 납부할 것을 확약합니다. 만일 귀 부대(기관)에서 지정하는 기일까지 입찰보증금을 납부하지 아니할 경우에는 귀 부대(기관)의 일방적인 공제조치는 물론 어떠한 법적 구상 및 제재 조치에도 하등의 이의가 없음을 확약합니다.',
    ],
  },
  {
    id: 'p19',
    title: '입찰보증금 지급확약서 관련 경고문',
    variant: 'agree',
    body: [
      '입찰보증금 면제 등록 시 「국가계약법 시행령」등에 따른 면제사유 해당여부를 반드시 확인하여 주시기 바라며, 방위사업관리규정 제397조②항에 따라 아래 각 호의 입찰보증금 면제 예외사유에 해당함에도 면제 등록 시, 입찰등록불가(부적격) 처리 예정이니 입찰보증금 납부를 권장합니다.',
      '1. 방위사업청에 입찰보증금 등 국고귀속조치에 응하지 않고 있는 자.',
      '2. 부정당업자 제재기간이 만료된 날로부터 다시 그 제한처분기간에 해당하는 기간 중에 있는 자',
    ],
  },
  {
    id: 'p20',
    title: '입찰보증금 면제사유 확약서',
    variant: 'agree',
    body: [
      '시행령 37조 3항',
      '국가기관 및 지방자치단체',
      '「공공기관의 운영에 관한 법률」에 따른 공공기관',
      '국가 또는 지방자치단체가 기본재산의 100분의 50 이상을 출연 또는 출자한 법인',
      '「농업협동조합법」에 의한 조합·조합공동사업법인 및 그 중앙회 등',
      '「건설산업기본법」·「전기공사업법」 등 법령에 의하여 등록등을 한 자로서 기획재정부장관이 정하는 기준에 해당되는 자',
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

export function AgreementForm({ agreement }: { agreement: AgreementData }) {
  const options = agreement.variant === 'select' ? SELECT_OPTIONS : AGREE_OPTIONS
  // 기본값: agree=동의안함 / select=선택1 (각 옵션의 첫 항목)
  const [choice, setChoice] = useState(options[0].value)

  return (
    <div className="flex flex-col gap-krds-7 py-2">
      {/* 본문 단락 — 설계서 원문 */}
      <div className="flex flex-col gap-krds-5 text-[17px] leading-normal text-krds-text-ink">
        {agreement.body.map((p, i) => (
          <p key={`${agreement.id}-${i}`} className="wrap-break-word">
            {p}
          </p>
        ))}
      </div>

      {/* P15 — 외부 시스템 바로가기 */}
      {agreement.link && (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => console.log('[M14] 바로가기', agreement.link?.url)} // 추후 API: 외부 링크 이동
        >
          {agreement.link.label}
        </Button>
      )}

      {/* 동의 선택 */}
      <div className="flex flex-col gap-krds-5">
        <p className="text-[17px] font-bold leading-normal text-krds-text-ink">동의 선택</p>
        <RadioButtonGroup
          items={options}
          value={choice}
          onValueChange={(v) => {
            setChoice(v)
            console.log('[M14] 동의 선택', agreement.id, v) // 추후 API: bdService.setAgreementChoice
          }}
        />
      </div>
    </div>
  )
}
AgreementForm.displayName = 'AgreementForm'
