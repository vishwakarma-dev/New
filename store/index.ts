import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './projectsSlice';
import editorReducer from './editorSlice';
import userSettingsReducer from './userSettingsSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    editor: editorReducer,
    userSettings: (await import('./userSettingsSlice')).default,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
