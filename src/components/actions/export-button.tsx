import { Button, IconButton, Tooltip } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';

interface ExportButtonProps {
  onExport?: () => void;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  tooltip?: string;
}

export const outlinedIconButtonSx = {
  color: 'text.primary',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1,
  '&:hover': {
    borderColor: 'text.primary',
    background: 'action.hover',
  },
};

export const ExportButton = ({
  onExport,
  label,
  size = 'small',
  tooltip = 'Export',
}: ExportButtonProps) => {
  if (label) {
    return (
      <Tooltip title={tooltip} placement="bottom" arrow>
        <Button
          variant="outlined"
          size={size}
          startIcon={<FileDownloadIcon />}
          onClick={onExport}
          sx={outlinedIconButtonSx}
        >
          {label}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltip}>
      <IconButton
        size={size}
        onClick={onExport}
        sx={outlinedIconButtonSx}
      >
        <FileDownloadIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};
