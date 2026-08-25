// 보안측정인원 등록 콘텐츠 (MUI-CM-01-P10, ScrtyMsrmtPrsnlReg). 설계서 slide169.
//   국내소재상사(M23) 폼의 보안측정인원 [신규 추가]에서 호출 → 성명/적격여부/보안측정일 + 첨부파일 입력
//   → [등록] 시 1건 반환(부모가 시트 닫음). 컨테이너(BottomSheet)·타이틀·footer([등록][닫기])는 부모(M23 폼)가 소유.
//   ⚠️ 설계서에 데이터영역(항목명 영문) 표 없음 → 화면 표기 기준 잠정 영문키(성명/적격여부/보안측정일/첨부파일).
//      인원 정보(성명/적격/측정일)는 필수 아님, 첨부파일만 필수(*)(slide169). (2026-07-01 개정: 주민등록번호 삭제)
//   footer [등록] 은 부모가 렌더 → 입력 상태는 이 콘텐츠가 소유, ref(ScrtyMsrmtPrsnlRegHandle.register)로 확정만 노출.
import { forwardRef, useImperativeHandle, useState } from 'react'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import type { ScrtyMsrmtPrsn } from '@/types/mock/cm'

/** 부모 footer([등록])가 호출하는 확정 동작. */
export interface ScrtyMsrmtPrsnlRegHandle {
  /** 현재 입력값을 onRegister 로 반환. */
  register: () => void
}

const QUAL_OPTIONS = [
  { value: '적격', label: '적격' },
  { value: '부적격', label: '부적격' },
]

export interface ScrtyMsrmtPrsnlRegProps {
  /** [등록] 시 호출 — 입력한 보안측정인원 1건을 부모에 반환. */
  onRegister: (person: ScrtyMsrmtPrsn) => void
}

const ScrtyMsrmtPrsnlReg = forwardRef<ScrtyMsrmtPrsnlRegHandle, ScrtyMsrmtPrsnlRegProps>(
  ({ onRegister }, ref) => {
    const [prsnNm, setPrsnNm] = useState('')
    const [qualYn, setQualYn] = useState('')
    const [scrtMsrYmd, setScrtMsrYmd] = useState('')
    // 첨부파일 — 파일뷰어 솔루션(캐비닛/업로드) 연동 자리. 목업으로 파일명만 관리.
    const [files, setFiles] = useState<FileDownloadItem[]>([])

    // 파일 추가 — 실제로는 캐비닛/파일 업로드 선택 팝업 호출(slide169). 목업으로 1건 추가.
    const handleAddFile = () => {
      const seq = files.length + 1
      setFiles((prev) => [...prev, { id: `f-${Date.now()}`, name: `증명서${seq}.pdf`, size: '256KB' }])
      console.log('[P10] 첨부파일 추가(캐비닛/업로드 선택 팝업)') // 추후 API: fbService.pickFromCabinet
    }
    const handleRemove = (id: string | number) =>
      setFiles((prev) => prev.filter((f) => f.id !== id))

    useImperativeHandle(
      ref,
      () => ({
        register: () =>
          onRegister({
            id: `p-${Date.now()}`,
            prsnNm,
            qualYn,
            scrtMsrYmd,
            fileName: files[0]?.name ?? '',
          }),
      }),
      [onRegister, prsnNm, qualYn, scrtMsrYmd, files],
    )

    return (
      <div className="flex flex-col gap-krds-7">
        {/* 인원 정보(필수 아님) — 성명 / 적격여부 / 보안측정일 */}
        <div className="flex flex-col gap-krds-5">
          <InputLabel htmlFor="scrt-prsnNm">성명</InputLabel>
          <InputBox
            id="scrt-prsnNm"
            value={prsnNm}
            placeholder="입력해주세요."
            onChange={(e) => setPrsnNm(e.target.value)}
            onClear={() => setPrsnNm('')}
          />
        </div>
        <div className="flex flex-col gap-krds-5">
          <InputLabel>적격여부</InputLabel>
          <SelectBox
            placeholder="선택해주세요."
            value={qualYn}
            onValueChange={setQualYn}
            items={QUAL_OPTIONS}
          />
        </div>
        <div className="flex flex-col gap-krds-5">
          <InputLabel htmlFor="scrt-ymd">보안측정일</InputLabel>
          <InputBox
            id="scrt-ymd"
            value={scrtMsrYmd}
            placeholder="yyyy-MM-dd"
            onChange={(e) => setScrtMsrYmd(e.target.value)}
            onClear={() => setScrtMsrYmd('')}
          />
        </div>

        {/* 첨부파일* — 파일 추가 + 목록(삭제). 필수(slide169). */}
        <div className="flex flex-col gap-krds-5">
          <InputLabel required>첨부파일 — 총 {files.length}건</InputLabel>
          <FileDownloadList
            files={files.map((f) => ({ ...f, onRemove: () => handleRemove(f.id ?? f.name) }))}
            onAddFile={handleAddFile}
            addFileLabel="파일 추가"
          />
        </div>
      </div>
    )
  },
)
ScrtyMsrmtPrsnlReg.displayName = 'ScrtyMsrmtPrsnlReg'

export { ScrtyMsrmtPrsnlReg }
