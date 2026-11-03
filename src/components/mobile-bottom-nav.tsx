import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  ButtonBase,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  MoreHorizOutlined as MoreHorizOutlinedIcon,
} from '@mui/icons-material';
import {
  MAX_BOTTOM_NAV_SLOTS,
  MENU_ITEMS,
  MOBILE_PRIMARY_NAV,
} from '@/constants/navigation';
import { MenuItem, NavEntry } from '@/interfaces/menu';
import { MOBILE_FOOTER_BAND, SAFE_AREA_BOTTOM, SAFE_AREA_LEFT, SAFE_AREA_RIGHT } from '@/constants/layout';

/** Height of the floating pill itself. */
const PILL_HEIGHT = 48;
/** Gap between the pill and the viewport edges at the sides, and above it. */
const PILL_INSET = 16;
/**
 * Gap between the pill and the attribution beneath it: none. The pill sits flush
 * on the attribution's top edge, so the two read as one block of furniture at
 * the bottom of the screen and no vertical space is spent separating them.
 *
 * Named rather than dropped from the arithmetic below, because it is the term
 * that decides where the pill sits relative to the footer — a future gap goes
 * here, not into `PILL_INSET`, which also controls the sides and the disc's
 * clearance above the bar.
 */
const PILL_FOOTER_GAP = 0;
/** Diameter of the disc that lifts out of the bar to mark the active slot. */
const ACTIVE_DISC = 34;
/**
 * How far the disc's centre sits below the pill's top edge.
 *
 * Derived, not chosen: it holds the part of the disc rising above the bar at
 * exactly `PILL_INSET`, the clearance already reserved up there. Resizing the
 * disc then keeps that fit automatically, where a hand-set value would quietly
 * start overhanging the band or floating short of it.
 *
 * It also sets how deep the notch reaches, which is what leaves room for the
 * active item's label underneath: a smaller disc both rises less and digs a
 * shallower notch, giving the label more room.
 */
const DISC_CENTRE_Y = ACTIVE_DISC / 2 - PILL_INSET;
/** Clearance between the disc and the notch cut around it. */
const NOTCH_GAP = 4;
const NOTCH_RADIUS = ACTIVE_DISC / 2 + NOTCH_GAP;
/**
 * Radius of the fillet easing the flat top edge into the notch.
 *
 * Without it the notch circle meets the top edge in a cusp — a sharp point at
 * each shoulder. The fillet is tangent to both the edge and the notch, so the
 * boundary never changes direction abruptly.
 */
const SHOULDER_RADIUS = 8;
/**
 * Inset of the slot row from the pill's ends.
 *
 * A notch needs ~32px of flat top edge either side of it for its shoulders, and
 * the pill's rounded cap consumes the first 24px — so the outermost slot centre
 * has to sit at least 56px in. With five slots the first centre lands at a tenth
 * of the row's width, which is what makes this tight: 34 is the smallest inset
 * that still clears the cap at 320px, the narrowest viewport worth supporting.
 * Wider screens only gain clearance, so the narrow case is the one that binds.
 *
 * Raising the slot count or the disc's size breaks this first, and it breaks
 * silently — the shoulder clamps and loses its tangency against the cap.
 */
const SLOT_ROW_INSET = 34;

/**
 * Vertical space the bottom navigation reserves — not the pill's own height.
 *
 * The bar floats, so what a page must keep clear is the pill plus the gap below
 * it and a matching gap above. `BaseLayout`, `FullHeightPage` and
 * `FloatingCornerActions` all measure against this, so it has to stay the full
 * reserved band rather than the pill's height alone.
 */
export const MOBILE_BOTTOM_NAV_HEIGHT = PILL_INSET + PILL_HEIGHT + PILL_FOOTER_GAP;

/**
 * Top edge of the pill, measured from the top of the attribution's band.
 *
 * Less than {@link MOBILE_BOTTOM_NAV_HEIGHT}, which also covers the clearance
 * the lifted disc needs. Something pinned to a *corner* — the helpdesk and
 * back-to-top stack — only has to clear the pill: the disc rises in the middle
 * of the bar, nowhere near it, so reserving the disc's band as well pushes the
 * stack needlessly far up the screen.
 */
