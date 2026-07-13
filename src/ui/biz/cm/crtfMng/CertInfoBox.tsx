// 인증서 가져오기/내보내기 안내 박스 — 타이틀 없는 연파랑 불릿 박스(Figma 인포박스).
// 불릿 스타일은 공통 Infobox 본문과 동일(text-info slate + 4px dot).
export function CertInfoBox({ items }: { items: string[] }) {
  return (
    <div className="flex w-full flex-col gap-krds-5 bg-krds-bg-blue-pastel px-4 py-4">
      {items.map((text, i) => (
        <div key={i} className="flex gap-krds-5 text-[17px] leading-normal text-krds-text-info">
          <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-krds-text-info" />
          <span className="min-w-px flex-1 wrap-break-word">{text}</span>
        </div>
      ))}
    </div>
  )
}
CertInfoBox.displayName = 'CertInfoBox'
