import { ReactElement } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { outlinedIconButtonSx } from '@/components/actions/export-button';

interface ToolbarIconButtonProps {
  title: string;
  icon: ReactElement;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Highlights the button while the panel it controls is open. */
  isActive?: boolean;
}

/**
 * Outlined icon button used in grid toolbars, highlighted while active.
 *
 * @example <ToolbarIconButton title="Show Filters" icon={<FilterListIcon fontSize="small" />} onClick={toggle} isActive={filtersVisible} />
 */
export const ToolbarIconButton = ({ title, icon, onClick, isActive = false }: ToolbarIconButtonProps) => (
  <Tooltip title={title} placement="bottom" arrow>
    <IconButton
      size="small"
      onClick={onClick}
      sx={isActive ? {
        ...outlinedIconButtonSx,
        color: 'secondary.main',
        borderColor: 'secondary.main',
        '&:hover': { background: 'action.hover' },
      } : outlinedIconButtonSx}
    >
      {icon}
    </IconButton>
  </Tooltip>
);
