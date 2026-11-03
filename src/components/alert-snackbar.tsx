import { forwardRef } from 'react';
import { CustomContentProps, closeSnackbar } from 'notistack';
import { Alert } from '@mui/material';

const AlertSnackbar = forwardRef<HTMLDivElement, CustomContentProps>(({ id, message, variant }, ref) => {
  const severity = variant === 'default' ? 'info' : variant as 'success' | 'error' | 'warning' | 'info';
  return (
    <Alert
      ref={ref}
      severity={severity}
      onClose={() => closeSnackbar(id)}
      sx={{ width: '100%', boxShadow: 3 }}
    >
      {message}
    </Alert>
  );
});

AlertSnackbar.displayName = 'AlertSnackbar';
export default AlertSnackbar;
