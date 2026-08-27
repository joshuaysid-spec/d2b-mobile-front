// 국외조달원등록증신청안내 (MUI-CM-01-P21, Figma 10020:82378). 설계서 00.공통 v0.84.
//   웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 업체정보 조회/추가정보 진입 안내. (진입점 M01 미구현 → 라우트만 등록)
//   구성(Figma 1:1): 처리절차(문서 아이콘 + 안내) · 양식 다운로드(첨부파일명 + FileDownloadList) · 신청서 확인사항(번호목록 + 링크).
//   바텀시트 임베드 시 padded=false(시트 본문 px-16 소유 — 이중 패딩 방지). 헤더(m_popup_header '국외조달원등록증신청안내')는 AppLayout sub 헤더가 담당(router handle).
import { type ComponentProps } from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { cn } from '@/utils/cn'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'

// 섹션 헤더 — 아이콘(24) + 19px Bold 제목 (Figma list row).
function SectionHead({ icon, title }: { icon: ComponentProps<typeof Icon>['name']; title: string }) {
  return (
    <div className="flex w-full items-center gap-1">
      <Icon name={icon} size={24} className="shrink-0 text-krds-text-ink" aria-hidden />
      <h2 className="min-w-px flex-1 text-[19px] font-bold leading-normal text-krds-text-ink">
        {title}
      </h2>
    </div>
  )
}

// 외부 링크 — 밑줄 + primary 색(Figma). 새 탭.
function ExtLink({ href }: { href: string }) {
  const label = href.replace(/^https?:\/\//, '')
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-krds-text-primary-active underline underline-offset-2"
    >
      {label}
    </a>
  )
}

export function OvsdmstSosCnfdoc({ padded = true }: { padded?: boolean } = {}) {
  // 양식 다운로드 파일 — 스텁(추후 cmService.downloadOvsSosForm). Figma: 첨부파일명.hwp [786KB].
  const handleDownload = () => {
    console.log('[OvsdmstSosCnfdoc] 양식 다운로드', '첨부파일명.hwp')
    // 추후 API: cmService.downloadOvsSosForm()
  }

  return (
    <div className="flex w-full flex-col">
      {/* 양식 다운로드 — 첨부파일명 라벨 + 파일 행(다운로드) */}
      <section className={cn('flex flex-col gap-krds-5 py-4', padded && 'px-4')}>
        <SectionHead icon="Download" title="양식 다운로드" />
        <span className="text-[17px] font-bold leading-normal text-krds-text-ink">첨부파일명</span>
        <FileDownloadList
          files={[{ id: 'form', name: '첨부파일명.hwp', size: '786KB', onDownload: handleDownload }]}
        />
      </section>

      {/* 처리절차 */}
      <section className={cn('flex flex-col gap-1 py-4', padded && 'px-4')}>
        <SectionHead icon="Description" title="처리절차" />
        <p className="text-[17px] leading-normal text-krds-text-ink">
          국외조달원 등록증 발급 신청서 양식을 출력하여 수기로 작성 후 팩스 또는 직접 방문 접수합니다.
        </p>
      </section>

      {/* 신청서 확인사항 — 번호 목록 */}
      <section className={cn('flex flex-col gap-krds-5 py-4', padded && 'px-4')}>
        <SectionHead icon="AssignmentGlobe" title="신청서 확인사항" />
        <div className="flex flex-col gap-4">
          {/* 1. */}
          <div className="flex flex-col gap-1">
            <p className="flex gap-1 text-[17px] font-bold leading-normal text-krds-text-ink">
              <span className="shrink-0">1.</span>
              <span className="min-w-px flex-1">마이페이지 &gt; 업체정보관리 &gt; 업체정보 조회</span>
            </p>
            <p className="text-[17px] leading-normal text-krds-text-ink">
              에서 영문상호명이 있어야 하며, 빈 값인 경우 조달청에서 등록하세요.
            </p>
            {/* 블릿 */}
            <div className="flex gap-2">
              <span
                className="mt-[10px] size-1 shrink-0 rounded-full bg-krds-text-ink"
                aria-hidden
              />
              <p className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-ink">
                업체정보(대표자 주소 등) 변경사항이 있는 경우 나라장터(<ExtLink href="https://www.g2b.go.kr" />
                )에 변경 요청하여 승인 처리되면 다음 날 국방전자조달(<ExtLink href="https://www.d2b.go.kr" />
                )에 자동 반영
              </p>
            </div>
          </div>

          {/* 2. */}
          <div className="flex flex-col gap-1">
            <p className="flex gap-1 text-[17px] font-bold leading-normal text-krds-text-ink">
              <span className="shrink-0">2.</span>
              <span className="min-w-px flex-1">
                마이페이지 &gt; 업체정보관리 &gt; 업체정보 추가정보 &gt; 신청
              </span>
            </p>
            <p className="text-[17px] leading-normal text-krds-text-ink">
              버튼 클릭 후 일반정보에 대표자명(영문), 주소(영문)은 필수입니다. 빈 값인경우 추가정보등록 후 신청하세요.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
OvsdmstSosCnfdoc.displayName = 'OvsdmstSosCnfdoc'
