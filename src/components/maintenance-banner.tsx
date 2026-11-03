import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  Construction as ConstructionIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useMaintenanceStore } from '@/stores/maintenance-store';
import { formatDateTime } from '@/utils/format-date';

const PLATFORMS_PATH = '/platform-management';

/**
 * Banner carried above every page while a platform deployment is running.
 *
 * A deployment takes as long as it takes, and holding the operator in a modal
 * for it stops them doing anything else in iDevX Space. The run is still something
 * they must not forget — a platform left in maintenance is a platform its
 * clients cannot reach — so it follows them across the app as a band at the top
 * of the page rather than a dialog in front of it.
 *
 * The whole band is the control: it goes to Platform Management, which is the
 * only place the run can be completed or reverted.
 *
 * A booked deployment gets the same band in a quieter colour. It is a promise
 * about the future rather than an outage, so it must not look like one — but it
 * is just as easy to forget, and the operator who booked it is rarely the one
 * on duty when it comes round.
 *
 * Renders nothing when nothing is running or booked.
 */
export const MaintenanceBanner = () => {
  const navigate = useNavigate();
  const activeMaintenance = useMaintenanceStore((state) => state.activeMaintenance);
  const scheduledMaintenances = useMaintenanceStore((state) => state.scheduledMaintenances);

  /* Several platforms may each be booked. The band names the one happening
     soonest and counts the rest: a band per booking would stack until the page
     had no room left, and the next one due is the only one that is actionable
     now. */
  const nextBooking = [...scheduledMaintenances]
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))[0] ?? null;
  const otherBookings = Math.max(scheduledMaintenances.length - 1, 0);

  /* A running deployment outranks a booking: one is an outage now, the other is
     an appointment, and two bands would bury the page under its own chrome. */
  const notice = activeMaintenance ?? nextBooking;
  if (!notice) return null;

  const isRunning = Boolean(activeMaintenance);
  const { platformName, deploymentType, newVersion } = notice;

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => navigate(PLATFORMS_PATH)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') navigate(PLATFORMS_PATH);
      }}
      sx={{
        cursor: 'pointer',
        px: { xs: 2, lg: 3 },
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        // Opaque rather than the usual translucent surface: the page scrolls
        // beneath this band, and a warning that rows read through is no warning.
        bgcolor: isRunning ? 'warning.dark' : 'info.dark',
        color: 'common.white',
        borderBottom: '1px solid',
        borderColor: isRunning ? 'warning.main' : 'info.main',
        transition: 'filter 0.15s ease',
        '&:hover': { filter: 'brightness(1.1)' },
      }}
    >
      {isRunning ? <ConstructionIcon fontSize="small" /> : <ScheduleIcon fontSize="small" />}
      <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
          {isRunning
            ? `${platformName} is under maintenance`
            : `${platformName} maintenance is scheduled`}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.85 }} noWrap>
          {isRunning
            ? `${deploymentType} · ${newVersion} — clients cannot reach it until this is completed.`
            : `${deploymentType} · ${newVersion} — begins ${formatDateTime(nextBooking!.scheduledFor)}${
              otherBookings > 0
                ? `, and ${otherBookings} other ${otherBookings === 1 ? 'platform is' : 'platforms are'} booked.`
                : '.'
            }`}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={0.25} sx={{ flexShrink: 0 }}>
        <Typography variant="caption" sx={{ fontWeight: 700 }}>Manage</Typography>
        <ChevronRightIcon fontSize="small" />
      </Stack>
    </Box>
  );
};
