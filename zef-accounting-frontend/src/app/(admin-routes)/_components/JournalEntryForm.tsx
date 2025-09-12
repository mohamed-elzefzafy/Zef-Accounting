/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react';
// import { useForm, useFieldArray, Controller } from 'react-hook-form';
// import { Box, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Divider } from '@mui/material';
// import { useGetAccountsQuery, useGetCostCentersQuery, useCreateJournalMutation } from '../services/api';

// export function JournalEntryForm(){
//   const { data: accounts } = useGetAccountsQuery();
//   const { data: costCenters } = useGetCostCentersQuery();
//   const [createJournal, { isLoading }] = useCreateJournalMutation();

//   const { control, handleSubmit, register } = useForm({ defaultValues: { date: new Date().toISOString().slice(0,10), description: '', entries: [{ account: '', debit: 0, credit: 0, costCenter: '' }] } });
//   const { fields, append, remove } = useFieldArray({ control, name: 'entries' });

//   const onSubmit = async (data:any) => {
//     const body = { date: data.date, description: data.description, entries: data.entries.map((e:any)=>({ account: e.account, debit: Number(e.debit||0), credit: Number(e.credit||0), costCenter: e.costCenter || null })) };
//     try{ await createJournal(body).unwrap(); alert('Journal entry created') }catch(err:any){ alert('Create failed: ' + (err?.data?.message || err.message)) }
//   }

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom>Create Journal Entry</Typography>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={3}><TextField label="Date" type="date" fullWidth {...register('date')} InputLabelProps={{ shrink: true }} /></Grid>
//           <Grid item xs={12} md={9}><TextField label="Description" fullWidth {...register('description')} /></Grid>
//           <Grid item xs={12}><Divider sx={{ my:2 }} /></Grid>

//           {fields.map((field, idx)=> (
//             <React.Fragment key={field.id}>
//               <Grid item xs={12} md={4}>
//                 <Controller name={`entries.${idx}.account`} control={control} render={({field}) => (
//                   <FormControl fullWidth>
//                     <InputLabel>Account</InputLabel>
//                     <Select label="Account" {...field}>
//                       {(accounts||[]).map((a:any)=> <MenuItem value={a._id} key={a._id}>{a.name} ({a.accountCode})</MenuItem>)}
//                     </Select>
//                   </FormControl>
//                 )} />
//               </Grid>

//               <Grid item xs={6} md={2}><TextField label="Debit" type="number" fullWidth {...register(`entries.${idx}.debit`)} /></Grid>
//               <Grid item xs={6} md={2}><TextField label="Credit" type="number" fullWidth {...register(`entries.${idx}.credit`)} /></Grid>

//               <Grid item xs={12} md={3}>
//                 <Controller name={`entries.${idx}.costCenter`} control={control} render={({field}) => (
//                   <FormControl fullWidth>
//                     <InputLabel>Cost Center (optional)</InputLabel>
//                     <Select {...field} label="Cost Center (optional)">
//                       <MenuItem value="">None</MenuItem>
//                       {(costCenters||[]).map((c:any)=> <MenuItem key={c._id} value={c._1d}>{c.name}</MenuItem>)}
//                     </Select>
//                   </FormControl>
//                 )} />
//               </Grid>

//               <Grid item xs={12} md={1}><Button variant="outlined" color="error" onClick={()=> remove(idx)}>Remove</Button></Grid>
//             </React.Fragment>
//           ))}

//           <Grid item xs={12}><Button variant="outlined" onClick={()=> append({ account: (accounts && accounts[0]?._id)||'', debit:0, credit:0, costCenter: '' })}>Add line</Button></Grid>
//           <Grid item xs={12}><Button type="submit" variant="contained" disabled={isLoading}>Save</Button></Grid>
//         </Grid>
//       </form>
//     </Box>
//   );
// }





"use client";
import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Stack,
} from '@mui/material';
import { useGetAccountsQuery } from '@/redux/slices/api/accountsApiSlice';
import { useGetCostCentersQuery } from '@/redux/slices/api/CostCentersApiSlice';
import { useCreateJournalEntryMutation } from '@/redux/slices/api/journalEntryApiSlice';

export function JournalEntryForm() {
  const { data: accounts } = useGetAccountsQuery();
  const { data: costCenters } = useGetCostCentersQuery();
  const [createJournal, { isLoading }] = useCreateJournalEntryMutation();

  const { control, handleSubmit, register } = useForm({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      description: '',
      entries: [
        { account: '', debit: 0, credit: 0, costCenter: '' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entries',
  });

  const onSubmit = async (data: any) => {
    const body = {
      date: data.date,
      description: data.description,
      entries: data.entries.map((e: any) => ({
        account: e.account,
        debit: Number(e.debit || 0),
        credit: Number(e.credit || 0),
        costCenter: e.costCenter || null,
      })),
    };
    try {
      await createJournal(body).unwrap();
      alert('Journal entry created');
    } catch (err: any) {
      alert(
        'Create failed: ' +
          (err?.data?.message || err.message),
      );
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Create Journal Entry
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header Fields */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Date"
            type="date"
            fullWidth
            {...register('date')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            fullWidth
            {...register('description')}
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Dynamic Entries */}
        {fields.map((field, idx) => (
          <Stack
            key={field.id}
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Controller
              name={`entries.${idx}.account`}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Account</InputLabel>
                  <Select {...field} label="Account">
                    {(accounts || []).map((a: any) => (
                      <MenuItem value={a._id} key={a._id}>
                        {a.name} ({a.accountCode})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <TextField
              label="Debit"
              type="number"
              fullWidth
              {...register(`entries.${idx}.debit`)}
            />
            <TextField
              label="Credit"
              type="number"
              fullWidth
              {...register(`entries.${idx}.credit`)}
            />

            <Controller
              name={`entries.${idx}.costCenter`}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Cost Center (optional)</InputLabel>
                  <Select {...field} label="Cost Center (optional)">
                    <MenuItem value="">None</MenuItem>
                    {(costCenters || []).map((c: any) => (
                      <MenuItem key={c._id} value={c._id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Button
              variant="outlined"
              color="error"
              onClick={() => remove(idx)}
            >
              Remove
            </Button>
          </Stack>
        ))}

        {/* Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() =>
              append({
                account: (accounts && accounts[0]?._id) || '',
                debit: 0,
                credit: 0,
                costCenter: '',
              })
            }
          >
            Add line
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            Save
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
