import { useState } from 'react';
import {
  Button,
  CircularProgress,
  IconButton,
  Popover,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { Check, Close, OpenInNew } from '@mui/icons-material';
import { CancelButton } from '@/components/buttons/cancel-button';

interface WithPopoverProps {
  label?: string;
  title?: string;
  description?: string;
  buttonColor?: 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success' | 'inherit';
  buttonVariant?: 'contained' | 'outlined' | 'text';
  buttonIcon?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const WithPopover = ({
  label = 'With Popup',
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed?',
  buttonColor = 'secondary',
  buttonVariant = 'outlined',
  buttonIcon = <OpenInNew />,
  onConfirm,
  onCancel,
}: WithPopoverProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleConfirm = () => {
    setAnchorEl(null);
    onConfirm?.();
  };

  const handleCancel = () => {
    setAnchorEl(null);
    onCancel?.();
  };

  const isDark = theme.palette.mode === 'dark';
  const popoverPaperSx = {
    mt: 1.5,
    p: 2,
    borderRadius: '15px',
    minWidth: 210,
    background: isDark ? 'rgba(8,12,20,0.70)' : 'rgba(255,255,255,0.80)',
    backdropFilter: 'blur(24px)',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.7)',
    boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.5)' : '0 20px 40px rgba(0,0,0,0.12)',
    overflow: 'visible',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -7,
      left: '50%',
      transform: 'translateX(-50%)',
      borderWidth: '0 7px 7px 7px',
      borderStyle: 'solid',
      borderColor: isDark
        ? 'transparent transparent rgba(8,12,20,0.90) transparent'
        : 'transparent transparent rgba(255,255,255,0.90) transparent',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: -8,
      left: '50%',
      transform: 'translateX(-50%)',
      borderWidth: '0 8px 8px 8px',
      borderStyle: 'solid',
      borderColor: isDark
        ? 'transparent transparent rgba(255,255,255,0.08) transparent'
        : 'transparent transparent rgba(200,210,240,0.5) transparent',
      zIndex: -1,
    },
  };

  return (
    <>
      <Button
        size="small"
        variant={buttonVariant}
        color={buttonColor}
        startIcon={isOpen ? <CircularProgress size={14} color="inherit" /> : buttonIcon}
        sx={{
          opacity: isOpen ? 0.65 : 1,
          pointerEvents: isOpen ? 'none' : 'auto',
        }}
        onClick={handleOpen}
      >
        {isOpen ? 'Loading' : label}
      </Button>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleCancel}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{ paper: { sx: popoverPaperSx } }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{title}</Typography>
          <IconButton size="small" onClick={handleCancel} sx={{ ml: 1, p: 0.25 }}>
            <Close fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button size="small" variant="contained" color="secondary" startIcon={<Check />} onClick={handleConfirm} sx={{ flex: 1 }}>
            Confirm
          </Button>
          <CancelButton onClick={handleCancel} isStretched />
        </Stack>
      </Popover>
    </>
  );
};
