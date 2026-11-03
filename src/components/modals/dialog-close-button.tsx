import { IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface DialogCloseButtonProps {
  onClose: () => void;
}

/**
 * Close button pinned to the top-right corner of a `DialogTitle`.
 * Use inside titles that stack their own content and reserve right padding.
 *
 * @example <DialogTitle sx={{ pr: 6 }}>Send Email<DialogCloseButton onClose={onClose} /></DialogTitle>
 */
export const DialogCloseButton = ({ onClose }: DialogCloseButtonProps) => (
  <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
    <CloseIcon fontSize="small" />
  </IconButton>
);
