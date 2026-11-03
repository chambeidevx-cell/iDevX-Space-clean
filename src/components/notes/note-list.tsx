import { Divider, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material';
import { RichTextContent } from '@/components/editor/rich-text-content';
import { NoteEntry } from '@/interfaces/note';
import { formatHistoryDate } from '@/utils/format-date';

/** Matches `HistoryEntryList` — the two are read the same way, side by side. */
const ENTRY_FONT_SIZE = '0.75rem';
const HEADER_FONT_SIZE = '0.65rem';
const ENTRY_SPACING = 1.25;
const ENTRY_PADDING = 1.5;

interface NoteListProps {
  notes: NoteEntry[];
  /** Resolves an author id to a display name. */
  getAuthorName: (authorId: string) => string;
  /** Id of the signed-in user — only their own notes offer a remove button. */
  currentUserId: string;
  onRemove: (noteId: string) => void;
  emptyMessage?: string;
}

/**
 * Notes on a record, newest first — the same card, rail and type scale as
 * `HistoryEntryList`, so a record's notes and its history read as one family.
 *
 * The remove button appears only on the signed-in user's own notes. A note is
 * someone's statement, and letting a colleague delete it turns a record of what
 * was said into a record of what survived.
 *
 * @example
 * <NoteList notes={notes} getAuthorName={getName} currentUserId={user.id} onRemove={remove} />
 */
export const NoteList = ({
  notes,
  getAuthorName,
  currentUserId,
  onRemove,
  emptyMessage = 'No notes yet.',
}: NoteListProps) => {
  if (notes.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
        {emptyMessage}
      </Typography>
    );
  }

  const newestFirst = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <Stack spacing={ENTRY_SPACING} sx={{ pt: 1 }}>
      {newestFirst.map((note) => {
        const isOwn = note.authorId === currentUserId;
        return (
          <Paper
            key={note.id}
            variant="outlined"
            sx={{
              p: ENTRY_PADDING,
              borderRadius: 2,
              borderLeft: '3px solid',
              borderLeftColor: 'primary.main',
            }}
          >
            <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ mb: 0.75, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: HEADER_FONT_SIZE, fontWeight: 700 }}>
                {getAuthorName(note.authorId)}
              </Typography>
              <Typography sx={{ fontSize: HEADER_FONT_SIZE }} color="text.disabled">·</Typography>
              <Typography sx={{ fontSize: HEADER_FONT_SIZE }} color="text.secondary">
                {formatHistoryDate(note.createdAt)}
              </Typography>
              {isOwn && (
                <Tooltip title="Remove Note" placement="top" arrow>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onRemove(note.id)}
                    sx={{ ml: 'auto', p: 0.25 }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
            <Divider sx={{ mb: 0.75 }} />
            <RichTextContent html={note.body} sx={{ fontSize: ENTRY_FONT_SIZE }} />
          </Paper>
        );
      })}
    </Stack>
  );
};
