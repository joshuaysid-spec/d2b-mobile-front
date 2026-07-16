// 문서함 상세 - '첨언 상세보기' 탭 콘텐츠 (MUI-CM-06-T02). 설계서 00.공통 v0.84 slide94·97.
// 첨언(dm_addCnInfo.addCn) 상세 내용을 표시. 첨언이 있는 문서에서만 탭이 노출된다(페이지가 분기).
// 첨언 텍스트는 목록 아이템(DocBoxItem.addCn)에서 그대로 전달받는다(설계서 목록 데이터영역에 존재).
import { PageTitle } from '@/ui/common/base/PageTitle'

/** 첨언(addCn) — 페이지가 상세 항목에서 주입. */
export function DocBoxDtl_AtchOpnn({ addCn }: { addCn: string }) {
  return (
    <div className="flex w-full flex-col">
      <PageTitle>첨언 상세보기</PageTitle>
      <div className="px-4 pb-6">
        <p className="whitespace-pre-line text-krds-body-md leading-relaxed text-krds-text-ink">
          {addCn}
        </p>
      </div>
    </div>
  )
}
DocBoxDtl_AtchOpnn.displayName = 'DocBoxDtl_AtchOpnn'
