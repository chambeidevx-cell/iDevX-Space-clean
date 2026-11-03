import { useState, useEffect } from 'react';
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Popover,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Check, Close, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { CancelButton } from '@/components/buttons/cancel-button';

interface WithPasswordProps {
  label?: string;
  title?: string;
  description?: string;
  subdescription?: string;
  buttonColor?: 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success' | 'inherit';
  buttonVariant?: 'contained' | 'outlined' | 'text';
  buttonIcon?: React.ReactNode;
  onConfirm?: (password: string) => void;
  onCancel?: () => void;
  open?: boolean;
  anchorEl?: HTMLElement | null;
  onClose?: () => void;
}

export const WithPassword = ({
  label = 'With Password',
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed?',
  subdescription = 'Enter your password to proceed.',
  buttonColor = 'primary',
  buttonVariant = 'outlined',
  buttonIcon = <LockOutlined />,
  onConfirm,
  onCancel,
  open: controlledOpen,
  anchorEl: controlledAnchorEl,
  onClose,
}: WithPasswordProps) => {
  const theme = useTheme();
  const isControlled = controlledOpen !== undefined;
  const [internalAnchorEl, setInternalAnchorEl] = useState<null | HTMLElement>(null);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const anchorEl = isControlled ? controlledAnchorEl : internalAnchorEl;
  const isOpen = isControlled ? controlledOpen : Boolean(internalAnchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (!isControlled) setInternalAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalAnchorEl(null);
    }
    setPassword('');
    setShowPassword(false);
  };

  const handleConfirm = () => {
    handleClose();
    onConfirm?.(password);
  };

  const handleCancel = () => {
    handleClose();
    onCancel?.();
  };

  useEffect(() => {
    const appRoot = document.getElementById('root');
    if (!appRoot) return;
    if (isOpen) {
      appRoot.setAttribute('inert', '');
    }
    return () => {
      appRoot.removeAttribute('inert');
    };
  }, [isOpen]);

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
      {!isControlled && (
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
      )}
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleCancel}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{ paper: { sx: popoverPaperSx } }}
        disableEnforceFocus={false}
        disableRestoreFocus
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{title}</Typography>
          <IconButton size="small" onClick={handleCancel} sx={{ ml: 1, p: 0.25 }}>
            <Close fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {description}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
          {subdescription}
        </Typography>
        <TextField
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
          fullWidth
          placeholder="Password"
          autoComplete="new-password"
          autoFocus
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end" sx={{ color: 'text.secondary' }}>
                  <IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <CancelButton onClick={handleCancel} isStretched />
          <Button
            size="small"
            variant="contained"
            color="secondary"
            startIcon={<Check />}
            onClick={handleConfirm}
            disabled={!password.trim()}
            sx={{ flex: 1 }}
          >
            Confirm
          </Button>
        </Stack>
      </Popover>
    </>
  );
};
