import { Box, Chip } from '@mui/material';

type StatusColor = 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'default';

/**
 * Single source for what a status looks like everywhere in the app — grids,
 * cards and modals. Add new statuses here rather than mapping colours inside a
 * page, so the same word never renders in two different colours.
 */
export const STATUS_COLORS: Record<string, StatusColor> = {
  Active: 'success',
  Enabled: 'success',
  Completed: 'success',
  Paid: 'success',
  Verified: 'success',
  Converted: 'success',
  Subscribed: 'success',
  Inactive: 'error',
  Disabled: 'error',
  Revoked: 'error',
  Failed: 'error',
  Expired: 'error',
  Locked: 'warning',
  Pending: 'warning',
  Maintenance: 'warning',
  'Expiring Soon': 'warning',
  Reverted: 'error',
  Processing: 'info',
  Draft: 'default',
  'Not Converted': 'default',
  'Not Subscribed': 'default',
};

/** Colour registered for `status`, falling back to a neutral chip. */
export const getStatusColor = (status?: string): StatusColor =>
  (status && STATUS_COLORS[status]) || 'default';

interface StatusChipProps {
  status?: string;
  /** Filled chips are for categories; outlined is the default for states. */
  variant?: 'outlined' | 'filled';
}

/**
 * Status chip with the app-wide colour mapping applied.
 *
 * @example <StatusChip status={user.status} />
 */
export const StatusChip = ({ status, variant = 'outlined' }: StatusChipProps) => (
  <Chip label={status} color={getStatusColor(status)} variant={variant} size="small" />
);

/**
 * `StatusChip` centred for use inside a `DataGrid` cell.
 *
 * @example renderCell: (params) => <StatusChipCell status={params.value} />
 */
export const StatusChipCell = ({ status, variant }: StatusChipProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
    <StatusChip status={status} variant={variant} />
  </Box>
);
