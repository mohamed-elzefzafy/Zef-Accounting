/* eslint-disable @typescript-eslint/no-explicit-any */
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
import toast from 'react-hot-toast';

export function JournalEntryForm() {
  const { data: accounts } = useGetAccountsQuery();
  const { data: costCenters } = useGetCostCentersQuery();
  const [createJournal, { isLoading }] = useCreateJournalEntryMutation();

  const { control, handleSubmit, register } = useForm({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      description: '',
      entries: [
        { account: 0, debit: 0, credit: 0, costCenter: 0 },
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
      toast.success('Journal entry created')
    } catch (err: any) {
      toast.error('Create failed: ' + (err?.data?.message || err.message))
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
              slotProps={{ inputLabel: { shrink: true } }}
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
                    <MenuItem value={0}>Choose Account</MenuItem>
                    {(accounts || []).map((a: any) => (
                      <MenuItem value={a.id} key={a.id}>
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
                    <MenuItem value={0}>Cost Center</MenuItem>
                    {(costCenters || []).map((c: any) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Button
            size='small'
              variant="outlined"
              color="error"
              onClick={() => remove(idx)}
              sx={{fontSize:"14px",textTransform:"capitalize"}}
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
                account: (accounts && accounts[0]?.id) || 0,
                debit: 0,
                credit: 0,
                costCenter: 0,
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
