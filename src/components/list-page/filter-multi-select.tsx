import { Checkbox, ListItemText, MenuItem, TextField } from '@mui/material';
import { FILTER_FIELD_SX, FILTER_FONT_SIZE } from '@/constants/data-grid';

/**
 * Sentinel for the "All" row. Not a real option, so it can never be mistaken
 * for a selected value or handed back to the caller.
 */
const ALL_VALUE = '__all__';

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterMultiSelectProps {
  label: string;
  /** Selected option ids. Empty means no restriction — every row matches. */
  values: string[];
  onChange: (values: string[]) => void;
  options: FilterOption[];
  /** Summary shown when nothing is selected. */
  emptyLabel?: string;
}

/**
 * A filter that accepts several values at once, shown as a checkbox list.
 *
 * An empty selection means "no restriction" rather than "match nothing" — a
 * filter the user has not touched must never hide rows. "All" and empty
 * therefore filter identically.
 *
 * Clearing needs no control of its own: untick options individually, or click
 * "All" while it is checked to turn everything off at once.
 *
 * The closed field shows a count rather than the chosen labels: the panel is
 * narrow, and a list of chips would wrap it to several lines as soon as a
 * second value is picked.
 *
 * @example
 * <FilterMultiSelect
 *   label="Role"
 *   values={roleFilters}
 *   onChange={setRoleFilters}
 *   options={roleOptions}
 *   emptyLabel="All roles"
 * />
 */
export const FilterMultiSelect = ({
  label,
  values,
  onChange,
  options,
  emptyLabel = 'All',
}: FilterMultiSelectProps) => {
  const isAllSelected = options.length > 0 && values.length === options.length;
  const hasSelection = values.length > 0;

  const summarise = (selected: string[]): string => {
    if (selected.length === 0) return emptyLabel;
    if (selected.length === options.length) return 'All';
    if (selected.length === 1) {
      return options.find((option) => option.id === selected[0])?.label ?? selected[0];
    }
    return `${selected.length} selected`;
  };

  const handleChange = (raw: string | string[]) => {
    const next = typeof raw === 'string' ? raw.split(',') : raw;
    // The "All" row toggles every option rather than selecting itself, so
    // clicking it while checked is what clears the filter.
    if (next.includes(ALL_VALUE)) {
      onChange(isAllSelected ? [] : options.map((option) => option.id));
      return;
    }
    onChange(next);
  };

  return (
    <TextField
      select
      size="small"
      label={label}
      value={values}
      onChange={(event) => handleChange(event.target.value as unknown as string | string[])}
      sx={FILTER_FIELD_SX}
      slotProps={{
        select: {
          multiple: true,
          renderValue: (selected) => summarise(selected as string[]),
          MenuProps: {
            slotProps: {
              paper: { sx: { '& .MuiMenuItem-root': { fontSize: FILTER_FONT_SIZE } } },
            },
          },
        },
      }}
    >
      {/* Every child of a Select must be a MenuItem — it reads `props.value`
          off each one, so a Divider between them is not safe. The separator is
          a border on this row instead. */}
      <MenuItem value={ALL_VALUE} dense sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Checkbox
          size="small"
          checked={isAllSelected}
          indeterminate={hasSelection && !isAllSelected}
          sx={{ py: 0.25 }}
        />
        <ListItemText
          primary="All"
          slotProps={{ primary: { sx: { fontSize: FILTER_FONT_SIZE, fontWeight: 700 } } }}
        />
      </MenuItem>
      {options.map((option) => (
        <MenuItem key={option.id} value={option.id} dense>
          <Checkbox size="small" checked={values.includes(option.id)} sx={{ py: 0.25 }} />
          <ListItemText
            primary={option.label}
            slotProps={{ primary: { sx: { fontSize: FILTER_FONT_SIZE } } }}
          />
        </MenuItem>
      ))}
    </TextField>
  );
};
