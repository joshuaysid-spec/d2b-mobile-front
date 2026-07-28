// 물품단가계약서상세 - '특수조건' 탭 콘텐츠 (MUI-CT-01-T18). 설계서 slide54.
// 특수조건(spclCnd)은 총액제(T15)와 동일 데이터영역이라 총액제 _Spcl 을 단일 소스로 재사용한다.
import { CmdtyGramtCtrdocDtl_Spcl } from '@/ui/biz/ct/cmdtyGramtCtrdocDtl/CmdtyGramtCtrdocDtl_Spcl'

export function CmdtyUntprcCtrdocDtl_Spcl() {
  return <CmdtyGramtCtrdocDtl_Spcl />
}
CmdtyUntprcCtrdocDtl_Spcl.displayName = 'CmdtyUntprcCtrdocDtl_Spcl'
