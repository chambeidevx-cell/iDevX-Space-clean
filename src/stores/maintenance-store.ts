import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActiveMaintenance {
  platformId: string;
  platformName: string;
  deploymentType: string;
  newVersion: string;
  startedAt: string;
  /** Rich-text release notes captured while the deployment is running. */
  releaseNotes: string;
}

/**
 * A deployment booked for later.
 *
 * Held separately from the running one: a schedule is a promise about the
 * future and takes no platform offline, so the two must never be mistaken for
 * each other. Starting a run clears the schedule it fulfils.
 */
interface ScheduledMaintenance {
  platformId: string;
  platformName: string;
  deploymentType: string;
  newVersion: string;
  /** ISO timestamp the deployment is booked to begin. */
  scheduledFor: string;
}

interface SetupContext {
  platformId: string;
  platformName: string;
  currentVersion: string;
}

interface MaintenanceStore {
  activeMaintenance: ActiveMaintenance | null;
  /**
   * Bookings held across the estate — **at most one per platform**. Several
   * platforms may each have a deployment booked; a single platform may not have
   * two, because the second would be an arrangement nobody agreed to and the
   * first would vanish without saying so.
   */
  scheduledMaintenances: ScheduledMaintenance[];
  setupContext: SetupContext | null;
  /**
   * Whether the maintenance panel is on screen.
   *
   * Separate from the run itself, and deliberately not persisted: a deployment
   * can take an hour, and holding the operator in a modal for it stops them
   * doing anything else in iDevX Space. The run continues in the background, the
   * banner keeps it visible, and this says only whether they are looking at it.
   */
  isPanelOpen: boolean;
  openSetup: (context: SetupContext) => void;
  closeSetup: () => void;
  openPanel: () => void;
  closePanel: () => void;
  startMaintenance: (data: Omit<ActiveMaintenance, 'startedAt' | 'releaseNotes'>) => void;
  /** Books a deployment, replacing any the platform already had. */
  scheduleMaintenance: (data: ScheduledMaintenance) => void;
  /** Moves one platform's booking, leaving everything else as agreed. */
  rescheduleMaintenance: (platformId: string, scheduledFor: string) => void;
  /** Runs one platform's booking now rather than waiting for its time. */
  startScheduledMaintenance: (platformId: string) => void;
  cancelScheduledMaintenance: (platformId: string) => void;
  setReleaseNotes: (releaseNotes: string) => void;
  endMaintenance: () => void;
}

export const useMaintenanceStore = create<MaintenanceStore>()(
  persist(
    (set) => ({
      activeMaintenance: null,
      scheduledMaintenances: [],
      setupContext: null,
      isPanelOpen: false,
      openSetup: (context) => set({ setupContext: context }),
      closeSetup: () => set({ setupContext: null }),
      openPanel: () => set({ isPanelOpen: true }),
      closePanel: () => set({ isPanelOpen: false }),
      startMaintenance: (data) => set((state) => ({
        activeMaintenance: { ...data, startedAt: new Date().toISOString(), releaseNotes: '' },
        /* Starting this platform fulfils any booking it had: leaving the
           schedule behind would keep announcing a run that is already under
           way. Bookings for other platforms stand. */
        scheduledMaintenances: state.scheduledMaintenances
          .filter((entry) => entry.platformId !== data.platformId),
        setupContext: null,
        isPanelOpen: true,
      })),
      /* Replaces rather than appends: one booking per platform is the rule, and
         an interface that can reach this twice for the same platform is the
         thing being guarded against, not something to accommodate here. */
      scheduleMaintenance: (data) => set((state) => ({
        scheduledMaintenances: [
          ...state.scheduledMaintenances.filter((entry) => entry.platformId !== data.platformId),
          data,
        ],
        setupContext: null,
      })),
      rescheduleMaintenance: (platformId, scheduledFor) => set((state) => ({
        scheduledMaintenances: state.scheduledMaintenances.map((entry) => (
          entry.platformId === platformId ? { ...entry, scheduledFor } : entry
        )),
      })),
      /* The booking becomes the run rather than seeding a new one: its
         deployment type and target version were agreed when it was made, and
         re-entering them is a chance to enter them differently. */
      startScheduledMaintenance: (platformId) => set((state) => {
        const booking = state.scheduledMaintenances.find((entry) => entry.platformId === platformId);
        if (!booking) return {};
        return {
          activeMaintenance: {
            platformId: booking.platformId,
            platformName: booking.platformName,
            deploymentType: booking.deploymentType,
            newVersion: booking.newVersion,
            startedAt: new Date().toISOString(),
            releaseNotes: '',
          },
          scheduledMaintenances: state.scheduledMaintenances
            .filter((entry) => entry.platformId !== platformId),
          setupContext: null,
          isPanelOpen: true,
        };
      }),
      cancelScheduledMaintenance: (platformId) => set((state) => ({
        scheduledMaintenances: state.scheduledMaintenances
          .filter((entry) => entry.platformId !== platformId),
      })),
      setReleaseNotes: (releaseNotes) => set((state) => ({
        activeMaintenance: state.activeMaintenance
          ? { ...state.activeMaintenance, releaseNotes }
          : null,
      })),
      endMaintenance: () => set({ activeMaintenance: null, isPanelOpen: false }),
    }),
    {
      name: 'maintenance-store',
      partialize: (state) => ({
        activeMaintenance: state.activeMaintenance,
        scheduledMaintenances: state.scheduledMaintenances,
      }),
    },
  ),
);
