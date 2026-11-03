import { ReactNode } from 'react';
import { Avatar, Box, Card, CardContent, Chip, Grid, Typography, useTheme } from '@mui/material';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { ContactChip } from '@/components/fields/contact-chip';
import { useMyCompanyStore } from '@/stores/my-company-store';
import { useUserStore } from '@/stores/user-store';
import { getAvatarColor } from '@/utils/avatar';
import { getRoleLabel } from '@/constants/roles';

/**
 * Smaller on a phone, where the avatar shares its row with the name and every
 * pixel it takes comes off the space the name has to wrap in.
 */
const AVATAR_SIZE = { xs: 56, sm: 80 };
const AVATAR_INITIALS_SIZE = { xs: '1.25rem', sm: '1.75rem' };
/** Widest an address may run before it is truncated with its copy action intact. */
const EMAIL_CHIP_MAX_WIDTH = 240;

interface UserIdentityCardProps {
  /** Line above the name — a greeting, or a label for the record being shown. */
  eyebrow?: string;
  /** Appended to the name, e.g. the greeting's exclamation mark. */
  nameSuffix?: string;
  /**
   * Makes the avatar a control. Given this, the card renders the avatar as a
   * button and shows `avatarOverlay` over it on hover.
   */
  onAvatarClick?: () => void;
  /** Shown over the avatar while hovered — only with `onAvatarClick`. */
  avatarOverlay?: ReactNode;
  /** Replaces the avatar's image, e.g. a not-yet-saved upload preview. */
  avatarSrc?: string;
  /** Pinned to the card's right: the clock on the home page, for instance. */
  trailing?: ReactNode;
  /** Rendered after the chips — anything else the page needs inside the card. */
  children?: ReactNode;
}

/**
 * Who the signed-in person is: their avatar, name, company, roles and addresses,
 * on the app's glass surface.
 *
 * One component rather than one per page. The home page and the account page
 * each grew their own version of this and drifted into looking like different
 * products — same person, same facts, two cards. Anything a page needs to add
 * goes through `trailing` or `children`; a page that restyles it has reopened
 * exactly that gap.
 *
 * @example <UserIdentityCard eyebrow="Welcome back," nameSuffix="!" trailing={<Clock />} />
 */
export const UserIdentityCard = ({
  eyebrow,
  nameSuffix = '',
  onAvatarClick,
  avatarOverlay,
  avatarSrc,
  trailing,
  children,
}: UserIdentityCardProps) => {
  const theme = useTheme();
  const { user, getFullName, getInitials } = useUserStore();
  const { companyName, companyLogo } = useMyCompanyStore();
  const isDark = theme.palette.mode === 'dark';

  const fullName = getFullName();
  const workEmail = user?.email ?? '';
  const personalEmail = user?.personalEmail ?? '';

  const avatar = (
    <Avatar
      src={avatarSrc ?? user?.avatar}
      sx={{
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        bgcolor: getAvatarColor(fullName || 'U'),
        fontSize: AVATAR_INITIALS_SIZE,
        fontWeight: 600,
        border: `3px solid ${theme.palette.background.paper}`,
        boxShadow: theme.shadows[4],
      }}
    >
      {!(avatarSrc ?? user?.avatar) && getInitials()}
    </Avatar>
  );

  return (
    <Card
      sx={{
        background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.75)',
        boxShadow: isDark
          ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
          : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {/* The avatar and the name share a row at every width — a name that
            wraps underneath its own avatar reads as two separate things. Only
            the trailing slot drops to its own row on a phone. */}
        <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
          <Grid size="auto">
            {onAvatarClick ? (
              <Box
                onClick={onAvatarClick}
                sx={{
                  position: 'relative',
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  flexShrink: 0,
                  cursor: 'pointer',
                  borderRadius: '50%',
                  '&:hover .identity-avatar-overlay': { opacity: 1 },
                }}
              >
                {avatar}
                <Box
                  className="identity-avatar-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'common.white',
                    bgcolor: 'rgba(0,0,0,0.45)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {avatarOverlay}
                </Box>
              </Box>
            ) : avatar}
          </Grid>

          <Grid size="grow" sx={{ minWidth: 0 }}>
            {eyebrow && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.25, fontWeight: 500 }}>
                {eyebrow}
              </Typography>
            )}
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: 'text.primary', mb: 1, fontSize: { xs: '1.15rem', sm: '1.5rem' } }}
            >
              {fullName}{nameSuffix}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              {(companyName || companyLogo) && (
                <Chip
                  avatar={
                    companyLogo
                      ? <Avatar src={companyLogo} alt={companyName} />
                      : <Avatar sx={{ bgcolor: 'transparent' }}><BusinessOutlinedIcon sx={{ fontSize: '0.875rem', color: 'text.secondary' }} /></Avatar>
                  }
                  label={companyName}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
              {user?.roles?.map((role) => (
                <Chip
                  key={role}
                  label={getRoleLabel(role)}
                  size="small"
                  icon={<PersonOutlineIcon />}
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
              <ContactChip icon={<EmailOutlinedIcon />} value={workEmail} maxWidth={EMAIL_CHIP_MAX_WIDTH} />
              {personalEmail && (
                <ContactChip icon={<EmailOutlinedIcon />} value={personalEmail} maxWidth={EMAIL_CHIP_MAX_WIDTH} />
              )}
            </Box>
            {children}
          </Grid>

          {trailing && (
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              {trailing}
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};
