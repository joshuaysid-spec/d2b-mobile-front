// 문서함 상세 (MUI-CM-06-M11 DocBoxDtlPage). 설계서 00.공통 v0.84 slide92.
// 웹경로: 메인 홈 > 마이페이지 > 문서함 > 문서함 상세.
// 구성: 상단 요약(SummaryInfo, 스크롤 시 축소 + sticky) + 탭(TabList) + 탭 콘텐츠(탭별 컴포넌트 분리).
//   탭은 "추가 정보가 발생하는 경우"에만 노출(설계서) — 문서정보(T01) 항상, 첨언(T02)/반려사유/첨부파일(T03)은
//   해당 데이터가 있을 때만. 순서: 문서정보 → 첨언 → 반려사유 → 첨부파일(slide92).
// 상단은 목록에서 넘어온 항목(navigate state)으로 그리고(없으면 페이지 fallback 목업),
//   본문(문서내용/첨부목록)은 페이지 목업으로 보완. 백엔드 미연동(폐쇄망) — service 스텁 없음(CLAUDE.md).
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useCollapsibleHeader } from '@/hooks/useCollapsibleHeader'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { DocBoxDtl_Info } from '@/ui/biz/cm/docBoxDtl/DocBoxDtl_Info'
import { DocBoxDtl_AtchOpnn } from '@/ui/biz/cm/docBoxDtl/DocBoxDtl_AtchOpnn'
import { DocBoxDtl_Atch } from '@/ui/biz/cm/docBoxDtl/DocBoxDtl_Atch'
import { docBadges, docOrgLine, docDateRows } from '@/ui/biz/cm/docBox/docBoxView'
import type { DocBoxItem, DocBoxAtchFile } from '@/types/mock/cm'

// 직접 URL 진입(목록 state 없음) 대비 fallback 목업 — 설계서 dl_rcptnDocBoxList 항목명/형식 그대로.
const MOCK_DOC_DETAIL: DocBoxItem = {
  id: '0',
  docSeCd: 'received',
  docSeNm: '받은 문서',
  docNm: '2026년 K5방독면 구매 계약 통보서',
  trsmOgnzCd: '방위사업청',
  rcptnDt: '2026-03-10',
  rcptIdntyDt: '2026-03-11',
  addCn: '납품 일정 관련 협의가 필요하니 담당자에게 연락 바랍니다.',
  edmsDocId: 'EDMS20260310001',
}

// 본문(문서 내용) 목업 — 설계서 slide93 "문서 내용 1~6" 형식(데이터영역 미정의, 상세 표시용). ⚠️ 잠정.
const MOCK_DOC_CN = `1. 계약명: 2026년 K5방독면 구매
2. 계약방법: 수의계약
3. 계약금액: 225,337,550원
4. 납품기한: 2026-06-30
5. 납품장소: 화력총괄계약팀 지정 장소
6. 기타: 세부 사항은 첨부파일을 참고하시기 바랍니다.`

// 첨부문서 목업 — 첨부문서다운로드 데이터영역(dl_atchDocList) 형식.
const MOCK_ATCH_FILES: DocBoxAtchFile[] = [
  { fileTtl: '계약통보서', fileNm: '계약통보서.hwp', fileSize: '786KB', edmsDocId: 'EDMS20260310001-1' },
  { fileTtl: '품목명세서', fileNm: '품목명세서.pdf', fileSize: '1.2MB', edmsDocId: 'EDMS20260310001-2' },
]

export function DocBoxDtlPage() {
  const [tab, setTab] = useState('info')
  // 스크롤 시 상단 요약 블록 축소 + sticky (로직은 훅에서 — overflow-anchor 진동방지 포함).
  const { collapsed, rootRef, scrollToTop, goToContentTop } = useCollapsibleHeader()

  // 목록 → 상세 데이터 전달: navigate(state)로 넘어온 항목으로 상단을 그린다(없으면 페이지 목업).
  const detail = (useLocation().state as DocBoxItem | null) ?? MOCK_DOC_DETAIL

  // 탭 구성 — 문서정보 항상. 첨언/반려사유/첨부파일은 데이터가 있을 때만(설계서 "추가 정보 발생 시 탭 표시").
  const tabs: TabItem[] = [{ value: 'info', label: '문서정보' }]
  if (detail.addCn) tabs.push({ value: 'opinion', label: '첨언 상세보기' })
  if (detail.rjctRsn) tabs.push({ value: 'reject', label: '반려사유' })
  if (detail.edmsDocId) tabs.push({ value: 'file', label: '첨부파일' })
  // 노출 탭이 줄어 현재 탭이 사라진 경우(방어) 첫 탭으로.
  const activeTab = tabs.some((t) => t.value === tab) ? tab : 'info'

  function renderTabContent(value: string) {
    switch (value) {
      case 'info':
        return <DocBoxDtl_Info docCn={MOCK_DOC_CN} />
      case 'opinion':
        return <DocBoxDtl_AtchOpnn addCn={detail.addCn ?? ''} />
      case 'reject':
        // 반려사유(rjctRsn) — 별도 화면 ID 없어 페이지 인라인(도메인 전용 조립물).
        return (
          <div className="flex w-full flex-col">
            <PageTitle>반려사유</PageTitle>
            <div className="px-4 pb-6">
              <p className="whitespace-pre-line text-krds-body-md leading-relaxed text-krds-text-ink">
                {detail.rjctRsn}
              </p>
            </div>
          </div>
        )
      case 'file':
        return <DocBoxDtl_Atch files={MOCK_ATCH_FILES} />
      default:
        return null
    }
  }

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      {/* 상단 블록 — sticky 고정. 스크롤 시 요약이 축소(높이 0)되며 탭만 남는다.
          축소 시 하단 divider 노출(색만 transparent↔divider 전환 — 1px 점프 방지). */}
      <div
        className={`sticky top-0 z-20 border-b bg-white transition-colors ${
          collapsed ? 'border-krds-border-divider' : 'border-transparent'
        }`}
      >
        <SummaryInfo
          collapsed={collapsed}
          badges={docBadges(detail).map((b) => ({ label: b.label, color: b.color }))}
          subtitle={docOrgLine(detail)}
          title={detail.docNm}
          rows={docDateRows(detail)}
        />

        {/* 탭 — 노출 탭이 2개 이상일 때만(단일 탭이면 굳이 표시 안 함). */}
        {tabs.length > 1 && (
          <div className="px-4">
            <TabList
              value={activeTab}
              onChange={(next) => {
                setTab(next)
                goToContentTop()
              }}
              items={tabs}
              scrollButtons="auto"
            />
          </div>
        )}
      </div>

      {/* 탭 콘텐츠 — 짧은 탭도 헤더 접힘을 지탱할 스크롤 높이 확보(진동 방지, 상세화면 공통). */}
      <div className="min-h-[100dvh]">{renderTabContent(activeTab)}</div>

      {/* 맨위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton className="fixed bottom-0 right-4 z-40" onTop={scrollToTop} />
    </div>
  )
}
DocBoxDtlPage.displayName = 'DocBoxDtlPage'
