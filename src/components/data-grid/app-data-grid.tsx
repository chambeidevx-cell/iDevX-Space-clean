import { useMemo } from 'react';
import { DataGrid, DataGridProps, GridColumnVisibilityModel, GridRowClassNameParams, GridRowModel } from '@mui/x-data-grid';
import { alpha } from '@mui/material';
import type { Theme } from '@mui/material';
import { ColumnMenu } from './column-menu';
import { COLUMN_MIN_WIDTH } from '@/constants/data-grid';

const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = [10, 25, 50];

/** Field name every table uses for its trailing action buttons. */
const ACTIONS_FIELD = 'actions';

/**
 * How a flagged row reads. Two states that both need finding but mean different
 * things — something happening now, and something booked to happen — must not
 * share a colour, or the colour stops carrying the difference.
 */
export type RowFlag = 'warning' | 'info';

const flaggedRowClass = (flag: RowFlag): string => `row-flagged-${flag}`;

/**
 * Fallback floor for a column that declares neither a width nor a minimum, so
 * nothing silently shrinks to the point of clipping. Columns should state their
 * own `minWidth` from `COLUMN_MIN_WIDTH` to suit the content they carry.
 */
const withMinWidth = (columns: DataGridProps['columns']): DataGridProps['columns'] =>
  columns.map((column) => (column.width || column.minWidth
    ? column
    : { ...column, minWidth: COLUMN_MIN_WIDTH.label }));

/**
 * First column still visible, which is the one that gets stuck to the left.
 * Column headers carry only `data-field` — never `data-colindex` — so both the
 * header and its cells have to be addressed by field for the two to agree.
 */
const getFirstVisibleField = (
  columns: DataGridProps['columns'],
  columnVisibilityModel?: GridColumnVisibilityModel,
): string | undefined =>
  columns.find((column) => columnVisibilityModel?.[column.field] !== false)?.field;

const cellSelector = (field: string): string => `.MuiDataGrid-cell[data-field="${field}"]`;
const headerSelector = (field: string): string => `.MuiDataGrid-columnHeader[data-field="${field}"]`;

/**
 * Column separators are absolutely positioned at `z-index: 30` and overhang
 * their own header by a few pixels, so a stuck header has to outrank them or
 * the dividers of the headers passing underneath draw across it.
 */
const STUCK_HEADER_Z_INDEX = 35;

/**
 * Sticky first and action columns — headers included — so identity and row
 * actions stay put while the middle of a wide table scrolls sideways. Headers
 * sit inside the same horizontal scrollport as the cells, so one rule covers
 * both.
 *
 * Stuck columns are painted with fully opaque backgrounds: the grid surface is
 * translucent, and anything less lets the cells sliding underneath show through
 * and blur the text. Row striping, hover and the header band are re-created as
 * tints layered over that base so the columns still match their neighbours.
 */
const getPinnedColumnSx = (theme: Theme, firstField?: string) => {
  const isDark = theme.palette.mode === 'dark';
  const base = isDark ? '#080E1A' : '#FFFFFF';
  const stripeTint = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(23,94,161,0.04)';
  const hoverTint = isDark ? 'rgba(77,179,255,0.08)' : 'rgba(23,94,161,0.08)';
  const headerTint = isDark ? 'rgba(77,179,255,0.12)' : 'rgba(23,94,161,0.08)';
  const edgeShadow = isDark ? 'rgba(0,0,0,0.55)' : 'rgba(17,24,39,0.16)';
  const tinted = (tint: string): string => `linear-gradient(${tint}, ${tint}), ${base}`;
  const stuck = { position: 'sticky' as const, zIndex: 2, background: base };
  const stuckLeft = { ...stuck, left: 0, boxShadow: `6px 0 10px -8px ${edgeShadow}` };
  const stuckRight = {
    ...stuck,
    right: 0,
    boxShadow: `-6px 0 10px -8px ${edgeShadow}`,
    borderLeft: `1px solid ${theme.palette.divider}`,
  };
  const pinnedFields = [
    ...(firstField ? [{ field: firstField, stuckSx: stuckLeft }] : []),
    { field: ACTIONS_FIELD, stuckSx: stuckRight },
  ];

  return pinnedFields.reduce((styles, { field, stuckSx }) => ({
    ...styles,
    [`& ${headerSelector(field)}`]: {
      ...stuckSx,
      zIndex: STUCK_HEADER_Z_INDEX,
      background: tinted(headerTint),
    },
    [`& ${cellSelector(field)}`]: stuckSx,
    [`& .MuiDataGrid-row.row-even ${cellSelector(field)}`]: { background: tinted(stripeTint) },
    [`& .MuiDataGrid-row:hover ${cellSelector(field)}`]: { background: tinted(hoverTint) },
  }), {
    /**
     * The render zone carries `translate3d(0, offsetTop, 0)` to place the
     * virtualised row window. A transformed ancestor becomes the containing
     * block for its sticky descendants, which drags the stuck columns out of
     * view on vertical scroll. Row virtualisation is disabled below, so
     * `offsetTop` is always 0 and dropping the transform is safe.
     */
    '& .MuiDataGrid-virtualScrollerRenderZone': { transform: 'none' },
  });
};

