// 공지사항 상세 공유 뷰 — 일반/방위사업청/수요부대별(MUI-CM-04-M02·M22·M24)이 dm_noticeInfo 동일.
// 각 상세 페이지는 자기 목록 목업(mock)과 base(목록 라우트)만 주입한다. 이전글/다음글은 mock에서 계산.
// URL 에 식별자를 두지 않는다(보안 정책) — 대상 글은 목록이 넘긴 navigate state 로만 받는다.
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { Badge } from '@/ui/common/base/Badge'
import { BoardDetailView } from '@/ui/biz/cm/board/BoardDetailView'
import type { FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { toNoticeDetail } from '@/ui/biz/cm/noticeList/noticeMock'
import type { NoticeListItem } from '@/types/cm'

export function NoticeDtlView({ mock, base }: { mock: NoticeListItem[]; base: string }) {
  const navigate = useNavigate()
  // 상단 즉시표시: 목록에서 넘어온 항목(state). 직접 URL/새로고침이면 대상을 알 수 없어 목록으로 되돌린다.
  const item = useLocation().state as NoticeListItem | null
  if (!item) return <Navigate to={base} replace />
  const detail = toNoticeDetail(item)

  const idx = mock.findIndex((x) => x.contsNo === item.contsNo)
  // 이전글/다음글은 같은 상세 라우트로 state 만 교체('.' = 현재 라우트 — 게시판별 경로를 따로 안 받아도 됨).
  const goDetail = (target: NoticeListItem) => navigate('.', { state: target })
  const prevItem = idx > 0 ? mock[idx - 1] : null
  const nextItem = idx >= 0 && idx < mock.length - 1 ? mock[idx + 1] : null

  const files: FileDownloadItem[] = detail.files.map((f) => ({
    id: f.fileSn,
    name: f.fileName,
    size: f.fileSize,
    onDownload: () => console.log('[NoticeDtl] 첨부 다운로드', f.fileSn),
  }))

  return (
    <BoardDetailView
      badges={
        <>
          <Badge type="pastel" color={item.emrg === '긴급' ? 'red' : 'blue'}>
            {item.emrg}
          </Badge>
          <Badge type="pastel" color="blue">
            {item.bizFldCd}
          </Badge>
        </>
      }
      title={detail.bbsTtl}
      date={item.regDt}
      metaRows={[
        { label: '작성자', value: detail.wrtrNm },
        { label: '담당부서', value: detail.tkcgDeptNm },
        { label: '구분', value: detail.bizFldCd },
        { label: '게시기간', value: `${detail.pstgBgngYmd} ~ ${detail.pstgEndYmd}` },
      ]}
      content={detail.bbsCn}
      files={files}
      prev={prevItem ? { title: prevItem.bbsTtl, onClick: () => goDetail(prevItem) } : null}
      next={nextItem ? { title: nextItem.bbsTtl, onClick: () => goDetail(nextItem) } : null}
    />
  )
}
NoticeDtlView.displayName = 'NoticeDtlView'
