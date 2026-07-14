// MUI-MS-01-M11 챗봇문의 (ChatbotPage)
// ⚠️ 챗봇 화면. 설계서상 웹경로 = "솔루션"(외부 챗봇 솔루션 임베드)이라 자체 UI 를 그리지 않는다.
//    → 파일/화면 ID 자리만 확보(사용자 지시). 실제 챗봇은 외부 솔루션 연동 시 이 자리에 임베드.
//    진입: 하단 BottomNav '챗봇' 액션(AppLayout onAction) — 추후 이 화면/솔루션으로 연결.
export function ChatbotPage() {
  // 추후: 외부 챗봇 솔루션(iframe/SDK) 임베드 영역.
  return (
    <div className="flex h-full w-full items-center justify-center p-krds-10 text-center text-krds-body-md text-krds-text-muted">
      챗봇 화면 (외부 솔루션 연동 예정)
    </div>
  )
}
ChatbotPage.displayName = 'ChatbotPage'
