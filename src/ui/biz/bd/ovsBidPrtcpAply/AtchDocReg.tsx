// 스탭4 첨부파일 (MUI-BD-04-T75(구 M77 — v1.83 재편) 입찰참가신청서작성-파일첨부 · 설계서 slide337 · 데이터 slide340 · 이벤트 slide341).
// 호스트 페이지(OvsBidPrtcpAplyPage)의 '첨부파일' 탭 본문만 담당 — 요약/스텝/탭/하단 액션바(신청하기)는 페이지 소유.
// 구성(국외 입찰서제출 OvsTndrSbmsnPage_Stp3 패턴 그대로): 안내 Infobox + SectionTitle(총 N건)
//   + '파일 추가' 버튼 + 서류항목 행 N개(해외업체위임장/공급자증명서/제작사증명서/기타 공고요구서류 — 파일칩 + 삭제)
//   + 입찰 확약문(설계서 slide337 확약/구비서류 문안 그대로).
// 항목명/형식은 첨부서류 데이터영역(dl_docList, 설계서 slide340) 그대로.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FileDownloadList } from '@/ui/common/composites/FileDownloadList'
import { Infobox } from '@/ui/common/composites/Infobox'
import type { OvsAtchDocItem } from '@/ui/biz/bd/ovsBidPrtcpAply/OvsBidPrtcpAplyPage'
import type { BidPrgrsItem } from '@/types/mock/bd'

// 첨부파일 목록 목업 — 설계서 slide337 서류항목(해외업체위임장/공급자증명서/제작사증명서/기타 공고요구서류) 그대로.
const INITIAL_FILES: OvsAtchDocItem[] = [
  { id: 'doc1', atchDocNm: '해외업체위임장', atchFileNm: '해외업체위임장_FA무역대리점.hwp', fileSz: '324KB' },
  { id: 'doc2', atchDocNm: '공급자증명서', atchFileNm: '공급자증명서_A해외업체.hwp', fileSz: '512KB' },
  { id: 'doc3', atchDocNm: '제작사증명서', atchFileNm: '제작사증명서_MDHI.hwp', fileSz: '286KB' },
  {
    id: 'doc4',
    atchDocNm: '기타 공고요구서류',
    atchFileNm: '기타공고요구서류_EFD0007-2.hwp',
    fileSz: '1.2MB',
  },
]

export function AtchDocReg({ detail }: { detail: BidPrgrsItem }) {
  const [files, setFiles] = useState<OvsAtchDocItem[]>(INITIAL_FILES)

  const handleAdd = () => {
    console.log('[M77] 입찰참가 서류 파일 추가', detail.pbancNo)
    // 추후: 네이티브 파일 선택 → bdService.saveAtchDoc
  }

  const handleRemove = (id: string) => {
    console.log('[M77] 입찰참가 첨부파일 삭제', id, detail.pbancNo)
    // 추후 API: bdService.removeOvsBidPrtcpAtchDoc
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <>
      {/* 업무도움(설계서 slide337) — 입찰참가용 서류 첨부 안내. 탭명과 중복되는 큰 타이틀은 제거(260709) */}
      <Infobox
        title="안내사항"
        items={['입찰참가용 서류가 있는 경우 파일선택을 클릭하여 입찰참가 서류를 첨부합니다.']}
      />

      {/* 첨부파일 — 총 건수(설계서 slide337 '첨부파일 – 총 0건') */}
      <SectionTitle as="h3" topDivider info={`총 ${files.length}건`} className="bg-white">
        첨부파일
      </SectionTitle>

      <div className="flex flex-col gap-krds-8 px-4 py-4">
        {/* 파일 추가 */}
        <div className="flex flex-col gap-krds-3">
          <h4 className="text-[17px] font-bold leading-normal text-krds-text-ink">파일첨부</h4>
          <Button variant="inner" className="w-full" onClick={handleAdd}>
            <Icon name="Add" size={20} aria-hidden />
            파일 추가
          </Button>
        </div>

        {/* 서류항목별 행 — 첨부서류명 + 파일칩(FileDownloadList 업로드 변형: onRemove 로 삭제 X 버튼) */}
        {files.map((file) => (
          <div key={file.id} className="flex flex-col gap-krds-3">
            <span className="min-w-px flex-1 text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
              {file.atchDocNm}
            </span>
            <FileDownloadList
              files={[
                {
                  id: file.id,
                  name: file.atchFileNm,
                  size: file.fileSz,
                  onRemove: () => handleRemove(file.id),
                },
              ]}
            />
          </div>
        ))}
      </div>

      {/* 입찰 확약문(설계서 slide337) — 확약 문안 + 구비서류 안내 */}
      <div className="px-4 pb-6">
        <Infobox title="입찰 확약 및 구비서류 안내" collapsible={false}>
          <div className="flex flex-col gap-krds-5">
            <p>
              본인은 위의 번호로 공고한 귀청의 일반경쟁입찰에 참가하고자 귀청에서 정한
              물품구매(용역)입찰유의서, 계약 일반조건 및 입찰 공고 사항을 모두 숙지하여 수락하고
              계약일반조건 및 계약특수조건에 따라 계약품목을 기한 내에 납부할 것을 확약하며 입찰
              참가 신청서 및 아래 입찰서류를 제출합니다.
            </p>
            <p>
              단, 전차입찰의 경우 아래의 구비서류를 첨부 자료로써 제출하시고, 필요시 직접방문 및
              우편으로 제출요청을 받을 경우 제시하여야 함
            </p>
            <div>
              <p>1. 입찰 구비서류</p>
              <p>가. 입찰등록시 제출서류</p>
              <ul className="list-inside list-disc">
                <li>해외업체 위임장 1부</li>
                <li>공급자증명서 1부</li>
                <li>제작자 증명서 1부</li>
                <li>계약특수조건 1부</li>
                <li>서약서 1부</li>
              </ul>
            </div>
            <p>
              ※ 위 제출된 서류에 만약 이상이 있을 시에는 본 입찰 건을 무효 처리 하여도 이의가
              없음을 확인합니다.
            </p>
            <p>※ 입찰 참가신청서 작성 후 입찰 담당관의 심사를 받으셔야 입찰서제출이 가능합니다.</p>
          </div>
        </Infobox>
      </div>
    </>
  )
}
AtchDocReg.displayName = 'AtchDocReg'
