// 행정정보공동이용 사전동의서 (MUI-CM-01-P13, PbamdsInfoJntUtztnBfhdWtcs). Figma 10020:82612 / 설계서 slide175.
//   물품등록(내자) 추가등록 신청 시 노출되는 사전동의서 풀팝업. 조회 동의 체크 후 [동의하고 신청하기] → 신청 진행.
//   Figma 1:1(260828 재대조): m_popup_header + 안내 배너(아이콘 타일+타이틀, faint 박스) + 본문/①②③(박스 밖, 17px ink) + 동의 체크(Bold) + [동의하고 신청하기][취소].
//   기존 공통 재사용: FullPopup(컨테이너) · Infobox(안내 박스) · Checkbox(box, 동의) · ButtonGroup(footer).
//   (2026-07-01 개정: 안내문 '주민등록번호' 삭제.)
import { useState } from 'react'

import { FullPopup } from '@/ui/common/composites/FullPopup'
import { Icon } from '@/ui/common/base/Icon'
import { Checkbox } from '@/ui/common/base/Checkbox'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'

// 공동이용 대상 목록 (Figma ①②③, slide175).
const JNT_UTZTN_LIST = [
  '공동이용의 목적 : 국내,외 경쟁입찰에 참여하고자 하는 자의 업체등록(품목등록/추가) 및 입찰참가자격 확인/계약을 위해 제출하는 민원',
  '공동이용 대상 행정정보 및 이용범위 : 국내업체품목등록(사업자등록증명원)1종',
  '공동이용 대상 이용기관의 명칭 : 방위사업청',
]

export interface PbamdsInfoJntUtztnBfhdWtcsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** [동의하고 신청하기] — 조회 동의 후 신청 진행(부모가 팝업 닫고 신청 프로세스 실행). */
  onAgree: () => void
}

export function PbamdsInfoJntUtztnBfhdWtcs({
  open,
  onOpenChange,
  onAgree,
}: PbamdsInfoJntUtztnBfhdWtcsProps) {
  const [agreed, setAgreed] = useState(false)

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="행정정보공동이용사전동의서"
      footer={
        <ButtonGroup
          layout="vertical"
          items={[
            {
              label: '동의하고 신청하기',
              variant: 'primary',
              disabled: !agreed,
              onClick: onAgree,
            },
            { label: '취소', variant: 'secondary', onClick: () => onOpenChange(false) },
          ]}
        />
      }
    >
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {/* 안내 배너 (Figma 10020:82612) — faint 박스 안 아이콘 타일(blue-dark) + 타이틀만. 본문은 박스 밖. */}
        <div className="flex items-center gap-krds-7 rounded-krds-8 bg-krds-bg-primary-faint p-krds-8">
          <div
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-krds-8 bg-krds-action-primary-active"
          >
            <Icon name="Description" size={24} className="text-white" aria-hidden />
          </div>
          <p className="min-w-px flex-1 text-[17px] font-bold leading-normal text-krds-text-ink">
            행정정보공동이용 사전동의서 안내
          </p>
        </div>

        {/* 본문 — 박스 밖 일반 텍스트(Figma 17px ink). 문구는 설계서 2026-07-01 개정(주민등록번호 삭제) 유지. */}
        <p className="text-[17px] leading-relaxed text-krds-text-ink">
          전자정부법 제42조 제1항에 따라 행정정보 공동이용센터를 통하여 개인정보가 포함된 행정정보를
          이용할 때에는 정보주체의 사전동의를 받도록 하고 있습니다.
          <br />
          현재 사무를 처리하기 위하여 방위사업청 민원담당자가 본인의 정보(이름, 사업자등록번호)를
          활용하여 행정정보를 열람합니다.
        </p>
        <p className="text-[17px] leading-relaxed text-krds-text-ink">
          본인은 이 건 사무의 처리와 관련하여 『전자정부법』 제36조에 따른 행정정보 공동이용을 통하여
          이용기관의 업무처리 담당자가 전자적으로 본인의 구비서류를 확인 하는 것에 동의합니다.
          <br />
          (아래에 기재된 행정정보는 목적 외의 용도로 사용할 수 없으며, 동의하지 않는 경우 본인의 선택에
          따라 서류로 대신 제출 할 수 있음)
        </p>
        <ol className="flex flex-col gap-krds-5">
          {JNT_UTZTN_LIST.map((text, i) => (
            <li key={i} className="flex gap-krds-4 text-[17px] leading-relaxed text-krds-text-ink">
              <span aria-hidden className="shrink-0">
                {['①', '②', '③'][i]}
              </span>
              <span className="min-w-px flex-1">{text}</span>
            </li>
          ))}
        </ol>

        {/* 동의 체크 (m_agreement item, box 체크박스) — 라벨 Bold(Figma) */}
        <Checkbox
          variant="box"
          checked={agreed}
          onCheckedChange={(c) => setAgreed(c === true)}
          label={<span className="font-bold">행정정보 공동 이용에 동의합니다.</span>}
        />
      </div>
    </FullPopup>
  )
}
PbamdsInfoJntUtztnBfhdWtcs.displayName = 'PbamdsInfoJntUtztnBfhdWtcs'
