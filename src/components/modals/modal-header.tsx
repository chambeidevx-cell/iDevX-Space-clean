import { ReactNode } from 'react';
import { DialogTitle, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ModalHeaderProps {
  title: ReactNode;
  onClose: () => void;
}

/**
 * Dialog title with the title on the left and a close button on the right.
 *
 * @example <ModalHeader title="Edit Label" onClose={handleClose} />
 */
export const ModalHeader = ({ title, onClose }: ModalHeaderProps) => (
  <DialogTitle sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    {title}
    <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
      <CloseIcon fontSize="small" />
    </IconButton>
  </DialogTitle>
);
