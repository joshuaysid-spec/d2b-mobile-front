// MUI-MS-01-P08 중요 공지사항 / 시스템 안내 (설계서 slide26 / Figma 10020:87108)
// 앱 메인 홈에서 노출되는 중요 공지사항·시스템 안내 팝업.
//
// 설계서(slide26) 동작:
//   - 제목: 볼드로 한 줄 표시(초과 시 말줄임) · 내용: 설계서는 최대 5줄 말줄임이나 **에디터 HTML 본문(텍스트+이미지)을
//     그대로 표시**로 변경(2026-09-15 사용자 확정) — 게시판 상세와 같은 sanitizeHtml 렌더, 길면 본문 영역만 스크롤.
//   - 중요 공지사항/시스템 안내는 동일 팝업에서 내용만 교체되어 표시(type 으로 구분).
//     최신 등록된 중요 공지 1종, 시스템 안내 1종만 노출. z-index 는 시스템 안내가 상단.
//   - [더 이상 안보기] 현재 노출 공지를 더 이상 표시 안 함 + 창 닫힘.
//   - [더보기] 해당 공지 게시글 상세로 이동 + 창 닫힘.
//   - 닫기(X): 단순 닫힘.
//
// ⚠️ 근사(AlertModal 재사용 — 코디네이터 지정):
//   1) Figma 는 좌측 정렬 + "제목/내용" 라벨 섹션 구조이나 AlertModal 은 본문 text-center 고정 →
//      본문에 text-left 를 직접 지정해 근사(라벨 색/구조는 토큰으로 재현).
//   2) Figma 우상단 닫기(X) 버튼을 AlertModal 은 제공하지 않음 → dismissable(외부탭/Esc)로 닫힘 근사.
//   → 두 항목 보고 대상.
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

/** 팝업 종류: 중요 공지사항 | 시스템 안내 (동일 팝업, 내용만 교체). */
export type SysExplnType = 'notice' | 'system'

// TODO(설계서 확인): 공지/안내 데이터 항목 영문ID 미제공(설계서에 항목명 명시 없음) →
//   임시 필드명(title/content) 사용. API 연동 시 공지(board) 도메인 항목명으로 교체.
export interface SysExplnData {
  title: string
  /** 본문 — 에디터 HTML(게시판 bbsCn 과 동일 형식). sanitizeHtml 후 삽입. */
  content: string
}

// 목업 — 설계서(slide26)/Figma 노출 텍스트 그대로. (API 연동 시 최신 1종 조회로 교체)
const MOCK_DATA: Record<SysExplnType, SysExplnData> = {
  notice: {
    title: '제목을 표시합니다. 최대 1줄까지 표시 후 말줄임 처리됩니다.',
    content:
      '<p>공지사항 중에서 중요 공지로 등록한 최신 한가지를 노출합니다.</p>' +
      '<p><strong>중요 공지사항 메인홈에서 노출되는 것은 1종입니다.</strong></p>' +
      '<p>본문은 게시판 에디터 HTML 을 그대로 표시합니다(텍스트+이미지).</p>' +
      '<p>문의사항은 고객센터(<a href="tel:1577-1118">1577-1118</a>)로 연락 주시기 바랍니다.</p>',
  },
  system: {
    title: '시스템 점검 안내입니다. 최대 1줄까지 표시 후 말줄임 처리됩니다.',
    content:
      '<p>시스템 안내 중에서 등록한 최신 한가지를 노출합니다.</p>' +
      '<p><strong>시스템 안내 메인홈에서 노출되는 것은 1종입니다.</strong></p>' +
      '<p>3월 15일(토) 00:00~06:00 시스템 점검이 예정되어 있습니다. 이용에 참고 바랍니다.</p>',
  },
}

const HEADING: Record<SysExplnType, string> = {
  notice: '중요 공지사항',
  system: '시스템 안내',
}

// ── [더 이상 안보기] 영속화 ──────────────────────────────────────────────
// 설계서(slide26): "현재 노출 공지를 더 이상 표시 안 함" — 앱 전체가 아니라 **공지 1건 단위**.
// 노출 중단한 공지의 식별값을 종류별로 저장해 두고, 같은 공지면 스킵 / 새 공지가 등록되면 다시 노출.
// TODO(API 연동): 식별값을 title 대신 공지 게시글 id 로 교체(현 목업엔 id 가 없어 title 로 근사).
// TODO(하이브리드 앱 탑재): 필요 시 네이티브 저장(브릿지)으로 교체.
const dismissKey = (type: SysExplnType) => `sysExplnDismissed:${type}`

/** 해당 종류의 현재 공지가 [더 이상 안보기] 처리됐는지. 부모가 open 초기값 계산에 사용. */
export function isSysExplnDismissed(type: SysExplnType, data?: SysExplnData) {
  const item = data ?? MOCK_DATA[type]
  return localStorage.getItem(dismissKey(type)) === item.title
}

export interface SysExplnProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 팝업 종류. 기본 'notice'. */
  type?: SysExplnType
  /** 미주입 시 목업 데이터 사용(API 연동 시 최신 1종 주입). */
  data?: SysExplnData
  /** [더보기] — 게시글 상세 이동. */
  onMore?: () => void
  /** [더 이상 안보기] — 현재 공지 노출 중단. */
  onDismissForever?: () => void
}

export function SysExpln({
  open,
  onOpenChange,
  type = 'notice',
  data,
  onMore,
  onDismissForever,
}: SysExplnProps) {
  const item = data ?? MOCK_DATA[type]

  const handleMore = () => {
    console.log('[SysExpln] 더보기', type)
    onMore?.()
    // 추후 API: 해당 공지 게시글 상세 화면으로 이동
  }
  // [더 이상 안보기] — 현재 공지 식별값 저장(이후 같은 공지는 미노출, 새 공지는 노출).
  // 닫힘은 AlertModal 이 onClick 후 자동 처리. 서버 플래그가 생기면 저장을 API 로 교체.
  const handleDismissForever = () => {
    localStorage.setItem(dismissKey(type), item.title)
    onDismissForever?.()
  }

  return (
    <AlertModal
      open={open}
      onOpenChange={onOpenChange}
      variant="none"
      dismissable
      title={
        <span className="block text-left text-krds-heading-sm font-bold text-krds-text-ink">
          {HEADING[type]}
        </span>
      }
      description={
        <span className="flex flex-col gap-krds-5 text-left">
          <span className="flex flex-col gap-krds-2">
            <span className="text-krds-body-sm text-krds-text-muted">제목</span>
            <span className="line-clamp-1 text-krds-body-md font-bold text-krds-text-ink">
              {item.title}
            </span>
          </span>
          <span className="flex flex-col gap-krds-2">
            <span className="text-krds-body-sm text-krds-text-muted">내용</span>
            {/* 에디터 HTML — AlertModal description 이 <p> 라 React 자식으론 블록을 못 넣음 → innerHTML 로 삽입(DOM API 는 허용).
                게시판 상세(NoticeDtlPage)와 동일 클래스. 긴 본문은 이 영역만 스크롤. */}
            <span
              className="block max-h-[40vh] overflow-y-auto text-krds-body-md text-krds-text-ink wrap-break-word [&_img]:h-auto [&_img]:max-w-full"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content) }}
            />
          </span>
        </span>
      }
      secondaryAction={{ label: '더 이상 안보기', onClick: handleDismissForever }}
      primaryAction={{ label: '더보기', onClick: handleMore }}
    />
  )
}
SysExpln.displayName = 'SysExpln'
