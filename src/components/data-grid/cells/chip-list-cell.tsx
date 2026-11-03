import { Box, Chip, Stack, Tooltip } from '@mui/material';

/** Chips shown before the rest collapse into a "+N" summary. */
const DEFAULT_MAX_VISIBLE = 2;

interface ChipListCellProps {
  values?: string[];
  /** Maps a stored value to its display label. Defaults to the value itself. */
  getLabel?: (value: string) => string;
  maxVisible?: number;
}

/**
 * Grid cell for a field holding several values — roles, tags, departments.
 *
 * Only the first few fit in a cell, so the remainder collapse into a "+N" chip
 * whose tooltip lists them. Widening the column instead would cost every other
 * column space for a case that is usually one or two values.
 *
 * @example renderCell: (params) => <ChipListCell values={params.value} getLabel={getRoleLabel} />
 */
export const ChipListCell = ({
  values,
  getLabel = (value) => value,
  maxVisible = DEFAULT_MAX_VISIBLE,
}: ChipListCellProps) => {
  if (!values || values.length === 0) return null;
  const visible = values.slice(0, maxVisible);
  const hidden = values.slice(maxVisible);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', overflow: 'hidden' }}>
      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'nowrap' }}>
        {visible.map((value) => (
          <Chip
            key={value}
            label={getLabel(value)}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.65rem', height: 20 }}
          />
        ))}
        {hidden.length > 0 && (
          <Tooltip title={hidden.map(getLabel).join(', ')} placement="top" arrow>
            <Chip
              label={`+${hidden.length}`}
              size="small"
              sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700 }}
            />
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
};
