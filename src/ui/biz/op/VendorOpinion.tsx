// 조달계획 상세 - '업체의견' 탭 콘텐츠 (MUI-OP-01-M05, 문서 slide26).
// 제목(PageTitle) + 헤더(총건수 + 의견등록 버튼) + 의견 카드 목록(OpinionCard, 일부 답변 포함) + 더보기.
// 동작(스텁): 의견등록→등록 팝업 / 카드 클릭→상세 팝업 / 비공개는 "비공개 글입니다" 안내.
// 데이터는 목업 — 추후 API(opService.getOpinions)로 대체.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { OpinionCard, type OpinionData } from '@/ui/biz/op/OpinionCard'

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

export function VendorOpinion() {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const loaded = Math.min(page * pageSize, TOTAL)

  const handleRegister = () => {
    console.log('[M05] 의견등록 팝업 호출')
  }
  const handleOpen = (item: OpinionItem) => {
    // 비공개 정보는 작성자만 접근 — 안내 모달(스텁)
    if (!item.opinion.isPublic) {
      console.log('[M05] 비공개 글입니다.')
      return
    }
    console.log('[M05] 의견 상세보기 팝업', item.id)
  }

  return (
    <div className="flex flex-col gap-krds-7 pb-6">
      <PageTitle as="h2">업체의견</PageTitle>

      {/* 헤더 — 총건수 + 의견등록 */}
      <div className="flex items-center justify-between gap-krds-5 px-4">
        <span className="text-[17px] font-bold leading-normal text-krds-text-ink">
          총 {TOTAL.toLocaleString()}건
        </span>
        <Button variant="secondary" size="sm" onClick={handleRegister}>
          의견등록
        </Button>
      </div>

      {/* 의견 카드 목록 */}
      <div className="flex flex-col gap-krds-7 px-4">
        {MOCK.map((item) => (
          <OpinionCard
            key={item.id}
            opinion={item.opinion}
            reply={item.reply}
            onOpinionClick={() => handleOpen(item)}
            onReplyClick={() => console.log('[M05] 답변 상세 팝업', item.id)}
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
    </div>
  )
}
VendorOpinion.displayName = 'VendorOpinion'
