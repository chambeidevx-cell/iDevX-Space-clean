import { Check as CheckIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { MONO_TEXT_SX } from '@/constants/typography';
import { CellIconButton } from './cell-icon-button';
import { HoverActionCell } from './hover-action-cell';

/** Icon size that matches the compact grid density. */
const ICON_SIZE = 14;

interface CopyCellProps {
  value: string;
  /** Named in the tooltip, e.g. "number" renders "Copy number". */
  label?: string;
  /**
   * Renders the value monospaced. Use for identifiers and codes, which are read
   * character by character and should align down the column.
   */
  isIdentifier?: boolean;
}

/**
 * Grid cell whose value can be copied from a button revealed on hover.
 *
 * The mobile equivalent is `ContactNumberField` / `CardField`, which show the
 * same action as a permanent button.
 *
 * @example renderCell: (params) => <CopyCell value={params.value} label="number" />
 */
export const CopyCell = ({ value, label, isIdentifier = false }: CopyCellProps) => {
  const { hasCopied, copy } = useCopyToClipboard();
  return (
    <HoverActionCell
      value={isIdentifier ? <Box component="span" sx={MONO_TEXT_SX}>{value}</Box> : value}
      actions={
        <CellIconButton
          title={hasCopied ? 'Copied!' : `Copy ${label ?? 'value'}`}
          icon={hasCopied
            ? <CheckIcon sx={{ fontSize: ICON_SIZE }} />
            : <ContentCopyIcon sx={{ fontSize: ICON_SIZE }} />}
          onClick={() => copy(value)}
          isSuccess={hasCopied}
        />
      }
    />
  );
};
