import { ReactNode } from 'react';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { StatusChip } from '@/components/data-grid/status-chip';

interface EntityCardProps {
  /** Avatar or logo for the record. */
  avatar?: ReactNode;
  title: string;
  /** Identifier under the title, rendered monospaced. */
  subtitle?: string;
  status?: string;
  /** `CardField` rows — one per value the grid would show as a column. */
  children: ReactNode;
  /** Row actions, shown below a divider. Omit for a read-only card. */
  actions?: ReactNode;
}

/**
 * Mobile stand-in for a table row: identity at the top, the row's values as
 * labelled fields, and any actions pinned to the bottom.
 *
 * Every list page that is reachable on mobile renders its rows through this, so
 * records look the same whichever page they came from. Values belong in
 * `CardField` and its siblings (`EmailField`, `ContactNumberField`), which carry
 * the tap targets that replace the grid's hover actions.
 *
 * @example
 * <EntityCard avatar={<Avatar />} title={fullName} subtitle={accountId} status={user.status}>
 *   <EmailField label="Work Email" email={user.email} />
 * </EntityCard>
 */
export const EntityCard = ({ avatar, title, subtitle, status, children, actions }: EntityCardProps) => (
  <Paper sx={{ p: 2 }}>
    <Stack direction="row" alignItems="center" spacing={1.5}>
      {avatar}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="primary.main" sx={{ fontFamily: 'monospace' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {status && <StatusChip status={status} />}
    </Stack>
    <Divider sx={{ my: 1.5 }} />
    <Stack spacing={1.25}>{children}</Stack>
    {actions && (
      <>
        <Divider sx={{ my: 1.5 }} />
        {actions}
      </>
    )}
  </Paper>
);
