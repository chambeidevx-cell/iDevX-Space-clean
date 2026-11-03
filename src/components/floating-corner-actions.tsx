import { ReactElement, RefObject, useEffect, useState } from 'react';
import { Fab, Theme, Tooltip, Zoom } from '@mui/material';
import {
  HeadsetMicOutlined as HeadsetMicOutlinedIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { MOBILE_BOTTOM_NAV_OFFSET, MOBILE_BOTTOM_NAV_PILL_TOP } from './mobile-bottom-nav';
import { SAFE_AREA_BOTTOM, SAFE_AREA_RIGHT } from '@/constants/layout';

/** Far enough down that back-to-top is useful rather than in the way. */
const VISIBLE_AFTER_PX = 240;

/** Diameter of a `size="small"` Fab. The stack has to know its own height. */
const FAB_SIZE = 40;

/**
 * Gap between the lowest button and the pill's top edge — tight, so the stack
 * reads as part of the same block of furniture rather than floating loose above
 * it. It can be this small because the stack sits at the pill's end, where the
 * disc never rises.
 */
const NAV_CLEARANCE = 6;

/**
 * Gap between the buttons in the stack — the same as the gap below it, so the
 * buttons and the pill read as one evenly-spaced column of furniture rather
 * than two objects that happen to share a corner.
 */
const STACK_GAP = NAV_CLEARANCE;

/** Inset from the right edge — the same one the pill uses, so the two line up. */
const RIGHT_INSET = 16;

/**
 * Gap between the permanent button and the last of the page's content, so the
 * two never touch once the page is scrolled to its end.
 */
const CONTENT_CLEARANCE = 8;

/**
 * Where the stack begins, measured up from the bottom of the viewport.
 *
 * Clears the attribution and the pill stacked in the same corner — but only the
 * pill, not the lifted disc's band above it: the disc rises in the middle of the
 * bar, nowhere near this corner, so reserving its clearance here would strand
 * the stack high up the screen for no reason.
 */
const STACK_BOTTOM = MOBILE_BOTTOM_NAV_OFFSET + MOBILE_BOTTOM_NAV_PILL_TOP + NAV_CLEARANCE;

/**
 * Band the corner stack needs *inside* the scrolling content, measured from the
 * same datum as `MOBILE_BOTTOM_NAV_HEIGHT` — the top of the attribution — so a
 * page shell can take whichever of the two is larger.
 *
 * Only the permanent button is reserved for. Back-to-top appears partway down a
 * long page and goes away again, so reserving its slot as well would leave a
 * strip of dead space on every page to protect content from a button that is
 * not there.
 */
export const MOBILE_CORNER_ACTIONS_BAND =
  MOBILE_BOTTOM_NAV_PILL_TOP + NAV_CLEARANCE + FAB_SIZE + CONTENT_CLEARANCE;

/**
 * The same glass recipe as the app's cards and grids: a translucent fill over a
 * blur, a hairline edge and a soft shadow — so the buttons read as part of the
 * surface rather than solid pucks dropped on top of it.
 */
const getGlassSx = (theme: Theme) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    color: theme.palette.secondary.main,
    background: isDark ? 'rgba(8,12,20,0.45)' : 'rgba(255,255,255,0.62)',
    backdropFilter: 'blur(24px)',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.7)',
    boxShadow: isDark
      ? 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.5)'
      : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 24px rgba(180,80,0,0.12)',
    '&:hover': {
      background: isDark ? 'rgba(77,179,255,0.16)' : 'rgba(23,94,161,0.10)',
    },
  };
};

interface CornerFabProps {
  /** Names the button, as both its tooltip and its accessible label. */
  label: string;
  icon: ReactElement;
  /** Position in the stack, counted upward from the bottom. */
  slot: number;
  /** Whether the button is on screen — the transient one passes a changing value. */
  isVisible: boolean;
  onClick: () => void;
}

/**
 * One button in the corner stack. `Zoom` has to sit outside the `Tooltip`: it
 * clones its child with a `style` and a `ref`, and `Tooltip` forwards both on to
 * the `Fab`, where the reverse arrangement would leave the tooltip's handlers on
 * a transition that never passes them to the DOM.
 */
const CornerFab = ({ label, icon, slot, isVisible, onClick }: CornerFabProps) => (
  <Zoom in={isVisible}>
    <Tooltip title={label} placement="left" arrow>
      <Fab
        size="small"
        aria-label={label}
        onClick={onClick}
        sx={(theme) => ({
          ...getGlassSx(theme),
          position: 'fixed',
          // Both insets are needed: a phone held in landscape puts the notch on
          // one side and the home indicator along the bottom, and a curved
          // screen rounds the corner this stack sits in.
          right: `calc(${RIGHT_INSET}px + ${SAFE_AREA_RIGHT})`,
          bottom: `calc(${STACK_BOTTOM + slot * (FAB_SIZE + STACK_GAP)}px + ${SAFE_AREA_BOTTOM})`,
          zIndex: theme.zIndex.appBar,
        })}
      >
        {icon}
      </Fab>
    </Tooltip>
  </Zoom>
);

interface FloatingCornerActionsProps {
  /** The element that scrolls — not the window, which does not move here. */
  scrollRef: RefObject<HTMLElement | null>;
  onHelpdeskOpen: () => void;
}

/**
 * The buttons pinned to the bottom-right corner on tablet and below: helpdesk
 * always, back-to-top once there is enough scrolled past to make scrolling back
 * tedious.
 *
 * One component rather than two, because the corner's geometry is a single
 * decision — what to clear, how far apart the buttons sit, which order they
 * stack in. Split across two components each would own half of it, and the two
 * halves drift until they overlap.
 *
 * **Helpdesk takes the lower slot**, because it is the one always on screen: the
 * permanent button belongs at the fixed anchor, and back-to-top then appears
 * above it without moving anything. The stack sits below the `z-index` of
 * dialogs and full-screen sheets, so a modal's own actions always win.
 *
 * It listens to a specific element rather than the window: the layout scrolls
 * its content area, so the window itself never moves and a window listener would
 * never fire.
 *
 * Desktop has no stack — the sidebar carries the helpdesk entry, and a second
 * trigger for it in the corner would be two controls for one thing.
 *
 * @example <FloatingCornerActions scrollRef={contentRef} onHelpdeskOpen={openHelpdesk} />
 */
export const FloatingCornerActions = ({ scrollRef, onHelpdeskOpen }: FloatingCornerActionsProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const handleScroll = () => setIsScrolled(element.scrollTop > VISIBLE_AFTER_PX);
    handleScroll();
    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <CornerFab
        label="Helpdesk"
        icon={<HeadsetMicOutlinedIcon />}
        slot={0}
        isVisible
        onClick={onHelpdeskOpen}
      />
      <CornerFab
        label="Back to top"
        icon={<KeyboardArrowUpIcon />}
        slot={1}
        isVisible={isScrolled}
        onClick={scrollToTop}
      />
    </>
  );
};
