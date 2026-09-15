// [공통] 파일 추가 (설계서 v0.87 마지막 장, 2026-08-28 신규) — BottomSheet 콘텐츠 전용.
//   기존 캐비닛 연결(MUI-BD-04-P13) 팝업을 대체하는 파일 첨부 공통 화면. 컨테이너(BottomSheet)·
//   타이틀('파일 추가')·footer([취소][완료])는 사용처(부모)가 소유하고, 여기는 콘텐츠만 담는다.
//   구성(슬라이드 순): [직접 업로드][캐비닛 업로드] → 첨부서류명(기본 직접입력 InputBox,
//   군수품 신청 등 항목 지정 시 docNmOptions 셀렉트) → 첨부파일 목록(파일명·크기·건별 삭제).
//
// 업로드 구조(2026-09-15 사용자 확정): ① 파일 선택 즉시 여기서 RaonK 업로드(fbQueries.useUploadFile —
//   파일당 1요청 순차 큐, 실패 건별 재시도) → ② 업로드 응답(UploadedFile)을 통째로 보관(uploaded)
//   → ③ [완료] 시 부모가 응답 통째 + 파일명을 받아 GUID 등 필요한 값을 꺼내 등록 API 에 다른 정보와 함께 전송
//   → ④ 성공 응답. [완료]는 "전부 업로드된 파일"만 넘긴다(업로드 중/실패 건이 있으면 완료 차단).
//   응답 필드가 늘어나면 types/file.ts UploadedFile 만 확장(여기·사용처 무수정). 업로드된 파일의 id = 응답 guid.
//   시트에서 X 삭제 시 이미 올린 파일은 fbQueries.useRemoveFile 로 서버에서도 제거.
//   캐비닛 업로드는 디지털 캐비닛 팝업 연동 전 목업 스텁(캐비닛 파일은 재업로드 없이 캐비닛 측 응답을 받는 구조 — 현재 임시값).
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { validateFile } from '@/services/tss/fb'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import type { UploadedFile } from '@/types/file'

/**
 * 추가된 파일 1건. 업로드 완료 후 `uploaded` 에 RaonK 응답이 통째로 들어가고 `id` 는 그 guid 가 된다.
 * 실제 File 객체는 직접 업로드 시에만 존재(캐비닛/목업은 메타만).
 */
export interface FileAddFile {
  /** 목록 key. 업로드 전 = 로컬 임시값, 업로드 후 = 응답 guid. */
  id: string
  /** 원본 파일명. */
  name: string
  /** 표시 크기('786KB'). */
  size: string
  file?: File
  /** 업로드 응답 통째(guid·orgnlFileNm·fileSz …) — 완료 시 설정. 부모는 여기서 guid 등을 꺼내 등록 API 로. */
  uploaded?: UploadedFile
  /** 업로드 상태 — 완료(done)만 [완료]로 부모에 전달. */
  status: 'uploading' | 'done' | 'error'
}

/** [완료]로 부모에 전달되는 파일 — 업로드가 끝나 응답(uploaded)이 확정된 건. */
export type FileAddDoneFile = FileAddFile & { uploaded: UploadedFile; status: 'done' }

/** 부모 footer [완료]가 호출 — 검증 통과 시 onComplete 실행 후 true(부모가 닫기). */
export interface FileAddHandle {
  complete: () => boolean
}

export interface FileAddProps {
  /** 첨부서류명 지정 항목(군수품 신청 등) — 주어지면 셀렉트, 없으면 직접입력(기본). */
  docNmOptions?: string[]
  /**
   * 첨부서류명 고정(연대보증서·품목대체첨부문서 등 서류가 정해진 자리) — 주어지면
   * 첨부파일명 입력/선택 필드를 숨기고 이 값으로 확정한다. docNmOptions 보다 우선.
   */
  fixedDocNm?: string
  /** 여러 파일 추가 허용(기본 true). false 면 새로 고른 파일이 기존을 교체. */
  multiple?: boolean
  /** [완료] 확정 — 첨부서류명 + 업로드 완료 파일 목록(uploaded 응답 포함) 반환. 부모가 목록 반영 → 등록 API 전송. */
  onComplete: (result: { docNm: string; files: FileAddDoneFile[] }) => void
}

