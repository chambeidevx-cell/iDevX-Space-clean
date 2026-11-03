import { useState } from 'react';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import { OpenInNew as OpenInNewIcon, Send as SendIcon } from '@mui/icons-material';
import SendEmailModal from '@/components/modals/send-email-modal';

interface EmailOptionsMenuProps {
  email: string;
  /** The control the menu hangs from; `null` keeps it closed. */
  anchorEl: HTMLElement | null;
  onClose: () => void;
  /**
   * Told when the composer opens and closes. Callers whose trigger only exists
   * on hover need this to keep it mounted — a `Menu` whose anchor unmounts
   * loses its position.
   */
  onComposerChange?: (isOpen: boolean) => void;
}

/**
 * The two ways to write to an address: the composer inside the app, or the
 * reader's own mail client.
 *
 * Both are offered every time rather than one being chosen for the user —
 * sending from the app keeps the message on the record, while their own client
 * has their signature, drafts and history. Which they want depends on the
 * message, so neither can be the silent default.
 *
 * @example
 * <EmailOptionsMenu email={value} anchorEl={anchor} onClose={() => setAnchor(null)} />
 */
export const EmailOptionsMenu = ({ email, anchorEl, onClose, onComposerChange }: EmailOptionsMenuProps) => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const setComposerOpen = (isOpen: boolean) => {
    setIsComposerOpen(isOpen);
    onComposerChange?.(isOpen);
  };

  const handleOpenComposer = () => {
    setComposerOpen(true);
    onClose();
  };

  const handleOpenEmailApp = () => {
    window.open(`mailto:${email}`, '_blank');
    onClose();
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleOpenComposer}>
          <ListItemIcon><SendIcon fontSize="small" /></ListItemIcon>
          Send Instant Email
        </MenuItem>
        <MenuItem onClick={handleOpenEmailApp}>
          <ListItemIcon><OpenInNewIcon fontSize="small" /></ListItemIcon>
          Open Email App
        </MenuItem>
      </Menu>
      <SendEmailModal open={isComposerOpen} onClose={() => setComposerOpen(false)} toEmail={email} />
    </>
  );
};
