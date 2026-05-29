// Google Material Icons 통합 컴포넌트.
// 패턴: name 으로 REGISTRY 매칭되면 MUI 아이콘 렌더, 매칭 안 되거나 name 미주입 시 children 렌더.
//
// 새 아이콘 추가: 아래 import 한 줄 + REGISTRY 객체 한 줄 추가 (tree-shaking 유지).
// REGISTRY 에 없는 아이콘이 일회성으로 필요하면 children 으로 직접 전달.
//   <Icon><MyCustomSvg /></Icon>
//   import OneOff from '@mui/icons-material/OneOff'
//   <Icon><OneOff /></Icon>
import * as React from 'react'
import type { SvgIconProps } from '@mui/material/SvgIcon'

// --- 자주 쓰는 Material 아이콘 (필요시 확장) -------------------------------
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CampaignIcon from '@mui/icons-material/Campaign'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionIcon from '@mui/icons-material/Description'
import EditIcon from '@mui/icons-material/Edit'
import ErrorIcon from '@mui/icons-material/Error'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import MenuIcon from '@mui/icons-material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PersonIcon from '@mui/icons-material/Person'
import RefreshIcon from '@mui/icons-material/Refresh'
import RemoveIcon from '@mui/icons-material/Remove'
import SearchIcon from '@mui/icons-material/Search'
import SettingsIcon from '@mui/icons-material/Settings'
import ShareIcon from '@mui/icons-material/Share'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import UpgradeIcon from '@mui/icons-material/Upgrade'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import WarningIcon from '@mui/icons-material/Warning'

const REGISTRY = {
  Add: AddIcon,
  ArrowBack: ArrowBackIcon,
  ArrowBackIosNew: ArrowBackIosNewIcon,
  ArrowForward: ArrowForwardIcon,
  ArrowForwardIos: ArrowForwardIosIcon,
  CalendarToday: CalendarTodayIcon,
  Campaign: CampaignIcon,
  Cancel: CancelIcon,
  Check: CheckIcon,
  CheckBox: CheckBoxIcon,
  CheckBoxOutlineBlank: CheckBoxOutlineBlankIcon,
  CheckCircle: CheckCircleIcon,
  ChevronLeft: ChevronLeftIcon,
  ChevronRight: ChevronRightIcon,
  Close: CloseIcon,
  Delete: DeleteIcon,
  Description: DescriptionIcon,
  Edit: EditIcon,
  Error: ErrorIcon,
  ExpandMore: ExpandMoreIcon,
  Favorite: FavoriteIcon,
  FavoriteBorder: FavoriteBorderIcon,
  Home: HomeIcon,
  Info: InfoIcon,
  KeyboardDoubleArrowLeft: KeyboardDoubleArrowLeftIcon,
  KeyboardDoubleArrowRight: KeyboardDoubleArrowRightIcon,
  Menu: MenuIcon,
  MoreVert: MoreVertIcon,
  Notifications: NotificationsIcon,
  Person: PersonIcon,
  Refresh: RefreshIcon,
  Remove: RemoveIcon,
  Search: SearchIcon,
  Settings: SettingsIcon,
  Share: ShareIcon,
  Star: StarIcon,
  StarBorder: StarBorderIcon,
  Upgrade: UpgradeIcon,
  Visibility: VisibilityIcon,
  VisibilityOff: VisibilityOffIcon,
  Warning: WarningIcon,
} as const satisfies Record<string, React.ComponentType<SvgIconProps>>

export type IconName = keyof typeof REGISTRY

export interface IconProps {
  /** Material 아이콘 이름 (REGISTRY 키). 매칭 시 해당 MUI 아이콘 렌더. */
  name?: IconName
  /** name 미주입 또는 미매칭 시 표시할 커스텀 아이콘 (lucide/SVG 등). */
  children?: React.ReactNode
  /** 픽셀 단위 사이즈. 기본 24. */
  size?: number
  /** 색상. 미주입 시 currentColor 상속(className 의 text-* 우선). 명시할 때만 sx 로 강제. */
  color?: string
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
      className,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
    },
    ref,
  ) => {
    const Mui = name ? REGISTRY[name] : null

    if (Mui) {
      const sx: Record<string, unknown> = { fontSize: size }
      if (color) sx.color = color
      return (
        <Mui
          ref={ref as React.Ref<SVGSVGElement>}
          sx={sx}
          className={className}
          aria-label={ariaLabel ?? (ariaHidden ? undefined : name)}
          aria-hidden={ariaHidden ?? !ariaLabel}
        />
      )
    }

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
