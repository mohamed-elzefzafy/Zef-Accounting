'use client';
import { Box } from '@mui/material';
import { JournalEntryForm } from '../_components/JournalEntryForm';

export default function JournalPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* <Sidebar />  */}
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        <JournalEntryForm />
      </Box>
    </Box>
  );
}

