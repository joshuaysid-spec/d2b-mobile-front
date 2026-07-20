// 실적증명서 제출 — MUI-CM-04-P20 (PrfmncPrdocSbmsn). 설계서 00.공통 v0.84 slide329~330.
// 실적증명서 확인(M07) (+)시트 [실적증명서 제출]에서 여는 풀팝업(FullPopup 래퍼 컨벤션 — ID+FullPopup).
// 온라인 제출 가능 협회 7곳 멀티 선택 제출. 송신완료 건은 비고(rmrkCn) 입력 + 제출취소(협회 재전송).
// footer [닫기 | 제출하기] — 송신완료 건이 선택되면 '제출하기' → '제출취소' 라벨 변경(slide329).
// Figma 전용 프레임 없음 → 내부 컨벤션. 제출/제출취소 전송은 API 미연동 스텁.
import { useState } from 'react'

import { Badge } from '@/ui/common/base/Badge'
import { Button } from '@/ui/common/base/Button'
import { Checkbox } from '@/ui/common/base/Checkbox'
import { InputBox } from '@/ui/common/base/InputBox'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import type { SbmsnAsctnItem } from '@/types/cm'

// 온라인 제출 대상 협회 7곳(slide329) — dl_sbmsnAsctnList 목업.
// 상태(sttsVl)·비고(rmrkCn)는 slide329 표시값(건설산업정보원 송신완료 + "계약 금액이 다름").
const dl_sbmsnAsctnList: SbmsnAsctnItem[] = [
  { sbmsnSttsNm: '대한건설협회' },
  { sbmsnSttsNm: '건설산업정보원', sttsVl: '송신완료', rmrkCn: '계약 금액이 다름' },
  { sbmsnSttsNm: '대한전문건설협회' },
  { sbmsnSttsNm: '한국전기공사협회' },
  { sbmsnSttsNm: '한국정보통신공사협회' },
  { sbmsnSttsNm: '한국건설기술인협회' },
  { sbmsnSttsNm: '한국소방시설협회' },
]

export interface PrfmncPrdocSbmsnFullPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrfmncPrdocSbmsnFullPopup({ open, onOpenChange }: PrfmncPrdocSbmsnFullPopupProps) {
  const [items, setItems] = useState<SbmsnAsctnItem[]>(dl_sbmsnAsctnList)
  const [selected, setSelected] = useState<string[]>([]) // 선택 협회명(멀티 — 이벤트 설명)

  const toggle = (name: string, checked: boolean) =>
    setSelected((prev) => (checked ? [...prev, name] : prev.filter((n) => n !== name)))

  const setRmrk = (name: string, rmrkCn: string) =>
    setItems((prev) => prev.map((it) => (it.sbmsnSttsNm === name ? { ...it, rmrkCn } : it)))

  // 송신완료 건이 선택되면 footer '제출하기' → '제출취소'(slide329).
  const hasSentSelected = items.some(
    (it) => it.sttsVl === '송신완료' && selected.includes(it.sbmsnSttsNm),
  )

  const handleSubmit = () => {
    if (hasSentSelected) {
      // 제출취소 — 비고에 취소 내용 입력 후 다시 협회로 전송(slide330 이벤트 설명)
      console.log('[PrfmncPrdocSbmsn] 제출취소(API 미연동)', { selected, items })
    } else {
      // 제출하기 — 발급된 실적증명서 정보를 선택된 협회로 제출(멀티)
      console.log('[PrfmncPrdocSbmsn] 제출하기(API 미연동)', { selected })
    }
  }

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="실적증명서 제출"
      footer={
        <ButtonGroup
          layout="asymmetric"
          items={[
            { label: '닫기', variant: 'secondary', onClick: () => onOpenChange(false) },
            {
              label: hasSentSelected ? '제출취소' : '제출하기',
              variant: 'primary',
              disabled: selected.length === 0,
              onClick: handleSubmit,
            },
          ]}
        />
      }
    >
      {/* FullPopup body 는 무패딩 — 컨벤션대로 px-4 py-4(16px) 여백을 콘텐츠에서 부여 */}
      <div className="flex flex-col gap-4 p-4">
        <h3 className="text-[19px] font-bold leading-normal text-krds-text-ink">
          온라인 제출 가능 협회 목록
        </h3>

        <div className="flex flex-col gap-krds-7">
          {items.map((it) => {
            const isSelected = selected.includes(it.sbmsnSttsNm)
            const isSent = it.sttsVl === '송신완료'
            return (
              <div
                key={it.sbmsnSttsNm}
                className="flex flex-col gap-krds-5 rounded-[12px] border border-krds-border-divider bg-background p-4"
              >
                <div className="flex items-center gap-krds-5">
                  {/* 협회명 + 상태 레이블(미제출 시 미표시 — slide329) */}
                  <span className="min-w-px flex-1 text-[17px] font-bold leading-normal text-krds-text-ink wrap-break-word">
                    {it.sbmsnSttsNm}
                  </span>
                  {it.sttsVl && <Badge>{it.sttsVl}</Badge>}
                  <Checkbox
                    label="선택"
                    checked={isSelected}
                    onCheckedChange={(c) => toggle(it.sbmsnSttsNm, c === true)}
                  />
                </div>

                {/* 송신완료 건 — 비고(rmrkCn) 입력 + 제출취소(비고 입력 후 재전송) */}
                {isSent && (
                  <div className="flex flex-col gap-krds-5">
                    <div className="flex items-center gap-krds-3">
                      <span className="shrink-0 text-[15px] font-medium text-krds-text-muted">
                        비고
                      </span>
                      <InputBox
                        className="flex-1"
                        placeholder="입력해주세요."
                        value={it.rmrkCn ?? ''}
                        onChange={(e) => setRmrk(it.sbmsnSttsNm, e.target.value)}
                        onClear={() => setRmrk(it.sbmsnSttsNm, '')}
                      />
                    </div>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() =>
                        console.log('[PrfmncPrdocSbmsn] 제출취소(행, API 미연동)', it.sbmsnSttsNm, it.rmrkCn)
                      }
                    >
                      제출취소
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </FullPopup>
  )
}
PrfmncPrdocSbmsnFullPopup.displayName = 'PrfmncPrdocSbmsnFullPopup'
