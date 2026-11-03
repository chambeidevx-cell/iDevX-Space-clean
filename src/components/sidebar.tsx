import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import {
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Divider,
  IconButton,
  useTheme,
  Avatar,
  Menu,
  MenuItem as MuiMenuItem,
  Typography,
  Switch,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Brightness4,
  Brightness7,
  PersonOutlined as PersonOutlinedIcon,
  LogoutOutlined as LogoutOutlinedIcon,
  KeyboardDoubleArrowRightRounded as KeyboardDoubleArrowRightRoundedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  ArrowRight as ArrowRightIcon,
  ContentCopyOutlined as ContentCopyOutlinedIcon,
  Check as CheckIcon,
  HeadsetMicOutlined as HeadsetMicOutlinedIcon,
} from '@mui/icons-material';

import { useSidebarStore } from '@/stores/sidebar-store';
import { useThemeStore } from '@/stores/theme-store';
import { useUserStore } from '@/stores/user-store';
import { useAuthStore } from '@/stores/auth-store';
import { getAvatarColor } from '@/utils/avatar';
import { MENU_ITEMS } from '@/constants/navigation';
import { useMaintenanceStore } from '@/stores/maintenance-store';
import { useIsTruncated } from '@/hooks/use-is-truncated';
import { MenuItem } from '@/interfaces/menu';
import { CompanyMark } from './brand/company-mark';
import { ProductLockup } from './brand/product-lockup';
import { useMyCompanyStore } from '@/stores/my-company-store';

const DRAWER_WIDTH = 220;
const COLLAPSED_WIDTH = 72;
/** Inset of the company card from the rail's edges. */
const COMPANY_CARD_INSET = 12;
/** The card's own border and inner padding, per side. */
const COMPANY_CARD_BORDER = 1;
const COMPANY_CARD_PADDING = 4;
/**
 * Height of the bordered company card, fixed across collapse.
 *
 * **Derived from the collapsed rail, so the card is a square once the labels
 * are gone.** Collapsed, its width is whatever the rail leaves after the inset
 * on each side; matching the height to that makes it read as a tile holding a
 * mark rather than a row with its label cut off. A hand-set height drifts out
 * of square the moment the rail or the inset changes, and nothing fails — it
 * just stops looking deliberate.
 *
 * It stays fixed across collapse for a separate reason: the card sits above the
 * nav, so its height is load-bearing for everything below it. Letting the
 * padding shrink on collapse shifted the whole list up by the difference, in
 * one jump, while the rail was still animating its width.
 */
const COMPANY_CARD_HEIGHT = COLLAPSED_WIDTH - COMPANY_CARD_INSET * 2;
/**
 * Fixed lane the company mark is centred in — the card's inner width exactly,
 * so collapsed the lane fills the card edge to edge.
 *
 * The mark is centred in *this* rather than in the card, because the card's
 * width animates with the rail: centring against the card would re-centre the
 * mark on every frame and sweep it across the sidebar. The lane's left edge
 * never moves, so the mark stays put — the same reason {@link ICON_LANE} exists
 * for nav rows.
 */
const COMPANY_MARK_LANE = COMPANY_CARD_HEIGHT - (COMPANY_CARD_BORDER + COMPANY_CARD_PADDING) * 2;
/**
 * Side of the company mark itself, a little under its lane so a logo has air on
 * all four sides instead of touching the card's border.
 */
const COMPANY_TILE_SIZE = 32;
/**
 * Width of the icon column every sidebar row shares — nav entries, the company
 * mark, helpdesk and the profile trigger.
 *
 * Constant across collapse, and always left-aligned. Centring an icon in the
 * rail instead would re-centre it against a width that is mid-animation, so the
 * icon sweeps across the sidebar rather than staying put. Holding the lane fixed
 * also means every label starts at the same x.
 */
const ICON_LANE = 44;
/**
 * Air left below a section before the rule that closes it — the collapse row,
 * and the pinned Home entry.
 *
 * One value for both, because it is one decision: how far a divider sits from
 * what it divides. A rule pressed up against a nav row reads as an underline on
 * that row rather than a boundary between two groups.
 */
const SECTION_GAP = '10px';


interface SidebarProps {
  onHelpdeskOpen: () => void;
}

