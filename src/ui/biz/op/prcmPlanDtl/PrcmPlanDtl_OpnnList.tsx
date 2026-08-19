// 조달계획 상세 - '업체의견' 탭 콘텐츠 (MUI-OP-01-M05, 문서 slide26).
// 제목(PageTitle) + 헤더(총건수 + 의견등록 버튼) + 의견 카드 목록(PrcmPlanDtl_OpnnCard, 일부 답변 포함) + 더보기.
// 동작(스텁): 의견등록→등록 팝업 / 카드 클릭→상세 팝업 / 비공개는 "비공개 글입니다" 안내.
// 데이터는 목업 — 추후 API(opService.selectOpinions)로 대체.
import { useCallback, useMemo, useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { PrcmPlanDtl_OpnnCard, type OpinionData } from '@/ui/biz/op/prcmPlanDtl/PrcmPlanDtl_OpnnCard'
import { PrcmPlanDtl_OpnnDtlFullPopup } from '@/ui/biz/op/prcmPlanDtl/PrcmPlanDtl_OpnnDtlFullPopup'
import { PrcmPlanDtl_OpnnRegFullPopup } from '@/ui/biz/op/prcmPlanDtl/PrcmPlanDtl_OpnnRegFullPopup'

interface OpinionItem {
  id: string
  opinion: OpinionData
  reply?: OpinionData
}

const TOTAL = 258 // 총 건수(목업)

// 목업 (문서 slide26 예시값 기반)
const MOCK: OpinionItem[] = [
  {
    id: '1',
    opinion: {
      isPublic: false,
      company: '㈜미래회사',
      title: '업체의 의견이 있습니다',
      name: '홍길동',
      datetime: '2026-01-03 14:50',
    },
  },
  {
    id: '2',
    opinion: {
      isPublic: true,
      company: '㈜미래회사',
      title: '업체의 의견이 있습니다',
      name: '홍길동',
      datetime: '2026-01-03 14:50',
    },
    reply: {
      isPublic: true,
      company: '㈜길동주식회사',
      title: '업체의 의견이 있습니다',
      name: '성춘향',
      datetime: '2026-01-03 14:50',
    },
  },
  {
    id: '3',
    opinion: {
      isPublic: true,
      company: '㈜미래회사',
      title: '업체의 의견이 있습니다',
      name: '성춘향',
      datetime: '2026-01-03 14:50',
    },
  },
  {
    id: '4',
    opinion: {
      isPublic: false,
      company: '㈜미래회사',
      title: '업체의 의견이 있습니다',
      name: '홍길동',
      datetime: '2026-01-03 14:50',
    },
  },
  {
    id: '5',
    opinion: {
      isPublic: true,
      company: '㈜미래회사',
      title: '업체의 의견이 있습니다',
      name: '홍길동',
      datetime: '2026-01-03 14:50',
    },
  },
]

export function PrcmPlanDtl_OpnnList() {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const loaded = Math.min(page * pageSize, TOTAL)

  // 팝업 — 등록/수정(P07) · 상세/답변상세(P06)
  const [formOpen, setFormOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailVariant, setDetailVariant] = useState<'opinion' | 'reply'>('opinion')

  const handleRegister = useCallback(() => setFormOpen(true), [])
  const handleOpen = useCallback((item: OpinionItem) => {
    // 비공개 정보는 작성자만 접근 — 안내 모달(스텁)
    if (!item.opinion.isPublic) {
      console.log('[M05] 비공개 글입니다.')
      return
    }
    setDetailVariant('opinion')
    setDetailOpen(true)
  }, [])
  const handleReply = useCallback(() => {
    setDetailVariant('reply')
    setDetailOpen(true)
  }, [])

  // 카드별 안정 콜백 — memo(PrcmPlanDtl_OpnnCard) 가 부모 리렌더 시 스킵되도록 1회 계산.
  const cards = useMemo(
    () =>
      MOCK.map((item) => ({
        item,
        onOpen: () => handleOpen(item),
        onReply: () => handleReply(),
      })),
    [handleOpen, handleReply],
  )

  return (
    <div className="flex flex-col gap-krds-7 pb-6">

      {/* 헤더 — 총건수 + 의견등록 */}
      <div className="flex items-center justify-between gap-krds-5 px-4">
        <span className="text-[17px] font-bold leading-normal text-krds-text-primary-active">
          총 {TOTAL.toLocaleString()}건
        </span>
        <Button variant="secondary" size="sm" onClick={handleRegister}>
          의견등록
        </Button>
      </div>

      {/* 의견 카드 목록 */}
      <div className="flex flex-col gap-krds-7 px-4">
        {cards.map(({ item, onOpen, onReply }) => (
          <PrcmPlanDtl_OpnnCard
            key={item.id}
            opinion={item.opinion}
            reply={item.reply}
            onOpinionClick={onOpen}
            onReplyClick={onReply}
          />
        ))}
      </div>

      {/* 더보기 */}
      <div className="px-4">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            const next = page + 1
            setPage(next)
            console.log('[M05] 더보기 → page', next)
          }}
        >
          더보기 ({loaded}/{TOTAL})
        </Button>
      </div>

      {/* 의견등록/수정 (P07) */}
      <PrcmPlanDtl_OpnnRegFullPopup open={formOpen} onOpenChange={setFormOpen} />

      {/* 의견 상세 / 답변 상세 (P06) — 수정 클릭 시 등록/수정(P07) 진입 */}
      <PrcmPlanDtl_OpnnDtlFullPopup
        open={detailOpen}
        onOpenChange={setDetailOpen}
        variant={detailVariant}
        onEdit={() => {
          setDetailOpen(false)
          setFormOpen(true)
        }}
        onDelete={() => console.log('[M05] 삭제 확인 모달 (스텁)')}
      />
    </div>
  )
}
PrcmPlanDtl_OpnnList.displayName = 'PrcmPlanDtl_OpnnList'