/**
 * Keeps the resize grips on screen.
 *
 * Resizing is free in the grid's Community tier and on by default, but vertical
 * cell borders — which every table here uses — make the library drop its
 * separators to `opacity: 0`, on the reasoning that the border already divides
 * the columns. The grip then only appears once the pointer is inside a 10px
 * strip that gives no sign of being there, so the columns read as fixed.
 *
 * The root class is doubled because the rule being overridden is the grid's
 * own, at equal specificity — `&` alone leaves the winner down to stylesheet
 * order.
 */
const RESIZE_HANDLE_SX = {
  '&& .MuiDataGrid-columnSeparator--resizable': { opacity: 1 },
};

/**
 * Tint for a row the caller has flagged.
 *
 * Painted on the cells, not only the row: the first and action columns stick to
 * the table's edges and paint an opaque background of their own so content does
 * not show through while it scrolls sideways. Tint the row alone and the flag
 * stops at the second column.
 */
const getFlaggedRowSx = (theme: Theme) => {
  const isDark = theme.palette.mode === 'dark';
  const base = isDark ? '#080E1A' : '#FFFFFF';
  const over = (value: string): string => `linear-gradient(${value}, ${value}), ${base}`;
  const flags: RowFlag[] = ['warning', 'info'];
  return flags.reduce((styles, flag) => {
    const colour = theme.palette[flag].main;
    const row = `& .MuiDataGrid-row.${flaggedRowClass(flag)}`;
    return {
      ...styles,
      [`${row} .MuiDataGrid-cell`]: { background: over(alpha(colour, isDark ? 0.18 : 0.14)) },
      [`${row}:hover .MuiDataGrid-cell`]: { background: over(alpha(colour, isDark ? 0.26 : 0.2)) },
    };
  }, {});
};

const getDefaultSx = (firstField?: string) => (theme: Theme) => ({
  flex: 1,
  width: '100%',
  minHeight: 0,
  '& .cell-no-padding': { padding: '0 !important' },
  ...RESIZE_HANDLE_SX,
  ...getPinnedColumnSx(theme, firstField),
  ...getFlaggedRowSx(theme),
});

const getStripedRowClassName = (params: GridRowClassNameParams): string =>
  params.indexRelativeToCurrentPage % 2 === 0 ? 'row-even' : 'row-odd';

interface AppDataGridProps extends DataGridProps {
  /**
   * Marks a row as needing attention, and says how: `warning` for something
   * happening now, `info` for something booked to happen. Return `null` to
   * leave the row alone. The tint goes over the row's stripe.
   *
   * A prop rather than the caller passing `getRowClassName`: that would replace
   * the striping rather than add to it, and every table would then decide its
   * own highlight colours.
   */
  getRowFlag?: (row: GridRowModel) => RowFlag | null;
}

/**
 * `DataGrid` preconfigured with the grid conventions used across the app:
 * compact density, striped rows, the shared column menu, paging defaults, and
 * first/action columns stuck to the edges while the table scrolls sideways.
 * Every prop can be overridden; `sx` is merged on top of the defaults.
 *
 * Virtualisation is off so the stuck columns survive scrolling in both
 * directions: a virtualised column unmounts once it leaves the viewport, and
 * the virtualised row window is positioned with a transform that breaks sticky
 * cells. Page sizes cap at 50 rows, so every page renders in full cheaply.
 *
 * @example <AppDataGrid rows={rows} columns={columns} />
 */
export const AppDataGrid = ({ sx, columns, getRowFlag, ...props }: AppDataGridProps) => {
  const sizedColumns = useMemo(() => withMinWidth(columns), [columns]);
  const firstField = getFirstVisibleField(columns, props.columnVisibilityModel);
  return (
    <DataGrid
      initialState={{ pagination: { paginationModel: { page: 0, pageSize: DEFAULT_PAGE_SIZE } } }}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      density="compact"
      showCellVerticalBorder
      disableRowSelectionOnClick
      disableVirtualization
      slots={{ columnMenu: ColumnMenu }}
      {...props}
      /* After the spread: the striping and any flag are the grid's own and must
         survive whatever a caller passes. */
      getRowClassName={(params) => {
        const flag = getRowFlag?.(params.row);
        return [getStripedRowClassName(params), flag ? flaggedRowClass(flag) : '']
          .filter(Boolean).join(' ');
      }}
      columns={sizedColumns}
      sx={[getDefaultSx(firstField), ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
};
