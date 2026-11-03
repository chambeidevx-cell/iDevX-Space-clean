import { useState } from 'react';
import {
  Check as CheckIcon,
  ContentCopy as ContentCopyIcon,
  MailOutline as MailOutlineIcon,
} from '@mui/icons-material';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { EmailOptionsMenu } from '@/components/modals/email-options-menu';
import { CellIconButton } from './cell-icon-button';
import { HoverActionCell } from './hover-action-cell';

/** Icon size that matches the compact grid density. */
const ICON_SIZE = 14;

interface EmailCellProps {
  value: string;
}

/**
 * Grid cell for an email address. Hover reveals a copy button and a menu
 * offering the in-app composer or the user's mail client.
 *
 * The mobile equivalent is `EmailField`, which offers the same three actions as
 * permanent buttons. Keep the two in step.
 *
 * @example renderCell: (params) => <EmailCell value={params.value} />
 */
export const EmailCell = ({ value }: EmailCellProps) => {
  const { hasCopied, copy } = useCopyToClipboard();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <>
      <HoverActionCell
        value={value}
        /* The menu and the composer both outlive the pointer leaving the cell. */
        isActionsPinned={Boolean(menuAnchor) || isComposerOpen}
        actions={
          <>
            <CellIconButton
              title="Email Options"
              icon={<MailOutlineIcon sx={{ fontSize: ICON_SIZE }} />}
              onClick={(event) => setMenuAnchor(event.currentTarget)}
            />
            <CellIconButton
              title={hasCopied ? 'Copied!' : 'Copy Email'}
              icon={hasCopied
                ? <CheckIcon sx={{ fontSize: ICON_SIZE }} />
                : <ContentCopyIcon sx={{ fontSize: ICON_SIZE }} />}
              onClick={() => copy(value)}
              isSuccess={hasCopied}
            />
          </>
        }
      />
      <EmailOptionsMenu
        email={value}
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        onComposerChange={setIsComposerOpen}
      />
    </>
  );
};
