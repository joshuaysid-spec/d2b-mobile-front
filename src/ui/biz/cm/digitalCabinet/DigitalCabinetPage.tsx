// MUI-CM-06-M14 디지털캐비닛 (DigitalCabinetPage). 설계서 00.공통 v0.84 slide108·110.
// 사용자가 등록한 자료 폴더 목록. 폴더 클릭 → 폴더 내 파일 목록(M16) 이동.
//   폴더 생성/삭제는 PC 에서만(모바일 조회+권한설정). 권한 버튼은 **업체 대표자에게만** 노출.
//   파일첨부/업로드 > 디지털 캐비닛 선택으로 진입하는 경우 권한 버튼 숨김(설계서 slide108).
// 웹경로: 메인 홈 > 마이페이지 > 디지털캐비닛. 셸 안 + sub헤더(뒤로+타이틀). 3뎁스라 BottomNav 숨김.
//
// P15(폴더 설정 권한 관리)는 이 페이지가 컨테이너(BottomSheet)·footer(취소/저장)를 소유하고
//   콘텐츠(DigitalCabinetMng)만 끼워 넣는다(CLAUDE: BottomSheet 콘텐츠 분리 패턴).
// 데이터=파일 내 목업(데이터영역 dl_digitalCabinetFldrList / dl_digitalCabinetAuthrtList), 동작=경계 스텁.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { Icon } from '@/ui/common/base/Icon'
import { Button } from '@/ui/common/base/Button'
import { Notice } from '@/ui/common/composites/Notice'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Toast } from '@/ui/common/composites/Toast'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { CabinetHelpDisclosure } from '@/ui/biz/cm/digitalCabinet/CabinetHelpDisclosure'
import { DigitalCabinetMng } from '@/ui/biz/cm/digitalCabinet/DigitalCabinetMng'
import { cn } from '@/utils/cn'
import type { DigitalCabinetAuthrtSe, DigitalCabinetFldr } from '@/types/mock/cm'

// ── 목업 (설계서 slide108/110 예시 + 데이터영역 항목명/형식) ────────────────────────
const MOCK_FOLDERS: DigitalCabinetFldr[] = [
  {
    fldrSn: '1',
    fldrNm: '입찰 제출서류',
    fldrSz: '10MB',
    mdfrNm: '김대표',
    regDt: '2025-01-10 09:00',
    mdfcnDt: '2025-01-31 12:12',
    authrtList: [
      { userNm: '김대표', authrtSe: 'write', mdfcnDt: '2025-01-15 13:25' },
      { userNm: '박영업', authrtSe: 'read', mdfcnDt: '2025-01-15 14:47' },
      { userNm: 'James Burkley', authrtSe: 'none', mdfcnDt: '2025-01-15 16:22' },
    ],
  },
  {
    fldrSn: '2',
    fldrNm: '계약 관련 서류',
    fldrSz: '10MB',
    mdfrNm: '박영업',
    regDt: '2025-01-12 10:30',
    mdfcnDt: '2025-01-31 12:12',
    authrtList: [
      { userNm: '김대표', authrtSe: 'write', mdfcnDt: '2025-01-15 13:25' },
      { userNm: '박영업', authrtSe: 'write', mdfcnDt: '2025-01-15 14:47' },
    ],
  },
  {
    fldrSn: '3',
    fldrNm: '증빙 서류',
    fldrSz: '5MB',
    mdfrNm: '김대표',
    regDt: '2025-01-14 11:00',
    mdfcnDt: '2025-01-31 12:12',
    authrtList: [{ userNm: '김대표', authrtSe: 'write', mdfcnDt: '2025-01-15 13:25' }],
  },
]

// ⚠️ 목업 — 로그인 사용자가 업체 대표자인지(권한 버튼 노출) / 파일첨부 진입인지(권한 버튼 숨김).
//    API/네비게이션 연동 시 실제 값으로 교체(대표자 = 업체정보 API, 진입경로 = navigate state).
const MOCK_IS_REPRESENTATIVE = true
const MOCK_FROM_ATTACH = false

