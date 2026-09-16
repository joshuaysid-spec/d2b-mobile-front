// 디지털캐비닛 파일 선택 팝업 (FileAdd 의 [캐비닛 업로드] 진입) — 도메인 조립물.
//   설계서(00.공통 slide118·121)는 "캐비닛 업로드 선택 → 폴더 목록 화면 진입" 이지만, FileAdd 는
//   신청서/마법사 폼 한가운데 BottomSheet 안에서 열린다. 라우트 이동을 하면 작성 중이던 폼 상태가
//   전부 유실되므로 **라우트 대신 FullPopup 안에서 폴더 → 파일을 탐색**한다(2026-09-16 확정).
//   화면 구성·동작(체크박스 선택, [선택 파일 첨부], 권한 버튼 숨김, 상위 폴더 이동)은 설계서 그대로.
//   조회용 라우트 화면(M14/M16)은 그대로 유지된다.
import { useState } from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { Button } from '@/ui/common/base/Button'
import { Notice } from '@/ui/common/composites/Notice'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { CabinetHelpDisclosure } from '@/ui/biz/cm/digitalCabinet/CabinetHelpDisclosure'
import { CabinetFileList } from '@/ui/biz/cm/digitalCabinet/CabinetFileList'
import { CabinetFolderList } from '@/ui/biz/cm/digitalCabinet/CabinetFolderList'
import { MOCK_CABINET_FILES, MOCK_CABINET_FOLDERS } from '@/ui/biz/cm/digitalCabinet/cabinetMock'
import type { MockDigitalCabinetFile, MockDigitalCabinetFldr } from '@/types/mock/cm'
import type { UploadedFile } from '@/types/file'

export interface CabinetPickFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** [선택 파일 첨부] — 선택분을 업로드 응답 형태로 반환(캐비닛 파일은 이미 서버에 있어 재업로드 없음). */
  onPick: (files: UploadedFile[]) => void
}

// ⚠️ 임시 — 캐비닛 목록은 파일크기를 표시 문자열('369KB'/'10MB')로 준다. 실 API 는 바이트를 직접 주므로
//    그때 이 변환을 제거하고 응답 값을 그대로 쓴다.
function parseSize(display: string): number {
  const m = /^([\d.]+)\s*(KB|MB|GB)?$/i.exec(display.trim())
  if (!m) return 0
  const unit = (m[2] ?? 'KB').toUpperCase()
  const mul = unit === 'GB' ? 1024 ** 3 : unit === 'MB' ? 1024 ** 2 : 1024
  return Math.round(Number(m[1]) * mul)
}

export function CabinetPickFullPopup({ open, onOpenChange, onPick }: CabinetPickFullPopupProps) {
  // 탐색 단계 — 폴더 목록 → (폴더 선택) → 파일 목록. 라우트가 아니라 팝업 내부 state.
  const [step, setStep] = useState<'folders' | 'files'>('folders')
  // 선택한 폴더 — 파일 단계 타이틀에 쓰고, 추후 폴더별 파일목록 조회 키(fldrSn)로 쓴다.
  const [folder, setFolder] = useState<MockDigitalCabinetFldr | null>(null)
  const [selected, setSelected] = useState<MockDigitalCabinetFile[]>([])

  // 닫히면 단계·선택 초기화(Esc·외부 클릭·닫기 버튼 전부 여기로 들어온다).
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setStep('folders')
      setFolder(null)
      setSelected([])
    }
    onOpenChange(next)
  }

  const handleOpenFolder = (f: MockDigitalCabinetFldr) => {
    setFolder(f)
    setStep('files')
  }

  // 단건 선택 — 첨부서류명 1건 = 파일 1건(2026-09-16 사용자 확정). 다시 누르면 해제.
  const handleToggle = (file: MockDigitalCabinetFile) => {
    setSelected((prev) => (prev.some((f) => f.fileId === file.fileId) ? [] : [file]))
  }

  const handleAttach = () => {
    onPick(
      selected.map((f) => ({
        // ⚠️ 임시 — 캐비닛 파일ID(fileId)를 GUID 자리에 쓴다. 캐비닛 목록 응답에 파일 GUID 가
        //    확정되면 그 값으로 교체할 것.
        guid: f.fileId,
        orgnlFileNm: f.fileNm,
        fileSz: parseSize(f.fileSz),
      })),
    )
    handleOpenChange(false)
  }

  return (
    <FullPopup
      open={open}
      onOpenChange={handleOpenChange}
      // 폴더 안에서는 폴더명을 타이틀로(어느 폴더를 보는 중인지 — 라우트가 아니라 팝업이라 헤더가 유일한 단서).
      title={step === 'files' && folder ? folder.fldrNm : '디지털 캐비닛'}
    >
      {/* 안내(중요) — M14/M16 과 동일 문구. */}
      <Notice type="urgent">폴더와 파일의 추가. 삭제는 PC 버전에서 가능합니다.</Notice>

      {/* 업무도움 — 접힘 disclosure. */}
      <CabinetHelpDisclosure />

      {step === 'folders' ? (
        // 폴더 단계 — 권한 버튼은 숨김(설계서 slide118: 캐비닛 선택 업로드 진입 시 권한 버튼 숨김).
        <div className="px-4 py-4">
          <CabinetFolderList folders={MOCK_CABINET_FOLDERS} onOpen={handleOpenFolder} />
        </div>
      ) : (
        <>
          {/* 상위 폴더 목록 이동 — M16 과 같은 버튼이지만 navigate 가 아니라 폴더 단계로 복귀. */}
          <button
            type="button"
            onClick={() => setStep('folders')}
            className="mx-4 mt-4 flex items-center gap-krds-5 rounded-krds-8 border border-krds-border-field p-krds-7 text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-krds-focus-ring focus-visible:ring-offset-2"
          >
            <Icon name="ArrowBack" size={20} aria-hidden className="shrink-0 text-krds-text-ink" />
            <Icon
              name="Folder"
              size={24}
              fill={1}
              aria-hidden
              className="shrink-0 text-krds-text-primary"
            />
            <span className="min-w-px flex-1 text-[17px] font-bold leading-normal text-krds-text-ink">
              상위 폴더 목록 이동
            </span>
          </button>

          {/* ⚠️ 폴더별 파일목록 조회 API 미확정 — 현재는 폴더와 무관하게 고정 목업.
              선택 폴더(folder.fldrSn)는 추후 조회 키로 쓰기 위해 state 로 보관 중. */}
          <CabinetFileList
            files={MOCK_CABINET_FILES}
            attachMode
            selectedIds={selected.map((f) => f.fileId)}
            onToggle={handleToggle}
          />

          {/* [선택 파일 첨부] — 선택 0건이면 비활성(설계서 slide117). */}
          <div className="px-4 pb-6">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleAttach}
              disabled={selected.length === 0}
            >
              <Icon name="Upload" size={20} aria-hidden />
              선택 파일 첨부
            </Button>
          </div>
        </>
      )}
    </FullPopup>
  )
}
CabinetPickFullPopup.displayName = 'CabinetPickFullPopup'
