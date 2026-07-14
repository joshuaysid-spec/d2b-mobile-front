// Material Symbols Outlined(아이콘 폰트) 기반 통합 아이콘 컴포넌트.
//
// 왜 폰트인가:
//   - 디자인 원본(Figma)이 Google "Material Symbols"(신) 기준이라 @mui/icons-material(구
//     "Material Icons")로는 모양이 1:1 로 안 맞았다. Symbols 는 가변폰트로만 제공된다.
//   - 폰트는 `material-symbols` npm 패키지로 self-host(globals.css @import) → 폐쇄망/오프라인 OK.
//
// 패턴: name(PascalCase) 으로 REGISTRY 매칭되면 해당 ligature 문자열을 <span> 텍스트로 출력한다.
//   (폰트의 'liga' 기능이 'home' → 🏠 글리프로 합자) — 기존 호출부 <Icon name="Home" /> 그대로 유지.
//   매칭 안 되거나 name 미주입 시 children 렌더(커스텀 SVG).
//
// 새 아이콘 추가: REGISTRY 에 `PascalCase: 'ligature_snake_case'` 한 줄 추가.
//   ligature 이름은 https://fonts.google.com/icons (Material Symbols) 상세의 코드명(snake_case).
//   별도 import/번들 작업 불필요 — 폰트에 모든 글리프가 이미 포함.
//
// 가변 축(variable axes): FILL(0 아웃라인 / 1 채움) · wght(100~700) · GRAD · opsz.
//   기본 아웃라인(FILL 0). 솔리드가 자연스러운 아이콘(별/하트)은 FILLED_BY_DEFAULT 로 FILL 1.
import * as React from 'react'

import { cn } from '@/utils/cn'

// --- name(PascalCase) → Material Symbols ligature(snake_case) --------------
// 기존 @mui/icons-material 명명과 호환되도록 PascalCase 키를 유지한다.
// 새 아이콘 추가: 아래에 `PascalCase: 'ligature_snake_case'` 한 줄 추가 (알파벳 순서 유지).
//   ligature 이름은 https://fonts.google.com/icons (Material Symbols) 상세의 코드명(snake_case).
const REGISTRY = {
  Add: 'add',
  ArrowBack: 'arrow_back',
  ArrowBackIosNew: 'arrow_back_ios_new',
  ArrowDropDown: 'arrow_drop_down',
  ArrowForward: 'arrow_forward',
  ArrowForwardIos: 'arrow_forward_ios',
  AssignmentGlobe: 'assignment_globe',
  AssignmentInd: 'assignment_ind',
  CalendarToday: 'calendar_today',
  Call: 'call',
  Campaign: 'campaign',
  Cancel: 'cancel',
  Check: 'check',
  CheckBox: 'check_box',
  CheckBoxOutlineBlank: 'check_box_outline_blank',
  CheckCircle: 'check_circle',
  ChevronLeft: 'chevron_left',
  ChevronRight: 'chevron_right',
  Close: 'close',
  Computer: 'computer',
  Delete: 'delete',
  Description: 'description',
  DeveloperGuide: 'developer_guide',
  Download: 'download',
  Edit: 'edit',
  Error: 'error',
  ExpandMore: 'expand_more',
  // Material Symbols 는 채움/아웃라인을 FILL 축으로 구분 — 'favorite'/'kid_star' 한 ligature 로 통합.
  // Favorite/KidStar 는 FILLED_BY_DEFAULT 로 채움, FavoriteBorder 는 아웃라인(FILL 0).
  // 즐겨찾기(별)는 디자인 기준 kid_star 사용 — fill 0/1 로 off/on 토글.
  Favorite: 'favorite',
  FavoriteBorder: 'favorite',
  FilterAlt: 'filter_alt',
  Fingerprint: 'fingerprint',
  Folder: 'folder',
  HeadsetMic: 'headset_mic',
  Home: 'home',
  Info: 'info',
  KeyboardDoubleArrowLeft: 'keyboard_double_arrow_left',
  KeyboardDoubleArrowRight: 'keyboard_double_arrow_right',
  KidStar: 'kid_star',
  LocationAway: 'location_away',
  Login: 'login',
  Logout: 'logout',
  Menu: 'menu',
  MoreVert: 'more_vert',
  NotificationAdd: 'notification_add',
  Notifications: 'notifications',
  NotificationsActive: 'notifications_active',
  OpenInNew: 'open_in_new',
  Pause: 'pause',
  Person: 'person',
  PlayArrow: 'play_arrow',
  Print: 'print',
  Public: 'public',
  Recommend: 'recommend',
  Refresh: 'refresh',
  Remove: 'remove',
  Search: 'search',
  Settings: 'settings',
  Share: 'share',
  SmartToy: 'smart_toy',
  SoundDetection: 'sound_detection_loud_sound',
  SubdirectoryArrowRight: 'subdirectory_arrow_right',
  TrendingFlat: 'trending_flat',
  Tune: 'tune',
  Upgrade: 'upgrade',
  Upload: 'upload',
  VerifiedUser: 'verified_user',
  Visibility: 'visibility',
  VisibilityOff: 'visibility_off',
  Warning: 'warning',
} as const satisfies Record<string, string>

