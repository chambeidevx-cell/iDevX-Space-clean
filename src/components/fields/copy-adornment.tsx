import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import { Check as CheckIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

const ICON_SIZE = 16;

interface CopyAdornmentProps {
  /** What lands on the clipboard — usually the field's own value. */
  value: string;
  /** Names the value in the tooltip, as in "Copy Platform Secret". */
  label: string;
  /**
   * `top` for a multiline field, where a vertically centred button drifts away
   * from the first line as the box grows.
   */
  align?: 'center' | 'top';
}

/**
 * Copy button for the end of a text field.
 *
 * Belongs on any field holding a value that exists to be pasted somewhere else
 * — credentials, keys, endpoints, generated identifiers. Selecting a long
 * secret by hand is easy to get wrong by a character, and the mistake surfaces
 * later as an authentication failure with nothing to point at.
 *
 * Confirms with a tick for a moment rather than a snackbar, which would be a
 * lot of ceremony for a copy.
 *
 * @example
 * slotProps={{ input: { endAdornment: <CopyAdornment value={secret} label="Platform Secret" /> } }}
 */
export const CopyAdornment = ({ value, label, align = 'center' }: CopyAdornmentProps) => {
  const { hasCopied, copy } = useCopyToClipboard();

  return (
    <InputAdornment
      position="end"
      sx={align === 'top' ? { alignSelf: 'flex-start', mt: 1.25 } : undefined}
    >
      <Tooltip title={hasCopied ? 'Copied!' : `Copy ${label}`} placement="top" arrow>
        {/* A span keeps the tooltip working when the field is disabled. */}
        <span>
          <IconButton
            size="small"
            onClick={() => copy(value)}
            disabled={!value}
            aria-label={`Copy ${label}`}
            sx={{ color: hasCopied ? 'success.main' : 'text.secondary' }}
          >
            {hasCopied
              ? <CheckIcon sx={{ fontSize: ICON_SIZE }} />
              : <ContentCopyIcon sx={{ fontSize: ICON_SIZE }} />}
          </IconButton>
        </span>
      </Tooltip>
    </InputAdornment>
  );
};
