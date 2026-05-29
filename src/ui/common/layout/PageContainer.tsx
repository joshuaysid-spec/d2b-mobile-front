import type { ReactNode } from 'react'

interface PageContainerProps {
  title: string
  children?: ReactNode
}

// frontend-architecture.md §10.1 — 페이지 공통 컨테이너 (제목 + 본문 패딩)
export function PageContainer({ title, children }: PageContainerProps) {
  return (
    <section className="px-4 py-5">
      <h1 className="mb-4 text-xl font-bold text-foreground">{title}</h1>
      {children}
    </section>
  )
}
