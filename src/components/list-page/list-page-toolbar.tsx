import { ReactNode } from 'react';
import { Stack } from '@mui/material';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import { GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { ExportButton } from '@/components/actions/export-button';
import { ColumnVisibilityPopover } from '@/components/data-grid/column-visibility-popover';
import { SearchField } from '@/components/data-grid/search-field';
import { ToolbarIconButton } from '@/components/data-grid/toolbar-icon-button';
import { useIsMobile } from '@/hooks/use-is-mobile';

interface ListPageToolbarProps {
  /** Primary action for the page, typically an "Add New …" button. */
  primaryAction?: ReactNode;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  isFiltersVisible: boolean;
  onToggleFilters: () => void;
  /** Supply all three to offer column management. */
  columns?: GridColDef[];
  columnVisibilityModel?: GridColumnVisibilityModel;
  onColumnVisibilityModelChange?: (model: GridColumnVisibilityModel) => void;
  exportTooltip?: string;
  /** Extra desktop-only controls, placed before Export. */
  children?: ReactNode;
}

/**
 * Standard header row for a list page: primary action on the left, then search,
 * the filters toggle, column management and export on the right.
 *
 * Mobile keeps only search and the filters toggle. Creating records, exporting
 * and choosing columns are desktop tasks, and hiding them here is what keeps
 * every list page consistent without each one re-deciding.
 *
 * @example
 * <ListPageToolbar
 *   primaryAction={<Button startIcon={<AddIcon />}>Add New Client</Button>}
 *   search={search}
 *   onSearchChange={setSearch}
 *   isFiltersVisible={isFiltersVisible}
 *   onToggleFilters={() => setIsFiltersVisible((visible) => !visible)}
 *   columns={columns}
 *   columnVisibilityModel={columnVisibilityModel}
 *   onColumnVisibilityModelChange={setColumnVisibilityModel}
 * />
 */
export const ListPageToolbar = ({
  primaryAction,
  search,
  onSearchChange,
  searchPlaceholder,
  isFiltersVisible,
  onToggleFilters,
  columns,
  columnVisibilityModel,
  onColumnVisibilityModelChange,
  exportTooltip = 'Export table',
  children,
}: ListPageToolbarProps) => {
  const isMobile = useIsMobile();
  const hasColumnManagement = Boolean(columns && columnVisibilityModel && onColumnVisibilityModelChange);

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
      {!isMobile && primaryAction}
      {/* On mobile the search takes the row and the filter sits at its right
          edge — with no primary action or export there, a fixed-width search
          would leave the row mostly empty. */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ ml: 'auto', flex: isMobile ? 1 : 'none', minWidth: 0 }}
      >
        <SearchField
          value={search}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
        <ToolbarIconButton
          title={isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
          icon={<FilterListIcon fontSize="small" />}
          onClick={onToggleFilters}
          isActive={isFiltersVisible}
        />
        {!isMobile && hasColumnManagement && (
          <ColumnVisibilityPopover
            columns={columns!}
            model={columnVisibilityModel!}
            onChange={onColumnVisibilityModelChange!}
          />
        )}
        {!isMobile && children}
        {!isMobile && <ExportButton tooltip={exportTooltip} />}
      </Stack>
    </Stack>
  );
};
