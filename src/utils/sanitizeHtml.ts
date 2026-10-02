// 게시판 본문(에디터 HTML — bbsCn/contsCn) 정화. 백엔드 에디터가 내려주는 HTML 을 그대로 삽입하면
// XSS 경계가 뚫리므로 스크립트·이벤트 핸들러·javascript: URL 을 제거하고 서식/이미지/표만 남긴다.
// 사용처: 게시판 상세 8화면(공지 3·자료실 3·시스템개선·FAQ) 의 dangerouslySetInnerHTML.
import DOMPurify from 'dompurify'

export const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })

/**
 * HTML 이 섞인 문자열을 평문으로 — 태그 제거 · `<br>`/블록 경계는 공백 · `&amp;` 등 엔티티 디코딩 · 연속 공백 정리.
 * 1줄/2줄 말줄임 카드(통합검색 결과 등)처럼 줄바꿈 대신 공백이 자연스러운 곳에 쓴다.
 * script/style 내용은 DOMPurify 가 버리므로 텍스트에 섞이지 않는다. 평문(태그 없음)을 넣으면 그대로 돌아온다.
 */
export const htmlToText = (html: string): string => {
  if (!html) return ''
  const spaced = html.replace(/<\/?(br|p|div|li|tr|h[1-6])\b[^>]*>/gi, ' ')
  const body = DOMPurify.sanitize(spaced, { ALLOWED_TAGS: [], KEEP_CONTENT: true, RETURN_DOM: true })
  return (body.textContent ?? '').replace(/\s+/g, ' ').trim()
}
