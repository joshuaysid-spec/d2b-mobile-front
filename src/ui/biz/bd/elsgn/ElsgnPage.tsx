// 전자서명 (MUI-BD-04-M21, 영문ID Elsgn · 설계서 02입찰 slide132).
// 접속: 홈 > 입찰 진행 > 입찰서(견적서)작성 - 전자서명.
// 용도: 사전심사(PQ)/입찰참가신청/입찰서에 전자서명을 처리하는 화면.
// 흐름: 견적서작성하기/신청서 제출 → 전자서명(Elsgn) → [전자서명 하기] → 인증서 선택 → 비밀번호(가상키패드)
//        → 서명 완료 → 신청완료(AplyCmptn) 로 이동.
// 레이아웃: 요약(SummaryInfo) → 안내 영역(아이콘+안내문구) → [전자서명 하기] 주 버튼 → 맨위로 FAB.
//        + [전자서명 하기] → 전자서명 BottomSheet(인증서 목록 'cert' → 비밀번호 입력 'pwd' 2단계).
// 가상키패드/인증서 행은 biz/bd/elsgn 도메인 전용 조립이라 본 파일 내 작은 컴포넌트로 인라인.
// 목록→상세 표준: useLocation().state(AplyFlowState) ?? MOCK_DETAIL. 항목명/형식은 설계서 데이터영역 그대로.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { bdQueries } from '@/queries/bds/bd/bdQueries'
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { FloatingActionButton } from '@/ui/common/composites/FloatingActionButton'
import { SummaryInfo } from '@/ui/common/composites/SummaryInfo'
import { cn } from '@/utils/cn'
import type { ApiError } from '@/types/api'
import type { AplyFlowState, BidPrgrsItem, ElsgnCert } from '@/types/bd'

// 직접 URL 진입(state 없음) 대비 fallback 목업 — 설계서 항목명/형식 그대로.
const MOCK_DETAIL: BidPrgrsItem = {
  rNum: '0',
  taskSeNm: '물품',
  pbancNo: '긴급공고 LDG0097-1',
  prcmNo: '56349',
  bidNm: '특수작전용대물타격무인항공기',
  rfrncNo: '2025LDG56349',
  orderInstTelno: '031-940-0000',
  ctrtMthdNm: '경쟁입찰',
  bidMthdNm: '총액제',
  bidClrsDt: '2026-03-16 15:00',
  tndrSbmsnDdlnDt: '2026-03-17 15:00',
  bzentySeNm: '대표',
  bfhdSrng: true,
  bidPrgrsApfr: true,
  tndr: false,
  techEvl: false,
  prdcpDcmntSbms: false,
  apfrStatNm: '신청',
  regRjctYn: false,
}

// 가상키패드 키 배열(설계서 slide132: 숫자 0~9 + 정정/취소). 3열 × 4행 그리드.
const KEYPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '정정', '0', '취소'] as const
const PWD_MAX = 8

