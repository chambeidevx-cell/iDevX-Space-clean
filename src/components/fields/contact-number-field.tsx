import { IconButton, Tooltip } from '@mui/material';
import {
  Check as CheckIcon,
  ContentCopy as ContentCopyIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { outlinedIconButtonSx } from '@/components/actions/export-button';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { CardField } from './card-field';

interface ContactNumberFieldProps {
  label: string;
  dialCode?: string;
  contactNumber?: string;
}

/**
 * Phone row for the mobile cards. Replaces the grid's hover-only copy button
 * with permanent tap targets, and adds the dialer since the card only ever
 * renders on a device that has one.
 *
 * @example <ContactNumberField label="Contact Number" dialCode="+63" contactNumber="9171234567" />
 */
export const ContactNumberField = ({ label, dialCode, contactNumber }: ContactNumberFieldProps) => {
  const { hasCopied, copy } = useCopyToClipboard();
  const display = [dialCode, contactNumber].filter(Boolean).join(' ');

  const handleCall = () => window.open(`tel:${display.replace(/\s/g, '')}`, '_self');

  return (
    <CardField
      label={label}
      value={display}
      actions={
        <>
          <Tooltip title="Call" placement="top" arrow>
            <IconButton size="small" onClick={handleCall} sx={outlinedIconButtonSx}>
              <PhoneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={hasCopied ? 'Copied!' : 'Copy Number'} placement="top" arrow>
            <IconButton
              size="small"
              onClick={() => copy(display)}
              sx={{ ...outlinedIconButtonSx, ...(hasCopied && { color: 'success.main' }) }}
            >
              {hasCopied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </>
      }
    />
  );
};
