import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AlertSnackbar from '@/components/alert-snackbar';
import { ThemeProvider } from './providers/theme-provider';
import { PageLoader } from './components/page-loader';
const HomePage = lazy(() => import('./app/home/page'));

const App = () => {
  return (
    <ThemeProvider>
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={6000}
        variant="info"
        preventDuplicate={false}
        Components={{
          default: AlertSnackbar,
          info: AlertSnackbar,
          success: AlertSnackbar,
          warning: AlertSnackbar,
          error: AlertSnackbar,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
