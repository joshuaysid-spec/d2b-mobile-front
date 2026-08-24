// 파일 다운로드 저장 유틸 — Blob(바이너리 응답)을 브라우저 "다운로드"로 저장시키는 공용 함수.
// 사용처: 첨부서류 탭들의 다운로드(useDownloadFile 훅 응답 Blob) — 앱 전체가 이 유틸 하나만 쓴다.
//
// 왜 유틸로 모으나:
//   1) Blob → 저장 트리거(createObjectURL + <a download> 클릭) 보일러플레이트 제거.
//   2) ⚠️ 하이브리드 앱 WebView 에서는 blob: URL 다운로드가 OS 다운로드 매니저로 안 넘어가는
//      경우가 흔하다 — 앱 브리지(네이티브 저장 위임) 방식이 확정되면 "이 함수 안에서만" 분기하면
//      전 화면이 함께 전환된다(화면별 수정 불필요).

/**
 * Blob 을 지정한 파일명으로 저장(다운로드 트리거).
 * @param blob     서버 응답 바이너리 (useDownloadFile 훅 / fbService.download 반환값)
 * @param fileName 저장 파일명 — 조회 목록의 원본 파일명(orgnlFileNm/fileNm)을 그대로 넘긴다.
 *                 (Content-Disposition 헤더 파싱 대신 목록 파일명 사용 — 단순·충분)
 */
export function saveBlob(blob: Blob, fileName: string) {
  // TODO(웹뷰 브리지): 앱 탑재 후 네이티브 저장 위임이 필요하면 여기서 분기.
  //   예) if (window.AppBridge?.saveFile) return window.AppBridge.saveFile(await blob.arrayBuffer(), fileName)

  // Blob 에 임시 URL 을 부여하고, 숨은 <a download> 클릭으로 브라우저 다운로드를 발동시킨다.
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  // 임시 URL 해제 — 누수 방지. (click 은 동기 발동이라 즉시 해제해도 저장에 영향 없음)
  URL.revokeObjectURL(url)
}
