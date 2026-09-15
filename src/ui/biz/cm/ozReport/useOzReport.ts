// OZ 리포트 출력 훅 — 화면의 [출력] 버튼 → OzReportFullPopup 열기 보일러플레이트 축약.
//   const oz = useOzReport()
//   <Button onClick={() => oz.open('PVB021', { rcptNo }, '군수품무역대리업 등록증')}>출력</Button>
//   <OzReportFullPopup {...oz.popupProps} />
import { useCallback, useMemo, useState } from 'react'

import type { OzReportRequest } from '@/ui/biz/cm/ozReport/OzReportFullPopup'

export function useOzReport() {
  const [request, setRequest] = useState<OzReportRequest | null>(null)
  const open = useCallback(
    (reportId: string, params?: OzReportRequest['params'], title?: string) =>
      setRequest({ reportId, params, title }),
    [],
  )
  const close = useCallback(() => setRequest(null), [])
  const popupProps = useMemo(
    () => ({ request, onOpenChange: (o: boolean) => !o && setRequest(null) }),
    [request],
  )
  return { request, open, close, popupProps }
}
