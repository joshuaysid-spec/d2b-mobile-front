// 입찰서(견적서) 작성 - 파일첨부 (MUI-BD-06-M05, Figma 9973-63627 · 설계서 02입찰 v1.83 slide129·134)
// 호스트 페이지(TndrWrtPage)의 '파일첨부' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바는 페이지 소유.
// 설계서 slide129: "입찰참가신청서작성 – 파일첨부와 같은 구성임(서류항목이 다름)".
//   레퍼런스 BidPrtcpAperWrtPage_Stp6 재사용하되, Figma(9973:63627) 기준으로 서류항목별 행 구성.
// 구성: [입찰서 첨부파일] SectionTitle(총 N건) + '파일 추가' + 서류항목 행 N개(서류명/일자 + 파일칩)
//     + [기술평가서류] 동일 구성(2026-08-06 요청 — ⚠️ v1.83 slide134 dlt_tndrAtchFileList 에는 미정의, 개정 반영 잠정).
// '파일 추가' 클릭 → 파일첨부 방식 선택 바텀시트(MUI-BD-04-P13, CabinetLink) — 직접 업로드/캐비닛 선택.
//   직접 업로드 = 숨은 <input type=file> 트리거(다중), 캐비닛 선택 = 미배선 스텁(보관함 조회 API 미확정).
import { useRef, useState, type ChangeEvent } from 'react'
import dayjs from 'dayjs'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { CabinetLink, type CabinetLinkKind } from '@/ui/biz/bd/bidPrtcpAperWrt/CabinetLink'
import { formatFileSize } from '@/utils/format'
import type { MockBidPrgrsItem } from '@/types/mock/bd'

// 입찰서 첨부파일 데이터 영역(dlt_tndrAtchFileList, 설계서 slide134). 항목명(영문) 그대로.
interface TndrAtchFile {
  /** 식별자(고유) — 파일명 중복 가능하므로 목록 key 는 id 사용 */
  id: string
  /** 첨부서류명 (adocNm) — 첨부파일 구분 */
  adocNm: string
  /** 첨부파일명 (fileNm) */
  fileNm: string
  /** 파일크기 (fileSz) — 대괄호 없이(표시 시 [ ] 로 감쌈) */
  fileSz: string
  /** 첨부일자 — Figma 표시값(2026-01-01). ⚠️ dlt_tndrAtchFileList 미정의(상세설계 예정), 임시 항목 */
  atchDt: string
}

// 첨부 그룹 — 입찰서 첨부파일(tndr) / 기술평가서류(tech).
type AtchGroup = 'tndr' | 'tech'

// 입찰서 첨부파일 목록 목업(Figma 9973:63627). 서류항목별 노출 조건(설계서 slide134 비고)은 주석으로만 남기고
// 목업은 4건 모두 표시(실제로는 부서부호·계약방법·입찰방법 분기로 노출 여부 결정).
const INITIAL_FILES: TndrAtchFile[] = [
  // 규격제안서 — 부서부호 'E' 시작, 계약방법 'G'/'H', 2단계경쟁(분리/동시) 첨부파일 제출여부 'Y'
  { id: 'atch1', adocNm: '규격제안서', fileNm: '첨부파일명.hwp', fileSz: '786KB', atchDt: '2026-01-01' },
  // 공종별 산출내역서 — 내역입찰(최저가/적격심사)+산출내역서적용, 또는 내역입찰(종합심사)+공사구분≠감리용역 등
  { id: 'atch2', adocNm: '공종별 산출내역서', fileNm: '첨부파일명.hwp', fileSz: '786KB', atchDt: '2026-01-01' },
  // 자기평가기술서 — 내역입찰(최저가/적격심사)+산출내역서적용
  { id: 'atch3', adocNm: '자기평가기술서', fileNm: '첨부파일명.hwp', fileSz: '786KB', atchDt: '2026-01-01' },
  // 기타참조서류 — 내역입찰(종합심사)+감리용역+산출내역서 비적용
  { id: 'atch4', adocNm: '기타참조서류', fileNm: '첨부파일명.hwp', fileSz: '786KB', atchDt: '2026-01-01' },
]

// 기술평가서류 목록 목업 — ⚠️ v1.83 설계서 미정의(개정 반영 잠정): 항목 구조는 dlt_tndrAtchFileList 준용.
const INITIAL_TECH_FILES: TndrAtchFile[] = [
  { id: 'tech1', adocNm: '기술평가서류', fileNm: '첨부파일명.hwp', fileSz: '786KB', atchDt: '2026-01-01' },
]

