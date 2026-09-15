// OZ 리포트 뷰어 컴포넌트 — 통신(뷰어 스크립트 로드 · OZ 서버 호출)은 전부 이 안에서. 팝업(OzReportFullPopup)은 껍데기만.
//   OZ HTML5 JS 뷰어는 별도 화면이 아니라 "우리 페이지의 div#OZViewer 안에" 리포트를 그린다(2026-09-15 확인, 포시에스 문서).
//   흐름: html5viewer 스크립트 1회 로드 → window.SetOZParamters_OZViewer 에 접속/리포트 파라미터 등록 → start_ozjs('OZViewer', 뷰어경로).
//   div id 는 'OZViewer' 고정(뷰어 규격) → 동시에 뷰어 1개만. 요청은 OzReportRequest 하나로 고정.
// 환경변수(.env.production, 반입 시 기입): VITE_OZ_VIEWER_URL(html5viewer 폴더 URL) · VITE_OZ_SERVLET_URL(OZ 서버 서블릿 URL).
//   둘 중 하나라도 비면(개발망) 요청 정보만 보여주는 자리 화면.
// ⚠️ 반입 시 설치본으로 확인: 스크립트 파일명(OZ 버전별 상이) · 리포트 경로 규칙(.ozr) · 파라미터 방식(args N 대 inputjson) · 종료 API.
import { useEffect, useRef } from 'react'

import { Notice } from '@/ui/common/composites/Notice'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OzReportRequest } from '@/ui/biz/cm/ozReport/OzReportFullPopup'

declare global {
  interface Window {
    start_ozjs?: (viewerId: string, viewerPath: string) => void
    SetOZParamters_OZViewer?: () => void
  }
}
interface OzViewerElement extends HTMLDivElement {
  sendToActionScript?: (key: string, value: string) => void
}

const VIEWER_ID = 'OZViewer' // 뷰어 규격상 고정
const VIEWER_URL = import.meta.env.VITE_OZ_VIEWER_URL // 예: http://oz.internal/oz/html5viewer/
const SERVLET_URL = import.meta.env.VITE_OZ_SERVLET_URL // 예: http://oz.internal/oz/server
// html5viewer 폴더의 스크립트(로드 순서 중요 — jQuery → ui → dynatree → 뷰어). 설치본 파일명 기준으로 수정.
const VIEWER_SCRIPTS = ['jquery-2.0.3.min.js', 'jquery-ui.min.js', 'jquery.dynatree.js', 'OZJSViewer.js']
const VIEWER_STYLES = ['jquery-ui.css', 'ui.dynatree.css']

function loadOnce(tag: 'script' | 'link', url: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`[data-oz="${url}"]`)) return resolve()
    const el = document.createElement(tag)
    el.dataset.oz = url
    if (el instanceof HTMLScriptElement) el.src = url
    else Object.assign(el, { rel: 'stylesheet', href: url })
    el.onload = () => resolve()
    el.onerror = () => reject(new Error(`OZ 뷰어 리소스 로드 실패: ${url}`))
    document.head.appendChild(el)
  })
}

async function loadViewerAssets(base: string) {
  await Promise.all(VIEWER_STYLES.map((f) => loadOnce('link', base + f)))
  for (const f of VIEWER_SCRIPTS) await loadOnce('script', base + f) // 순차
}

/** OzReportRequest → OZ 뷰어 파라미터(connection.*) 문자열 쌍. */
function toOzParams(req: OzReportRequest): [string, string][] {
  const args = Object.entries(req.params ?? {}).filter(([, v]) => v != null)
  return [
    ['connection.servlet', SERVLET_URL],
    ['connection.reportname', req.reportId], // ⚠️ 리포트 경로 규칙(폴더/.ozr) 확정 시 여기서 조립
    ['connection.pcount', String(args.length)],
    ...args.map(([k, v], i): [string, string] => [`connection.args${i + 1}`, `${k}=${v}`]),
  ]
}

export function OzReportViewer({ request }: { request: OzReportRequest }) {
  const ref = useRef<OzViewerElement>(null)
  const ready = Boolean(VIEWER_URL && SERVLET_URL)

  useEffect(() => {
    if (!ready) return
    let alive = true
    const el = ref.current
    loadViewerAssets(VIEWER_URL)
      .then(() => {
        if (!alive || !el) return
        // 뷰어가 start 시 호출하는 콜백(SetOZParamters_{ViewerID}) — 여기서 접속/리포트 파라미터 주입.
        window.SetOZParamters_OZViewer = () => toOzParams(request).forEach(([k, v]) => el.sendToActionScript?.(k, v))
        window.start_ozjs?.(VIEWER_ID, VIEWER_URL)
      })
      .catch((e: unknown) => console.error(e))
    return () => {
      alive = false
      delete window.SetOZParamters_OZViewer
      if (el) el.innerHTML = '' // ⚠️ 뷰어 정식 종료 API(버전별) 확인 후 교체
    }
  }, [ready, request])

  if (!ready) {
    const rows: TableRow[] = [
      { label: '리포트 ID', value: request.reportId },
      ...Object.entries(request.params ?? {}).map(([k, v]) => ({ label: k, value: v == null ? '-' : String(v) })),
    ]
    return (
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        <Notice type="urgent" badgeLabel="안내" className="flex-col">
          OZ 리포트 뷰어는 폐쇄망 반입 후 연동됩니다(VITE_OZ_VIEWER_URL·VITE_OZ_SERVLET_URL 미설정). 아래 요청 정보로 리포트가 호출됩니다.
        </Notice>
        <Table rows={rows} />
      </div>
    )
  }
  return <div id={VIEWER_ID} ref={ref} className="h-full w-full" />
}
OzReportViewer.displayName = 'OzReportViewer'
