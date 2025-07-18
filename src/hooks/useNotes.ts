import { useState, useEffect } from 'react';

interface JobNote {
  companyName: string;
  createdAt: string;
  note?: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<JobNote[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    try {
      const result = await chrome.storage.local.get(['jobNotes']);
      const notesData = result.jobNotes || {};
      
      // Convert object to array for table display
      const notesArray = Object.entries(notesData).map(([companyName, data]: [string, any]) => ({
        companyName,
        createdAt: data.createdAt,
        note: data.note || ''
      }));
      
      setNotes(notesArray);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (companyName: string) => {
    if (window.confirm(`Are you sure you want to delete the note for ${companyName}?`)) {
      try {
        const result = await chrome.storage.local.get(['jobNotes']);
        const notesData = result.jobNotes || {};
        delete notesData[companyName];
        await chrome.storage.local.set({ jobNotes: notesData });
        await loadNotes(); // Reload the notes
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return {
    notes,
    loading,
    deleteNote,
    loadNotes
  };
}; 