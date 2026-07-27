// MUI-MS-01-M11 챗봇문의 (ChatbotPage, /chatbot)
// ⚠️ 챗봇 화면. 설계서상 웹경로 = "솔루션"(외부 챗봇 솔루션 임베드)이라 자체 UI 를 그리지 않는다.
//    실제 챗봇은 외부 솔루션 연동 시 이 자리에 임베드.
//    진입: 하단 BottomNav '챗봇' 액션(AppLayout onAction) + 전체메뉴 퀵아이콘 '챗봇상담' → /chatbot 라우트.
export function ChatbotPage() {
  // 추후: 외부 챗봇 솔루션(iframe/SDK) 임베드 영역.
  return (
    <div className="flex h-full w-full items-center justify-center p-krds-10 text-center text-krds-body-md text-krds-text-muted">
      챗봇 화면 (외부 솔루션 연동 예정)
    </div>
  )
}
ChatbotPage.displayName = 'ChatbotPage'
