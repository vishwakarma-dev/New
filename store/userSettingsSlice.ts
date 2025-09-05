import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type Unit = 'px' | 'rem' | '%';

export interface UserSettingsState {
  theme: ThemeMode;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  autoSave: boolean;
  gridSnapping: boolean;
  showRulers: boolean;
  defaultUnit: Unit;
}

const STORAGE_KEY = 'user:settings:v1';

const getInitialState = (): UserSettingsState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as UserSettingsState;
  } catch {}
  return {
    theme: 'light',
    language: 'en',
    emailNotifications: true,
    pushNotifications: false,
    autoSave: true,
    gridSnapping: true,
    showRulers: false,
    defaultUnit: 'px',
  };
};

const persist = (state: UserSettingsState) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
};

const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState: getInitialState(),
  reducers: {
    updateSetting: (state, action: PayloadAction<{ key: keyof UserSettingsState; value: any }>) => {
      const { key, value } = action.payload;
      (state as any)[key] = value;
      persist(state);
    },
    replaceSettings: (_state, action: PayloadAction<UserSettingsState>) => {
      persist(action.payload);
      return action.payload;
    },
    resetSettings: () => {
      const fresh = getInitialState();
      persist(fresh);
      return fresh;
    },
  },
});

export const { updateSetting, replaceSettings, resetSettings } = userSettingsSlice.actions;
export default userSettingsSlice.reducer;
