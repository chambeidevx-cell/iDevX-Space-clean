import { MouseEvent } from 'react';
import { IconButton, Stack, Tooltip } from '@mui/material';
import {
  Cancel as CancelIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

interface SectionActionsProps {
  isEditMode: boolean;
  onEdit: () => void;
  onSaveOpen: (event: MouseEvent<HTMLButtonElement>) => void;
  onCancel: () => void;
  onHistory: () => void;
  /** Disables editing while another section on the page is being edited. */
  isEditDisabled?: boolean;
  /** Disables saving while the section still has invalid or missing fields. */
  isSaveDisabled?: boolean;
}

/**
 * Edit / history icons for a settings section, swapped for save / cancel while editing.
 *
 * @example <SectionActions isEditMode={isEditMode} onEdit={startEdit} onSaveOpen={openSave} onCancel={cancel} onHistory={openHistory} />
 */
export const SectionActions = ({
  isEditMode,
  onEdit,
  onSaveOpen,
  onCancel,
  onHistory,
  isEditDisabled = false,
  isSaveDisabled = false,
}: SectionActionsProps) => (
  <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
    {!isEditMode && (
      <>
        <Tooltip title={isEditDisabled ? 'Another section is being edited' : 'Edit section details'} arrow>
          <span>
            <IconButton size="small" onClick={onEdit} disabled={isEditDisabled}>
              <EditIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="View edit history" arrow>
          <IconButton size="small" onClick={onHistory}>
            <HistoryIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    )}
    {isEditMode && (
      <>
        <Tooltip title={isSaveDisabled ? 'Fill all required fields' : 'Save changes'} arrow>
          <span>
            <IconButton size="small" color="success" onClick={onSaveOpen} disabled={isSaveDisabled}>
              <SaveIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Cancel" arrow>
          <IconButton size="small" onClick={onCancel}>
            <CancelIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    )}
  </Stack>
);
