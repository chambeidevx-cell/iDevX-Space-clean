import { MouseEvent, ReactElement } from 'react';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { Check as CheckIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { MONO_TEXT_SX } from '@/constants/typography';

/** Long addresses truncate rather than pushing the chips beside them off the row. */
const DEFAULT_MAX_WIDTH = 260;

/** Sized to sit inside a small chip without stretching it past its 24px height. */
const CHIP_ICON_SIZE = 14;

interface ChipActionProps {
  title: string;
  icon: ReactElement;
  onClick: (event: MouseEvent<HTMLElement>) => void;
}

const ChipAction = ({ title, icon, onClick }: ChipActionProps) => (
  <Tooltip title={title} placement="top" arrow>
    <IconButton
      size="small"
      onClick={onClick}
      sx={{ p: 0.25, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
    >
      {icon}
    </IconButton>
  </Tooltip>
);

interface ContactChipProps {
  /** Leading icon naming the kind of value — an envelope, a handset. */
  icon: ReactElement;
  value: string;
  /**
   * An action of its own, as a button before copy. Copy keeps the trailing
   * position because it is the one action every value supports, so it lands in
   * the same place on every chip.
   */
  onAction?: (event: MouseEvent<HTMLElement>) => void;
  /** Icon for `onAction` — required with it. */
  actionIcon?: ReactElement;
  /** Tooltip for `onAction` — required with it. */
  actionLabel?: string;
  maxWidth?: number;
  /**
   * Renders the value in a monospace face. For identifiers, which are read and
   * checked character by character rather than as words.
   */
  monospace?: boolean;
}

/**
 * A contact detail — an address, a number — shown as a chip you can act on.
 *
 * The buttons sit inside the chip rather than the chip itself being clickable:
 * a chip that silently does something on click gives no sign that it will, and
 * no room for a second action. Copy confirms with a tick for a moment, which is
 * feedback enough for something this small — no snackbar.
 *
 * @example <ContactChip icon={<PhoneOutlinedIcon />} value={phone} />
 * @example
 * <ContactChip
 *   icon={<EmailOutlinedIcon />}
 *   value={email}
 *   onAction={openMenu}
 *   actionIcon={<MailOutlineIcon />}
 *   actionLabel="Email options"
 * />
 */
export const ContactChip = ({
  icon,
  value,
  onAction,
  actionIcon,
  actionLabel,
  maxWidth = DEFAULT_MAX_WIDTH,
  monospace = false,
}: ContactChipProps) => {
  const { hasCopied, copy } = useCopyToClipboard();

  return (
    <Chip
      icon={icon}
      size="small"
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, minWidth: 0 }}>
          <Box
            component="span"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              ...(monospace && MONO_TEXT_SX),
            }}
          >
            {value}
          </Box>
          {onAction && actionIcon && actionLabel && (
            <ChipAction
              title={actionLabel}
              // Sized by selector, not by `fontSize` on this span: an MUI icon
              // takes its size from its own `fontSize` prop and does not inherit
              // the parent's, so setting it here left the action icon at the
              // default 24px beside a 14px copy button.
              icon={(
                <Box
                  component="span"
                  sx={{ display: 'flex', '& .MuiSvgIcon-root': { fontSize: CHIP_ICON_SIZE } }}
                >
                  {actionIcon}
                </Box>
              )}
              onClick={onAction}
            />
          )}
          <ChipAction
            title={hasCopied ? 'Copied!' : 'Copy'}
            icon={hasCopied
              ? <CheckIcon sx={{ fontSize: CHIP_ICON_SIZE }} />
              : <ContentCopyIcon sx={{ fontSize: CHIP_ICON_SIZE }} />}
            onClick={() => copy(value)}
          />
        </Box>
      }
      sx={{
        fontSize: '0.75rem',
        maxWidth,
        '& .MuiChip-label': { display: 'flex', minWidth: 0, pr: 0.5 },
      }}
    />
  );
};
