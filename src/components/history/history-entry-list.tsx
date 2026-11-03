import { Divider, Paper, Stack, Typography } from '@mui/material';
import { HistoryEntry } from '@/interfaces/history';
import { formatHistoryDate } from '@/utils/format-date';

/**
 * History is reference material read in bulk, so it is set tighter than normal
 * body copy — more entries visible without scrolling, at a size still
 * comfortable to read.
 */
const ENTRY_FONT_SIZE = '0.75rem';
/** The header labels the change; the change itself is what is being read. */
const HEADER_FONT_SIZE = '0.65rem';
const ENTRY_SPACING = 1.25;
const ENTRY_PADDING = 1.5;

const DEFAULT_FIELD_MIN_WIDTH = 120;

interface HistoryEntryListProps {
  entries: HistoryEntry[];
  /** Width reserved for the field name column, so the arrows line up. */
  fieldMinWidth?: number;
  /** Timestamp formatter, defaults to `DD MMM YYYY HH:MM:SS`. */
  formatTimestamp?: (iso: string) => string;
  emptyMessage?: string;
}

/**
 * Renders edit history newest-first, one card per entry.
 *
 * Ordering is derived from `changedAt` rather than trusting the order entries
 * arrive in, so every caller gets the most recent change on top whichever way
 * its own data happens to be stored.
 *
 * @example <HistoryEntryList entries={history} fieldMinWidth={120} />
 */
export const HistoryEntryList = ({
  entries,
  fieldMinWidth = DEFAULT_FIELD_MIN_WIDTH,
  formatTimestamp = formatHistoryDate,
  emptyMessage = 'No edit history found.',
}: HistoryEntryListProps) => {
  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
        {emptyMessage}
      </Typography>
    );
  }
  const newestFirst = [...entries].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime(),
  );

  return (
    <Stack spacing={ENTRY_SPACING} sx={{ pt: 1 }}>
      {newestFirst.map((entry) => (
        <Paper
          key={entry.id}
          variant="outlined"
          sx={{
            p: ENTRY_PADDING,
            borderRadius: 2,
            // Accent rail marking each entry as one audited change.
            borderLeft: '3px solid',
            borderLeftColor: 'primary.main',
          }}
        >
          <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ mb: 0.75, flexWrap: 'wrap' }}>
            {/* Who made the change, not what role they hold. */}
            <Typography sx={{ fontSize: HEADER_FONT_SIZE, fontWeight: 700 }}>
              {entry.changedBy}
            </Typography>
            <Typography sx={{ fontSize: HEADER_FONT_SIZE }} color="text.disabled">·</Typography>
            <Typography sx={{ fontSize: HEADER_FONT_SIZE }} color="text.secondary">
              {formatTimestamp(entry.changedAt)}
            </Typography>
          </Stack>
          <Divider sx={{ mb: 0.75 }} />
          <Stack spacing={0.4}>
            {entry.changes.map((change) => (
              <Stack
                key={change.field}
                direction="row"
                spacing={0.75}
                alignItems="baseline"
                sx={{ flexWrap: 'wrap' }}
              >
                <Typography sx={{ fontSize: ENTRY_FONT_SIZE, fontWeight: 600, minWidth: fieldMinWidth }}>
                  {change.field}
                </Typography>
                {/* Red for what it was, green for what it became — the direction
                    of the change should be readable without parsing the text. */}
                <Typography sx={{ fontSize: ENTRY_FONT_SIZE }} color="error.main">{change.from}</Typography>
                <Typography sx={{ fontSize: ENTRY_FONT_SIZE }} color="text.disabled">→</Typography>
                <Typography sx={{ fontSize: ENTRY_FONT_SIZE }} color="success.main">{change.to}</Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};
