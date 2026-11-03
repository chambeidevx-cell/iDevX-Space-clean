import { ReactNode, useState } from 'react';
import { Box, useTheme } from '@mui/material';

/** Width of the fade that masks the text behind the revealed actions. */
const FADE_WIDTH = '80px';
const CELL_PADDING_X = '10px';

interface HoverActionCellProps {
  /** Text shown in the cell; tinted while the row is hovered. */
  value: ReactNode;
  /** Buttons revealed on hover, laid out at the trailing edge. */
  actions: ReactNode;
  /**
   * Keeps the actions on screen while one of them owns something that is still
   * open — a menu, a dialog.
   *
   * Without it, opening a menu moves the pointer off the cell, the buttons
   * unmount, and the menu loses the element it was anchored to: it jumps to the
   * corner of the screen instead of sitting under the button that opened it.
   */
  isActionsPinned?: boolean;
}

/**
 * Grid cell that keeps its actions hidden until the pointer is over it, so wide
 * tables stay readable. The actions sit on a fade so long values disappear
 * behind them rather than colliding.
 *
 * Every hover cell in the app is built on this — do not re-implement the
 * hover/fade behaviour per column. Mobile cards use the `fields/*` components
 * instead, which show the same actions as permanent tap targets.
 *
 * @example <HoverActionCell value={email} actions={<CopyButton value={email} />} />
 */
export const HoverActionCell = ({ value, actions, isActionsPinned = false }: HoverActionCellProps) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const isShowingActions = isHovered || isActionsPinned;
  const overlayColor = theme.palette.mode === 'dark'
    ? 'rgba(8, 12, 20, 0.78)'
    : 'rgba(255, 255, 255, 0.95)';

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        pl: CELL_PADDING_X,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* A block wrapper, not a span, so the value may be chips or avatars
          rather than only text. */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          whiteSpace: 'nowrap',
          color: isShowingActions ? 'primary.main' : 'text.primary',
          transition: 'color 0.15s ease',
          fontSize: 'inherit',
        }}
      >
        {value}
      </Box>
      {isShowingActions && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            pl: FADE_WIDTH,
            pr: CELL_PADDING_X,
            background: `linear-gradient(to right, transparent, ${overlayColor} 60%)`,
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
  );
};
