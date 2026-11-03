import { ReactElement, useState } from 'react';
import { IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

export interface RowAction {
  label: string;
  icon: ReactElement;
  onClick: () => void;
  /**
   * Tints the item to match the button the action would carry in the row —
   * green for one that completes something, blue for one that opens a view.
   * Ignored for a destructive action, which is always shown in the error tone.
   */
  color?: 'success' | 'info' | 'warning' | 'primary';
  /** Tints the item and pushes it below a divider, apart from the rest. */
  isDestructive?: boolean;
  /** Omit the action entirely — use for actions that depend on row state. */
  isHidden?: boolean;
}

interface RowActionsMenuProps {
  actions: RowAction[];
}

/**
 * The `⋮` overflow menu on a table row.
 *
 * Every table's action column is capped at three direct buttons plus this, so
 * rare, read-only and destructive actions live here rather than widening a
 * column that is pinned and costs the table horizontal room.
 *
 * Destructive actions sort to the bottom behind a divider, so a mis-aimed click
 * lands on something harmless.
 *
 * @example
 * <RowActionsMenu
 *   actions={[
 *     { label: 'View History Logs', icon: <HistoryIcon fontSize="small" />, onClick: () => onHistory(id) },
 *   ]}
 * />
 */
export const RowActionsMenu = ({ actions }: RowActionsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const visibleActions = actions.filter((action) => !action.isHidden);
  const handleClose = () => setAnchorEl(null);

  if (visibleActions.length === 0) return null;

  const ordered = [
    ...visibleActions.filter((action) => !action.isDestructive),
    ...visibleActions.filter((action) => action.isDestructive),
  ];
  const firstDestructiveIndex = ordered.findIndex((action) => action.isDestructive);

  return (
    <>
      <Tooltip title="More Actions" placement="bottom" arrow>
        <IconButton size="small" onClick={(event) => { event.stopPropagation(); setAnchorEl(event.currentTarget); }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 180 } } }}
      >
        {ordered.map((action, index) => (
          <MenuItem
            key={action.label}
            onClick={() => { handleClose(); action.onClick(); }}
            sx={{
              ...(action.color && !action.isDestructive && { color: `${action.color}.main` }),
              ...(action.isDestructive && { color: 'error.main' }),
              ...(index === firstDestructiveIndex && index > 0 && {
                borderTop: '1px solid',
                borderColor: 'divider',
              }),
            }}
          >
            <ListItemIcon
              sx={action.isDestructive
                ? { color: 'error.main' }
                : (action.color ? { color: `${action.color}.main` } : undefined)}
            >
              {action.icon}
            </ListItemIcon>
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
