// 입찰포기신청서작성 — 설계서 영문 화면ID MUI-BD-03-P03 (slide108 기준).
// Figma 는 참고만, 내용(항목명·코드값·형식)은 설계서대로.
// 바텀시트 콘텐츠 전용(컨테이너는 부모 소유) — 부모가 BottomSheet(title/footer/open/onOpenChange)를
// 소유하고, 이 컴포넌트는 본문만 렌더한다. footer '제출하기' 는 부모가 ref.submit() 으로 호출한다.
// ⚠️ 본문(요약·공고일반·품목내역·서약문)은 조회판(MUI-BD-03-P09 BidAbndAperDtl)과 완전히 동일해
//    (신청서에 입력 필드가 없다) 그쪽 한 벌을 재사용하고, 여기선 제출 핸들만 얹는다.
import { forwardRef, useImperativeHandle } from 'react'
import { BidAbndAperDtl } from '@/ui/biz/bd/bidPrgsDtlInq/BidAbndAperDtl'
import type { BidPrgrsItem } from '@/types/mock/bd'

export interface BidAbndAperWrtHandle {
  /** 부모 BottomSheet footer '제출하기' 가 호출 — 제출 처리 후 onSubmitted() 로 시트 닫힘 알림 */
  submit: () => void
}

interface BidAbndAperWrtProps {
  /** 상세에서 넘어온 항목(navigate state) — 요약/공고일반을 이 항목으로 그린다. */
  detail: BidPrgrsItem
  /** 제출 완료 시 호출(부모가 BottomSheet 를 닫음) */
  onSubmitted: () => void
}

const BidAbndAperWrt = forwardRef<BidAbndAperWrtHandle, BidAbndAperWrtProps>(
  ({ detail, onSubmitted }, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        submit: () => {
          console.log('[P03] 입찰포기신청서 제출', { pbancNo: detail.pbancNo })
          // 추후 API: scwin.btn_bidAbndApfrSbmsn_onclick
          onSubmitted()
        },
      }),
      [detail, onSubmitted],
    )

    return <BidAbndAperDtl detail={detail} />
  },
)
BidAbndAperWrt.displayName = 'BidAbndAperWrt'

export { BidAbndAperWrt }
