import { createStore } from 'zustand/vanilla';

export interface SettingsDialogState {
  isOpen: boolean;
  activeSection: string;
}

export interface SettingsDialogActions {
  openSettingsDialog: (section?: string) => void;
  closeSettingsDialog: () => void;
  setActiveSection: (section: string) => void;
}

export type SettingsDialogStore = SettingsDialogState & SettingsDialogActions;

export const defaultSettingsDialogState: SettingsDialogState = {
  isOpen: false,
  activeSection: 'general',
};

export const createSettingsDialogStore = (
  initState: SettingsDialogState = defaultSettingsDialogState
) => {
  return createStore<SettingsDialogStore>((set) => ({
    ...initState,
    openSettingsDialog: (section = 'general') =>
      set(() => ({ isOpen: true, activeSection: section })),
    closeSettingsDialog: () =>
      set(() => ({ isOpen: false, activeSection: 'general' })),
    setActiveSection: (section: string) =>
      set(() => ({ activeSection: section })),
  }));
};
