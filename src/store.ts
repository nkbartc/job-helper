import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface JobNote {
  id: string;
  companyName: string;
  createdAt: string;
}

interface JobNotesState {
  notes: JobNote[];
}

const initialState: JobNotesState = {
  notes: [],
};

const jobNotesSlice = createSlice({
  name: 'jobNotes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<JobNote>) => {
      state.notes.push(action.payload);
    },
    setNotes: (state, action: PayloadAction<JobNote[]>) => {
      state.notes = action.payload;
    },
  },
});

export const { addNote, setNotes } = jobNotesSlice.actions;

export const store = configureStore({
  reducer: {
    jobNotes: jobNotesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Helper for content script to dispatch Redux action (for future use)
export function dispatchAddNoteFromContent(note: JobNote) {
  store.dispatch(addNote(note));
} 