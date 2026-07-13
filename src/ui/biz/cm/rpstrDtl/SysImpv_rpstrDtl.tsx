// 시스템개선안내상세 — MUI-CM-04-M32(slide231). 자료실 그룹이나 항목명은 공지형 + 게시기간 있음(긴급 없음).
// 공유 BoardDetailView 직접 조립(자료실 뷰와 필드가 달라 별도). 이전글/다음글은 SYSIMPV_MOCK에서 계산.
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { Badge } from '@/ui/common/base/Badge'
import { BoardDetailView } from '@/ui/biz/cm/board/BoardDetailView'
import type { FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { SYSIMPV_MOCK, toSysImpvDetail } from '@/ui/biz/cm/rpstrList/rpstrMock'
import type { SysImpvListItem } from '@/types/notice'

export function SysImpv_rpstrDtl() {
  const navigate = useNavigate()
  const { contsNo } = useParams<{ contsNo: string }>()
  const stateItem = useLocation().state as SysImpvListItem | null
  const item = stateItem ?? SYSIMPV_MOCK.find((x) => x.contsNo === contsNo) ?? SYSIMPV_MOCK[0]
  const detail = toSysImpvDetail(item)

  const idx = SYSIMPV_MOCK.findIndex((x) => x.contsNo === item.contsNo)
  const goDetail = (target: SysImpvListItem) =>
    navigate(`${ROUTES.SUPPORT_SYS_IMPV}/${target.contsNo}`, { state: target })
  const prevItem = idx > 0 ? SYSIMPV_MOCK[idx - 1] : null
  const nextItem = idx >= 0 && idx < SYSIMPV_MOCK.length - 1 ? SYSIMPV_MOCK[idx + 1] : null

  const files: FileDownloadItem[] = detail.files.map((f) => ({
    id: f.fileSn,
    name: f.fileName,
    size: f.fileSize,
    onDownload: () => console.log('[SysImpvDtl] 첨부 다운로드', f.fileSn),
  }))

  return (
    <BoardDetailView
      badges={
        <Badge type="pastel" color="blue">
          {item.bizFldCd}
        </Badge>
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
SysImpv_rpstrDtl.displayName = 'SysImpv_rpstrDtl'