export const MOBILE_BOTTOM_NAV_PILL_TOP = PILL_HEIGHT + PILL_FOOTER_GAP;

/**
 * How far above the bottom of the viewport the nav's band begins.
 *
 * On mobile the "Powered by" footer sits *below* the bar, at the very bottom of
 * the screen, so the pill floats clear of it. Exported rather than re-derived by
 * each caller: the corner stack and the page shell both have to clear the bar,
 * and all three disagreeing is how something ends up half-covered.
 */
export const MOBILE_BOTTOM_NAV_OFFSET = MOBILE_FOOTER_BAND;

const BOTTOM_NAV_ICON_SIZE = 22;
/** Smaller than a resting icon, so it is not crowded against the disc's edge. */
const ACTIVE_ICON_SIZE = 20;
const NAV_DURATION = 320;
const LABEL_SIZE = 10;
const LABEL_LINE_HEIGHT = 1.2;
/** Centred in the band the notch leaves free at the bottom of the pill. */
const LABEL_TOP = DISC_CENTRE_Y + NOTCH_RADIUS
  + (PILL_HEIGHT - (DISC_CENTRE_Y + NOTCH_RADIUS) - LABEL_SIZE * LABEL_LINE_HEIGHT) / 2;
/**
 * Widest the label may run. The notch is wider than a slot, and only the active
 * item is labelled, so a label may overhang its own slot — but not so far that
 * it reaches the neighbouring icons.
 */
