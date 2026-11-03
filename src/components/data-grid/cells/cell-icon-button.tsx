import { ReactElement } from 'react';
import { IconButton, Tooltip } from '@mui/material';

interface CellIconButtonProps {
  title: string;
  icon: ReactElement;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Tints the button, used to confirm an action such as a copy. */
  isSuccess?: boolean;
}

/**
 * Icon button sized for the inside of a grid cell. Stops propagation so using
 * an action never also triggers the row's own click handler.
 *
 * @example <CellIconButton title="Copy Email" icon={<ContentCopyIcon sx={{ fontSize: 14 }} />} onClick={copy} />
 */
export const CellIconButton = ({ title, icon, onClick, isSuccess = false }: CellIconButtonProps) => (
  <Tooltip title={title} placement="bottom" arrow>
    <IconButton
      size="small"
      onClick={(event) => { event.stopPropagation(); onClick(event); }}
      sx={{
        p: 0.25,
        color: isSuccess ? 'success.main' : 'text.secondary',
        '&:hover': { color: 'text.primary' },
      }}
    >
      {icon}
    </IconButton>
  </Tooltip>
);
