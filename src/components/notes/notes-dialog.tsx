import { ReactNode, useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';
import { AddComment as AddCommentIcon } from '@mui/icons-material';
import { ModalHeader } from '@/components/modals/modal-header';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { hasRichTextContent } from '@/utils/rich-text';
import { NoteEntry } from '@/interfaces/note';
import { NoteList } from './note-list';

interface NotesDialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  notes: NoteEntry[];
  getAuthorName: (authorId: string) => string;
  currentUserId: string;
  onAdd: (body: string) => void;
  onRemove: (noteId: string) => void;
}

/**
 * Standard notes dialog: the record's notes newest-first, with a composer for
 * the signed-in user.
 *
 * Built to match `HistoryDialog` — same size, same header, same entry cards —
 * because the two sit behind adjacent actions on the same row and a reader
 * should not have to reorient between them. The difference is deliberate and
 * limited: history is read-only, notes can be added and withdrawn by whoever
 * wrote them.
 *
 * The composer sits above the list rather than below it, so writing a note
 * never means scrolling past the ones already there.
 *
 * @example
 * <NotesDialog
 *   open={open}
 *   onClose={close}
 *   title="Notes — Soylent Corp"
 *   notes={lead.notes}
 *   getAuthorName={getName}
 *   currentUserId={user.id}
 *   onAdd={addNote}
 *   onRemove={removeNote}
 * />
 */
export const NotesDialog = ({
  open,
  onClose,
  title,
  notes,
  getAuthorName,
  currentUserId,
  onAdd,
  onRemove,
}: NotesDialogProps) => {
  const [draft, setDraft] = useState('');
  /*
   * The editor takes `content` once, on mount — clearing `draft` alone leaves
   * the written note on screen. Bumping this key remounts it empty, which is
   * the supported way to reset a TipTap instance.
   */
  const [composerKey, setComposerKey] = useState(0);

  // Reopening on another record must not carry the previous draft over.
  useEffect(() => {
    if (!open) return;
    setDraft('');
    setComposerKey((key) => key + 1);
  }, [open]);

  const handleAdd = () => {
    if (!hasRichTextContent(draft)) return;
    onAdd(draft);
    setDraft('');
    setComposerKey((key) => key + 1);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <ModalHeader title={title} onClose={onClose} />
      <DialogContent>
        <Stack spacing={1} sx={{ pt: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Add a Note
          </Typography>
          <RichTextEditor key={composerKey} value={draft} onChange={setDraft} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddCommentIcon />}
              onClick={handleAdd}
              disabled={!hasRichTextContent(draft)}
            >
              Add Note
            </Button>
          </Box>
        </Stack>
        <NoteList
          notes={notes}
          getAuthorName={getAuthorName}
          currentUserId={currentUserId}
          onRemove={onRemove}
        />
      </DialogContent>
    </Dialog>
  );
};
