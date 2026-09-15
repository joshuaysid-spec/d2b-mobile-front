// 보안측정인원 등록 콘텐츠 (MUI-CM-01-P10, ScrtyMsrmtPrsnlReg). 설계서 slide169.
//   국내소재상사(M23) 폼의 보안측정인원 [신규 추가]에서 호출 → 성명/적격여부/보안측정일 + 첨부파일 입력
//   → [등록] 시 1건 반환(부모가 시트 닫음). 컨테이너(BottomSheet)·타이틀·footer([등록][닫기])는 부모(M23 폼)가 소유.
//   ⚠️ 설계서에 데이터영역(항목명 영문) 표 없음 → 화면 표기 기준 잠정 영문키(성명/적격여부/보안측정일/첨부파일).
//      인원 정보(성명/적격/측정일)는 필수 아님, 첨부파일만 필수(*)(slide169). (2026-07-01 개정: 주민등록번호 삭제)
//   footer [등록] 은 부모가 렌더 → 입력 상태는 이 콘텐츠가 소유, ref(ScrtyMsrmtPrsnlRegHandle.register)로 확정만 노출.
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'
import { FileAdd, type FileAddHandle } from '@/ui/biz/cm/fileAdd/FileAdd'
import type { MockScrtyMsrmtPrsn } from '@/types/mock/cm'
import type { UploadedFile } from '@/types/file'

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
  onRegister: (person: MockScrtyMsrmtPrsn) => void
}

const ScrtyMsrmtPrsnlReg = forwardRef<ScrtyMsrmtPrsnlRegHandle, ScrtyMsrmtPrsnlRegProps>(
  ({ onRegister }, ref) => {
    const [prsnNm, setPrsnNm] = useState('')
    const [qualYn, setQualYn] = useState('')
    const [scrtMsrYmd, setScrtMsrYmd] = useState('')
    // 첨부파일 — 파일 추가 시트에서 업로드 완료된 건(응답 통째 uploaded + 입력한 첨부서류명 docNm, v0.87 검토 39번).
    const [files, setFiles] = useState<(FileDownloadItem & { docNm: string; uploaded: UploadedFile })[]>([])
    // 파일 추가 시트 — P10 자체가 시트 콘텐츠라 중첩 컨테이너는 여기서 소유(부모 M23 은 관여 X, 설계서 "공통 파일첨부 사용").
    const [fileAddOpen, setFileAddOpen] = useState(false)
    const fileAddRef = useRef<FileAddHandle>(null)

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
            docNm: files[0]?.docNm, // 첨부서류명(v0.87 검토 39번)
            uploaded: files[0]?.uploaded, // 업로드 응답 통째 — 등록 API 에서 guid 등 추출
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

        {/* 첨부파일* — 파일 추가([공통] 파일 추가 시트) + 목록(삭제). 필수(slide169). */}
        <div className="flex flex-col gap-krds-5">
          <InputLabel required>첨부파일 — 총 {files.length}건</InputLabel>
          <FileDownloadList
            files={files.map((f) => ({ ...f, onRemove: () => handleRemove(f.id ?? f.name) }))}
            onAddFile={() => setFileAddOpen(true)}
            addFileLabel="파일 추가"
          />
        </div>

        {/* [공통] 파일 추가 시트(v0.87 마지막 장) — 첨부서류명 직접입력 + 직접/캐비닛 업로드. */}
        <BottomSheet
          open={fileAddOpen}
          onOpenChange={setFileAddOpen}
          title="파일 추가"
          footer={
            <ButtonGroup
              items={[
                { label: '취소', variant: 'secondary', onClick: () => setFileAddOpen(false) },
                {
                  label: '완료',
                  variant: 'primary',
                  onClick: () => {
                    if (fileAddRef.current?.complete()) setFileAddOpen(false)
                  },
                },
              ]}
            />
          }
        >
          {fileAddOpen && (
            <FileAdd
              ref={fileAddRef}
              onComplete={({ docNm, files: picked }) =>
                // 업로드 완료분(id=guid, uploaded=응답 통째) + 입력한 첨부서류명 보관 → [등록] 시 부모로.
                setFiles((prev) => [
                  ...prev,
                  ...picked.map((p) => ({ id: p.id, name: p.name, size: p.size, docNm, uploaded: p.uploaded })),
                ])
              }
            />
          )}
        </BottomSheet>
      </div>
    )
  },
)
ScrtyMsrmtPrsnlReg.displayName = 'ScrtyMsrmtPrsnlReg'

export { ScrtyMsrmtPrsnlReg }
