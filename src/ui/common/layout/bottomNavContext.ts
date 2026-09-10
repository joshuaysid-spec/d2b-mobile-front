import { createContext, useContext } from 'react'

// AppLayout 이 BottomNav 의 "실제 노출" 여부(라우트 showBottomNav && 스크롤 숨김 아님)를 하위
// (특히 FloatingActionButton)에 알린다. FAB 는 이 값으로 자신을 BottomNav 위 10px(없으면 화면 하단 10px)에 배치한다.
export const BottomNavVisibleContext = createContext(false)

export const useBottomNavVisible = () => useContext(BottomNavVisibleContext)

// BottomNav 높이(탭 77px + border-t 1px). FAB 의 하단 오프셋 계산에 공용으로 쓴다.
export const BOTTOM_NAV_HEIGHT = 78
