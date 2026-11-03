import { ReactNode } from 'react';
import {
  Button,
  Collapse,
  Dialog,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  FilterList as FilterListIcon,
  KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
  RestartAlt as RestartAltIcon,
} from '@mui/icons-material';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { FILTER_FONT_SIZE } from '@/constants/data-grid';
import { SAFE_AREA_BOTTOM, SAFE_AREA_LEFT, SAFE_AREA_RIGHT, SAFE_AREA_TOP } from '@/constants/layout';

/**
 * Narrow enough that the table keeps most of the width, wide enough for a
 * select and its label at the panel's type size.
 */
const PANEL_WIDTH = 196;

interface FiltersPanelProps {
  isOpen: boolean;
  /** Collapses the panel — the header chevron and the toolbar toggle share this. */
  onClose: () => void;
  /** Clears every filter back to its default. Omit to hide the reset button. */
  onReset?: () => void;
  /** Filter controls, usually `select` TextFields with `FILTER_FIELD_SX`. */
  children: ReactNode;
}

interface PanelContentsProps extends Omit<FiltersPanelProps, 'isOpen'> {
  /** The overlay sets its own width; the docked panel is fixed. */
  isFullWidth?: boolean;
}

const PanelContents = ({ onClose, onReset, children, isFullWidth }: PanelContentsProps) => (
  <Stack sx={{ height: '100%', width: isFullWidth ? '100%' : PANEL_WIDTH, maxWidth: '100%' }}>
    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ px: 1.5, py: 1.25 }}>
      <FilterListIcon sx={{ fontSize: 16 }} color="secondary" />
      <Typography sx={{ fontSize: FILTER_FONT_SIZE, fontWeight: 700, flex: 1 }}>
        Filters
      </Typography>
      <Tooltip title={isFullWidth ? 'Close' : 'Hide Filters'} placement="left" arrow>
        <IconButton size="small" onClick={onClose}>
          {isFullWidth
            ? <CloseIcon sx={{ fontSize: 16 }} />
            : <KeyboardDoubleArrowRightIcon sx={{ fontSize: 16 }} />}
        </IconButton>
      </Tooltip>
    </Stack>
    <Divider />
    {/* The controls scroll; the reset action stays pinned to the bottom. */}
    <Stack spacing={2} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 1.5, py: 2 }}>
      {children}
    </Stack>
    {onReset && (
      <>
        <Divider />
        {/* Spans the panel edge to edge as a footer bar. The divider above
            separates it, so the button carries no border or radius of its own —
            the panel's own rounded corners clip it. */}
        <Button
          fullWidth
          size="small"
          color="secondary"
          startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
          onClick={onReset}
          sx={{ fontSize: FILTER_FONT_SIZE, borderRadius: 0, py: 1.25, maxWidth: 'none' }}
        >
          Reset Filters
        </Button>
      </>
    )}
  </Stack>
);

/**
 * Filter controls in a panel beside the list, rather than a bar above it.
 *
 * Sitting alongside the table keeps the filters and their results visible at
 * once — a filter bar above a long list scrolls out of reach exactly when the
 * results need adjusting. Controls stack full width, so a filter reads the same
 * on every page regardless of how many it has.
 *
 * On mobile it becomes a full-screen overlay: a column beside the content would
 * leave the list unusably narrow, and taking the whole viewport gives the
 * controls room while keeping the reset action within thumb reach at the
 * bottom.
 *
 * @example
 * <FiltersPanel isOpen={isFiltersVisible} onClose={toggleFilters} onReset={handleReset}>
 *   <TextField select size="small" label="Status" sx={FILTER_FIELD_SX} … />
 * </FiltersPanel>
 */
export const FiltersPanel = ({ isOpen, onClose, onReset, children }: FiltersPanelProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullScreen
        slotProps={{
          paper: {
            sx: {
              // A full-screen sheet paints into the unsafe areas, so its header
              // would sit under the dynamic island and the reset action pinned
              // to the bottom under the home indicator — the one control here
              // that has to be tappable.
              pt: SAFE_AREA_TOP,
              pb: SAFE_AREA_BOTTOM,
              pl: SAFE_AREA_LEFT,
              pr: SAFE_AREA_RIGHT,
            },
          },
        }}
      >
        <PanelContents onClose={onClose} onReset={onReset} isFullWidth>
          {children}
        </PanelContents>
      </Dialog>
    );
  }

  return (
    <Collapse in={isOpen} orientation="horizontal" sx={{ height: '100%' }}>
      <Paper sx={{ height: '100%', overflow: 'hidden' }}>
        <PanelContents onClose={onClose} onReset={onReset}>{children}</PanelContents>
      </Paper>
    </Collapse>
  );
};
