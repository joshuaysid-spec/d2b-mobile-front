// 시스템개선안내상세 — MUI-CM-04-M36(slide231). 자료실 그룹이나 항목명은 공지형 + 게시기간 있음(긴급 없음).
// 공유 BoardDetailView 직접 조립(자료실 뷰와 필드가 달라 별도). 이전글/다음글은 SYSIMPV_MOCK에서 계산.
// URL 에 식별자를 두지 않는다(보안 정책) — 대상 글은 목록이 넘긴 navigate state 로만 받는다.
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { Badge } from '@/ui/common/base/Badge'
import { BoardDetailView } from '@/ui/biz/cm/board/BoardDetailView'
import type { FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { Toast } from '@/ui/common/composites/Toast'
import { SYSIMPV_MOCK, toSysImpvDetail } from '@/ui/biz/cm/rpstrList/rpstrMock'
import type { MockSysImpvListItem } from '@/types/mock/cm'

export function SysImpv_rpstrDtl() {
  const navigate = useNavigate()
  const downloadFile = fbQueries.useDownloadFile()
  const [toast, setToast] = useState<string | null>(null) // 다운로드 실패 토스트(null=닫힘)
  const item = useLocation().state as MockSysImpvListItem | null
  if (!item) return <Navigate to={ROUTES.SUPPORT_SYS_IMPV} replace />
  const detail = toSysImpvDetail(item)

  const idx = SYSIMPV_MOCK.findIndex((x) => x.contsNo === item.contsNo)
  const goDetail = (target: MockSysImpvListItem) => navigate('.', { state: target })
  const prevItem = idx > 0 ? SYSIMPV_MOCK[idx - 1] : null
  const nextItem = idx >= 0 && idx < SYSIMPV_MOCK.length - 1 ? SYSIMPV_MOCK[idx + 1] : null

  // 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정) — CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
  // ⚠️ 임시 GUID(fileSn) — 백엔드 응답에 파일 GUID 확정 시 교체.
  const handleDownload = async (guid: string, fileNm: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(guid), fileNm)
    } catch {
      setToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  const files: FileDownloadItem[] = detail.files.map((f) => ({
    id: f.fileSn,
    name: f.fileName,
    size: f.fileSize,
    onDownload: () => handleDownload(f.fileSn, f.fileName),
  }))

  return (
    <>
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

    {/* 다운로드 실패 토스트 */}
    <Toast open={toast !== null} onClose={() => setToast(null)} duration={2000}>
      {toast}
    </Toast>
    </>
  )
}
SysImpv_rpstrDtl.displayName = 'SysImpv_rpstrDtl'
