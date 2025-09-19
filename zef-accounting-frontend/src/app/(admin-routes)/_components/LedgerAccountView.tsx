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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useGetCostCentersQuery } from "@/redux/slices/api/CostCentersApiSlice";
import { ICostCenter } from "@/types/costCenters";

export function LedgerAccountView() {
  const { data: accounts } = useGetAccountsQuery();
  const { data: costCenters } = useGetCostCentersQuery();

  const [selected, setSelected] = useState<string>("");
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>("");

  const [startDate, setStartDate] = useState<string>("2025-01-01");
  const [endDate, setEndDate] = useState<string>("2025-12-31");

  const [getLedger] = useGetLedgerMutation();
  const [rows, setRows] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    debit: 0,
    credit: 0,
    balance: 0,
  });

  const load = async () => {
    if (!selected) return;
    const res = await getLedger({
      accountId: +selected,
      costCenter: selectedCostCenter ? +selectedCostCenter : undefined,
      startDate,
      endDate,
    }).unwrap();

    const sorted = [...(res.details || [])].sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return (a.sequenceNumber || 0) - (b.sequenceNumber || 0);
    });

    setRows(sorted);
    setTotals({
      debit: res.totalDebit || 0,
      credit: res.totalCredit || 0,
      balance: res.balance || 0,
    });
  };

  const selectedAccount = accounts?.find(
    (a: IAccount) => a.id.toString() === selected
  );

  // ---- Print Ledger ----
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.body.innerHTML = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: center; }
            th { background: #f2f2f2; font-weight: bold; }
            tfoot td { font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>${selectedAccount?.name} General Ledger</h2>
          <h4>Cost Center: ${
            selectedCostCenter
              ? costCenters?.find((c) => c.id.toString() === selectedCostCenter)
                  ?.name || "-"
              : "All"
          }</h4>
          <table>
            <thead>
              <tr>
                <th>Entry No</th>
                <th>Code</th>
                <th>Date</th>
                <th>Cost Center</th>
                <th>Description</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (r) => `
                <tr>
                  <td>${r.entryNumber ?? r.sequenceNumber ?? ""}</td>
                  <td>${r.code ?? ""}</td>
                  <td>${new Date(r.date).toLocaleDateString()}</td>
                  <td>${
                    r.costCenter ? r.costCenter.name || r.costCenter._id : "-"
                  }</td>
                  <td>${r.description ?? ""}</td>
                  <td>${r.debit ?? 0}</td>
                  <td>${r.credit ?? 0}</td>
                  <td>${r.balance ?? 0}</td>
                </tr>`
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5">Totals</td>
                <td>${totals.debit}</td>
                <td>${totals.credit}</td>
                <td>${totals.balance} (${
      totals.balance >= 0 ? "Debit" : "Credit"
    })</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    printWindow.document.close();
    printWindow.print();
  };

  // ---- Export to Excel ----
  const exportExcel = () => {
    const htmll = `
    <h3>${selectedAccount?.name} General Ledger</h3/>
    <h4>Cost Center: ${
      selectedCostCenter
        ? costCenters?.find((c) => c.id.toString() === selectedCostCenter)
            ?.name || "-"
        : "All"
    }</h4>
    <table border="1" style="border-collapse:collapse; text-align:center;">
      <thead>
        <tr style="background:#f2f2f2; font-weight:bold;">
          <th>Entry No</th>
          <th>Date</th>
          <th>Cost Center</th>
          <th>Description</th>
          <th>Debit</th>
          <th>Credit</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (r) => `
          <tr>
            <td>${r.entryNumber ?? r.sequenceNumber ?? ""}</td>
            <td>${new Date(r.date).toLocaleDateString()}</td>
            <td>${
              r.costCenter ? r.costCenter.name || r.costCenter._id : "-"
            }</td>
            <td>${r.description ?? ""}</td>
            <td>${r.debit}</td>
            <td>${r.credit}</td>
            <td>${r.balance}</td>
          </tr>`
          )
          .join("")}
      </tbody>
      <tfoot>
        <tr style="font-weight:bold; background:#eee;">
          <td colspan="4">Totals</td>
          <td>${totals.debit}</td>
          <td>${totals.credit}</td>
          <td>${totals.balance}</td>
        </tr>
      </tfoot>
    </table>
  `;

    const blob = new Blob([htmll], { type: "application/vnd.ms-excel" });
    saveAs(blob, "ledger.xls");
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
        flexWrap="wrap"
      >
        {/* Account Select */}
        <FormControl fullWidth sx={{ flex: 1 }}>
          <Select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Choose account</MenuItem>
            {accounts &&
              accounts.map((a: IAccount) => (
                <MenuItem key={a.id} value={String(a.id)}>
                  {a.name} ({a.accountCode})
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Cost Center Select */}
        <FormControl fullWidth sx={{ flex: 1 }}>
          <Select
            value={selectedCostCenter}
            onChange={(e) => setSelectedCostCenter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All cost centers</MenuItem>
            {costCenters &&
              costCenters.map((c: ICostCenter) => (
                <MenuItem key={c.id} value={String(c.id)}>
                  {c.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          type="date"
          label="Start Date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ width: 180 }}
        />

        <TextField
          type="date"
          label="End Date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ width: 180 }}
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
              <TableCell>Entry No</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Cost Center</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Debit</TableCell>
              <TableCell align="right">Credit</TableCell>
              <TableCell align="right">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r: any, i: number) => (
              <TableRow key={i}>
                <TableCell>{r.entryNumber ?? r.sequenceNumber ?? ""}</TableCell>
                <TableCell>{r.code}</TableCell>
                <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {r.costCenter ? r.costCenter.name || r.costCenter._id : "-"}
                </TableCell>
                <TableCell>{r.description}</TableCell>
                <TableCell align="right">{r.debit}</TableCell>
                <TableCell align="right">{r.credit}</TableCell>
                <TableCell align="right">{r.balance}</TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={5}>
                <b>Totals</b>
              </TableCell>
              <TableCell align="right">
                <b>{totals.debit}</b>
              </TableCell>
              <TableCell align="right">
                <b>{totals.credit}</b>
              </TableCell>
              <TableCell align="right">
                <b>
                  {totals.balance} ({totals.balance >= 0 ? "Debit" : "Credit"})
                </b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* Actions */}
      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="outlined" onClick={handlePrint}>
          Print
        </Button>
        <Button variant="outlined" onClick={exportExcel}>
          Export to Excel
        </Button>
      </Stack>
    </Box>
  );
}