export function DigitalCabinetPage() {
  const navigate = useNavigate()
  // P15 권한설정 시트 — 대상 폴더 + 편집 중 권한값(userNm → authrtSe). 페이지가 소유(저장이 footer).
  const [permFolder, setPermFolder] = useState<DigitalCabinetFldr | null>(null)
  const [permDraft, setPermDraft] = useState<Record<string, DigitalCabinetAuthrtSe>>({})
  const [toastOpen, setToastOpen] = useState(false)

  const showPermBtn = MOCK_IS_REPRESENTATIVE && !MOCK_FROM_ATTACH

  // ── 동작 스텁 ──
  const handleOpenFolder = (folder: DigitalCabinetFldr) => {
    // 폴더 클릭 → 폴더 내 파일 목록(M16). 폴더 정보를 state 로 전달(추후 파일목록 조회 키).
    navigate(ROUTES.DIGITAL_CABINET_FILES, { state: folder })
  }
  const handleOpenPerm = (folder: DigitalCabinetFldr) => {
    // 권한 설정 시트 열기 — 편집 초기값을 폴더 권한 목록에서 구성.
    const draft: Record<string, DigitalCabinetAuthrtSe> = {}
    for (const u of folder.authrtList ?? []) draft[u.userNm] = u.authrtSe
    setPermDraft(draft)
    setPermFolder(folder)
  }
  const handleSavePerm = () => {
    console.log('[DigitalCabinet] 권한 저장', permFolder?.fldrSn, permDraft) // 추후: cmService.saveAuthrt(...)
    setPermFolder(null)
    setToastOpen(true) // 설계서 slide109: 저장 시 토스트("변경 저장 되었습니다.")
  }

  return (
    <div className="flex w-full flex-col">
      {/* 안내(중요) — Figma m_notice_urgent 1:1. 공통 Notice urgent 재사용(빨강 '중요' 배지 + 핑크 bg + 17 Bold). */}
      <Notice type="urgent">폴더와 파일의 추가. 삭제는 PC 버전에서 가능합니다.</Notice>

      {/* 업무도움 — 상단 접힘 disclosure(Figma m_help_disclosure). */}
      <CabinetHelpDisclosure />

      {/* 폴더 리스트 — 아웃라인 폴더 + 폴더명(19 Bold) + 수정/폴더(17 #555) + 전체폭 권한버튼(navy). 항목 사이 구분선. */}
      <div className="px-4 py-4">
        <ul className="flex w-full flex-col">
          {MOCK_FOLDERS.map((folder, i) => {
            const last = i === MOCK_FOLDERS.length - 1
            return (
              <li
                key={folder.fldrSn}
                className={cn(
                  'relative flex w-full flex-col gap-krds-8',
                  i > 0 && 'pt-krds-8',
                  !last && 'border-b border-krds-border-divider pb-krds-8',
                )}
              >
                {/* 전면 nav 버튼 — 폴더 정보 클릭 시 파일 목록 이동. */}
                <button
                  type="button"
                  onClick={() => handleOpenFolder(folder)}
                  aria-label={`${folder.fldrNm} 폴더 열기`}
                  className="absolute inset-0 z-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
                />
                {/* 폴더 정보 행 */}
                <div className="pointer-events-none relative z-10 flex items-start gap-krds-5">
                  <Icon
                    name="Folder"
                    size={24}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-krds-text-ink"
                  />
                  <div className="flex min-w-px flex-1 flex-col gap-krds-5">
                    <span className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                      {folder.fldrNm}
                    </span>
                    <div className="flex flex-wrap items-center gap-krds-5 text-[17px] leading-normal text-krds-text-muted">
                      <span>수정 {folder.mdfcnDt}</span>
                      <span className="h-5 w-px shrink-0 bg-krds-border-divider" aria-hidden />
                      <span>폴더 {folder.fldrSz}</span>
                    </div>
                  </div>
                </div>
                {/* 권한 버튼 — 대표자 & 파일첨부 진입 아닐 때만. 전체폭 navy(tertiary). */}
                {showPermBtn && (
                  <Button
                    variant="tertiary"
                    onClick={() => handleOpenPerm(folder)}
                    className="pointer-events-auto relative z-10 w-full"
                  >
                    권한
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* 맨 위로 FAB — 스크롤 주체는 AppLayout 의 #app-scroll(main). */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* P15 폴더 설정 권한 관리 — 컨테이너/footer 는 페이지 소유, 콘텐츠만 DigitalCabinetMng. */}
      <BottomSheet
        open={permFolder !== null}
        onOpenChange={(open) => !open && setPermFolder(null)}
        title="권한 설정"
        footer={
          <ButtonGroup
            layout="split"
            items={[
              { label: '취소', variant: 'secondary', onClick: () => setPermFolder(null) },
              { label: '저장', variant: 'primary', onClick: handleSavePerm },
            ]}
          />
        }
      >
        {permFolder && (
          <DigitalCabinetMng
            folder={permFolder}
            value={permDraft}
            onChange={(userNm, authrtSe) =>
              setPermDraft((prev) => ({ ...prev, [userNm]: authrtSe }))
            }
          />
        )}
      </BottomSheet>

      {/* 저장 완료 토스트 (설계서 slide109) */}
      <Toast open={toastOpen} onClose={() => setToastOpen(false)} duration={2000}>
        변경 저장 되었습니다.
      </Toast>
    </div>
  )
}
DigitalCabinetPage.displayName = 'DigitalCabinetPage'
