import { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';

const EMPTY_VALUE = '—';

interface CardFieldProps {
  label: string;
  value?: string;
  /** Action buttons rendered to the right of the value. */
  actions?: ReactNode;
}

/**
 * Label/value pair used by the mobile cards that stand in for data grids, with
 * an optional row of tap targets beside the value.
 *
 * @example <CardField label="Position" value={contact.position} />
 */
export const CardField = ({ label, value, actions }: CardFieldProps) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
      {label}
    </Typography>
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="body2" sx={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>
        {value || EMPTY_VALUE}
      </Typography>
      {value && actions
        ? <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>{actions}</Stack>
        : null
      }
    </Stack>
  </Box>
);