export function TndrWrt_Stp5({ detail }: { detail: MockBidPrgrsItem }) {
  const [files, setFiles] = useState<TndrAtchFile[]>(INITIAL_FILES)
  const [techFiles, setTechFiles] = useState<TndrAtchFile[]>(INITIAL_TECH_FILES)
  // 파일첨부 방식 선택 시트(P13) — null=닫힘, 값=열림 + 추가 대상 그룹.
  const [addTarget, setAddTarget] = useState<AtchGroup | null>(null)
  const pickTarget = useRef<AtchGroup>('tndr') // 파일 선택기 진행 중인 대상 그룹
  const inputRef = useRef<HTMLInputElement>(null)

  // P13 방식 선택 — '직접 업로드'면 시트 닫고 파일 선택기 열기(사용자 제스처 내 호출).
  const handleSelectMethod = (kind: CabinetLinkKind) => {
    if (addTarget) pickTarget.current = addTarget
    setAddTarget(null)
    if (kind === 'direct') {
      inputRef.current?.click()
    } else {
      // 캐비닛 선택 — 미배선(보관함 조회 API 미확정). 추후 API: bdService.linkCabinet
      console.log('[M05] 캐비닛 선택 (미배선)', pickTarget.current)
    }
  }

  // 직접 업로드 파일 선택 완료 → 대상 그룹 목록에 추가. 추후 API: bdService.uploadTndrFile
  const handleFilesPicked = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    e.target.value = '' // 같은 파일 재선택 허용
    if (picked.length === 0) return
    const target = pickTarget.current
    const rows: TndrAtchFile[] = picked.map((f) => ({
      id: crypto.randomUUID(),
      // ⚠️ 첨부서류 구분(adocNm) 선택 UI 는 상세설계 예정 — 직접 업로드는 그룹 기본 구분으로 잠정 표기.
      adocNm: target === 'tech' ? '기술평가서류' : '기타참조서류',
      fileNm: f.name,
      fileSz: formatFileSize(f.size),
      atchDt: dayjs().format('YYYY-MM-DD'),
    }))
    console.log('[M05] 입찰서 파일 추가', target, rows.map((r) => r.fileNm), detail.pbancNo)
    if (target === 'tech') setTechFiles((prev) => [...prev, ...rows])
    else setFiles((prev) => [...prev, ...rows])
  }

  // 추후 API: bdService.removeTndrFile
  const handleRemove = (group: AtchGroup, id: string) => {
    console.log('[M05] 입찰서 첨부파일 삭제', group, id, detail.pbancNo)
    if (group === 'tech') setTechFiles((prev) => prev.filter((f) => f.id !== id))
    else setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  // 첨부 그룹 렌더 — 파일첨부 헤더 + '파일 추가' + 서류항목 행(서류명/일자 + 파일칩(onRemove X)).
  const renderGroup = (group: AtchGroup, list: TndrAtchFile[]) => (
    <div className="flex flex-col gap-krds-8 px-4 py-4">
      {/* 파일 추가 — 클릭 시 파일첨부 방식 선택(P13) 바텀시트 */}
      <div className="flex flex-col gap-krds-3">
        <h4 className="text-[17px] font-bold leading-normal text-krds-text-ink">파일첨부</h4>
        <Button variant="inner" className="w-full" onClick={() => setAddTarget(group)}>
          <Icon name="Add" size={20} aria-hidden />
          파일 추가
        </Button>
      </div>

      {list.map((file) => (
        <div key={file.id} className="flex flex-col gap-krds-3">
          <div className="flex items-center justify-between gap-krds-3">
            <span className="min-w-px flex-1 text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
              {file.adocNm}
            </span>
            <span className="shrink-0 text-[17px] leading-normal text-krds-text-muted">
              {file.atchDt}
            </span>
          </div>
          <FileDownloadList
            files={[
              {
                id: file.id,
                name: file.fileNm,
                size: file.fileSz,
                onRemove: () => handleRemove(group, file.id),
              },
            ]}
          />
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* 입찰서 첨부파일 — 총 건수 */}
      <SectionTitle as="h3" info={`총 ${files.length}건`} className="bg-white">
        입찰서 첨부파일
      </SectionTitle>
      {renderGroup('tndr', files)}

      {/* 기술평가서류 — 총 건수 (2026-08-06 요청 신설) */}
      <SectionTitle as="h3" info={`총 ${techFiles.length}건`} className="bg-white">
        기술평가서류
      </SectionTitle>
      {renderGroup('tech', techFiles)}

      {/* 숨은 파일 선택기 — '직접 업로드'로 트리거(다중 선택) */}
      <input ref={inputRef} type="file" multiple className="hidden" onChange={handleFilesPicked} />

      {/* 파일첨부 방식 선택(MUI-BD-04-P13) — 이 탭이 컨테이너 소유, 콘텐츠는 CabinetLink 재사용 */}
      <BottomSheet
        open={addTarget !== null}
        onOpenChange={(open) => !open && setAddTarget(null)}
        title="파일첨부 방식 선택"
      >
        <CabinetLink onSelect={handleSelectMethod} />
      </BottomSheet>
    </>
  )
}
TndrWrt_Stp5.displayName = 'TndrWrt_Stp5'
