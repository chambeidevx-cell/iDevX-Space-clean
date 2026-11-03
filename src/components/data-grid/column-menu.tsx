import { GridColumnMenu, GridColumnMenuProps } from '@mui/x-data-grid';

export const ColumnMenu = (props: GridColumnMenuProps) => (
  <GridColumnMenu {...props} slots={{ columnMenuColumnsItem: null, columnMenuFilterItem: null }} />
);
