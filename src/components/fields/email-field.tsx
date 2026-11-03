import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import {
  Check as CheckIcon,
  ContentCopy as ContentCopyIcon,
  OpenInNew as OpenInNewIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { outlinedIconButtonSx } from '@/components/actions/export-button';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import SendEmailModal from '@/components/modals/send-email-modal';
import { CardField } from './card-field';

interface EmailFieldProps {
  label: string;
  email?: string;
}

/**
 * Email row for the mobile cards. The grid's hover-only affordances become
 * permanent tap targets, since touch devices have no hover state.
 *
 * @example <EmailField label="Work Email" email={contact.workEmail} />
 */
export const EmailField = ({ label, email }: EmailFieldProps) => {
  const { hasCopied, copy } = useCopyToClipboard();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenEmailApp = () => window.open(`mailto:${email}`, '_blank');

  return (
    <>
      <CardField
        label={label}
        value={email}
        actions={
          <>
            <Tooltip title="Send Instant Email" placement="top" arrow>
              <IconButton size="small" onClick={() => setIsModalOpen(true)} sx={outlinedIconButtonSx}>
                <SendIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Open Email App" placement="top" arrow>
              <IconButton size="small" onClick={handleOpenEmailApp} sx={outlinedIconButtonSx}>
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={hasCopied ? 'Copied!' : 'Copy Email'} placement="top" arrow>
              <IconButton
                size="small"
                onClick={() => copy(email ?? '')}
                sx={{ ...outlinedIconButtonSx, ...(hasCopied && { color: 'success.main' }) }}
              >
                {hasCopied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </>
        }
      />
      {email && (
        <SendEmailModal open={isModalOpen} onClose={() => setIsModalOpen(false)} toEmail={email} />
      )}
    </>
  );
};
