import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';

const DEFAULT_WIDTH = 180;

/**
 * Full width on tablet and below, fixed above it. Search is the only control
 * left in the toolbar at those widths, so a 180px box leaves the row mostly
 * empty; on desktop it shares the row with the primary action and export.
 *
 * The breakpoint key must stay in step with `BOTTOM_NAV_BREAKPOINT`.
 */
const RESPONSIVE_WIDTH = { xs: '100%', lg: DEFAULT_WIDTH };

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /**
   * Any `sx` width value, overriding the responsive default. Rarely needed —
   * omit it and the field sizes itself to the breakpoint.
   */
  width?: number | string;
}

/**
 * Compact search input with a leading search icon and a clear button that
 * appears once there is something to clear.
 *
 * @example <SearchField value={search} onChange={setSearch} />
 */
export const SearchField = ({
  value,
  onChange,
  placeholder = 'Search',
  width,
}: SearchFieldProps) => (
  <TextField
    size="small"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => onChange('')} edge="end">
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      },
    }}
    sx={{ width: width ?? RESPONSIVE_WIDTH }}
  />
);
