import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CONTENT_GUTTER_SX } from '@/constants/layout';
import { useIsTruncated } from '@/hooks/use-is-truncated';
import { useMyCompanyStore } from '@/stores/my-company-store';
import { CompanyMark } from './company-mark';
import { ProductLockup } from './product-lockup';

/**
 * One size for both halves of the row.
 *
 * The product and the company are set at the same scale, so a single pair of
 * values drives both marks and both names — there is no second size that can
 * drift out of step with the first.
 *
 * A little under the sidebar's own lockup, because this row has to hold two
 * names and a divider inside a phone's width. Raising them is the one lever
 * here, and the company name is what gives way first.
 */
const MARK_SIZE = 24;
const FONT_SIZE = 16;

/**
 * The rule between the two halves, set well above the theme's hairline.
 *
 * It is load-bearing rather than decorative: without it the product mark and
 * the company mark sit in one row at one size and read as a single compound
 * name. A divider doing that job has to be seen without being looked for.
 */
const DIVIDER_WIDTH = 2;
const DIVIDER_OPACITY = 0.32;

/**
 * Gap between the company's mark and its name — tighter than the product
 * half's.
 *
 * Not an inconsistency. The product mark is a square icon that fills its box,
 * while a company logo is fitted into the same square with `contain`, so a wide
 * mark carries transparent margin of its own on each side. Matching the
 * numbers makes the company half look the looser of the two; matching what is
 * actually seen means setting a smaller one here.
 */
const COMPANY_MARK_GAP = 0.5;

/**
 * Who this is and whose it is, centred at the very top of the page on tablet
 * and below.
 *
 * It restores what the sidebar carries on desktop and the breakpoint takes
 * away: the product's own mark, and beside it the company being worked in. The
 * attribution at the foot of the screen names neither — that is the company
 * behind the product, not the one whose data is on screen.
 *
 * **One row, product then company, divided.** They answer different questions —
 * which application, and whose data is in it — so a rule between them is what
 * stops the two marks reading as one compound name. Both are set at the same
 * scale; only the ink separates them, the company's being the secondary of the
 * two.
 *
 * The product half never shrinks and the company half always does: a truncated
 * company name still identifies the tenant from its mark and its opening
 * characters, where a clipped product name reads as a different product.
 *
 * **It scrolls away with the page.** Pinning it would make it the thing every
 * `StickySurface` docks against, so each page's action bar would detach
 * *underneath* the branding rather than at the top of the viewport — and
 * identity is worth a glance on arrival, which is what the page heading below
 * it already assumes. Once it has gone, the detached bar carries the page name.
 */
export const MobileBrandHeader = () => {
  const companyName = useMyCompanyStore((state) => state.companyName);
  const [nameRef, isNameTruncated] = useIsTruncated<HTMLSpanElement>();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={1.25}
      sx={{ ...CONTENT_GUTTER_SX, pt: 2 }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <ProductLockup markHeight={MARK_SIZE} fontSize={FONT_SIZE} />
      </Box>
      {/* Heavier than the theme's hairline on purpose. This rule does real
          work — it is the only thing separating two marks that would otherwise
          read as one compound name — so it has to be visible at a glance
          rather than merely present. */}
      <Divider
        orientation="vertical"
        flexItem
        sx={(theme) => ({
          my: 0.25,
          borderRightWidth: DIVIDER_WIDTH,
          borderColor: alpha(theme.palette.text.primary, DIVIDER_OPACITY),
        })}
      />
      <Stack direction="row" alignItems="center" spacing={COMPANY_MARK_GAP} sx={{ minWidth: 0 }}>
        <CompanyMark size={MARK_SIZE} />
        <Tooltip title={isNameTruncated ? companyName : ''} placement="bottom" arrow>
          <Typography
            component="span"
            ref={nameRef}
            sx={{
              fontSize: FONT_SIZE,
              fontWeight: 700,
              lineHeight: 1,
              color: 'text.secondary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
            }}
          >
            {companyName}
          </Typography>
        </Tooltip>
      </Stack>
    </Stack>
  );
};
