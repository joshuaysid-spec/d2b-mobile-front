// MUI-MS-01-P08 중요 공지사항 / 시스템 안내 (설계서 slide26 / Figma 10020:87108)
// 앱 메인 홈에서 노출되는 중요 공지사항·시스템 안내 팝업.
//
// 설계서(slide26) 동작:
//   - 제목: 볼드로 한 줄 표시(초과 시 말줄임) · 내용: 최대 5줄 표시(초과 시 …말줄임).
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

/** 팝업 종류: 중요 공지사항 | 시스템 안내 (동일 팝업, 내용만 교체). */
export type SysExplnType = 'notice' | 'system'

// TODO(설계서 확인): 공지/안내 데이터 항목 영문ID 미제공(설계서에 항목명 명시 없음) →
//   임시 필드명(title/content) 사용. API 연동 시 공지(board) 도메인 항목명으로 교체.
interface SysExplnData {
  title: string
  content: string
}

// 목업 — 설계서(slide26)/Figma 노출 텍스트 그대로. (API 연동 시 최신 1종 조회로 교체)
const MOCK_DATA: Record<SysExplnType, SysExplnData> = {
  notice: {
    title: '제목을 표시합니다. 최대 1줄까지 표시 후 말줄임 처리됩니다.',
    content:
      '공지사항 중에서 중요 공지로 등록한 최신 한가지를 노출합니다.\n' +
      '중요 공지사항 메인홈에서 노출되는 것은 1종입니다.\n' +
      '표시되는 텍스트의 길이는 최대 5줄로 표시하고, 이후 내용이 더 있는 경우는 …(말줄임) 표시를 통해서 내용을 숨김처리 합니다.',
  },
  system: {
    title: '시스템 점검 안내입니다. 최대 1줄까지 표시 후 말줄임 처리됩니다.',
    content:
      '시스템 안내 중에서 등록한 최신 한가지를 노출합니다.\n' +
      '시스템 안내 메인홈에서 노출되는 것은 1종입니다.\n' +
      '표시되는 텍스트의 길이는 최대 5줄로 표시하고, 이후 내용이 더 있는 경우는 …(말줄임) 표시를 통해서 내용을 숨김처리 합니다.',
  },
}

const HEADING: Record<SysExplnType, string> = {
  notice: '중요 공지사항',
  system: '시스템 안내',
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
  const handleDismissForever = () => {
    console.log('[SysExpln] 더 이상 안보기', type)
    onDismissForever?.()
    // 추후 API: noticeService 로 현재 공지 노출 중단 처리(로컬/서버 플래그)
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
            <span className="line-clamp-5 whitespace-pre-line text-krds-body-md text-krds-text-ink">
              {item.content}
            </span>
          </span>
        </span>
      }
      secondaryAction={{ label: '더 이상 안보기', onClick: handleDismissForever }}
      primaryAction={{ label: '더보기', onClick: handleMore }}
    />
  )
}
SysExpln.displayName = 'SysExpln'
