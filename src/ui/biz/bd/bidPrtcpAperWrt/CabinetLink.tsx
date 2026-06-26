// 입찰참가신청서작성 - 파일첨부 방식 선택(MUI-BD-04-P13 · 캐비닛 연결 팝업).
// 바텀시트 콘텐츠 전용 — 컨테이너(BottomSheet)/footer/open 은 부모(BidPrtcpAperWrtPage_Stp6) 소유.
// 조회/선택 전용이라 forwardRef 불필요. '직접 업로드' / '캐비닛 선택' 2옵션을 NavigationItemList 로.
import { NavigationItemList } from '@/ui/common/composites/NavigationItemList'

export type CabinetLinkKind = 'direct' | 'cabinet'

interface Props {
  /** 옵션 선택 시 호출 — 부모가 시트 닫기/후속 처리. */
  onSelect?: (kind: CabinetLinkKind) => void
}

export function CabinetLink({ onSelect }: Props) {
  // 추후 API: bdService.linkCabinet (캐비닛 파일 목록 조회 후 선택 화면 연결)
  const handleSelect = (kind: CabinetLinkKind) => {
    console.log('[P13] 파일첨부 방식 선택', kind)
    onSelect?.(kind)
  }

  return (
    <NavigationItemList
      items={[
        { id: 'direct', label: '직접 업로드', onClick: () => handleSelect('direct') },
        { id: 'cabinet', label: '캐비닛 선택', onClick: () => handleSelect('cabinet') },
      ]}
    />
  )
}
CabinetLink.displayName = 'CabinetLink'
