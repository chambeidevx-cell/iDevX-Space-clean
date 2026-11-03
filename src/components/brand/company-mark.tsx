import { Box } from '@mui/material';
import { DEFAULT_COMPANY_LOGO } from '@/constants/brand';
import { getAvatarColor, getCompanyInitials } from '@/utils/avatar';
import { useMyCompanyStore } from '@/stores/my-company-store';

/**
 * Proportions of the initials tile, as fractions of its side — so a mark at any
 * size keeps the shape it has in the sidebar rather than being re-tuned per
 * caller.
 */
const CORNER_RATIO = 0.26;
const INITIALS_RATIO = 0.37;

interface CompanyMarkProps {
  /** Side of the mark in pixels. */
  size?: number;
}

/**
 * The company being worked in, as a mark: its own logo where it has uploaded
 * one, otherwise its initials on a colour derived from its name.
 *
 * **The default product logo counts as no logo.** It is what a company record
 * carries until someone uploads a real one, and showing it here would render
 * the product's mark as though it were the company's — directly beneath the
 * product's actual mark, saying nothing about which company this is.
 *
 * Reads the company from the store rather than taking it as props: there is one
 * company being worked in, and passing it down each time is how two callers end
 * up resolving the fallback differently.
 *
 * @example <CompanyMark size={18} />
 */
export const CompanyMark = ({ size = 38 }: CompanyMarkProps) => {
  const { companyName, companyLogo } = useMyCompanyStore();
  const ownLogo = companyLogo && companyLogo !== DEFAULT_COMPANY_LOGO ? companyLogo : null;

  if (ownLogo) {
    return (
      <Box
        component="img"
        src={ownLogo}
        alt=""
        // `contain`, not the avatar default of `cover`: a wide logo would
        // otherwise be cropped to this square.
        sx={{ width: size, height: size, objectFit: 'contain', flexShrink: 0 }}
      />
    );
  }

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: `${Math.round(size * CORNER_RATIO)}px`,
        bgcolor: getAvatarColor(companyName),
        color: 'common.white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(size * INITIALS_RATIO),
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {getCompanyInitials(companyName)}
    </Box>
  );
};
