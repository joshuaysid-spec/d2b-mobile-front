// 추가정보 신청내역상세 (MUI-CM-01-M03 상세, addRegInfoAplyDtl). 설계서 slide140·144(문서 P139·143).
//   웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 추가정보 신청 목록 > 상세.
//   추가정보구분(addInfoCdNm)에 따라 T05 물품(내자)신청정보 / T06 국내소재상사신청정보 콘텐츠를 렌더(상태값 무관, slide137).
//   상단 접수정보(업체/접수번호/신청일자/진행상태)는 목록에서 넘어온 항목(navigate state)으로 그리고, 본문은 탭 콘텐츠 목업.
//   헤더(뒤로/타이틀)는 전역 Header(AppLayout). 백엔드 미연동(폐쇄망) — service 스텁 없이 페이지 fallback 목업.
import { useLocation } from 'react-router-dom'

import { PageTitle } from '@/ui/common/base/PageTitle'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { Badge } from '@/ui/common/base/Badge'
import { AddRegInfoAplyDtl_Cmdty } from '@/ui/biz/cm/addRegInfoAplyDtl/AddRegInfoAplyDtl_Cmdty'
import { AddRegInfoAplyDtl_DmsAgt } from '@/ui/biz/cm/addRegInfoAplyDtl/AddRegInfoAplyDtl_DmsAgt'
import type { AddRegInfoAplyItem } from '@/types/cm'

// 직접 URL 진입·새로고침(state 없음) 대비 fallback 목업(설계서 slide139/140 예시값, 항목명 영문 준수).
const MOCK_ITEM: AddRegInfoAplyItem = {
  id: '1',
  rcptNo: '202602027888',
  aplyYmd: '2026-02-02',
  rprsvTelno: '02-1234-5678',
  bizCdNm: '물품(내자)',
  addInfoCdNm: '물품(내자)',
  prgrsSttsNm: '접수',
}
// 접수정보 상단 업체 표시값 — 목록 아이템에 없는 업체명/업체코드/대표자는 로그인 업체 정보(추후 authStore). 현재 목업.
const BZENTY = { bzentyNm: '주식회사 국방전자조달', bzentyCd: '7004F', rprsvNm: '홍길동' }

export function AddRegInfoAplyDtlPage() {
  // 목록에서 넘어온 항목으로 상단(접수정보)을 그린다. 직접 진입(state 없음)이면 페이지 목업.
  const detail = (useLocation().state as AddRegInfoAplyItem | null) ?? MOCK_ITEM
  // 추가정보구분으로 콘텐츠 분기 — 국내소재상사면 T06, 그 외(물품(내자))는 T05.
  const isDmsAgt = detail.addInfoCdNm.includes('국내소재상사')

  return (
    <div className="flex w-full flex-col">
      {/* 접수정보 (slide140/144) — 업체명/업체코드 + 대표자/접수번호/신청일자/진행상태. */}
      <div className="border-b border-krds-border-divider bg-krds-bg-primary-faint px-4 py-2">
        <SummaryInfo
          flushX
          badges={[{ label: detail.addInfoCdNm }]}
          subtitle={`업체코드 ${BZENTY.bzentyCd}`}
          title={BZENTY.bzentyNm}
          rows={[
            { label: '대표자', value: BZENTY.rprsvNm },
            { label: '접수번호', value: detail.rcptNo },
            { label: '신청일자', value: detail.aplyYmd },
            {
              label: '진행상태',
              value: <Badge>{detail.prgrsSttsNm}</Badge>,
            },
          ]}
        />
      </div>

      {/* 신청 내역 상세 — 추가정보구분에 따라 T05/T06 콘텐츠. */}
      <div className="flex flex-col gap-4 px-4 pt-4">
        <PageTitle>신청 내역 상세</PageTitle>
      </div>
      {isDmsAgt ? <AddRegInfoAplyDtl_DmsAgt /> : <AddRegInfoAplyDtl_Cmdty />}
    </div>
  )
}
AddRegInfoAplyDtlPage.displayName = 'AddRegInfoAplyDtlPage'
