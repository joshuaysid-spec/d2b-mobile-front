// 조달계획 상세 - '계약특수조건' 탭 콘텐츠 (MUI-OP-01-M08, Figma 9300-42505 / 42708[스크롤]).
// 제목(PageTitle) + 조항(제N조) 목록 — 각 조 = 헤딩 + 본문 + 일부 번호 리스트.
// 법조문 텍스트라 정적 렌더(List 컴포지트는 Switch/Button 설정행용이라 부적합). 목업 — 추후 API.

interface Article {
  heading: string
  /** 본문(리스트 앞 문단) */
  body?: string
  /** 번호 항목들(각 항목 텍스트에 '1)' 등 마커 포함) */
  items?: string[]
}

// 목업 (문서/Figma M08 [물품] 예시 본문)
const ARTICLES: Article[] = [
  {
    heading: '제1조 (총칙)',
    body: '본 특수조건은 육군 중앙계약관과 계약당사자간에 체결하는 "인쇄재료 구매"에 적용한다.',
  },
  {
    heading: '제2조 (계약당사자의 표시)',
    body: '본 특수조건에서 사용하는 용어의 정의는 다음과 같다.',
    items: [
      "1) 계약담당공무원: '갑'이라 한다.",
      "2) 계약상대자: '을'이라 한다.",
      '3) 기타 본 특수조건에서 사용하는 용어의 정의는 물품구매계약 일반조건 제2조에서 정하는 바에 의한다.',
    ],
  },
  {
    heading: '제3조 (계약담당공무원의 업무분장)',
    body: "'갑'중 육군 중앙계약관은 계약의 체결, 수정계약 및 계약의 해제·해지행위만 수행하며 기타 계약과 관련한 모든 업무는 집행부대 재무관이 수행한다.",
  },
  {
    heading: '제4조 (계약문서)',
    body: '본 특수조건에서 사용하는 용어의 정의는 다음과 같다.',
    items: [
      '1) 특수조건과 다른 계약문서에서 이 특수조건과 달리 정한 사항에 대하여는 이 특수조건에서 정하는 바에 따른다.',
      "2) '을'이 제출한 입찰 서류와 자료의 내용은 계약문서에 준하는 효력을 가지며 '을'은 이에 구속된다. 다만 동일한 사항에 대하여는 계약문서가 우선한다.",
    ],
  },
  {
    heading: '제5조 (납품예정일자의 통지)',
    body: '본 특수조건에서 사용하는 용어의 정의는 다음과 같다.',
    items: [
      "1) '을'은 6근무일 이전까지 납품예정 도착일시를 납지부대에 통지하여야 한다.",
      '2) 계약상의 납기일에 납품하고자 할 경우 사전에 시험성적서 발급기관과 협의하여 납품에 차질이 없도록 하여야 한다. (문의처: 자재담당관 상사 원광식 TEL : 042)550-7465)',
    ],
  },
  {
    heading: '제6조 (보증 및 납품)',
    body: '본 특수조건에서 사용하는 용어의 정의는 다음과 같다.',
    items: [
      "1) '을'은 검수와 별도로 검수 후 1년간 납품한 물품의 규격과 품질이 계약내용과 동일함을 보증하여야 한다.",
      "2) 납품 후 보증기간 내에 납품된 물품의 규격과 품질이 계약내용과 상이함이 발견된 때 '갑'은 그 사실을 '을'에게 통지하고 상당한 기간을 정하여 당해물품의 보수, 대체납품 또는 당해 물품대금의 반환을 청구할 수 있다. 이때 발생되는 제반 경비는 '을'이 부담한다.",
      "3) '을'은 인쇄용지류는 수입지 또는 하급지의 납품은 불가하며, 품절 발생 시 반품 및 재납품을 한다. 이때 발생되는 제반 경비는 '을'이 부담한다.",
      "4) '을'은 바인더·사스 직물은 담당관과 사전 협의 후 납품한다.",
      '5) 포장박스는 DW-1호로 제작하여 납품 BOX로 하여야 한다.',
    ],
  },
]

export function PrcmPlanDtl_spclCtrt() {
  return (
    <div className="flex flex-col gap-krds-7 pb-6">

      <div className="flex flex-col gap-6 px-4">
        {ARTICLES.map((article) => (
          <section key={article.heading} className="flex flex-col gap-2">
            <h3 className="text-[17px] font-bold leading-normal text-krds-text-ink">
              {article.heading}
            </h3>
            {article.body && (
              <p className="text-[17px] leading-relaxed text-krds-text-ink">{article.body}</p>
            )}
            {article.items && article.items.length > 0 && (
              <ul className="flex flex-col gap-1">
                {article.items.map((item) => (
                  <li
                    key={item}
                    className="text-[17px] leading-relaxed text-krds-text-ink"
                    // 번호 마커 hanging indent — 줄바꿈 시 본문이 마커에 맞춰 들여쓰기
                    style={{ paddingLeft: '1.25rem', textIndent: '-1.25rem' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
PrcmPlanDtl_spclCtrt.displayName = 'PrcmPlanDtl_spclCtrt'
