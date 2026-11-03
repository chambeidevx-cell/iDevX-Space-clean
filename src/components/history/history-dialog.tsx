import { ReactNode } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { ModalHeader } from '@/components/modals/modal-header';
import { HistoryEntry } from '@/interfaces/history';
import { HistoryEntryList } from './history-entry-list';

interface HistoryDialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  entries: HistoryEntry[];
  /** Width reserved for the field name column, so the arrows line up. */
  fieldMinWidth?: number;
  /** Timestamp formatter, defaults to `DD MMM YYYY HH:MM:SS`. */
  formatTimestamp?: (iso: string) => string;
}

/**
 * Standard read-only edit-history dialog.
 *
 * @example <HistoryDialog open={open} onClose={close} title="Edit History" entries={history} />
 */
export const HistoryDialog = ({
  open,
  onClose,
  title,
  entries,
  fieldMinWidth,
  formatTimestamp,
}: HistoryDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <ModalHeader title={title} onClose={onClose} />
    <DialogContent>
      <HistoryEntryList entries={entries} fieldMinWidth={fieldMinWidth} formatTimestamp={formatTimestamp} />
    </DialogContent>
  </Dialog>
);
