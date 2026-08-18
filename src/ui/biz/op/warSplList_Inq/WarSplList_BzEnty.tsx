// 업체정보 (MUI-OP-01-P77, WarSplList_BzEnty) — 설계서 01.조달계획 v0.82 slide81.
// 사용자 확정(2026-08-18): P77 은 바텀시트가 아니라 형상자료(T73) 참조번호 건별
// '업체정보' 아코디언으로 표현한다 — P77 의 데이터 영역(dm_bzentyInfo) 내용만 참고.
// 이 컴포넌트는 그 아코디언의 **콘텐츠 전용** — 컨테이너(AccordionSection)는 부모(WarSplList_Cnfg)가 소유.
// 조회: 아코디언 펼침 시에만 마운트되므로 여기서 생산자부호로 직접 조회한다(닫힘 상태 미조회).
// 항목: dm_bzentyInfo 6항목 — 업체명/대표자/본사주소/사업자번호/전화번호/FAX.
import { useWarSplBzEnty } from '@/queries/op'
import { Table, type TableRow } from '@/ui/common/composites/Table'

export interface WarSplList_BzEntyProps {
  /** 조회 키 — 참조번호 건의 생산자부호. */
  prdctnCd: string
}

export function WarSplList_BzEnty({ prdctnCd }: WarSplList_BzEntyProps) {
  const { data } = useWarSplBzEnty(prdctnCd)

  if (!data) {
    return <p className="py-krds-8 text-center text-[17px] text-krds-text-muted">조회 중입니다.</p>
  }

  const rows: TableRow[] = [
    { label: '업체명', value: data.bzentyNm },
    { label: '대표자', value: data.rprsvNm },
    { label: '본사주소', value: data.addr },
    { label: '사업자번호', value: data.bzmnNo },
    { label: '전화번호', value: data.tlno },
    { label: 'FAX', value: data.fxno },
  ]

  return <Table rows={rows} />
}
WarSplList_BzEnty.displayName = 'WarSplList_BzEnty'
