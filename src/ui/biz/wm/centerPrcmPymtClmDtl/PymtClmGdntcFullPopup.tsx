// 대금청구 안내문 풀팝업 — MUI-WM-01-P09 PymtClmGdntc. 설계서 05.대금청구및사후 v0.83 slide70~71.
// 대금청구통합목록(M01)·대금/사후 상세 화면들의 '안내문' 클릭 → 안내 내용 조회.
// 안내 내용은 설계서 slide70 원문 정적 표기 — 서버 공급으로 확정 시 조회(wmService)로 교체.
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FullPopup } from '@/ui/common/composites/FullPopup'

export interface PymtClmGdntcFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PymtClmGdntcFullPopup({ open, onOpenChange }: PymtClmGdntcFullPopupProps) {
  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="대금청구 안내문"
      footer={
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col gap-krds-7 pb-8">
        <SectionTitle as="h3">대금청구 안내문</SectionTitle>
        <div className="flex flex-col gap-krds-7 px-4 text-krds-body-md leading-relaxed text-krds-text-ink">
          <p className="font-bold">&lt;계약업체 대금청구 시 안내문&gt;</p>
          <div className="flex flex-col gap-krds-3">
            <p className="font-bold">
              ● 국민연금법 제95조의 2(연금보험료 등의 납부증명) 시행중인 제도
            </p>
            <p>
              - 국민연금보험료 납부증명은 대금청구시 행정정보공동이용 사전동의 및 사업장관리번호
              입력으로 갈음합니다. (사업장 관리번호 문의 : 국민연금 콜센터 1355)
            </p>
          </div>
          <div className="flex flex-col gap-krds-3">
            <p className="font-bold">
              ● 국민건강보험법 제81조의3 및 시행령 제47조의3(보험료의 납부증명 등) &#39;16.8.4.
              시행
            </p>
            <p>- 대상 : &#39;16년 8월 4일 이후 최초로 계약의 대가를 지급받는 자</p>
            <p>
              - 제출서류 : 건강·장기요양보험료 납부증명서 또는 4대 사회보험료 완납증명서 발급 후
              스캔하여 대금청구 &quot;첨부&quot;란에 첨부하여 대금청구 [인터넷 국민건강보험공단
              사회보험징수포털(http://si4n.nhis.or.kr), 지사 방문 등 발급]
            </p>
            <p>
              - 대금청구 절차 : 방위사업청 인터넷 홈페이지 국방전자조달시스템 → 물품[용역/공사] →
              대금청구 → 대금/선금/착중도금 신청 → 우측 &quot;첨부&quot; 란(보험료납부 증명서) 첨부
              제출
            </p>
          </div>
          <div className="flex flex-col gap-krds-3">
            <p>
              대금청구 신청 전 : 기반_지출심사 [Tel : 02)2079-4791,4793,4794] · 미래_지출심사 [Tel
              : 02)2079-4021,4023,4024]
            </p>
            <p>
              대금청구 신청 후 : 운영지원과 재무팀 [Tel : 02)2079-6680,6681(내자),
              02)2079-6670(외자)]
            </p>
          </div>
        </div>
      </div>
    </FullPopup>
  )
}
PymtClmGdntcFullPopup.displayName = 'PymtClmGdntcFullPopup'