export function ElsgnPage() {
  const navigate = useNavigate()
  const state = useLocation().state as AplyFlowState | null
  const detail = state?.detail ?? MOCK_DETAIL
  const aplyType = state?.aplyType ?? 'tndr'

  const [sheetOpen, setSheetOpen] = useState(false)
  const [step, setStep] = useState<'cert' | 'pwd'>('cert')
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null)
  const [pwd, setPwd] = useState('')
  const [signError, setSignError] = useState<string | null>(null) // 전자서명 실패 안내(null=닫힘)

  // 전자서명 인증서 목록 — 목업/실연동은 bdService.selectElsgnCerts 의 USE_MOCK 분기가 전환.
  const { data: certData } = bdQueries.useSelectElsgnCerts()
  const certs = certData ?? []
  const signElsgn = bdQueries.useSignElsgn()

  // 시트 초기화 — 닫거나 다시 열 때 단계/선택/비밀번호 리셋.
  const resetSheet = () => {
    setStep('cert')
    setSelectedCertId(null)
    setPwd('')
  }

  const openSheet = () => {
    resetSheet()
    setSheetOpen(true)
  }

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open)
    if (!open) resetSheet()
  }

  // 가상키패드 입력 — 숫자=채움(최대 PWD_MAX) · 정정=마지막 한 자리 삭제 · 취소=시트 닫기.
  const handleKeypad = (key: string) => {
    if (key === '정정') {
      setPwd((prev) => prev.slice(0, -1))
      return
    }
    if (key === '취소') {
      handleSheetOpenChange(false)
      return
    }
    setPwd((prev) => (prev.length >= PWD_MAX ? prev : prev + key))
  }

  // 서명 완료 → 신청완료(MUI-BD-06-M08) 로 이동. 접수번호/일시는 signElsgn 응답값.
  const handleSign = async () => {
    try {
      const receipt = await signElsgn.mutateAsync({
        certId: selectedCertId ?? '',
        pbancNo: detail.pbancNo,
      })
      setSheetOpen(false)
      navigate('/bd/aplyCmptn', {
        state: {
          detail,
          aplyType,
          rcptNo: receipt.rcptNo,
          rcptDt: receipt.rcptDt,
        } satisfies AplyFlowState,
      })
    } catch (err) {
      setSheetOpen(false)
      setSignError(
        (err as ApiError | null)?.message ?? '전자서명에 실패했습니다. 잠시 후 다시 시도해주세요.',
      )
    }
  }

  // 시트 footer — 단계별: cert=취소/다음(선택해야 활성) · pwd=취소/전자서명(확인)
  const sheetFooter =
    step === 'cert' ? (
      <ButtonGroup
        layout="asymmetric"
        items={[
          { label: '취소', variant: 'secondary', onClick: () => handleSheetOpenChange(false) },
          {
            label: '다음',
            variant: 'primary',
            disabled: !selectedCertId,
            onClick: () => setStep('pwd'),
          },
        ]}
      />
    ) : (
      <ButtonGroup
        layout="asymmetric"
        items={[
          { label: '취소', variant: 'secondary', onClick: () => handleSheetOpenChange(false) },
          {
            label: '전자서명',
            variant: 'primary',
            disabled: pwd.length === 0,
            onClick: handleSign,
          },
        ]}
      />
    )

  return (
    <div className="flex w-full flex-col">
      {/* 요약 — 업무구분/입찰방식 + 공고번호 + 입찰건명 */}
      <SummaryInfo
        badges={[
          { key: 'task', label: detail.taskSeNm },
          { key: 'ctrt', label: detail.ctrtMthdNm },
        ]}
        subtitle={detail.pbancNo}
        title={detail.bidNm}
      />

      {/* 안내 영역 — 아이콘 + 안내 문구(설계서 slide132 원문) */}
      <div className="flex flex-col items-center gap-4 px-4 py-12 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-krds-bg-primary-faint text-krds-text-primary">
          <Icon name="VerifiedUser" size={44} aria-hidden />
        </div>
        <p className="text-[19px] font-bold leading-normal text-krds-text-ink">
          전자서명을 진행합니다.
        </p>
        <p className="text-[15px] font-normal leading-normal text-krds-text-muted">
          전자서명 창이 닫혔을 경우 아래 버튼을 통해
          <br />
          전자 서명을 다시 띄울 수 있습니다.
        </p>
      </div>

      {/* 주 버튼 — 전자서명 하기 (풀폭) */}
      <div className="px-4 pb-4">
        <Button variant="primary" className="w-full" onClick={openSheet}>
          전자서명 하기
        </Button>
      </div>

      {/* 맨위로 FAB — #app-scroll 컨테이너 기준(window.scrollTo 금지) */}
      <FloatingActionButton
        className="fixed bottom-0 right-4 z-40"
        onTop={() =>
          document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />

      {/* 전자서명 BottomSheet — cert(인증서 선택) → pwd(비밀번호 가상키패드) 2단계 */}
      <BottomSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        title="전자서명"
        footer={sheetFooter}
      >
        {step === 'cert' ? (
          <ElsgnCertList certs={certs} selectedId={selectedCertId} onSelect={setSelectedCertId} />
        ) : (
          <ElsgnPwdKeypad pwd={pwd} onKey={handleKeypad} />
        )}
      </BottomSheet>

      {/* 전자서명 실패 안내 */}
      <AlertModal
        open={signError !== null}
        onOpenChange={(open) => {
          if (!open) setSignError(null)
        }}
        variant="error"
        title="전자서명 실패"
        description={signError}
        primaryAction={{ label: '확인', onClick: () => setSignError(null) }}
      />
    </div>
  )
}
ElsgnPage.displayName = 'ElsgnPage'

// ─── 전자서명 인증서 목록(라디오형 선택) — 도메인 전용 조립 ────────────────────
interface ElsgnCertListProps {
  certs: ElsgnCert[]
  selectedId: string | null
  onSelect: (id: string) => void
}

function ElsgnCertList({ certs, selectedId, onSelect }: ElsgnCertListProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[15px] font-normal leading-normal text-krds-text-muted">
        전자서명에 사용할 인증서를 선택하세요.
      </p>
      <ul className="flex flex-col gap-2">
        {certs.map((cert) => {
          const selected = cert.id === selectedId
          return (
            <li key={cert.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(cert.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-krds-8 border px-4 py-3 text-left transition-colors',
                  selected
                    ? 'border-krds-border-primary bg-krds-bg-primary-faint'
                    : 'border-krds-border-divider bg-background',
                )}
              >
                <Icon
                  name={selected ? 'CheckCircle' : 'Description'}
                  size={24}
                  className={selected ? 'text-krds-text-primary' : 'text-krds-text-muted'}
                  aria-hidden
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[17px] font-bold leading-normal text-krds-text-ink">
                    {cert.certNm}
                  </span>
                  <span className="text-[14px] font-normal leading-normal text-krds-text-muted">
                    유효기간: {cert.vldPdEndDt}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ─── 비밀번호 입력 + 가상키패드(보안 입력 목업) — 도메인 전용 조립 ────────────
interface ElsgnPwdKeypadProps {
  pwd: string
  onKey: (key: string) => void
}

function ElsgnPwdKeypad({ pwd, onKey }: ElsgnPwdKeypadProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 비밀번호 입력 라벨 + 마스킹 표시(●) */}
      <div className="flex flex-col gap-2">
        <span className="text-[15px] font-bold leading-normal text-krds-text-ink">
          비밀번호 입력
        </span>
        <div className="flex h-12 items-center rounded-krds-8 border border-krds-border-divider bg-background px-4">
          <span className="text-[20px] leading-none tracking-[0.3em] text-krds-text-ink">
            {pwd.length > 0 ? '●'.repeat(pwd.length) : (
              <span className="text-[15px] tracking-normal text-krds-text-muted">
                비밀번호를 입력하세요.
              </span>
            )}
          </span>
        </div>
      </div>

      {/* 가상키패드 — 보안 입력 목업(숫자 0~9 + 정정/취소). 3열 그리드. */}
      <div className="grid grid-cols-3 gap-2">
        {KEYPAD_KEYS.map((key) => {
          const isSpecial = key === '정정' || key === '취소'
          return (
            <Button
              key={key}
              variant={isSpecial ? 'secondary' : 'inner'}
              className="h-14 text-[19px]"
              onClick={() => onKey(key)}
            >
              {key}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
