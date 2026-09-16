// 시스템개선안내상세 — MUI-CM-04-M36(설계서 slide231). Figma 10020-82258.
// 게시판 상세는 화면별로 마크업을 각자 소유한다(공유 BoardDetailView 폐기 — 2026-09-10 사용자 확정).
// 자료실 그룹이나 항목명은 공지형 + 게시기간 있음(긴급 없음). 구성: 상단(배지 구분 / 제목 / 작성일자)
//   → 메타(작성자/담당부서/구분/게시기간) → 내용(bbsCn, 에디터 HTML — 텍스트+이미지, sanitizeHtml 후 삽입)
//   → 첨부파일(총 N건) → 이전글/다음글. 이전글/다음글은 SYSIMPV_MOCK에서 계산.
// URL 에 식별자를 두지 않는다(보안 정책) — 대상 글은 목록이 넘긴 navigate state 로만 받는다.
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { sanitizeHtml } from '@/utils/sanitizeHtml'
import { Badge } from '@/ui/common/base/Badge'
import { SectionDivider } from '@/ui/common/base/SectionDivider'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { showToast } from '@/stores/authStore'
import { SYSIMPV_MOCK, toSysImpvDetail } from '@/ui/biz/cm/rpstrList/rpstrMock'
import type { MockSysImpvListItem } from '@/types/mock/cm'

export function SysImpv_rpstrDtl() {
  const navigate = useNavigate()
  const downloadFile = fbQueries.useDownloadFile()
  // 목록에서 넘어온 항목(state). 직접 URL/새로고침이면 대상을 알 수 없어 목록으로 되돌린다.
  const item = useLocation().state as MockSysImpvListItem | null
  if (!item) return <Navigate to={ROUTES.SUPPORT_SYS_IMPV} replace />
  const detail = toSysImpvDetail(item)

  const idx = SYSIMPV_MOCK.findIndex((x) => x.contsNo === item.contsNo)
  // 이전글/다음글은 같은 상세 라우트로 state 만 교체('.' = 현재 라우트).
  const goDetail = (target: MockSysImpvListItem) => navigate('.', { state: target })
  const prevItem = idx > 0 ? SYSIMPV_MOCK[idx - 1] : null
  const nextItem = idx >= 0 && idx < SYSIMPV_MOCK.length - 1 ? SYSIMPV_MOCK[idx + 1] : null

  // 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정). ⚠️ 임시 GUID(fileSn) — 백엔드 파일 GUID 확정 시 교체.
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      showToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }
  const files: FileDownloadItem[] = detail.files.map((f) => ({
    id: f.fileSn,
    name: f.fileName,
    size: f.fileSize,
    onDownload: () => handleDownload(f.fileSn, f.fileName),
  }))

  const metaRows = [
    { label: '작성자', value: detail.wrtrNm },
    { label: '담당부서', value: detail.tkcgDeptNm },
    { label: '구분', value: detail.bizFldCd },
    { label: '게시기간', value: `${detail.pstgBgngYmd} ~ ${detail.pstgEndYmd}` },
  ]

  return (
    <div className="flex w-full flex-col">
      {/* 상단 — 배지(구분) + 제목 + 작성일자 (목록 카드와 동일) */}
      <div className="flex flex-col gap-krds-5 px-4 py-4">
        <div className="flex flex-wrap items-start gap-krds-5">
          <Badge type="pastel" color="blue">
            {item.bizFldCd}
          </Badge>
        </div>
        <span className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
          {detail.bbsTtl}
        </span>
        <span className="text-[17px] leading-normal text-krds-text-muted">{item.regDt}</span>
      </div>

      {/* 메타 — 작성자/담당부서/구분/게시기간 */}
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

      {/* 내용(bbsCn) — 에디터 HTML(텍스트+이미지). sanitize 후 삽입, 이미지는 화면폭에 맞춤. */}
      <SectionDivider />
      <div
        className="px-4 py-4 text-[17px] leading-normal text-krds-text-ink wrap-break-word [&_img]:h-auto [&_img]:max-w-full"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(detail.bbsCn) }}
      />

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
SysImpv_rpstrDtl.displayName = 'SysImpv_rpstrDtl'