interface NavLabelProps {
  title: string;
  isEmphasised: boolean;
}

/**
 * A nav entry's label: truncated to the sidebar's width, with the full name in
 * a tooltip only when there is more of it to see.
 */
const NavLabel = ({ title, isEmphasised }: NavLabelProps) => {
  const [labelRef, isTruncated] = useIsTruncated<HTMLSpanElement>();

  return (
    <Tooltip title={isTruncated ? title : ''} placement="right" arrow>
      <Typography
        component="span"
        ref={labelRef}
        sx={{
          fontSize: 12,
          fontWeight: isEmphasised ? 600 : 400,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 1,
          minWidth: 0,
        }}
      >
        {title}
      </Typography>
    </Tooltip>
  );
};

interface CompanyCardProps {
  isExpanded: boolean;
}

/**
 * The company the operator is working in, between the collapse toggle and Home.
 *
 * Expanded, it names the company; collapsed, only its mark remains, with the
 * name in a tooltip. The mark is the company's own logo where it has uploaded
 * one, otherwise its initials on a coloured tile. The default iDevX Space mark counts
 * as no logo here — the product mark already sits directly above, and repeating
 * it would say nothing about which company this is.
 *
 * Display only for now; it becomes a trigger once there is something to open.
 */
const CompanyCard = ({ isExpanded }: CompanyCardProps) => {
  const theme = useTheme();
  const companyName = useMyCompanyStore((state) => state.companyName);
  const [nameRef, isNameTruncated] = useIsTruncated<HTMLSpanElement>();

  return (
    <Box sx={{ px: `${COMPANY_CARD_INSET}px`, mb: 1 }}>
      <Tooltip title={isExpanded ? '' : companyName} placement="right" arrow>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            // Fixed height and padding: collapsed, the tile fills the card
            // exactly, so there is nothing to centre and nothing to resize.
            height: COMPANY_CARD_HEIGHT,
            boxSizing: 'border-box',
            px: `${COMPANY_CARD_PADDING}px`,
            borderRadius: '15px',
            border: `${COMPANY_CARD_BORDER}px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.text.primary, 0.04),
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: COMPANY_MARK_LANE,
              display: 'flex',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CompanyMark size={COMPANY_TILE_SIZE} />
          </Box>
          {isExpanded && (
            <Box sx={{ minWidth: 0, flex: 1 }}>
              {/* Smaller than the group headings below it, and deliberately so:
                  those name a section you navigate to, this one only labels the
                  line under it. The name is what should be read first. */}
              <Typography
                sx={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  lineHeight: 1.4,
                }}
              >
                Company
              </Typography>
              <Tooltip title={isNameTruncated ? companyName : ''} placement="right" arrow>
                <Typography
                  component="span"
                  ref={nameRef}
                  sx={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'text.primary',
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {companyName}
                </Typography>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Tooltip>
    </Box>
  );
};

export const Sidebar = ({ onHelpdeskOpen }: SidebarProps) => {
  const activeMaintenance = useMaintenanceStore((state) => state.activeMaintenance);
  const scheduledMaintenances = useMaintenanceStore((state) => state.scheduledMaintenances);
  const theme = useTheme();

  const C = {
    bg: theme.palette.background.paper,
    itemHoverBg: alpha(theme.palette.text.primary, 0.06),
    activeText: theme.palette.primary.contrastText,
    text: theme.palette.text.secondary,
    textHover: theme.palette.text.primary,
    // Every rule in the rail — the collapse row, the section dividers, the
    // group separators — is this one colour. The collapse line used to carry a
    // brighter one of its own, which made the topmost rule the heaviest thing
    // in the sidebar and read as a mistake rather than an emphasis.
    border: theme.palette.divider,
    popoverBg: theme.palette.background.default,
    popoverText: theme.palette.text.primary,
    glassBg: theme.palette.mode === 'dark' ? 'rgba(8,12,20,0.70)' : 'rgba(255,255,255,0.80)',
    glassBorder: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.7)',
  };

  const location = useLocation();
  const { isCollapsed, isHovered, toggleSidebar, setIsHovered } = useSidebarStore();
  const { mode, toggleTheme } = useThemeStore();
  const { user, getFullName, getInitials, clearUser } = useUserStore();
  const logout = useAuthStore((state) => state.logout);
  const [expandedItems, setExpandedItems] = useState<string[]>(() =>
    MENU_ITEMS
      .filter((entry): entry is MenuItem => !('group' in entry) && Boolean(entry.children?.length))
      .map((item) => item.title)
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const [emailCopied, setEmailCopied] = useState(false);

  const isExpanded = !isCollapsed || isHovered;
  const layoutWidth = isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;
  const visualWidth = isExpanded ? DRAWER_WIDTH : COLLAPSED_WIDTH;
  const isMenuOpen = Boolean(anchorEl);
  const isSettingsOpen = Boolean(settingsAnchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleSettingsOpen = (event: React.MouseEvent<HTMLElement>) => setSettingsAnchorEl(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchorEl(null);

  const handleLogout = () => {
    clearUser();
    logout();
    handleMenuClose();
  };

  React.useEffect(() => {
    const activeParents = MENU_ITEMS
      .filter((entry): entry is MenuItem => !('group' in entry))
      .filter((item) => item.children?.some((child) => child.path === location.pathname))
      .map((item) => item.title);
    if (activeParents.length > 0) {
      setExpandedItems((prev) => [...new Set([...prev, ...activeParents])]);
    }
  }, [location.pathname]);

  const hasActiveChild = (title: string): boolean =>
    MENU_ITEMS
      .filter((entry): entry is MenuItem => !('group' in entry))
      .find((item) => item.title === title)
      ?.children?.some((child) => child.path === location.pathname) ?? false;

  const handleToggleExpand = (title: string) => {
    if (isCollapsed && !isHovered) return;
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const isActiveRoute = (path: string): boolean => location.pathname === path;

  /**
   * Counts shown against a nav entry, by path.
   *
   * A platform left in maintenance is a platform its clients cannot reach, so
   * the page that can end it carries the count wherever the operator wanders.
   * Only states that need acting on belong here — a badge for something nobody
   * has to do is a badge people learn to ignore.
   */
  const navBadges: Record<string, number> = {
    '/platform-management': (activeMaintenance ? 1 : 0) + scheduledMaintenances.length,
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const isItemExpanded = expandedItems.includes(item.title);
    const isSidebarExpanded = !isCollapsed || isHovered;
    const isActive = !item.action && isActiveRoute(item.path);
    const isActiveParent = hasChildren && !isItemExpanded && hasActiveChild(item.title);
    const badgeCount = navBadges[item.path] ?? 0;
    const primary = theme.palette.primary.main;

    return (
      <Box key={item.path}>
        <ListItem disablePadding sx={{ display: 'block', px: 1.5 }}>
          <ListItemButton
            component={!hasChildren && !item.action ? Link : 'div'}
            to={!hasChildren && !item.action ? item.path : undefined}
            onClick={() => {
              if (item.action) item.action();
              else if (hasChildren) handleToggleExpand(item.title);
            }}
            sx={{
              borderRadius: '8px',
              height: 44,
              justifyContent: 'flex-start',
              p: 0,
              pl: isSidebarExpanded && depth > 0 ? 1.5 : 0,
              gap: 0,
              backgroundColor: 'transparent',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: 'transparent',
                '& .nav-icon-bg': {
                  backgroundColor: isActive ? primary : alpha(primary, 0.12),
                  color: isActive ? C.activeText : C.textHover,
                },
                '& .nav-text-bg': {
                  backgroundColor: isActive ? primary : alpha(primary, 0.08),
                  color: isActive ? C.activeText : C.textHover,
                },
              },
            }}
          >
            <Box
              className="nav-icon-bg"
              sx={{
                width: ICON_LANE,
                height: '100%',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                backgroundColor: isActive || isActiveParent ? primary : 'transparent',
                color: isActive || isActiveParent ? C.activeText : C.text,
                transition: 'background-color 0.2s ease, color 0.2s ease',
              }}
            >
              {/* Collapsed, the label is gone and the count has nowhere to sit,
                  so it rides the icon instead — a count that disappears with
                  the text is a count nobody sees when they most need it. */}
              {!isSidebarExpanded && badgeCount > 0 ? (
                <Badge
                  badgeContent={badgeCount}
                  color="error"
                  overlap="circular"
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16, fontWeight: 700 } }}
                >
                  {item.icon}
                </Badge>
              ) : item.icon}
            </Box>
            {isSidebarExpanded && (
              <Box
                className="nav-text-bg"
                sx={{
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  borderRadius: '15px',
                  px: 1.5,
                  minWidth: 0,
                  backgroundColor: isActive || isActiveParent ? primary : 'transparent',
                  color: isActive || isActiveParent ? C.activeText : C.text,
                  transition: 'background-color 0.2s ease, color 0.2s ease',
                }}
              >
                <NavLabel title={item.title} isEmphasised={isActive || isActiveParent} />
                {badgeCount > 0 && (
                  <Box
                    sx={{
                      minWidth: 20,
                      height: 20,
                      px: 0.5,
                      borderRadius: '999px',
                      bgcolor: 'error.main',
                      color: 'common.white',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {badgeCount}
                  </Box>
                )}
                {hasChildren && (isItemExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
              </Box>
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <>
            {/* Expanded: show children based on dropdown state; auto-stays open when child is active */}
            {isSidebarExpanded && (
              <Collapse in={isItemExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children?.map((child) => renderMenuItem(child, depth + 1))}
                </List>
              </Collapse>
            )}
            {/* Collapsed: show children only when the parent is expanded */}
            {!isSidebarExpanded && isItemExpanded && (
              item.children?.map((child) => renderMenuItem(child, depth + 1))
            )}
          </>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => isCollapsed && setIsHovered(false)}
      sx={{
        width: layoutWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        overflow: 'visible',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: visualWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          backgroundColor: 'transparent',
          border: 'none',
          zIndex: isCollapsed && isHovered ? theme.zIndex.appBar + 1 : theme.zIndex.drawer,
        },
      }}
    >
      <Box
        sx={{
          background: theme.palette.mode === 'dark' ? 'rgba(8,12,20,0.55)' : 'rgba(255,255,255,0.65)',
          backdropFilter: 'blur(20px)',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: C.text,
          borderRight: `1px solid ${C.border}`,
        }}
      >
        {/* Logo / Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 2.5, paddingBottom: .5 }}>
          <ProductLockup isNameHidden={!isExpanded} />
        </Box>

        {/* Divider with collapse toggle. The line is drawn in both states and
            the row is never re-justified: collapsed, the line simply shrinks to
            whatever the rail leaves beside the button, which is a width change
            and nothing else. Dropping it and centring the button instead made
            the toggle slide across a rail that was still animating — the exact
            thing the collapse rule forbids. */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: SECTION_GAP, gap: 1 }}>
          <Box sx={{ flex: 1, height: '1px', bgcolor: C.border }} />
          <Tooltip
            title={isExpanded ? 'Collapse' : 'Expand'}
            placement="right"
            arrow
            slotProps={{
              tooltip: { sx: { bgcolor: C.popoverBg, color: C.popoverText, fontSize: 13, px: 2, py: 1, borderRadius: 2 } },
              arrow: { sx: { color: C.popoverBg } },
            }}
          >
            <IconButton
              size="small"
              onClick={toggleSidebar}
              sx={{
                color: C.text,
                width: 22,
                height: 22,
                borderRadius: '15px',
                flexShrink: 0,
                '&:hover': { color: C.textHover, bgcolor: C.itemHoverBg },
              }}
            >
              <KeyboardDoubleArrowRightRoundedIcon
                sx={{
                  fontSize: 16,
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        <CompanyCard isExpanded={isExpanded} />

        {/* Home Page - fixed, not scrollable */}
        <Box sx={{ pb: SECTION_GAP }}>
          <List disablePadding>
            {renderMenuItem(MENU_ITEMS[0] as MenuItem)}
          </List>
        </Box>

        <Divider />

        {/* Nav list */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <List disablePadding sx={{ pt: 1, pb: 1.5 }}>
            {MENU_ITEMS.slice(1).map((entry, index) => {
              if ('group' in entry) {
                if (!entry.group) return null;
                return (
                  <Box key={`group-${index}`} sx={{ px: 1.5, pt: 1, pb: 1.5, display: 'flex', alignItems: 'center', gap: isExpanded ? 1 : 0 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0, ml: isExpanded ? 1 : 0, ...(!isExpanded && { visibility: 'hidden', width: 0, overflow: 'hidden' }) }}>
                      {entry.group}
                    </Typography>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: C.border }} />
                  </Box>
                );
              }
              return renderMenuItem(entry);
            })}
          </List>
        </Box>

        {/* Helpdesk - pinned above user profile */}
        <Box sx={{ borderTop: `1px solid ${C.border}` }}>
          <Tooltip
            title="Helpdesk"
            placement="right"
            disableHoverListener={isExpanded}
            arrow
            slotProps={{
              tooltip: { sx: { bgcolor: C.popoverBg, color: '#fff', fontSize: 13, px: 2, py: 1, borderRadius: 2 } },
              arrow: { sx: { color: C.popoverBg } },
            }}
          >
            <Box
              onClick={onHelpdeskOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                py: 1.5,
                cursor: 'pointer',
                color: C.text,
                '&:hover': { bgcolor: C.itemHoverBg, color: C.textHover },
              }}
            >
              <Box sx={{ width: ICON_LANE, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                <HeadsetMicOutlinedIcon fontSize="small" />
              </Box>
              {isExpanded && (
                <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
                  Helpdesk
                </Typography>
              )}
            </Box>
          </Tooltip>
        </Box>

        {/* Bottom section */}
        <Box sx={{ borderTop: `1px solid ${C.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'stretch' }}>

            {/* Profile trigger */}
            <Box
              onClick={handleMenuOpen}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                py: 1.5,
                cursor: 'pointer',
                color: C.text,
                minWidth: 0,
                '&:hover': { bgcolor: C.itemHoverBg, color: C.textHover },
              }}
            >
              <Box sx={{ width: ICON_LANE, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                <Tooltip
                  title={getFullName()}
                  placement="right"
                  disableHoverListener={isExpanded}
                  arrow
                  slotProps={{
                    tooltip: { sx: { bgcolor: C.popoverBg, color: '#fff', fontSize: 13, px: 2, py: 1, borderRadius: 2 } },
                    arrow: { sx: { color: C.popoverBg } },
                  }}
                >
                  <Avatar
                    src={user?.avatar}
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: user ? getAvatarColor(getFullName()) : theme.palette.primary.main,
                      fontSize: '0.8rem',
                      flexShrink: 0,
                    }}
                  >
                    {!user?.avatar && getInitials()}
                  </Avatar>
                </Tooltip>
              </Box>
              {isExpanded && (
                <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: C.text, fontSize: 13 }}>
                  {getFullName()}
                </Typography>
              )}
            </Box>

            {/* Vertical divider + Settings — only when expanded */}
            {isExpanded && <Box sx={{ width: '1px', bgcolor: C.border, flexShrink: 0, alignSelf: 'center', height: '24px' }} />}

            {/* Settings button */}
            {isExpanded &&
            <Tooltip
              title="Settings"
              placement="right"
              disableHoverListener={isExpanded}
              arrow
              slotProps={{
                tooltip: { sx: { bgcolor: C.popoverBg, color: '#fff', fontSize: 13, borderRadius: 2 } },
                arrow: { sx: { color: C.popoverBg } },
              }}
            >
              <IconButton
                onClick={handleSettingsOpen}
                disableRipple
                sx={{
                  p: 0,
                  mx: 1.5,
                  my: 'auto',
                  color: C.text,
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                  position: 'relative',
                  bgcolor: 'transparent',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: C.textHover,
                    '& .settings-icon-wrap': { bgcolor: C.itemHoverBg },
                    '& .settings-gear': { transform: 'rotate(-20deg)' },
                    '& .settings-arrow': { opacity: 1, transform: 'translateY(-50%) translateX(-8px)' },
                  },
                }}
              >
                <Box
                  className="settings-icon-wrap"
                  component="span"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '8px',
                    p: '5px',
                    transition: 'background-color 0.2s ease',
                    bgcolor: isSettingsOpen ? C.itemHoverBg : 'transparent',
                  }}
                >
                  <Box
                    className="settings-gear"
                    component="span"
                    sx={{
                      display: 'flex',
                      transition: 'transform 0.3s ease',
                      transform: isSettingsOpen ? 'rotate(-20deg)' : 'none',
                      color: isSettingsOpen ? C.textHover : 'inherit',
                    }}
                  >
                    <SettingsOutlinedIcon fontSize="small" />
                  </Box>
                </Box>
                <Box
                  className="settings-arrow"
                  component="span"
                  sx={{
                    position: 'absolute',
                    left: '100%',
                    top: '50%',
                    opacity: isSettingsOpen ? 1 : 0,
                    transform: isSettingsOpen
                      ? 'translateY(-50%) translateX(-8px)'
                      : 'translateY(-50%) translateX(-16px)',
                    display: 'flex',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                    pointerEvents: 'none',
                    color: isSettingsOpen ? C.textHover : 'inherit',
                  }}
                >
                  <ArrowRightIcon sx={{ fontSize: 18 }} />
                </Box>
              </IconButton>
            </Tooltip>}

          </Box>
        </Box>
      </Box>

      {/* Profile popup */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              mt: -1,
              left: '0 !important',
              background: C.glassBg,
              backdropFilter: 'blur(24px)',
              border: C.glassBorder,
              borderRadius: '15px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              p: 2,
            },
          },
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={user?.avatar}
              sx={{ width: 48, height: 48, bgcolor: user ? getAvatarColor(getFullName()) : theme.palette.primary.main }}
            >
              {!user?.avatar && getInitials()}
            </Avatar>
            <Box sx={{ flexGrow: 1, overflow: 'hidden', pl: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: C.text }}>{getFullName()}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" noWrap sx={{ color: C.text }}>{user?.email}</Typography>
                <Tooltip title={emailCopied ? 'Copied!' : 'Copy email'} placement="top" arrow>
                  <IconButton
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(user?.email ?? '');
                      setEmailCopied(true);
                      setTimeout(() => setEmailCopied(false), 2000);
                    }}
                    sx={{
                      p: '2px',
                      color: emailCopied ? theme.palette.success.main : C.text,
                      flexShrink: 0,
                      '&:hover': { color: C.textHover },
                    }}
                  >
                    {emailCopied
                      ? <CheckIcon sx={{ fontSize: 14 }} />
                      : <ContentCopyOutlinedIcon sx={{ fontSize: 14 }} />
                    }
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ borderColor: C.border }} />
        <MuiMenuItem
          component={Link}
          to="/my-account"
          onClick={handleMenuClose}
          sx={{ '&:hover': { bgcolor: C.itemHoverBg } }}
        >
          <ListItemIcon sx={{ color: C.text }}><PersonOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText sx={{ color: C.text }}>My Account</ListItemText>
        </MuiMenuItem>
        <MuiMenuItem onClick={handleLogout} sx={{ '&:hover': { bgcolor: C.itemHoverBg } }}>
          <ListItemIcon sx={{ color: C.text }}><LogoutOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText sx={{ color: C.text }}>Logout</ListItemText>
        </MuiMenuItem>
      </Menu>

      {/* Settings popup */}
      <Menu
        anchorEl={settingsAnchorEl}
        open={isSettingsOpen}
        onClose={handleSettingsClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              top: 'auto !important',
              bottom: '0 !important',
              left: `${DRAWER_WIDTH}px !important`,
              background: C.glassBg,
              backdropFilter: 'blur(24px)',
              border: C.glassBorder,
              borderRadius: '15px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              p: 2,
            },
          },
        }}
      >
        <Typography sx={{ color: C.textHover, fontSize: 14, fontWeight: 600 }}>Settings</Typography>
        <Divider sx={{ my: 1, borderColor: C.border }} />
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {mode === 'dark' ? <Brightness7 fontSize="small" sx={{ color: C.text }} /> : <Brightness4 fontSize="small" sx={{ color: C.text }} />}
              <Typography variant="body2" sx={{ color: C.text }}>{mode === 'dark' ? 'Dark Mode' : 'Light Mode'}</Typography>
            </Box>
          }
          sx={{ width: '100%', ml: 0 }}
        />
      </Menu>
    </Drawer>
  );
};