// 바이트 → 표시 크기(KB/MB) — 설계서 '[파일크기]' 표기.
function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  return `${Math.max(1, Math.round(bytes / 1024))}KB`
}

const FileAdd = forwardRef<FileAddHandle, FileAddProps>(
  ({ docNmOptions, fixedDocNm, multiple = true, onComplete }, ref) => {
    const [docNm, setDocNm] = useState(fixedDocNm ?? '')
    const [files, setFiles] = useState<FileAddFile[]>([])
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const uploadFile = fbQueries.useUploadFile()
    const removeFile = fbQueries.useRemoveFile()
    // 순차 업로드 큐 — 프라미스 체인으로 항상 1건씩만 전송(추가 선택·재시도도 뒤에 이어붙음).
    const queueRef = useRef(Promise.resolve())

    const patchFile = (id: string, patch: Partial<FileAddFile>) =>
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))

    // 1건 업로드 — 성공 시 응답 통째 보관 + id 를 guid 로 확정(done), 실패 시 error(재시도 대기).
    const uploadOne = async (item: FileAddFile) => {
      if (!item.file) return
      patchFile(item.id, { status: 'uploading' })
      try {
        const uploaded = await uploadFile.mutateAsync(item.file)
        patchFile(item.id, { id: uploaded.guid, name: uploaded.orgnlFileNm, uploaded, status: 'done' })
      } catch {
        patchFile(item.id, { status: 'error' })
      }
    }
    const enqueue = (item: FileAddFile) => {
      queueRef.current = queueRef.current.then(() => uploadOne(item))
    }

    const appendFiles = (next: FileAddFile[]) => {
      setError(null)
      setFiles((prev) => {
        if (multiple) return [...prev, ...next]
        // 단일 파일: 기존 업로드분은 서버에서도 제거 후 교체.
        prev.forEach((f) => f.uploaded && removeFile.mutate(f.uploaded.guid))
        return next.slice(0, 1)
      })
    }

    // 직접 업로드 — 디바이스 저장소(input[type=file], AOS/iOS 시스템 파일 선택기).
    //   건당 10MB 검증(초과분 제외 안내) → 통과분은 즉시 순차 업로드 큐에.
    const handlePickDevice = (list: FileList | null) => {
      if (!list || list.length === 0) return
      const picked = Array.from(list)
      const rejected = picked.map(validateFile).filter((m): m is string => m !== null)
      const valid = picked.filter((f) => validateFile(f) === null)
      if (rejected.length > 0) setError(rejected.join(' '))
      if (valid.length === 0) return
      const items: FileAddFile[] = valid.map((f, i) => ({
        id: `d-${Date.now()}-${i}`,
        name: f.name,
        size: formatSize(f.size),
        file: f,
        status: 'uploading',
      }))
      appendFiles(items)
      const toUpload = multiple ? items : items.slice(0, 1)
      toUpload.forEach(enqueue)
    }

    // 캐비닛 업로드 — 디지털 캐비닛 팝업에서 파일 선택(연동 전 목업 스텁).
    //   캐비닛 파일은 이미 서버에 있어 재업로드 없이 캐비닛 측 응답을 받는 구조 — 임시 응답으로 done 처리.
    const handlePickCabinet = () => {
      console.log('[FileAdd] 캐비닛 업로드') // 추후: 디지털 캐비닛 파일 선택 팝업 호출 → 선택분(응답 포함) append
      const guid = crypto.randomUUID()
      appendFiles([
        {
          id: guid,
          name: '첨부파일명.hwp',
          size: '786KB',
          uploaded: { guid, orgnlFileNm: '첨부파일명.hwp', fileSz: 786 * 1024 },
          status: 'done',
        },
      ])
    }

    // X 삭제 — 업로드된 파일은 서버에서도 제거(fire-and-forget), 목록에서 제외.
    const handleRemove = (id: string | number) =>
      setFiles((prev) => {
        const target = prev.find((f) => f.id === id)
        if (target?.uploaded) removeFile.mutate(target.uploaded.guid)
        return prev.filter((f) => f.id !== id)
      })

    // 실패 건 재업로드 — 큐 뒤에 이어붙여 순차 유지.
    const handleRetry = (item: FileAddFile) => {
      patchFile(item.id, { status: 'uploading' })
      enqueue(item)
    }

    useImperativeHandle(
      ref,
      () => ({
        complete: () => {
          const name = docNm.trim()
          if (!name) {
            setError(
              docNmOptions ? '첨부파일명을 선택해주세요.' : '첨부파일명을 입력해주세요.',
            )
            return false
          }
          if (files.length === 0) {
            setError('첨부할 파일을 추가해주세요.')
            return false
          }
          if (files.some((f) => f.status === 'uploading')) {
            setError('파일을 업로드하는 중입니다. 잠시 후 완료해주세요.')
            return false
          }
          if (files.some((f) => f.status === 'error')) {
            setError('업로드에 실패한 파일이 있습니다. 재시도하거나 삭제해주세요.')
            return false
          }
          const done = files.filter(
            (f): f is FileAddDoneFile => f.status === 'done' && f.uploaded !== undefined,
          )
          console.log('[FileAdd] 완료', name, done.map((f) => f.uploaded))
          onComplete({ docNm: name, files: done })
          return true
        },
      }),
      [docNm, files, docNmOptions, onComplete],
    )

    return (
      <div className="flex flex-col gap-krds-7 py-krds-5">
        {/* 업로드 방식 — 직접(디바이스 저장소) / 캐비닛(디지털 캐비닛). */}
        <div className="flex gap-krds-5">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => inputRef.current?.click()}
          >
            <Icon name="Upload" size={20} aria-hidden />
            직접 업로드
          </Button>
          <Button variant="secondary" className="flex-1" onClick={handlePickCabinet}>
            <Icon name="Description" size={20} aria-hidden />
            캐비닛 업로드
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            className="hidden"
            onChange={(e) => {
              handlePickDevice(e.target.files)
              e.target.value = '' // 같은 파일 재선택 허용
            }}
          />
        </div>

        {/* 첨부서류명 — 기본 직접입력, 항목 지정(군수품 등) 시 셀렉트. 고정(fixedDocNm)이면 필드 숨김. */}
        {!fixedDocNm && (
        <div className="flex flex-col gap-krds-5">
          <InputLabel required>첨부파일명</InputLabel>
          {docNmOptions ? (
            <SelectBox
              placeholder="첨부파일명을 선택해주세요."
              value={docNm}
              onValueChange={(v) => {
                setDocNm(v)
                setError(null)
              }}
              items={docNmOptions.map((t) => ({ value: t, label: t }))}
            />
          ) : (
            <InputBox
              value={docNm}
              placeholder="첨부파일명을 입력해주세요."
              onChange={(e) => {
                setDocNm(e.target.value)
                setError(null)
              }}
              onClear={() => setDocNm('')}
            />
          )}
        </div>
        )}

        {/* 첨부파일 — 파일명·크기 + 업로드 상태(업로드 중/실패→재시도) + 건별 삭제. */}
        <div className="flex flex-col gap-krds-5">
          <InputLabel>첨부파일</InputLabel>
          {files.length > 0 ? (
            <FileDownloadList
              files={files.map((f) => ({
                id: f.id,
                name: f.name,
                size: f.size,
                status: f.status === 'done' ? undefined : f.status,
                onRetry: f.status === 'error' ? () => handleRetry(f) : undefined,
                onRemove: () => handleRemove(f.id),
              }))}
            />
          ) : (
            <p className="text-[15px] leading-normal text-krds-text-muted">
              직접 업로드 또는 캐비닛 업로드로 파일을 추가해주세요.
            </p>
          )}
        </div>

        {error && <InputMessage type="error">{error}</InputMessage>}
      </div>
    )
  },
)
FileAdd.displayName = 'FileAdd'

export { FileAdd }
