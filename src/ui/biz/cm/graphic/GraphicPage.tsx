// 인포그래픽스 — MUI-CM-05-M04. Figma 10064-17202(화면) / 10064-17227(info_mobile_360 이미지 원본).
// 설계서 00.공통 v0.85 slide357(화면목록: graphic/GraphicPage) · slide363.
// M04 화면은 인포그래픽을 통이미지 1장으로 얹었지만, 원본(10064-17227)의 레이어를 그대로 마크업으로
// 재현해 텍스트 확대/스크린리더/폐쇄망(이미지 누락) 대응이 가능하게 했다. 일러스트·로고·스텝 아이콘만
// Figma 내보낸 SVG 를 커밋해 사용(직접 그린 벡터 없음).
// 색상: 인포그래픽 전용 hex(#f5f7fc 배경 · #e3ecfb 번호/아이콘칩 · #14161c 고객지원센터)는 토큰이 없는
// 일회성 그래픽 색이라 arbitrary 로 둔다(시스템소개 IntroducePage 와 동일 판단). 나머지는 KRDS 토큰.
import { SatisfactionSurvey } from '@/ui/biz/cm/introduce/SatisfactionSurvey'

import hero from '@/assets/images/graphic/hero.svg'
import step01 from '@/assets/images/graphic/step01.svg'
import step02 from '@/assets/images/graphic/step02.svg'
import step03 from '@/assets/images/graphic/step03.svg'
import step04 from '@/assets/images/graphic/step04.svg'
import step05 from '@/assets/images/graphic/step05.svg'
import step06 from '@/assets/images/graphic/step06.svg'
import googlePlay from '@/assets/images/graphic/googlePlay.svg'
import appleLogo from '@/assets/images/graphic/appleLogo.svg'
import appStoreText from '@/assets/images/graphic/appStoreText.svg'
import phone from '@/assets/images/graphic/phone.svg'

// 전자조달 절차 6단계(Figma 10064-17248~17321). 번호는 인덱스가 아닌 데이터(문구 안의 STEP 표기와 일치).
const STEPS: { no: string; icon: string; title: string; desc: string }[] = [
  {
    no: '01',
    icon: step01,
    title: '업체 조달원 등록',
    desc: '조달에 참여할 국내외 기업이 조달원으로 등록합니다.',
  },
  {
    no: '02',
    icon: step02,
    title: '입찰공고 검색',
    desc: '관심 있는 입찰공고를 검색하고 참가 조건을 확인합니다.',
  },
  {
    no: '03',
    icon: step03,
    title: '입찰',
    desc: '공정하고 투명한 전자입찰에 온라인으로 참여합니다.',
  },
  {
    no: '04',
    icon: step04,
    title: '협상',
    desc: '필요 시 발주기관과 세부 조건을 협상합니다.',
  },
  {
    no: '05',
    icon: step05,
    title: '계약',
    desc: '낙찰 후 온라인으로 전자계약을 체결합니다.',
  },
  {
    no: '06',
    icon: step06,
    title: '납품',
    desc: '계약 내용에 따라 군수품을 납부하며 절차가 완료 됩니다.',
  },
]

// 절차 카드 — 우상단 번호 워터마크 + 아이콘 칩 + STEP 라벨 + 제목 + 설명.
function StepCard({ no, icon, title, desc }: (typeof STEPS)[number]) {
  return (
    <div className="relative flex w-full flex-col gap-krds-6 overflow-hidden rounded-[12px] border border-krds-border-field bg-background p-4">
      <span
        aria-hidden
        className="absolute right-4 top-4 text-[60px] font-bold leading-normal text-[#e3ecfb]"
      >
        {no}
      </span>

      <div className="flex flex-col">
        <div className="flex size-[66px] items-center justify-center rounded-[17px] bg-[#e3ecfb]">
          <img src={icon} alt="" className="size-[30px]" />
        </div>
        <span className="mt-[13px] text-[12px] font-bold leading-normal text-krds-text-primary">
          STEP {no}
        </span>
        <span className="text-[20px] font-bold leading-normal text-krds-text-ink">{title}</span>
      </div>

      <p className="text-[17px] leading-normal text-krds-text-ink wrap-break-word">{desc}</p>
    </div>
  )
}

// 절차 섹션 오버라인(영문 라벨 13px + 우측 구분선, Figma 10064-17244·17245·17246).
// 카드 안의 오버라인(MOBILE SERVICE · SUPPORT CENTER)은 12px·선 없음이라 각 카드에 인라인으로 둔다.
function ProcessOverline() {
  return (
    <div className="flex w-full items-center gap-krds-7">
      <span className="text-[13px] font-bold leading-normal text-krds-text-primary">
        PROCUREMENT PROCESS
      </span>
      <div className="h-px min-w-px flex-1 bg-krds-border-field" />
    </div>
  )
}

