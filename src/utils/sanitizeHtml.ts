// 게시판 본문(에디터 HTML — bbsCn/contsCn) 정화. 백엔드 에디터가 내려주는 HTML 을 그대로 삽입하면
// XSS 경계가 뚫리므로 스크립트·이벤트 핸들러·javascript: URL 을 제거하고 서식/이미지/표만 남긴다.
// 사용처: 게시판 상세 8화면(공지 3·자료실 3·시스템개선·FAQ) 의 dangerouslySetInnerHTML.
import DOMPurify from 'dompurify'

export const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
