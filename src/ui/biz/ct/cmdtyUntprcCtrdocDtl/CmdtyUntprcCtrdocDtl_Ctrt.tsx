// 물품단가계약서상세 - '계약명세서' 탭 콘텐츠 (MUI-CT-01-T17). 설계서 slide58·61.
// 단가제 품목 항목 세트(항목번호~납지수량)는 총액제 _Ctrt 의 type='untprc' 분기와 동일하므로,
// 총액제 _Ctrt 를 type='untprc' 로 재사용한다(itemRows 단가제 분기 = 단일 소스).
import { CmdtyGramtCtrdocDtl_Ctrt } from '@/ui/biz/ct/cmdtyGramtCtrdocDtl/CmdtyGramtCtrdocDtl_Ctrt'

export function CmdtyUntprcCtrdocDtl_Ctrt({ id }: { id: string }) {
  return <CmdtyGramtCtrdocDtl_Ctrt id={id} type="untprc" />
}
CmdtyUntprcCtrdocDtl_Ctrt.displayName = 'CmdtyUntprcCtrdocDtl_Ctrt'
