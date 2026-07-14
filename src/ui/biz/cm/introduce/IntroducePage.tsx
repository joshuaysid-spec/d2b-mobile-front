// 시스템소개 — MUI-CM-05-M01. Figma 10020-85293 / 설계서 00.공통 v0.83 slide343·346.
// 구성: 정보 요약(제목/부제) + 소개 본문 + 조달 프로세스 인포그래픽 + 만족도 설문(SatisfactionSurvey).
// 인포그래픽 색상은 디자인 원본(브랜드 일러스트) 실측 hex — 토큰 없는 일회성 그래픽이라 arbitrary 사용.
import { Icon } from '@/ui/common/base/Icon'
import { SatisfactionSurvey } from './SatisfactionSurvey'

// 소개 본문(Figma 10020-85300) — 문단 사이 빈 줄.
const INTRO_BODY = [
  '안녕하십니까?',
  '방위사업청 국방전자조달시스템에 오신 것을 환영합니다.',
  '',
  '방위사업청은 국방 획득 업무를 주관하는 정부 기관으로서 방위력 개선사업을 통한 무기체계의 획득, 체계 연구 개발 및 품질 개선과 더불어 각 군부대의 운용을 위한 물품, 용역 및 시설공사 등 군수품 조달을 주요 업무 범위로 하고 있습니다.',
  '',
  '연간 약 10조원을 넘는 대규모 군수품 조달을 공정하고 신속하게 수행하기 위해서는 온라인 환경을 기반으로 한 전자조달시스템의 존재가 필수적으로 요구되며, 이러한 필요성에 따라 방위사업청은 국방전자조달시스템을 지속적으로 운영·발전시켜 왔습니다.',
  '',
  '이러한 노력의 결실로 조달업체와 방위사업청 직원이 국방전자조달시스템을 통해 입찰, 협상, 계약, 납품 등 조달 업무 전 과정을 온라인에서 처리함으로써 조달업체가 직접 방위사업청에 방문하여 각종 서류를 제출하는 등 불필요한 행정 소요를 크게 감소시켰고, 조달업체 간에 동일한 입찰 참여 기회를 보장함으로써 공정한 경쟁이 이루어질 수 있는 장(場)을 마련하였습니다.',
].join('\n')

// 조달 프로세스 pill — 번호 원 + 라벨(브랜드 색).
function ProcessPill({ n, label, color }: { n: string; label: string; color: string }) {
  return (
    <div
      className="flex min-w-px flex-1 items-center justify-center gap-2 rounded-[8px] py-[14px] pl-[14px] pr-[18px]"
      style={{ backgroundColor: `${color}26` }} // 0.15 알파
    >
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {n}
      </span>
      <span className="text-[19px] font-bold" style={{ color }}>
        {label}
      </span>
    </div>
  )
}

// 단계 연결부 — 세로선 + 노란 라벨 + 아래 화살표.
function Connector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-4 w-0.5 bg-krds-text-primary-active" />
      <div className="rounded-full bg-[#ffe567] px-[14px] py-1.5 text-[14px] font-bold text-krds-text-primary-active">
        {label}
      </div>
      <Icon name="ExpandMore" size={20} className="text-krds-text-primary-active" aria-hidden />
    </div>
  )
}

export function IntroducePage() {
  return (
    <div className="flex w-full flex-col">
      {/* 정보 요약 */}
      <div className="flex flex-col gap-1 px-4 py-4">
        <p className="text-[19px] font-bold leading-normal text-krds-text-ink">
          국방전자조달 시스템이란?
        </p>
        <p className="text-[17px] font-bold leading-normal text-krds-text-muted">
          국방 획득 업무를 주관하는 정부 기관
        </p>
      </div>

      {/* 소개 본문 */}
      <div className="px-4 py-4">
        <p className="whitespace-pre-line text-[17px] leading-normal text-krds-text-ink wrap-break-word">
          {INTRO_BODY}
        </p>
      </div>

      {/* 조달 프로세스 인포그래픽 */}
      <div className="px-4 py-4">
        <div className="flex flex-col items-center gap-2 rounded-[12px] border border-krds-border-field p-6">
          <div className="flex w-full flex-col gap-1">
            <div className="flex gap-1">
              <ProcessPill n="01" label="입찰" color="#dd270a" />
              <ProcessPill n="02" label="협상" color="#25732b" />
            </div>
            <div className="flex gap-1">
              <ProcessPill n="03" label="계약" color="#0d6ace" />
              <ProcessPill n="04" label="납품" color="#2a2554" />
            </div>
          </div>

          <Connector label="온라인 제출" />

          {/* 온라인 창구 */}
          <div className="flex w-full flex-col items-center gap-2 rounded-[12px] border border-[#d4e3ff] bg-[#f5f9ff] px-10 py-[14px]">
            <div className="flex size-20 items-center justify-center rounded-full bg-krds-text-primary-active">
              <Icon name="Computer" size={34} className="text-white" aria-hidden />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[19px] font-bold leading-normal text-krds-text-ink">온라인</span>
              <span className="text-[14px] leading-normal text-krds-text-ink">각종 자료 제출 창구</span>
            </div>
          </div>

          <Connector label="각종자료 제출" />

          {/* 방위사업청(로고 자리 — 에셋 확정 시 이미지 교체) */}
          <div className="flex h-[100px] w-full items-center justify-center rounded-[12px] border border-krds-text-primary-active bg-background">
            <span className="text-[19px] font-bold leading-normal text-krds-text-ink">방위사업청</span>
          </div>
        </div>
      </div>

      {/* 만족도 설문 */}
      <SatisfactionSurvey />
    </div>
  )
}
IntroducePage.displayName = 'IntroducePage'