export type IconName = keyof typeof REGISTRY

/** 채움(FILL 1)이 기본 디자인인 아이콘 — 나머지는 아웃라인(FILL 0). fill prop 으로 개별 오버라이드.
 *  별/하트(솔리드가 자연스러움) + 상태 아이콘(성공/경고/에러 — Empty·AlertModal 처럼 채움이 기본). */
const FILLED_BY_DEFAULT = new Set<IconName>(['CheckCircle', 'Error', 'Favorite', 'KidStar', 'Warning'])

export interface IconProps {
  /** Material Symbols 아이콘 이름 (REGISTRY 키, PascalCase). 매칭 시 해당 글리프 렌더. */
  name?: IconName
  /** name 미주입 또는 미매칭 시 표시할 커스텀 아이콘 (SVG 등). */
  children?: React.ReactNode
  /** 픽셀 단위 사이즈. 기본 24. opsz 축도 이 값에 맞춤. */
  size?: number
  /** 색상. 미주입 시 currentColor 상속(className 의 text-* 우선). 명시할 때만 강제. */
  color?: string
  /** FILL 축. 0=아웃라인 · 1=채움. 미지정 시 아이콘별 기본값(FILLED_BY_DEFAULT). */
  fill?: 0 | 1
  /** wght 축(100~700). 기본 400. */
  weight?: number
  className?: string
  'aria-label'?: string
  'aria-hidden'?: boolean
}

const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      name,
      children,
      size = 24,
      color,
      fill,
      weight = 400,
      className,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
    },
    ref,
  ) => {
    const ligature = name ? REGISTRY[name] : null

    if (ligature && name) {
      const resolvedFill = fill ?? (FILLED_BY_DEFAULT.has(name) ? 1 : 0)
      const style: React.CSSProperties = {
        fontSize: size,
        width: size,
        height: size,
        lineHeight: 1,
        fontVariationSettings: `'FILL' ${resolvedFill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }
      if (color) style.color = color
      return (
        <span
          ref={ref}
          // material-symbols-outlined: globals.css 의 패키지 CSS 가 font-family + 'liga' 제공
          className={cn('material-symbols-outlined shrink-0 select-none', className)}
          style={style}
          translate="no"
          aria-label={ariaLabel ?? (ariaHidden ? undefined : name)}
          aria-hidden={ariaHidden ?? !ariaLabel}
        >
          {ligature}
        </span>
      )
    }

    // REGISTRY 미매칭 / name 미주입 — children(커스텀 SVG) 렌더
    const wrapperStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      lineHeight: 1,
    }
    if (color) wrapperStyle.color = color

    return (
      <span
        ref={ref}
        className={className}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden ?? !ariaLabel}
        style={wrapperStyle}
      >
        {children}
      </span>
    )
  },
)
Icon.displayName = 'Icon'

export { Icon, REGISTRY as ICON_REGISTRY }
