// 문서함 상세 - '문서정보' 탭 콘텐츠 (MUI-CM-06-T01). 설계서 00.공통 v0.84 slide93.
// 상단 요약(송신처/문서명/일자)은 페이지(DocBoxDtlPage)의 sticky SummaryInfo 가 담당하고,
// 이 탭은 문서 본문(문서 내용)을 표시한다("콘텐츠 표시").
// 데이터는 페이지 목업(docCn) — 추후 API(cmService.selectDocBoxDetail)로 대체.

/** 문서 내용(docCn) — 페이지가 상세 목업으로 주입. ⚠️ 데이터영역 미정의(화면 '문서 내용' 표기) — 잠정. */
export function DocBoxDtl_Info({ docCn }: { docCn: string }) {
  return (
    <div className="flex w-full flex-col">
      <div className="px-4 pt-4 pb-6">
        <p className="whitespace-pre-line text-krds-body-md leading-relaxed text-krds-text-ink">
          {docCn}
        </p>
      </div>
    </div>
  )
}
DocBoxDtl_Info.displayName = 'DocBoxDtl_Info'
