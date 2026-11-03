import { ReactNode } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';
import { StickySurface } from '@/components/sticky-surface';

const DEFAULT_WIDTH = 280;

/**
 * Full width on tablet and below, fixed above it — the same rule `SearchField`
 * follows, so every search box in the app behaves the same way at a given
 * width. The breakpoint key must stay in step with `BOTTOM_NAV_BREAKPOINT`.
 */
const RESPONSIVE_WIDTH = { xs: '100%', lg: DEFAULT_WIDTH };

interface SectionSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  /** Overrides the responsive default. Rarely needed. */
  width?: number | string;
  /** Actions shown beside the search until the bar detaches. */
  children?: ReactNode;
}

/**
 * Filters a record page down to the sections matching what is typed.
 *
 * Built on `StickySurface`, so it detaches exactly like `PageActionBar` and
 * every other sticky bar — the behaviour lives there rather than here, which is
 * what keeps the two from drifting into looking like different components.
 *
 * @example <SectionSearchBar value={search} onChange={setSearch} />
 */
export const SectionSearchBar = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Search sections...',
  width,
  children,
}: SectionSearchBarProps) => (
  <StickySurface contentSx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {(isStuck) => (
      <>
        {/* Actions give up their place once the bar is a floating strip, so the
            search keeps the full width of it. */}
        {!isStuck && children}
        <TextField
          size="small"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          disabled={disabled}
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
          sx={{ ml: 'auto', width: width ?? RESPONSIVE_WIDTH }}
        />
      </>
    )}
  </StickySurface>
);
