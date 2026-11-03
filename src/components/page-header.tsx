import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { PAGE_TITLES } from '@/constants/navigation';
import { CONTENT_GUTTER_SX, CONTENT_PADDING_Y } from '@/constants/layout';

/**
 * Gap left between the heading and whatever the page opens with — usually its
 * action bar.
 *
 * Narrow on purpose: the heading names the bar directly beneath it, so the two
 * read as one block at the top of the page rather than as a title adrift above
 * unrelated controls.
 */
const GAP_BELOW = 1;

/**
 * Pulls the page's content up to {@link GAP_BELOW}.
 *
 * The heading sits *outside* the scroll container's padded box, so the space
 * under it is that padding — sized for a page that opens straight into content
 * and has no heading at all. Left alone it is the full gutter, which is twice
 * what a title needs. Derived rather than hand-set, so changing the gutter does
 * not silently reopen the gap.
 */
const CONTENT_PULL_UP = GAP_BELOW - CONTENT_PADDING_Y;

/**
 * Names the page the operator is on.
 *
 * Shown on tablet and below, where there is no sidebar to say which page this
 * is — on desktop the nav entry is highlighted and the heading would only
 * repeat it.
 *
 * The name alone, with no sentence under it: a description spends the most
 * valuable rows on a phone explaining a page the operator has just chosen to
 * open, and after the first visit it is only something to scroll past.
 *
 * The title comes from `PAGE_TITLES`, so a page is named in one place rather
 * than drifting between its nav entry and its own heading. A path with no entry
 * renders nothing rather than an empty heading.
 *
 * It scrolls away with the page rather than pinning: it says which page this is,
 * which is worth a glance on arrival and nothing after that.
 */
export const PageHeader = () => {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname];

  if (!title) return null;

  return (
    <Box
      component="header"
      sx={{
        ...CONTENT_GUTTER_SX,
        pt: 2,
        mb: CONTENT_PULL_UP,
      }}
    >
      <Typography component="h1" sx={{ fontSize: 18, fontWeight: 700, lineHeight: 1.25 }}>
        {title}
      </Typography>
    </Box>
  );
};
