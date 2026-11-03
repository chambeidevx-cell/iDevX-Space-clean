import { Link as RouterLink } from 'react-router-dom';
import { Button, Paper, Stack, Typography } from '@mui/material';
import {
  DesktopWindowsOutlined as DesktopWindowsOutlinedIcon,
  HomeOutlined as HomeOutlinedIcon,
} from '@mui/icons-material';

/**
 * Shown in place of a page that has no responsive layout when it is opened on
 * tablet or below — reachable only by typing the URL, since the mobile
 * navigation hides these pages.
 */
export const DesktopOnlyNotice = () => (
  <Paper sx={{ p: 4, textAlign: 'center' }}>
    <Stack spacing={2} alignItems="center">
      <DesktopWindowsOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Available on Desktop Only
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
        This page is not optimized for smaller screens yet. Open it on a desktop browser
        to continue.
      </Typography>
      <Button
        variant="contained"
        size="small"
        component={RouterLink}
        to="/"
        startIcon={<HomeOutlinedIcon />}
      >
        Back to Home
      </Button>
    </Stack>
  </Paper>
);
