// Design Ref: search-filter.design.md §3.2 — 조달(OP, MUI-OP) 검색조건 value 타입.
// 느슨한 alias — 검색필터 공통 value 타입(SearchFilterValue) 그대로. (빡빡한 union 대신, 캐스팅 불필요)
// 값 키(참고): srchType · taskSeNm · orderPrnmntYm · prcmPlanNm · prcmNo ·
//             rprsItemNm · deptCd · userNm · implPrgrsStcd · inspShcd · bidSecd · ctrtMthdCd
import type { SearchFilterValue } from '@/types/search-filter'

export type OpSearchFilter = SearchFilterValue
