// 자료실 상세 공유 뷰 — 일반/수요부대별/계약관련서식(MUI-CM-04-M26·M28·M30)이 dm_rpstrInfo 동일.
// 공지 상세와 달리 긴급·게시기간 없음(배지=구분만, 메타=작성자/담당부서/구분). 이전글/다음글은 mock에서 계산.
// URL 에 식별자를 두지 않는다(보안 정책) — 대상 글은 목록이 넘긴 navigate state 로만 받는다.
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { Badge } from '@/ui/common/base/Badge'
import { BoardDetailView } from '@/ui/biz/cm/board/BoardDetailView'
import type { FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { toRpstrDetail } from '@/ui/biz/cm/rpstrList/rpstrMock'
import type { MockRpstrListItem } from '@/types/mock/cm'

export function RpstrDtlView({
  mock,
  base,
  deptNm,
}: {
  mock: MockRpstrListItem[]
  base: string
  /** 담당부서(deptNm) — 목록에 없어 상세 목업으로 보완. 게시판별로 주입. */
  deptNm?: string
}) {
  const navigate = useNavigate()
  const item = useLocation().state as MockRpstrListItem | null
  if (!item) return <Navigate to={base} replace />
  const detail = toRpstrDetail(item, deptNm)

  const idx = mock.findIndex((x) => x.contsNo === item.contsNo)
  // 이전글/다음글은 같은 상세 라우트로 state 만 교체('.' = 현재 라우트 — 게시판별 경로를 따로 안 받아도 됨).
  const goDetail = (target: MockRpstrListItem) => navigate('.', { state: target })
  const prevItem = idx > 0 ? mock[idx - 1] : null
  const nextItem = idx >= 0 && idx < mock.length - 1 ? mock[idx + 1] : null

  const files: FileDownloadItem[] = detail.files.map((f) => ({
    id: f.fileSn,
    name: f.fileName,
    size: f.fileSize,
    onDownload: () => console.log('[RpstrDtl] 첨부 다운로드', f.fileSn),
  }))

  return (
    <BoardDetailView
      badges={
        <Badge type="pastel" color="blue">
          {item.bizFldCd}
        </Badge>
      }
      title={detail.rpstrTtl}
      date={item.regDt}
      metaRows={[
        { label: '작성자', value: detail.wrtrNm },
        { label: '담당부서', value: detail.deptNm },
        { label: '구분', value: detail.bizFldCd },
      ]}
      content={detail.contsCn}
      files={files}
      prev={prevItem ? { title: prevItem.rpstrTtl, onClick: () => goDetail(prevItem) } : null}
      next={nextItem ? { title: nextItem.rpstrTtl, onClick: () => goDetail(nextItem) } : null}
    />
  )
}
RpstrDtlView.displayName = 'RpstrDtlView'
