import { Button } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface CancelButtonProps {
  onClick: () => void;
  /** Use "Close" where nothing was being edited and nothing is discarded. */
  label?: string;
  disabled?: boolean;
  /** Share the row's width with its sibling — used inside confirm popovers. */
  isStretched?: boolean;
}

/**
 * The button that backs out of a form, dialog or edit — outlined, in the
 * warning tone, with an X.
 *
 * One component rather than a rule to follow by hand: the pair of buttons at
 * the foot of a dialog is the most copied markup in the app, and every copy is
 * a chance for one of them to end up plain, or grey, or without its icon. The
 * warning tone marks it as the destructive-ish half of the pair — it discards
 * what was typed — without the alarm of the error tone, which belongs to
 * deleting a record.
 *
 * @example <CancelButton onClick={onClose} />
 * @example <CancelButton onClick={onClose} label="Close" />
 */
export const CancelButton = ({
  onClick,
  label = 'Cancel',
  disabled = false,
  isStretched = false,
}: CancelButtonProps) => (
  <Button
    onClick={onClick}
    variant="outlined"
    color="warning"
    size="small"
    startIcon={<CloseIcon />}
    disabled={disabled}
    sx={isStretched ? { flex: 1 } : undefined}
  >
    {label}
  </Button>
);
