// 물품단가계약서상세 - '상세정보' 탭 콘텐츠 (MUI-CT-01-T16). 설계서 slide57.
// 단가제 상세정보 데이터영역은 총액제(T13)와 동일 구조 + 부서명/조달판단번호 2행 차이뿐이라,
// 총액제 _Cn(deptCd/prcmNo 존재 시 해당 2행 노출)을 단일 소스로 재사용한다(로직 중복 방지).
import { CmdtyGramtCtrdocDtl_Cn } from '@/ui/biz/ct/cmdtyGramtCtrdocDtl/CmdtyGramtCtrdocDtl_Cn'
import type { CmdtyCtrdocDtl } from '@/types/mock/ct'

export interface CmdtyUntprcCtrdocDtl_CnProps {
  detail: CmdtyCtrdocDtl
}

export function CmdtyUntprcCtrdocDtl_Cn({ detail }: CmdtyUntprcCtrdocDtl_CnProps) {
  return <CmdtyGramtCtrdocDtl_Cn detail={detail} />
}
CmdtyUntprcCtrdocDtl_Cn.displayName = 'CmdtyUntprcCtrdocDtl_Cn'
