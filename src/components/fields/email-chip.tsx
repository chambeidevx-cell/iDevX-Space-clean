import { useState } from 'react';
import { EmailOutlined as EmailOutlinedIcon, MailOutline as MailOutlineIcon } from '@mui/icons-material';
import { ContactChip } from '@/components/fields/contact-chip';
import { EmailOptionsMenu } from '@/components/modals/email-options-menu';

interface EmailChipProps {
  email: string;
  maxWidth?: number;
}

/**
 * An address shown as a chip, with email options beside a copy button.
 *
 * The envelope button opens `EmailOptionsMenu` rather than composing straight
 * away, so the choice between sending from the app and using the reader's own
 * mail client is the same here as it is in a table cell.
 *
 * @example <EmailChip email={client.email} />
 */
export const EmailChip = ({ email, maxWidth }: EmailChipProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <ContactChip
        icon={<EmailOutlinedIcon />}
        value={email}
        onAction={(event) => setMenuAnchor(event.currentTarget)}
        actionIcon={<MailOutlineIcon />}
        actionLabel="Email Options"
        maxWidth={maxWidth}
      />
      <EmailOptionsMenu email={email} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)} />
    </>
  );
};
