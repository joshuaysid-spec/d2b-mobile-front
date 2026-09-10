// 자주묻는질문 상세 — 설계서(MUI-CM-04-M03)엔 별도 상세 화면이 없으나(아코디언), 공지사항 목록→상세
// 프로세스와 동일하게 클릭 시 상세 이동으로 변경(2026-09-10 사용자 요청). 서비스 no.936 selectFaqDtl 대응.
// 게시판 상세는 화면별로 마크업을 각자 소유한다(공유 BoardDetailView 폐기 — 2026-09-10 사용자 확정).
// 구성(위→아래): 상단(배지 구분 / 질문 / 작성일자) → 메타(구분/조회)
//   → 답변(contsCn, 에디터 HTML — 텍스트+이미지, sanitizeHtml 후 삽입) → 이전글/다음글(FAQ_MOCK 기준). 첨부 없음.
// URL 에 식별자를 두지 않는다(보안 정책) — 대상 글은 목록이 넘긴 navigate state 로만 받는다.
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { sanitizeHtml } from '@/utils/sanitizeHtml'
import { Badge } from '@/ui/common/base/Badge'
import { SectionDivider } from '@/ui/common/base/SectionDivider'
import { FAQ_MOCK } from '@/ui/biz/cm/faqList/faqMock'
import type { MockFaqListItem } from '@/types/mock/cm'

export function FaqDtlPage() {
  const navigate = useNavigate()
  // 목록에서 넘어온 항목(state). 직접 URL/새로고침이면 대상을 알 수 없어 목록으로 되돌린다.
  const item = useLocation().state as MockFaqListItem | null
  if (!item) return <Navigate to={ROUTES.SUPPORT_FAQ} replace />

  const idx = FAQ_MOCK.findIndex((x) => x.bbsId === item.bbsId)
  // 이전글/다음글은 같은 상세 라우트로 state 만 교체('.' = 현재 라우트).
  const goDetail = (target: MockFaqListItem) => navigate('.', { state: target })
  const prevItem = idx > 0 ? FAQ_MOCK[idx - 1] : null
  const nextItem = idx >= 0 && idx < FAQ_MOCK.length - 1 ? FAQ_MOCK[idx + 1] : null

  const metaRows = [
    { label: '구분', value: item.bizFldCd },
    { label: '조회', value: item.inqNocs },
  ]

  return (
    <div className="flex w-full flex-col">
      {/* 상단 — 배지(구분) + 질문 + 작성일자 */}
      <div className="flex flex-col gap-krds-5 px-4 py-4">
        <div className="flex flex-wrap items-start gap-krds-5">
          <Badge type="pastel" color="blue">
            {item.bizFldCd}
          </Badge>
        </div>
        <span className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
          {item.qstnTtl}
        </span>
        <span className="text-[17px] leading-normal text-krds-text-muted">{item.regDt}</span>
      </div>

      {/* 메타 — 구분/조회 */}
      <SectionDivider />
      <dl className="flex flex-col gap-krds-5 px-4 py-4">
        {metaRows.map((row) => (
          <div key={row.label} className="flex items-baseline gap-krds-7">
            <dt className="w-[88px] shrink-0 text-[17px] leading-normal text-krds-text-muted">
              {row.label}
            </dt>
            <dd className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-ink wrap-break-word">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* 답변(contsCn) — '답변' 배지 + 에디터 HTML(텍스트+이미지). sanitize 후 삽입, 이미지는 화면폭에 맞춤. */}
      <SectionDivider />
      <div className="flex flex-col gap-krds-5 px-4 py-4">
        <Badge type="pastel" color="blue" className="self-start">
          답변
        </Badge>
        <div
          className="text-[17px] leading-normal text-krds-text-ink wrap-break-word [&_img]:h-auto [&_img]:max-w-full"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.contsCn) }}
        />
      </div>

      {/* 이전글 / 다음글 — 질문 클릭 시 같은 상세로 state 교체 */}
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        <div className="flex flex-col gap-krds-3">
          <span className="text-[17px] leading-normal text-krds-text-muted">이전글</span>
          {prevItem ? (
            <button
              type="button"
              onClick={() => goDetail(prevItem)}
              className="truncate text-left text-[19px] font-medium leading-normal text-krds-text-ink focus-visible:outline-hidden active:opacity-70"
            >
              {prevItem.qstnTtl}
            </button>
          ) : (
            <span className="text-[19px] font-medium leading-normal text-krds-text-ink">
              이전글이 없습니다
            </span>
          )}
        </div>
        <SectionDivider />
        <div className="flex flex-col gap-krds-3">
          <span className="text-[17px] leading-normal text-krds-text-muted">다음글</span>
          {nextItem ? (
            <button
              type="button"
              onClick={() => goDetail(nextItem)}
              className="truncate text-left text-[19px] font-medium leading-normal text-krds-text-ink focus-visible:outline-hidden active:opacity-70"
            >
              {nextItem.qstnTtl}
            </button>
          ) : (
            <span className="text-[19px] font-medium leading-normal text-krds-text-ink">
              다음글이 없습니다
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
FaqDtlPage.displayName = 'FaqDtlPage'
