// 공통관리(CM) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 조회는 useQuery 훅, 저장/제출은 페이지 핸들러에서 서비스 직접 await(useMutation 미도입).
// queryKey 는 cmKeys 로 중앙 관리 — 무효화/프리페치 시 여기서만 참조.
import { useQuery } from '@tanstack/react-query'
import { prfmncPrdocService } from '@/services/cm'

export const cmKeys = {
  /** 실적증명서 제출 협회 목록(MUI-CM-04-P20). */
  sbmsnAsctnList: (prfmncRcptNo: string) => ['cm', 'sbmsnAsctnList', prfmncRcptNo] as const,
}

/**
 * 실적증명서 제출 — 제출 협회 목록(dl_sbmsnAsctnList) 조회.
 * slide336 On-Load(scwin.onpageload). 제출 시트가 열릴 때만 조회한다(enabled).
 */
export function useSbmsnAsctnList(prfmncRcptNo: string, enabled = true) {
  return useQuery({
    queryKey: cmKeys.sbmsnAsctnList(prfmncRcptNo),
    queryFn: () => prfmncPrdocService.getSbmsnAsctnList(prfmncRcptNo),
    enabled: enabled && !!prfmncRcptNo,
  })
}
