import { ReactNode } from 'react';
import { TextField } from '@mui/material';
import { FILTER_FIELD_SX, FILTER_FONT_SIZE } from '@/constants/data-grid';

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** `MenuItem` options. */
  children: ReactNode;
}

/**
 * A select inside `FiltersPanel`, carrying the panel's density and type size.
 *
 * Exists because the size has to be applied in two places that cannot be
 * expressed as one prop: `sx` styles the field, but the dropdown renders in a
 * portal outside it and needs `MenuProps`. Leaving that to each page meant
 * every filter had to remember both, and options drifted back to the theme's
 * larger size wherever one was forgotten.
 *
 * @example
 * <FilterSelect label="Status" value={status} onChange={setStatus}>
 *   <MenuItem value="All">All</MenuItem>
 * </FilterSelect>
 */
export const FilterSelect = ({ label, value, onChange, children }: FilterSelectProps) => (
  <TextField
    select
    size="small"
    label={label}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    sx={FILTER_FIELD_SX}
    slotProps={{
      select: {
        MenuProps: {
          slotProps: {
            paper: { sx: { '& .MuiMenuItem-root': { fontSize: FILTER_FONT_SIZE } } },
          },
        },
      },
    }}
  >
    {children}
  </TextField>
);
