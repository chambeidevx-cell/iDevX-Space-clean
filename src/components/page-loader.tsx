import { Box, CircularProgress } from '@mui/material';

/**
 * Tall enough that the spinner lands near where content will appear, so the
 * page does not visibly jump when the chunk arrives.
 */
const LOADER_MIN_HEIGHT = '60vh';

/**
 * Placeholder shown while a lazily-loaded page or panel is being fetched.
 *
 * Deliberately minimal: a route chunk usually arrives in well under a second on
 * a warm connection, and anything more elaborate flashes more than it informs.
 *
 * @example <Suspense fallback={<PageLoader />}><SomePage /></Suspense>
 */
export const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: LOADER_MIN_HEIGHT,
      width: '100%',
    }}
  >
    <CircularProgress size={28} />
  </Box>
);
