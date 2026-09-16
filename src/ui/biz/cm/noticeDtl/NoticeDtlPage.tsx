// 일반공지사항상세 — MUI-CM-04-M02(설계서 slide224·225). Figma 10020-82258.
// 게시판 상세는 화면별로 마크업을 각자 소유한다(공유 BoardDetailView/NoticeDtlView 폐기 — 2026-09-10 사용자 확정).
// 구성(위→아래): 상단(배지 긴급+구분 / 제목 / 작성일자) → 메타(작성자/담당부서/구분/게시기간)
//   → 내용(bbsCn, 에디터 HTML — 텍스트+이미지, sanitizeHtml 후 삽입) → 첨부파일(총 N건) → 이전글/다음글.
// 데이터: tssCmQueries.useSelectNoticeDtl(contsNo, no.926) — state 로 받은 목록 항목으로 상단을 먼저 그리고 본문/첨부는 조회 후 표시.
// 이전글/다음글: 목록 훅 캐시(useSelectNoticeList({}))에서 계산 — ⚠️ 상세 응답에 이전/다음 글 항목이 확정되면 그걸로 교체.
// URL 에 식별자를 두지 않는다(보안 정책) — 대상 글은 목록이 넘긴 navigate state 로만 받는다.
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { tssCmQueries } from '@/queries/tss/cm/tssCmQueries'
import { saveBlob } from '@/utils/download'
import { sanitizeHtml } from '@/utils/sanitizeHtml'
import { Badge } from '@/ui/common/base/Badge'
import { SectionDivider } from '@/ui/common/base/SectionDivider'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { showToast } from '@/stores/authStore'
import type { MockNoticeListItem } from '@/types/mock/cm'

export function NoticeDtlPage() {
  const navigate = useNavigate()
  const downloadFile = fbQueries.useDownloadFile()
  // 목록에서 넘어온 항목(state). 직접 URL/새로고침이면 대상을 알 수 없어 목록으로 되돌린다.
  const item = useLocation().state as MockNoticeListItem | null
  // 훅은 early return 앞에 — contsNo 없으면 enabled=false 라 요청이 나가지 않는다.
  const { data: detail, isError } = tssCmQueries.useSelectNoticeDtl(item?.contsNo ?? '')
  const { data: list = [] } = tssCmQueries.useSelectNoticeList({})
  if (!item) return <Navigate to={ROUTES.SUPPORT_NOTICE} replace />

  const idx = list.findIndex((x) => x.contsNo === item.contsNo)
  // 이전글/다음글은 같은 상세 라우트로 state 만 교체('.' = 현재 라우트).
  const goDetail = (target: MockNoticeListItem) => navigate('.', { state: target })
  const prevItem = idx > 0 ? list[idx - 1] : null
  const nextItem = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null

  // 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정). ⚠️ 임시 GUID(fileSn) — 백엔드 파일 GUID 확정 시 교체.
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      showToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }
  const files: FileDownloadItem[] = (detail?.files ?? []).map((f) => ({
    id: f.fileSn,
    name: f.fileName,
    size: f.fileSize,
    onDownload: () => handleDownload(f.fileSn, f.fileName),
  }))

  // 메타는 목록 항목(state)으로 먼저 그리고, 게시기간(상세에만 있음)은 조회 후 채운다.
  const metaRows = [
    { label: '작성자', value: item.wrtrNm },
    { label: '담당부서', value: item.tkcgDeptNm },
    { label: '구분', value: item.bizFldCd },
    { label: '게시기간', value: detail ? `${detail.pstgBgngYmd} ~ ${detail.pstgEndYmd}` : '-' },
  ]

  return (
    <div className="flex w-full flex-col">
      {/* 상단 — 배지(긴급+구분) + 제목 + 작성일자 (목록 카드와 동일) */}
      <div className="flex flex-col gap-krds-5 px-4 py-4">
        <div className="flex flex-wrap items-start gap-krds-5">
          <Badge type="pastel" color={item.emrg === '긴급' ? 'red' : 'blue'}>
            {item.emrg}
          </Badge>
          <Badge type="pastel" color="blue">
            {item.bizFldCd}
          </Badge>
        </div>
        <span className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
          {item.bbsTtl}
        </span>
        <span className="text-[17px] leading-normal text-krds-text-muted">{item.regDt}</span>
      </div>

      {/* 메타 — 작성자/담당부서/구분/게시기간 (설계서 slide224) */}
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

      {/* 내용(bbsCn) — 에디터 HTML(텍스트+이미지). sanitize 후 삽입, 이미지는 화면폭에 맞춤. 조회 전엔 빈 영역, 실패 시 안내. */}
      <SectionDivider />
      {isError ? (
        <p className="px-4 py-4 text-[17px] leading-normal text-krds-text-muted">
          공지사항을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      ) : (
        <div
          className="px-4 py-4 text-[17px] leading-normal text-krds-text-ink wrap-break-word [&_img]:h-auto [&_img]:max-w-full"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(detail?.bbsCn ?? '') }}
        />
      )}

      {/* 첨부파일 — 파란 바(총 N건) + 파일 목록 */}
      {files.length > 0 && (
        <div className="flex flex-col">
          <div className="flex h-14 items-center gap-krds-7 border-t border-krds-border-divider bg-krds-bg-primary-faint px-4">
            <span className="min-w-px flex-1 text-[19px] font-bold leading-normal text-krds-text-ink">
              첨부파일
            </span>
            <span className="shrink-0 text-[17px] leading-normal text-krds-text-primary-active">
              총 {files.length}건
            </span>
          </div>
          <div className="px-4 py-4">
            <FileDownloadList files={files} />
          </div>
        </div>
      )}

      {/* 이전글 / 다음글 — 제목 클릭 시 같은 상세로 state 교체 */}
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        <div className="flex flex-col gap-krds-3">
          <span className="text-[17px] leading-normal text-krds-text-muted">이전글</span>
          {prevItem ? (
            <button
              type="button"
              onClick={() => goDetail(prevItem)}
              className="truncate text-left text-[19px] font-medium leading-normal text-krds-text-ink focus-visible:outline-hidden active:opacity-70"
            >
              {prevItem.bbsTtl}
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
              {nextItem.bbsTtl}
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
NoticeDtlPage.displayName = 'NoticeDtlPage'
