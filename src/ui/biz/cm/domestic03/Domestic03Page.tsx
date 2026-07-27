// 전자대금청구절차 — MUI-CM-05-M11. Figma 개인용-260723 10020-86420 / 설계서 00.공통 v0.84 slide372.
// 이용안내 > 국내조달안내 하위의 정적 안내(가이드) 페이지. 고정 안내 문구라 목업/API 경계 없음.
// 구성: 단계 박스 5개(1 검사 및 납품조서 작성 ~ 5 대금청구 송신) + 메뉴얼 링크 섹션.
// 단계 박스 = border-field rounded-12 p-4 / 헤더 = 32px 사각 뱃지(bg action-primary-active, rounded-4)
//   + 제목 19 Bold text-primary-active / 본문 = m_list(불릿 슬롯 20px + gap 4px, 17 Regular ink, 대시 pl-24).
// [[cm-preparation01-m07]] 안내 페이지 계열(Domestic01/Foreign01/Preparation02)과 동일 컨벤션 — 프리미티브는 페이지 소유.
import type { ReactNode } from 'react'

// ● 불릿 항목 — Figma m_list: 20px 불릿 슬롯 + 4px gap, 본문 17 Regular ink.
function Bullet({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-1">
      <span className="flex h-[26px] w-5 shrink-0 items-center justify-center" aria-hidden>
        <span className="size-1.5 rounded-full bg-krds-text-ink" />
      </span>
      <span className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-ink wrap-break-word">
        {children}
      </span>
    </div>
  )
}

// - 대시 하위 항목 — Figma m_list(pl-24px).
function Dash({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-1 pl-6">
      <span className="shrink-0 whitespace-nowrap text-[14px] font-medium leading-normal text-krds-text-ink">
        -
      </span>
      <span className="min-w-px flex-1 self-stretch text-[17px] leading-normal text-krds-text-ink wrap-break-word">
        {children}
      </span>
    </div>
  )
}

// 단계 박스 — 32px 사각 번호 뱃지 + 제목(19 Bold text-primary-active) + 본문(gap 4px).
function StepBox({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[12px] border border-krds-border-field p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-krds-action-primary-active text-[17px] font-bold leading-normal text-white">
          {n}
        </span>
        <span className="text-[19px] font-bold leading-normal text-krds-text-primary-active">
          {title}
        </span>
      </div>
      <div className="flex w-full flex-col gap-1">{children}</div>
    </div>
  )
}

// '바로가기' 링크 텍스트 — 일반자료실 메뉴얼로 이동(대상 URL 미정, 스텁).
function ShortcutLink() {
  return (
    <button
      type="button"
      className="text-[17px] leading-normal text-krds-text-primary underline"
      onClick={() => console.log('[Domestic03] 일반자료실 메뉴얼 바로가기')} // 추후: 일반자료실 게시물 연결
    >
      바로가기
    </button>
  )
}

export function Domestic03Page() {
  return (
    <div className="flex w-full flex-col">
      {/* 단계 1~5 — Figma 섹션 프레임 p-16 + 박스 간 gap 8px */}
      <div className="flex w-full flex-col gap-2 p-4">
        <StepBox n={1} title="검사 및 납품조서 작성">
          <Bullet>
            물품검사를 수행하기 위해 [검사 및 납품조서]를 작성하여 납지부대(수요군)에 검사를 의뢰하는
            화면입니다.
          </Bullet>
          <Bullet>{'물품[용역/공사] > 검사및납품조서 > 검사및납품조서'}</Bullet>
          <Dash>
            납지부대(수요군) 검사품목에 한해 작성, 품관소 검사품목은 검사완료시 품관소에서 [검사 및
            납품조서]가 작성되어 인터넷에 게시되므로 작성 할 필요없이 바로 2번 항목부터 수행
          </Dash>
        </StepBox>

        <StepBox n={2} title="검사 및 납품조서 조회">
          <Bullet>검사가 완료되면 [검사 및 납품조서]를 조회 할 수 있는 화면입니다.</Bullet>
          <Bullet>{'물품[용역/공사] > 검사 및 납품 조서 > 검사 및 납품 조서 현황'}</Bullet>
          <Dash>
            검사완료 후 [검사 및 납품조서]가 인터넷에 게시되기 까지는 최장 2~3시간까지 소요될 수
            있습니다.
          </Dash>
        </StepBox>

        <StepBox n={3} title="대금청구서 작성">
          <Bullet>계약번호별로 대금청구서를 작성하여 대금청구를 진행 할 수 있는 화면입니다.</Bullet>
          <Bullet>
            {'물품[용역/공사] > 대금청구 > 대금/선금/착·중도금 신청 > [대금청구서 작성] 버튼 클릭'}
          </Bullet>
          <Dash>
            대금청구서 작성후 대금청구 진행을 위해서는 위 3번으로 작성한 대금청구서를 선택후 화면
            하단의 [대금청구 수정/제출] 버튼을 클릭하여 대금청구(방위사업청 송신)를 할 수 있습니다.
          </Dash>
        </StepBox>

        <StepBox n={4} title="세금계산서 작성">
          <Bullet>세금계산서를 작성하는 화면입니다.</Bullet>
          <Bullet>{'세금계산서 > 세금계산서목록 > [세금계산서작성] 버튼 클릭'}</Bullet>
        </StepBox>

        <StepBox n={5} title="대금청구 (송신)">
          <Bullet>대금청구서 방위사업청(지출심사팀)으로 송신하는 화면입니다.</Bullet>
          <Bullet>
            {'물품[용역/공사] > 대금청구 > 대금/선금/착·중도금 신청 > [대금청구 수정/제출] 버튼 클릭'}
          </Bullet>
          <Dash>
            대금청구서 송신시 지출심사팀 담당자를 지정하여야 하는데 담당자 지정방법은 아래 [수신처
            지정방법 메뉴얼] 바로가기를 선택후 조회되는 전자문서유통체계 수신처 지정 방법 메뉴얼을
            참고하시기 바랍니다.
          </Dash>
        </StepBox>
      </div>

      {/* 메뉴얼 링크 */}
      <div className="flex w-full flex-col gap-1 p-4">
        <p className="text-[19px] font-bold leading-normal text-krds-text-ink">메뉴얼</p>
        <Bullet>
          국방조달 전자 대금청구 절차(일반자료실) <ShortcutLink />
        </Bullet>
        <Bullet>
          전자문서유통체계 수신처 지정 방법(일반자료실) <ShortcutLink />
        </Bullet>
      </div>
    </div>
  )
}
Domestic03Page.displayName = 'Domestic03Page'
