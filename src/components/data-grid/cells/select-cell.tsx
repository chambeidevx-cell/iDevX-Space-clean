import { Box, Chip, MenuItem, Select, SelectChangeEvent, Tooltip } from '@mui/material';

export type CellChipColor = 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

export interface SelectCellOption {
  value: string;
  label: string;
  /** Tints the chip. Options without one read as neutral. */
  color?: CellChipColor;
}

interface SelectCellProps {
  value: string;
  options: readonly SelectCellOption[];
  onChange: (value: string) => void;
  /** Names the control for screen readers — the column header, e.g. 'Stage'. */
  label: string;
  isDisabled?: boolean;
  /**
   * Why the value is fixed, shown on hover while disabled. Always give one: a
   * cell that simply refuses to open reads as a broken control, and the reader
   * has no way to tell it apart from the rows that do work.
   */
  disabledReason?: string;
}

/**
 * Grid cell whose value is set in place from a fixed list — a status, a stage,
 * a tier.
 *
 * Use this where the value is a person's judgement rather than something the
 * system derives: editing in the row is far fewer clicks than opening a modal
 * to change one field, and it makes clear that the value is theirs to set.
 * Values the system owns stay read-only, so an operator is never offered a
 * choice that will be overwritten.
 *
 * The chip carries the same colour here as in a read-only cell, so a column
 * still scans by colour and only the caret marks it as editable.
 *
 * @example
 * renderCell: (params) => (
 *   <SelectCell
 *     label="Stage"
 *     value={params.value}
 *     options={STAGE_OPTIONS}
 *     onChange={(stage) => onStageChange(params.row.id, stage)}
 *   />
 * )
 */
export const SelectCell = ({
  value,
  options,
  onChange,
  label,
  isDisabled = false,
  disabledReason,
}: SelectCellProps) => {
  const selected = options.find((option) => option.value === value);
  const handleChange = (event: SelectChangeEvent<string>) => onChange(event.target.value);

  const field = (
    <Box
      sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}
      /* The grid treats a cell click as a row click — the dropdown is its own
         control and should not also select the row behind it. */
      onClick={(event) => event.stopPropagation()}
    >
      <Select
        value={value}
        onChange={handleChange}
        disabled={isDisabled}
        variant="standard"
        disableUnderline
        inputProps={{ 'aria-label': label }}
        renderValue={() => (
          <Chip
            label={selected?.label ?? value}
            color={selected?.color ?? 'default'}
            variant="outlined"
            size="small"
            sx={{ cursor: isDisabled ? 'default' : 'pointer' }}
          />
        )}
        sx={{
          width: '100%',
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            p: 0,
            pr: '20px !important',
          },
          '& .MuiSelect-icon': { fontSize: '1.1rem', right: 0 },
          '&.Mui-disabled .MuiSelect-icon': { display: 'none' },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={{ py: 0.75 }}>
            <Chip
              label={option.label}
              color={option.color ?? 'default'}
              variant="outlined"
              size="small"
              sx={{ cursor: 'pointer' }}
            />
          </MenuItem>
        ))}
      </Select>
    </Box>
  );

  return isDisabled && disabledReason
    ? <Tooltip title={disabledReason} placement="top" arrow><span>{field}</span></Tooltip>
    : field;
};
