import { Box, Typography } from '@mui/material';
import { PersonName } from '@/utils/format-name';
import { usePersonName } from '@/hooks/use-person-name';
import { formatHistoryDate } from '@/utils/format-date';

/** The name leads; the timestamp qualifies it and is set smaller and muted. */
const NAME_FONT_SIZE = '0.8rem';
const DATE_FONT_SIZE = '0.65rem';

interface ActorDateCellProps {
  /** Omit for an unknown person — the cell shows a dash in their place. */
  person?: PersonName;
  /** ISO timestamp, rendered in the configured display timezone. */
  timestamp?: string;
}

/**
 * Grid cell for "who did it, and when" — a last update, an approval, a
 * conversion.
 *
 * Stacked rather than joined into one line: the two facts are read at different
 * moments — you scan the names to find whose work it was, then the dates to see
 * how recent — and a single line makes both scans harder while costing the
 * column the width of a full timestamp.
 *
 * Names arrive as parts and are arranged by the configured Name Settings
 * format, so this column matches every other name in the app.
 *
 * @example
 * renderCell: (params) => (
 *   <ActorDateCell person={findUserById(params.row.updatedBy)} timestamp={params.value} />
 * )
 */
export const ActorDateCell = ({ person, timestamp }: ActorDateCellProps) => {
  const getName = usePersonName();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
      }}
    >
      <Typography component="span" sx={{ fontSize: NAME_FONT_SIZE }}>
        {person ? getName(person) : <Box component="span" sx={{ color: 'text.disabled' }}>—</Box>}
      </Typography>
      {timestamp && (
        <Typography component="span" sx={{ fontSize: DATE_FONT_SIZE, color: 'text.secondary' }}>
          {formatHistoryDate(timestamp)}
        </Typography>
      )}
    </Box>
  );
};
