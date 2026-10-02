// 검색어 하이라이트 — 텍스트 안에서 검색어와 일치하는 부분을 굵게+파랑(text-primary-active)으로 감싼 ReactNode 반환.
// 사용처: 통합검색 결과목록(IntgSrch_Rslt) 카드 제목·부제·행 값·첨부파일명. API 배선 측도 같은 함수를 쓰면 된다.
//
// 매칭 규칙(2026-10-02 잠정 — 확정 시 toTerms/buildPattern 두 함수만 손본다):
//   · 검색어를 공백으로 나눠 단어 각각 매칭 ('K5 방독면' → 'K5', '방독면')
//   · 텍스트 안 모든 등장 위치 강조
//   · 영문 대소문자 무시
//   · 결과 내 재검색 '포함' 추가어도 keywords 배열로 함께 넘기면 같이 강조
// HTML 이 섞인 텍스트는 먼저 htmlToText(utils/sanitizeHtml) 로 평문화한 뒤 넘긴다(태그 안을 검색어로 오인하지 않게).
import type { ReactNode } from 'react'

/** 하이라이트 조각 스타일 — 결과 타이틀 "{검색어} 검색결과" 의 검색어 강조와 동일 톤. */
export const HIGHLIGHT_CLASS = 'font-bold text-krds-text-primary-active'

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// 검색어(들) → 매칭 단어 목록. 공백 분리·빈값 제거·중복 제거·긴 단어 우선(짧은 단어가 긴 단어 일부를 먼저 잘라먹지 않게).
const toTerms = (keywords: string | string[]): string[] => {
  const raw = (Array.isArray(keywords) ? keywords : [keywords]).flatMap((k) => k.split(/\s+/))
  return [...new Set(raw.filter(Boolean))].sort((a, b) => b.length - a.length)
}

const buildPattern = (terms: string[]) => new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')

/**
 * text 안의 keywords 일치 부분을 <span className={HIGHLIGHT_CLASS}> 로 감싼다. 검색어가 비면 text 그대로.
 * @param text 평문(HTML 아님 — htmlToText 적용 후)
 * @param keywords 검색어 또는 검색어 배열(결과 내 재검색 추가어 등)
 */
export function highlightText(text: string, keywords: string | string[]): ReactNode {
  const terms = toTerms(keywords)
  if (!text || terms.length === 0) return text
  const parts = text.split(buildPattern(terms))
  if (parts.length === 1) return text
  // split 에 캡처 그룹이 있어 홀수 인덱스가 매칭 조각이다.
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className={HIGHLIGHT_CLASS}>
        {part}
      </span>
    ) : (
      part
    ),
  )
}
