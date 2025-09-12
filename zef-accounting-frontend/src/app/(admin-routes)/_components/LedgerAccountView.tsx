/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { useGetAccountsQuery } from "@/redux/slices/api/accountsApiSlice";
import { useGetLedgerMutation } from "@/redux/slices/api/ledgerApiSlice";
import { IAccount } from "@/types/Account";

export function LedgerAccountView() {
  const { data: accounts } = useGetAccountsQuery();
  const [selected, setSelected] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("2025-01-01");
  const [endDate, setEndDate] = useState<string>("2025-12-31");
  const [costCenter, setCostCenter] = useState<string>("");

  const [getLedger] = useGetLedgerMutation();
  const [rows, setRows] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    debit: 0,
    credit: 0,
    balance: 0,
  });
  console.log(accounts);

  console.log(selected);

  const load = async () => {
    if (!selected) return;
    const res = await getLedger({
      accountId: selected,
      startDate,
      endDate,
      costCenter: costCenter || undefined,
    }).unwrap();

    setRows(res.details || []);
    setTotals({
      debit: res.totalDebit || 0,
      credit: res.totalCredit || 0,
      balance: res.balance || 0,
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        General Ledger
      </Typography>

      {/* Filters */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
        mb={2}
        flexWrap="wrap" // يخلي العناصر تكسر سطر لو المساحة صغيرة
      >
        <FormControl fullWidth sx={{ flex: 1 }}>
          <Select
            value={selected}
            onChange={(e) => setSelected(e.target.value as string)}
            displayEmpty
          >
            <MenuItem value="">Choose account</MenuItem>
            {accounts &&
              accounts.map((a: IAccount) => (
                <MenuItem key={a._id} value={String(a._id)}>
                  {a.name} ({a.accountCode})
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ width: 180 }}
        />

        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ width: 180 }}
        />

        <TextField
          label="Cost Center ID"
          value={costCenter}
          onChange={(e) => setCostCenter(e.target.value)}
          placeholder="Optional"
          sx={{ width: 220 }}
        />

        <Button
          variant="contained"
          onClick={load}
          disabled={!selected}
          sx={{ minWidth: 120, height: 56 }}
        >
          Load
        </Button>
      </Stack>

      {/* Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Cost Center</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r: any, i: number) => (
              <TableRow key={i}>
                <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                <TableCell>{r.description}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell>
                  {r.costCenter ? r.costCenter.name || r.costCenter._id : "-"}
                </TableCell>
                <TableCell align="right">{r.amount}</TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={3}>
                <b>Totals</b>
              </TableCell>
              <TableCell align="right">
                <b>Debit: {totals.debit}</b>
              </TableCell>
              <TableCell align="right">
                <b>Credit: {totals.credit}</b>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}>
                <b>Balance</b>
              </TableCell>
              <TableCell align="right">
                <b>{totals.balance}</b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
