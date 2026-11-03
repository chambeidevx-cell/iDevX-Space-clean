import { Check as CheckIcon, ContentCopy as ContentCopyIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { CellIconButton } from './cell-icon-button';
import { HoverActionCell } from './hover-action-cell';

/** Icon size that matches the compact grid density. */
const ICON_SIZE = 14;

interface LinkCellProps {
  value: string;
}

/**
 * Grid cell for a URL. Hover reveals buttons to open the link in a new tab or
 * copy it.
 *
 * @example renderCell: (params) => <LinkCell value={params.value} />
 */
export const LinkCell = ({ value }: LinkCellProps) => {
  const { hasCopied, copy } = useCopyToClipboard();
  return (
    <HoverActionCell
      value={value}
      actions={
        <>
          <CellIconButton
            title="Open Link"
            icon={<OpenInNewIcon sx={{ fontSize: ICON_SIZE }} />}
            onClick={() => window.open(value, '_blank', 'noopener,noreferrer')}
          />
          <CellIconButton
            title={hasCopied ? 'Copied!' : 'Copy Link'}
            icon={hasCopied
              ? <CheckIcon sx={{ fontSize: ICON_SIZE }} />
              : <ContentCopyIcon sx={{ fontSize: ICON_SIZE }} />}
            onClick={() => copy(value)}
            isSuccess={hasCopied}
          />
        </>
      }
    />
  );
};
