// 업체정보 (MUI-OP-01-P77, WarSplList_BzEnty) — 설계서 01.조달계획 v0.82 slide81.
// 형상자료(T73) 참조번호 블록의 '업체정보 보기' 로 열리는 바텀시트의 **콘텐츠 전용** 컴포넌트.
// 컨테이너(<BottomSheet title="업체정보" footer={닫기}>)는 부모(WarSplList_Cnfg)가 소유한다
// — CLAUDE.md "BottomSheet 는 전용 래퍼(*Sheet)를 만들지 않는다".
// 항목: 업체정보 데이터 영역(dm_bzentyInfo) 6항목 — 업체명/대표자/본사주소/사업자번호/전화번호/FAX.
import type { WarSplBzEnty } from '@/types/op'
import { Table, type TableRow } from '@/ui/common/composites/Table'

export interface WarSplList_BzEntyProps {
  /** 조회 결과(dm_bzentyInfo). 조회 전/실패 시 undefined. */
  data?: WarSplBzEnty
}

export function WarSplList_BzEnty({ data }: WarSplList_BzEntyProps) {
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
