// 입찰공고 알림신청 콘텐츠 (MUI-OP-01-P10, Figma 9300-37419). 컨테이너(BottomSheet)는 부모가 소유.
// 서비스 안내 + 수신자 휴대번호 + 수신동의 라디오. 값은 부모가 소유(controlled) — footer 신청하기가 읽음.
// 기존 컴포넌트 활용: InputBox · InputLabel · InputMessage · RadioButtonGroup.
import { formatPhoneInput } from '@/utils/format'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'

// 안내문 (Figma intro section)
const GUIDE = [
  {
    title: '서비스 개요',
    body: '연초에 공개되는 조달계획에서 알림 신청한 품목에 대한 입찰공고가 시스템에 게시되면 알려드리는 서비스입니다.',
  },
  {
    title: '신청방법',
    body: "조달계획 상세화면에서 '공고게시알림신청' 버튼이 보이는 경우, 버튼을 눌러 신청하시면 됩니다.",
  },
  {
    title: '유의사항',
    body: '입찰공고는 국계법에 따라 조달업체가 직접 전자조달시스템에서 확인, 미전송, 스팸처리 등으로 사용자가 제대로 인지하지 못하였을 경우에 발생하는 문제에 대해 본 시스템은 책임지지 않습니다.',
  },
]

export interface PrcmPlan_NotiAplyProps {
  /** 수신자 휴대번호 (포맷된 문자열) */
  phone: string
  onPhoneChange: (value: string) => void
  /** 수신동의: 'no'(동의 안함) | 'yes'(동의함) */
  agree: string
  onAgreeChange: (value: string) => void
}

export function PrcmPlan_NotiAply({
  phone,
  onPhoneChange,
  agree,
  onAgreeChange,
}: PrcmPlan_NotiAplyProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 서비스 안내 */}
      <h3 className="text-[19px] font-bold leading-normal text-krds-text-ink">
        입찰공고 알림신청 서비스 안내
      </h3>
      <p className="flex gap-1 text-[15px] font-medium leading-normal text-krds-action-danger">
        <span aria-hidden>※</span>
        <span className="min-w-px flex-1">본 조달계획은 조달판단 과정에서 변동될 수 있습니다.</span>
      </p>
      {GUIDE.map((g) => (
        <section key={g.title} className="flex flex-col gap-1">
          <p className="text-[17px] font-bold leading-normal text-krds-text-ink">{g.title}</p>
          <p className="text-[17px] leading-relaxed text-krds-text-ink">{g.body}</p>
        </section>
      ))}

      {/* 입력 폼 (Figma form section — primary-faint 배경) */}
      <div className="flex flex-col gap-4 rounded-krds-8 bg-krds-bg-primary-faint p-4">
        <div className="flex flex-col gap-krds-5">
          <InputLabel required>수신자 휴대번호</InputLabel>
          <InputBox
            value={phone}
            inputMode="tel"
            maxLength={13}
            placeholder="번호를 입력하세요."
            onChange={(e) => onPhoneChange(formatPhoneInput(e.target.value))}
            onClear={() => onPhoneChange('')}
          />
          <InputMessage>
            휴대폰 변경은 마이페이지(조달업체) &gt; 알림서비스신청 에서 변경이 가능합니다.
          </InputMessage>
        </div>

        <div className="flex flex-col gap-krds-5">
          <InputLabel>입찰 단계별 안내 수신동의</InputLabel>
          <RadioButtonGroup
            showIndicator
            value={agree}
            onValueChange={onAgreeChange}
            items={[
              { value: 'no', label: '동의 안함' },
              { value: 'yes', label: '동의함' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
PrcmPlan_NotiAply.displayName = 'PrcmPlan_NotiAply'
