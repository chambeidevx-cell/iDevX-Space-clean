import { useState } from 'react';
import { Button, Paper, Popover, Stack, TextField, Typography } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { CancelButton } from '@/components/buttons/cancel-button';

const PANEL_WIDTH = 280;

interface WithReasonProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  /** Receives the typed reason; never called with blank text. */
  onConfirm: (reason: string) => void;
  title?: string;
  description?: string;
  placeholder?: string;
  confirmLabel?: string;
  confirmColor?: 'primary' | 'secondary' | 'warning' | 'error' | 'success';
  confirmIcon?: React.ReactNode;
}

/**
 * Confirmation that requires the user to say *why*, for actions that are
 * reversible but need an audit trail — reverting a deployment, rejecting a
 * request. Confirm stays disabled until a reason is given.
 *
 * Pick the confirmation to match the stakes:
 * - `WithPassword` — destructive or privileged: deactivating, revoking, resetting.
 * - `WithReason` — reversible but must be explained.
 * - `WithPopover` — a plain yes/no where neither of the above applies.
 *
 * @example
 * <WithReason
 *   open={Boolean(revertAnchor)}
 *   anchorEl={revertAnchor}
 *   onClose={() => setRevertAnchor(null)}
 *   onConfirm={handleRevert}
 *   title="Revert Maintenance"
 * />
 */
export const WithReason = ({
  open,
  anchorEl,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Provide a reason for this change.',
  placeholder = 'e.g. Deployment failed due to a compatibility issue',
  confirmLabel = 'Confirm',
  confirmColor = 'warning',
  confirmIcon = <CheckIcon />,
}: WithReasonProps) => {
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(reason.trim());
    setReason('');
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{ paper: { sx: { mt: -1 } } }}
    >
      <Paper sx={{ p: 2, width: PANEL_WIDTH }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          {description}
        </Typography>
        <TextField
          size="small"
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          placeholder={placeholder}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          autoFocus
        />
        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1.5 }}>
          <CancelButton onClick={handleClose} />
          <Button
            size="small"
            variant="contained"
            color={confirmColor}
            startIcon={confirmIcon}
            disabled={!reason.trim()}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </Stack>
      </Paper>
    </Popover>
  );
};
