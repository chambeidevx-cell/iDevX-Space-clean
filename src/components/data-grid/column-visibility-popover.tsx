import { useState } from 'react';
import { Checkbox, FormControlLabel, Popover, Stack, Typography } from '@mui/material';
import { ViewColumn as ViewColumnIcon } from '@mui/icons-material';
import { GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { ToolbarIconButton } from './toolbar-icon-button';

interface ColumnVisibilityPopoverProps {
  columns: GridColDef[];
  model: GridColumnVisibilityModel;
  onChange: (model: GridColumnVisibilityModel) => void;
  /** Columns the user should not be able to hide. */
  lockedFields?: string[];
}

/**
 * Toolbar button opening a checkbox list that toggles grid column visibility.
 *
 * @example <ColumnVisibilityPopover columns={columns} model={model} onChange={setModel} />
 */
export const ColumnVisibilityPopover = ({
  columns,
  model,
  onChange,
  lockedFields = ['actions'],
}: ColumnVisibilityPopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const toggleableColumns = columns.filter((column) => !lockedFields.includes(column.field));

  return (
    <>
      <ToolbarIconButton
        title="Column Management"
        icon={<ViewColumnIcon fontSize="small" />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        isActive={Boolean(anchorEl)}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 0.5, p: 1.5, minWidth: 200 } } }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Columns
        </Typography>
        <Stack>
          {toggleableColumns.map((column) => (
            <FormControlLabel
              key={column.field}
              label={String(column.headerName)}
              control={
                <Checkbox
                  size="small"
                  checked={model[column.field] !== false}
                  onChange={(e) => onChange({ ...model, [column.field]: e.target.checked })}
                />
              }
            />
          ))}
        </Stack>
      </Popover>
    </>
  );
};