export function GraphicPage() {
  return (
    <div className="flex w-full flex-col">
      <div className="p-4">
        {/* 인포그래픽 본문(원본 10064-17227) — 연한 배경 + 보더 카드 */}
        <div className="flex w-full flex-col gap-4 rounded-[12px] border border-krds-border-field bg-[#f5f7fc] pt-4">
          {/* 소개 */}
          <section className="flex flex-col gap-[30px] p-4">
            <p className="text-[38px] font-bold leading-normal text-krds-text-ink">국방전자조달</p>
            <p className="text-[17px] leading-normal text-krds-text-ink wrap-break-word">
              나라를 지키기 위해 필요한 모든 군수품 조달을 위해, 자격을 갖춘 국내외 기업이{' '}
              <span className="font-bold">공정하고 투명하게</span> 인터넷 전자입찰에 참여하여
              계약·납품까지 진행 할 수 있는 서비스입니다.
            </p>
            <div className="flex justify-center">
              <img src={hero} alt="" className="h-auto w-[265px] max-w-full" />
            </div>
          </section>

          {/* 전자조달 절차 + 모바일 서비스 + 고객지원센터 */}
          <section className="flex flex-col gap-4 p-4">
            <ProcessOverline />
            {/* 원본은 360폭 아트보드라 1줄이지만, 여기선 실제 17/24px 로 그려 296폭에서 줄이 바뀐다.
                낱말 중간(절/차)에서 끊기지 않게 break-keep. */}
            <p className="break-keep text-[24px] font-bold leading-normal text-krds-text-ink">
              6단계로 완료되는 전자조달 절차
            </p>

            {STEPS.map((s) => (
              <StepCard key={s.no} {...s} />
            ))}

            {/* 모바일 서비스 — 브랜드 그라데이션 카드(Figma 10064-17322 실측 각도/스톱) */}
            <div
              className="flex w-full flex-col gap-krds-6 rounded-[12px] px-4 py-5"
              style={{
                backgroundImage:
                  'linear-gradient(123.48deg, #0154e9 25.94%, #3d82ff 95.39%)',
              }}
            >
              <div className="flex flex-col gap-[7px]">
                <span className="text-[12px] font-bold leading-normal text-white">
                  MOBILE SERVICE
                </span>
                <span className="text-[20px] font-bold leading-normal text-white">
                  국방전자조달 모바일 서비스
                </span>
              </div>
              <p className="text-[17px] leading-normal text-white wrap-break-word">
                공지사항부터 조달계획, 입찰공고, 계약현황까지 각종 입찰정보를{' '}
                <span className="font-bold">스마트폰으로 편하게 검색</span>할 수 있는 서비스입니다.
              </p>
              <div className="flex flex-col gap-krds-6 pt-5">
                <div className="flex items-center gap-[30px]">
                  <img src={googlePlay} alt="Google Play" className="h-[30px] w-[128px]" />
                  <div className="flex items-center gap-[6px]">
                    <img src={appleLogo} alt="" className="h-[30px] w-[25px]" />
                    <img src={appStoreText} alt="App Store" className="h-[24px] w-[84px]" />
                  </div>
                </div>
                <p className="text-[17px] leading-normal text-white wrap-break-word">
                  안드로이드는 플레이스토어 / iOS는 앱스토어에서 ‘국방전자조달’을 검색하세요.
                </p>
              </div>
            </div>

            {/* 고객지원센터 */}
            <div className="flex w-full flex-col gap-krds-6 rounded-[12px] border border-krds-border-field px-4 py-5">
              <div className="flex flex-col gap-[7px]">
                <span className="text-[12px] font-bold leading-normal text-krds-text-primary">
                  SUPPORT CENTER
                </span>
                <span className="text-[22px] font-bold leading-normal text-[#14161c]">
                  고객지원센터
                </span>
              </div>
              <p className="text-[17px] leading-normal text-krds-text-ink wrap-break-word">
                방위사업청 고객지원센터에 방문하시면{' '}
                <span className="font-bold text-krds-text-primary">
                  조달원 상담, 민원접수, 서류 제출
                </span>{' '}
                등 조달업무 전반을 지원받으실 수 있습니다.
              </p>
              <div className="flex flex-col gap-krds-6 pt-5">
                <a
                  href="tel:1577-1118"
                  className="flex w-fit items-center gap-krds-6 focus-visible:outline-hidden"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-krds-bg-primary-strong">
                    <img src={phone} alt="" className="h-[19px] w-[20px]" />
                  </span>
                  <span className="text-[26px] font-bold leading-normal text-[#14161c]">
                    1577-1118
                  </span>
                </a>
                <p className="text-[17px] leading-normal text-krds-text-info wrap-break-word">
                  국방전자조달 이용에 관한 문의 사항이 있다면 언제든지 전화주세요. 친절하게
                  안내해드리겠습니다.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 만족도 설문 — 소개 계열 화면 공통(Figma 10064-17206) */}
      <SatisfactionSurvey />
    </div>
  )
}
GraphicPage.displayName = 'GraphicPage'