const LABEL_MAX_WIDTH = 72;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Material's standard ease, as a function rather than a CSS keyword. */
const easeInOut = (t: number): number =>
  (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Outline of the bar: a pill with a notch cradled into its top edge at `notchX`.
 *
 * The notch is three arcs, not one. A bare circular cut would meet the flat top
 * edge at a point on each side; the two fillets either side of it are tangent to
 * both the edge and the notch circle, which is what removes those points. Each
 * fillet's centre sits one fillet-radius below the top edge, at the horizontal
 * distance that leaves it exactly touching the notch circle.
 *
 * Drawn in pixels, so the caller must pass the bar's measured width — a
 * proportional viewBox would stretch the notch out of round on wide screens.
 */
const buildBarPath = (width: number, notchX: number): string => {
  const end = PILL_HEIGHT / 2;
  const span = Math.sqrt(Math.max((NOTCH_RADIUS + SHOULDER_RADIUS) ** 2
    - (DISC_CENTRE_Y - SHOULDER_RADIUS) ** 2, 0));
  // Clamped so a notch near either end cannot run into the pill's rounded cap.
  const leftEdge = clamp(notchX - span, end, width - end);
  const rightEdge = clamp(notchX + span, end, width - end);

  /** Where a shoulder's fillet meets the notch circle. */
  const meetingPoint = (edgeX: number): readonly [number, number] => {
    const dx = edgeX - notchX;
    const dy = SHOULDER_RADIUS - DISC_CENTRE_Y;
    const length = Math.hypot(dx, dy) || 1;
    return [
      notchX + (NOTCH_RADIUS * dx) / length,
      DISC_CENTRE_Y + (NOTCH_RADIUS * dy) / length,
    ];
  };
  const [leftX, leftY] = meetingPoint(leftEdge);
  const [rightX, rightY] = meetingPoint(rightEdge);

  return [
    `M ${end} 0`,
    `L ${leftEdge} 0`,
    `A ${SHOULDER_RADIUS} ${SHOULDER_RADIUS} 0 0 1 ${leftX} ${leftY}`,
    `A ${NOTCH_RADIUS} ${NOTCH_RADIUS} 0 0 0 ${rightX} ${rightY}`,
    `A ${SHOULDER_RADIUS} ${SHOULDER_RADIUS} 0 0 1 ${rightEdge} 0`,
    `L ${width - end} 0`,
    `A ${end} ${end} 0 0 1 ${width} ${end}`,
    `L ${width} ${PILL_HEIGHT - end}`,
    `A ${end} ${end} 0 0 1 ${width - end} ${PILL_HEIGHT}`,
    `L ${end} ${PILL_HEIGHT}`,
    `A ${end} ${end} 0 0 1 0 ${PILL_HEIGHT - end}`,
    `L 0 ${end}`,
    `A ${end} ${end} 0 0 1 ${end} 0`,
    'Z',
  ].join(' ');
};
const SHEET_ITEM_SIZE = '0.8125rem';
const SHEET_SUBHEADER_SIZE = '0.6875rem';
const SHEET_ICON_SIZE = 18;
/** Narrower gutter to match the smaller icons. */
const SHEET_ICON_GUTTER = 32;
const CHILD_INDENT = 4;

const isMenuItem = (entry: NavEntry): entry is MenuItem => !('group' in entry);

const primaryItems = MOBILE_PRIMARY_NAV.slice(0, MAX_BOTTOM_NAV_SLOTS - 1);

/** Paths already reachable from the bottom bar, so "More" leaves them out. */
const primaryPaths = new Set(primaryItems.map((item) => item.path));

const isInPrimaryNav = (item: MenuItem): boolean => primaryPaths.has(item.path);

/**
 * Entries for the sheet: the whole sidebar tree minus the pages the bottom bar
 * already links to. Separators left leading or trailing by those removals are
 * dropped so the list never opens or ends on a rule.
 */
const buildSheetEntries = (): NavEntry[] => {
  const kept = MENU_ITEMS
    .map((entry) => (isMenuItem(entry) && entry.children
      ? { ...entry, children: entry.children.filter((child) => !isInPrimaryNav(child)) }
      : entry))
    .filter((entry) => !(isMenuItem(entry) && isInPrimaryNav(entry) && !entry.children?.length));
  return kept.filter((entry, index) => isMenuItem(entry)
    || (kept.slice(0, index).some(isMenuItem) && kept.slice(index + 1).some(isMenuItem)));
};

const sheetEntries = buildSheetEntries();

/** Titles of every item that owns a submenu, so all sections start expanded. */
const parentTitles: string[] = sheetEntries
  .filter((entry): entry is MenuItem => isMenuItem(entry) && Boolean(entry.children?.length))
  .map((item) => item.title);

const subheaderSx = {
  bgcolor: 'transparent',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: SHEET_SUBHEADER_SIZE,
  fontWeight: 700,
  lineHeight: 2.5,
} as const;

interface MoreSheetProps {
  open: boolean;
  onClose: () => void;
  activePath: string;
}

/**
 * Bottom sheet holding the complete navigation tree — every group, item and
 * submenu the sidebar shows. Pages without a responsive layout stay listed and
 * render the desktop-only notice once opened.
 */
const MoreSheet = ({ open, onClose, activePath }: MoreSheetProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(parentTitles);

  const handleToggleExpand = (title: string) => {
    setExpandedItems((previous) => previous.includes(title)
      ? previous.filter((entry) => entry !== title)
      : [...previous, title]);
  };

  const renderLink = (item: MenuItem, isChild: boolean) => (
    <ListItemButton
      key={item.path}
      component={Link}
      to={item.path}
      onClick={onClose}
      selected={activePath === item.path}
      sx={isChild ? { pl: CHILD_INDENT } : undefined}
    >
      <ListItemIcon sx={{ minWidth: SHEET_ICON_GUTTER, '& .MuiSvgIcon-root': { fontSize: SHEET_ICON_SIZE } }}>
        {item.icon}
      </ListItemIcon>
      <ListItemText
        primary={item.title}
        slotProps={{ primary: { sx: { fontSize: SHEET_ITEM_SIZE } } }}
      />
    </ListItemButton>
  );

  const renderItem = (item: MenuItem) => {
    if (!item.children?.length) return renderLink(item, false);
    const isItemExpanded = expandedItems.includes(item.title);
    return (
      <Box key={item.title}>
        <ListItemButton onClick={() => handleToggleExpand(item.title)}>
          <ListItemIcon sx={{ minWidth: SHEET_ICON_GUTTER, '& .MuiSvgIcon-root': { fontSize: SHEET_ICON_SIZE } }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.title}
            slotProps={{ primary: { sx: { fontSize: SHEET_ITEM_SIZE } } }}
          />
          {isItemExpanded
            ? <ExpandLessIcon sx={{ fontSize: SHEET_ICON_SIZE }} />
            : <ExpandMoreIcon sx={{ fontSize: SHEET_ICON_SIZE }} />}
        </ListItemButton>
        <Collapse in={isItemExpanded} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children.map((child) => renderLink(child, true))}
          </List>
        </Collapse>
      </Box>
    );
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { maxHeight: '75vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 } } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.25, pb: 0.5 }}>
        <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: 'divider' }} />
      </Box>
      {/* The sheet spans the full width, so the side insets go on its rows —
          without them an entry's label runs into a curved edge. */}
      <List
        sx={{
          pb: `calc(${MOBILE_BOTTOM_NAV_HEIGHT}px + ${SAFE_AREA_BOTTOM})`,
          pl: SAFE_AREA_LEFT,
          pr: SAFE_AREA_RIGHT,
        }}
      >
        {sheetEntries.map((entry, index) => {
          if (isMenuItem(entry)) return renderItem(entry);
          if (!entry.group) return <Divider key={`divider-${index}`} sx={{ my: 1 }} />;
          return (
            <ListSubheader key={`group-${index}`} sx={subheaderSx}>
              {entry.group}
            </ListSubheader>
          );
        })}
      </List>
    </Drawer>
  );
};

