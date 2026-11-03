import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  PhoneAndroid as PhoneAndroidIcon,
  SvgIconComponent,
  Web as WebIcon,
} from '@mui/icons-material';
import { PLATFORMS } from './platforms';

/** Icon size that fits the compact grid cell; mobile cards pass a larger one. */
const DEFAULT_ICON_SIZE = 14;
const FALLBACK_COLOR = '#666';

const PLATFORM_ICONS: Record<string, SvgIconComponent> = {
  'iDevX Space': LockIcon,
  'Client Portal': WebIcon,
  'Admin Panel': AdminPanelSettingsIcon,
  'Analytics': BarChartIcon,
  'Mobile App': PhoneAndroidIcon,
};

export interface PlatformBadge {
  icon: React.ReactNode;
  color: string;
}

/**
 * Avatar contents for a platform chip, falling back to the platform's initial
 * and a neutral colour for ids that are not in `PLATFORMS`.
 *
 * @example const { icon, color } = getPlatformBadge('Admin Panel', 20);
 */
export const getPlatformBadge = (
  platform: string,
  iconSize: number = DEFAULT_ICON_SIZE,
): PlatformBadge => {
  const Icon = PLATFORM_ICONS[platform];
  return {
    icon: Icon ? <Icon sx={{ fontSize: iconSize }} /> : platform.charAt(0),
    color: PLATFORMS.find((entry) => entry.id === platform)?.color ?? FALLBACK_COLOR,
  };
};
