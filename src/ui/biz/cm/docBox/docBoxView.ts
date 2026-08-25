// 문서함(MUI-CM-06) 목록/상세 공통 표시 헬퍼 — DocBoxItem 한 건을 카드/요약 표시요소로 변환.
// 목록(DocBoxPage 카드)과 상세(DocBoxDtlPage 요약)가 동일하게 배지·기관라인·일자행을 그리므로
// 갈라지면 안 되는 파생 로직만 여기서 공유한다(마크업은 각 화면이 소유 — CLAUDE.md 컨벤션).
import type { DocBoxItem } from '@/types/mock/cm'

export interface DocBadge {
  label: string
  color: 'blue' | 'red' | 'green' | 'yellow'
}

/** 카드/요약 상단 배지 — 문서구분(반려=red, 그 외 blue) + 첨언(green) + 첨부(yellow). */
export function docBadges(item: DocBoxItem): DocBadge[] {
  const list: DocBadge[] = [
    { label: item.docSeNm, color: item.docSeCd === 'rejected' ? 'red' : 'blue' },
  ]
  if (item.addCn) list.push({ label: '첨언', color: 'green' })
  if (item.edmsDocId) list.push({ label: '첨부', color: 'yellow' })
  return list
}

/** 기관 라인(subtitle) — 받은=송신처 / 보낸=수신처 / 반려=반려처 / 임시=없음. */
export function docOrgLine(item: DocBoxItem): string | undefined {
  switch (item.docSeCd) {
    case 'received':
      return item.trsmOgnzCd ? `송신처 - ${item.trsmOgnzCd}` : undefined
    case 'sent':
      return item.rcptnOgnzCd ? `수신처 - ${item.rcptnOgnzCd}` : undefined
    case 'rejected':
      return item.trsmOgnzCd ? `반려처 - ${item.trsmOgnzCd}` : undefined
    case 'temp':
      return undefined
  }
}

/** 카드/요약 일자 행 — 문서구분별 라벨/값(설계서 slide90 카드 표기 그대로). */
export function docDateRows(item: DocBoxItem): { label: string; value: string }[] {
  switch (item.docSeCd) {
    case 'received':
      return [
        { label: '도착일', value: item.rcptnDt ?? '-' },
        { label: '수신일', value: item.rcptIdntyDt ?? '-' },
      ]
    case 'sent':
      return [
        { label: '송신일', value: item.docWrtDt ?? '-' },
        { label: '확인일', value: item.rcptIdntyDt ?? '-' },
      ]
    case 'temp':
      return [{ label: '작성일', value: item.wrtYmd ?? '-' }]
    case 'rejected':
      // 반려받은(rjctYn='N') = 도착일/수신일, 반려한(rjctYn='Y') = 반려일/반려자.
      return item.rjctYn === 'Y'
        ? [
            { label: '반려일', value: item.docWrtDt ?? '-' },
            { label: '반려자', value: item.rturId ?? '-' },
          ]
        : [
            { label: '도착일', value: item.rcptnDt ?? '-' },
            { label: '수신일', value: item.rcptIdntyDt ?? '-' },
          ]
  }
}
