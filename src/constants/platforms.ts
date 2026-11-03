import { IDEVX_SPACE_LOGO, IDEVX_SPACE_PALETTE } from './brand';

/**
 * The platforms, and the colour each one is identified by wherever it appears —
 * badges, dashboard bars, platform management.
 *
 * Kept at the same vibrancy as `DASHBOARD_ACCENTS`: these sit beside accent
 * colours on the dashboard, and one deeper blue among them reads as a bar that
 * matters less rather than as a different platform.
 */
export const PLATFORMS: { id: string; label: string; color: string; logo?: string }[] = [
  /* iDevX Space leads the list: it is the platform every client works in, so it is
     the first thing anyone looks for. Its colour comes from the brand palette
     rather than this file's accents — here the colour is identifying the
     product itself, which is exactly what those colours are for. */
  { id: 'iDevX Space', label: 'iDevX Space', color: IDEVX_SPACE_PALETTE.cosmicCyan, logo: IDEVX_SPACE_LOGO },
  { id: 'Client Portal', label: 'Client Portal', color: '#3B82F6' },
  { id: 'Admin Panel', label: 'Admin Panel', color: '#FB923C' },
  { id: 'Analytics', label: 'Analytics', color: '#22C55E' },
  { id: 'Mobile App', label: 'Mobile App', color: '#A78BFA' },
];

export type PlatformId = (typeof PLATFORMS)[number]['id'];
