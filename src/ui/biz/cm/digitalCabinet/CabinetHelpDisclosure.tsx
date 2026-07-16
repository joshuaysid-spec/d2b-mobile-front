// 디지털캐비닛 업무도움 — 공통 HelpDisclosure(Figma m_help_disclosure) 재사용 + 캐비닛 안내 항목만 주입.
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'

// 업무도움 안내 항목(디지털캐비닛). ⚠️ 설계서에 열림 콘텐츠 명세가 없어 화면 동작 기준 잠정 문구.
const HELP_ITEMS = [
  '폴더와 파일의 추가·삭제는 PC 버전에서만 가능합니다.',
  '폴더 접근 권한은 업체 대표자만 설정할 수 있습니다.',
  '파일첨부 시 디지털 캐비닛에서 파일을 선택해 업로드할 수 있습니다.',
]

export function CabinetHelpDisclosure() {
  return <HelpDisclosure items={HELP_ITEMS} />
}
CabinetHelpDisclosure.displayName = 'CabinetHelpDisclosure'
