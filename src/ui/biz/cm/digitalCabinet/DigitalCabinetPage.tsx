// MUI-CM-06-M14 디지털캐비닛 (DigitalCabinetPage). 설계서 00.공통 v0.84 slide108·110.
// 사용자가 등록한 자료 폴더 목록. 폴더 클릭 → 폴더 내 파일 목록(M16) 이동.
//   폴더 생성/삭제는 PC 에서만(모바일 조회+권한설정). 권한 버튼은 **업체 대표자에게만** 노출.
//   파일첨부/업로드 > 디지털 캐비닛 선택 진입은 이 라우트가 아니라 CabinetPickFullPopup 이 담당한다
//   (폼 상태 유실 방지 — 그 팝업은 권한 버튼 미노출. 설계서 slide108/118).
// 웹경로: 메인 홈 > 마이페이지 > 디지털캐비닛. 셸 안 + sub헤더(뒤로+타이틀). 3뎁스라 BottomNav 숨김.
//
// P15(폴더 설정 권한 관리)는 이 페이지가 컨테이너(BottomSheet)·footer(취소/저장)를 소유하고
//   콘텐츠(DigitalCabinetMng)만 끼워 넣는다(CLAUDE: BottomSheet 콘텐츠 분리 패턴).
// 데이터=파일 내 목업(데이터영역 dl_digitalCabinetFldrList / dl_digitalCabinetAuthrtList), 동작=경계 스텁.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { Notice } from '@/ui/common/composites/Notice'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Toast } from '@/ui/common/composites/Toast'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { CabinetHelpDisclosure } from '@/ui/biz/cm/digitalCabinet/CabinetHelpDisclosure'
import { CabinetFolderList } from '@/ui/biz/cm/digitalCabinet/CabinetFolderList'
import { MOCK_CABINET_FOLDERS } from '@/ui/biz/cm/digitalCabinet/cabinetMock'
import { DigitalCabinetMng } from '@/ui/biz/cm/digitalCabinet/DigitalCabinetMng'
import type { MockDigitalCabinetAuthrtSe, MockDigitalCabinetFldr } from '@/types/mock/cm'

// ⚠️ 목업 — 로그인 사용자가 업체 대표자인지(권한 버튼 노출). API 연동 시 업체정보 API 값으로 교체.
const MOCK_IS_REPRESENTATIVE = true

export function DigitalCabinetPage() {
  const navigate = useNavigate()
  // P15 권한설정 시트 — 대상 폴더 + 편집 중 권한값(userNm → authrtSe). 페이지가 소유(저장이 footer).
  const [permFolder, setPermFolder] = useState<MockDigitalCabinetFldr | null>(null)
  const [permDraft, setPermDraft] = useState<Record<string, MockDigitalCabinetAuthrtSe>>({})
  const [toastOpen, setToastOpen] = useState(false)

  const showPermBtn = MOCK_IS_REPRESENTATIVE

  // ── 동작 스텁 ──
  const handleOpenFolder = (folder: MockDigitalCabinetFldr) => {
    // 폴더 클릭 → 폴더 내 파일 목록(M16). 폴더 정보를 state 로 전달(추후 파일목록 조회 키).
    navigate(ROUTES.DIGITAL_CABINET_FILES, { state: folder })
  }
  const handleOpenPerm = (folder: MockDigitalCabinetFldr) => {
    // 권한 설정 시트 열기 — 편집 초기값을 폴더 권한 목록에서 구성.
    const draft: Record<string, MockDigitalCabinetAuthrtSe> = {}
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
        <CabinetFolderList
          folders={MOCK_CABINET_FOLDERS}
          onOpen={handleOpenFolder}
          showPermBtn={showPermBtn}
          onPerm={handleOpenPerm}
        />
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