const slotSx = {
  flex: 1,
  height: '100%',
  borderRadius: `${PILL_HEIGHT / 2}px`,
  color: 'text.secondary',
  '& .MuiSvgIcon-root': { fontSize: BOTTOM_NAV_ICON_SIZE },
} as const;

/**
 * Bottom navigation shown on mobile in place of the sidebar: a floating pill
 * holding up to `MAX_BOTTOM_NAV_SLOTS` slots — direct links first, then "More",
 * which opens a sheet with the full menu.
 *
 * The active slot is a disc that lifts clear of the bar, with a notch cut from
 * the bar beneath it. Both are driven by one `--notch-x`, so the hole and the
 * disc slide together as a single movement; animating them separately lets them
 * drift apart mid-transition and the disc appears to tear free of the bar.
 *
 * Only one disc exists, shared by every slot, for the same reason: a disc per
 * slot would have to fade one out while fading the next in, which reads as two
 * objects rather than one moving between tabs.
 */
export const MobileBottomNav = () => {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const activePath = location.pathname;
  const activeIndex = primaryItems.findIndex((item) => item.path === activePath);
  const slotCount = primaryItems.length + 1;
  /** "More" owns the last slot whenever the page is not one of the direct links. */
  const activeSlot = activeIndex === -1 ? slotCount - 1 : activeIndex;
  const activeIcon = activeIndex === -1
    ? <MoreHorizOutlinedIcon />
    : primaryItems[activeIndex].icon;
  const activeTitle = activeIndex === -1 ? 'More' : primaryItems[activeIndex].title;

  const theme = useTheme();
  /** The sidebar's glass recipe, so the two floating surfaces read as one material. */
  const glass = theme.palette.mode === 'dark'
    ? { fill: 'rgba(8,12,20,0.70)', edge: 'rgba(255,255,255,0.08)' }
    : { fill: 'rgba(255,255,255,0.80)', edge: 'rgba(255,255,255,0.70)' };
  const barRef = useRef<HTMLElement | null>(null);
  const [width, setWidth] = useState(0);
  const [notchX, setNotchX] = useState(0);
  /** The live notch position, so a tween interrupted mid-slide resumes from where it is. */
  const notchRef = useRef(0);

  useLayoutEffect(() => {
    const element = barRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const barPath = width > 0 ? buildBarPath(width, notchX) : '';
  const innerWidth = Math.max(width - SLOT_ROW_INSET * 2, 0);
  const targetX = SLOT_ROW_INSET + (innerWidth * (activeSlot + 0.5)) / slotCount;

  useEffect(() => {
    if (!width) return;
    const from = notchRef.current;
    // First measurement, or a resize: land on the mark rather than sliding to it
    // from wherever the bar used to be.
    const skip = from === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (skip) {
      notchRef.current = targetX;
      setNotchX(targetX);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / NAV_DURATION, 1);
      const value = from + (targetX - from) * easeInOut(progress);
      notchRef.current = value;
      setNotchX(value);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [targetX, width]);

  return (
    <>
      <Box
        component="nav"
        ref={barRef}
        aria-label="Primary"
        sx={{
          position: 'fixed',
          bottom: `calc(${MOBILE_BOTTOM_NAV_OFFSET + PILL_FOOTER_GAP}px + ${SAFE_AREA_BOTTOM})`,
          // The side insets are added to the pill's own, so a landscape notch
          // or a curved edge pushes the bar in rather than cropping its cap.
          left: `calc(${PILL_INSET}px + ${SAFE_AREA_LEFT})`,
          right: `calc(${PILL_INSET}px + ${SAFE_AREA_RIGHT})`,
          height: `${PILL_HEIGHT}px`,
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        {/* The bar, in the theme's glass: a translucent fill over a blurred
            backdrop, clipped to the notched outline.

            Two layers, because one cannot do both. `backdrop-filter` blurs what
            is behind an element but is cancelled by a `filter` anywhere above it
            in the tree, so the glass carries no shadow of its own; and a
            `box-shadow` would follow the element's rectangle, not the notch.
            The outline is therefore stroked separately, as a path. */}
        {width > 0 && (
          <>
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                inset: 0,
                clipPath: `path('${barPath}')`,
                WebkitClipPath: `path('${barPath}')`,
                backgroundColor: glass.fill,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            />
            <Box
              aria-hidden
              component="svg"
              width={width}
              height={PILL_HEIGHT}
              viewBox={`0 0 ${width} ${PILL_HEIGHT}`}
              sx={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
            >
              <path d={barPath} fill="none" stroke={glass.edge} strokeWidth={1} />
            </Box>
          </>
        )}

        <Box sx={{ position: 'relative', height: '100%', display: 'flex', px: `${SLOT_ROW_INSET}px` }}>
          {primaryItems.map((item, index) => (
            <ButtonBase
              key={item.path}
              component={Link}
              to={item.path}
              aria-label={item.title}
              aria-current={index === activeSlot ? 'page' : undefined}
              sx={slotSx}
            >
              {/* The active slot's icon lives in the disc, not here. */}
              {index !== activeSlot && item.icon}
            </ButtonBase>
          ))}
          <ButtonBase
            aria-label="More"
            aria-current={activeSlot === slotCount - 1 ? 'page' : undefined}
            onClick={() => setIsMoreOpen(true)}
            sx={slotSx}
          >
            {activeSlot !== slotCount - 1 && <MoreHorizOutlinedIcon />}
          </ButtonBase>
        </Box>

        {/* Labelled by the slot button underneath, so it stays out of the
            accessibility tree and out of the way of the tap. */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: `${notchX}px`,
            top: `${DISC_CENTRE_Y - ACTIVE_DISC / 2}px`,
            width: `${ACTIVE_DISC}px`,
            height: `${ACTIVE_DISC}px`,
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(0,0,0,0.28)',
            pointerEvents: 'none',
            '& .MuiSvgIcon-root': { fontSize: ACTIVE_ICON_SIZE },
          }}
        >
          {activeIcon}
        </Box>

        {/* The active page's name, in the band the notch leaves clear. Rides the
            same tweened position as the disc and the notch, so the three move as
            one object. Hidden from assistive tech: the slot button underneath
            already carries the name. */}
        <Typography
          aria-hidden
          sx={{
            position: 'absolute',
            left: `${notchX}px`,
            top: `${LABEL_TOP}px`,
            transform: 'translateX(-50%)',
            maxWidth: `${LABEL_MAX_WIDTH}px`,
            fontSize: LABEL_SIZE,
            fontWeight: 600,
            lineHeight: LABEL_LINE_HEIGHT,
            color: 'text.primary',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            pointerEvents: 'none',
          }}
        >
          {activeTitle}
        </Typography>
      </Box>
      <MoreSheet open={isMoreOpen} onClose={() => setIsMoreOpen(false)} activePath={activePath} />
    </>
  );
};
