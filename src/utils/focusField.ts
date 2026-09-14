// 검증 실패 시 첫 에러 필드로 포커스+스크롤 — Controller/파일/라디오처럼 RHF ref 가 없는 필드용(KWCAG 오류 정정).
// 앵커 블록(`<div id="field-…">`) 안의 첫 포커스 가능 요소를 찾아 포커스하고, 없으면 블록 자체를 포커스(tabIndex=-1).
// 스크롤은 컨테이너 기준 scrollIntoView(window.scrollTo 금지 — main#app-scroll 셸). focus 는 preventScroll 로 이중 스크롤 방지.
// 입력류(register)는 RHF shouldFocusError 가 먼저 포커스하므로, onInvalid 에서 이 함수는 "첫 에러 키"에만 호출한다.
const FOCUSABLE =
  'input:not([disabled]):not([readonly]):not([type="hidden"]),textarea:not([disabled]),select:not([disabled]),button:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function focusField(anchorId: string) {
  const block = document.getElementById(anchorId)
  if (!block) return
  const target = block.querySelector<HTMLElement>(FOCUSABLE) ?? block
  if (target === block && block.tabIndex < 0) block.tabIndex = -1
  target.focus({ preventScroll: true })
  block.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
