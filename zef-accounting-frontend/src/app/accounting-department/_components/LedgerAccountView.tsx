// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   FormControl,
//   Select,
//   MenuItem,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Button,
//   Stack,
//   TextField,
// } from "@mui/material";
// import { useGetAccountsQuery } from "@/redux/slices/api/accountsApiSlice";
// import { useGetLedgerMutation } from "@/redux/slices/api/ledgerApiSlice";
// import { IAccount } from "@/types/Account";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { useGetCostCentersQuery } from "@/redux/slices/api/CostCentersApiSlice";
// import { ICostCenter } from "@/types/costCenters";

// export function LedgerAccountView() {
//   const { data: accounts } = useGetAccountsQuery();
//   const { data: costCenters } = useGetCostCentersQuery();

//   const [selected, setSelected] = useState<string>("");
//   // const [selectedCostCenter, setSelectedCostCenter] = useState<number>();
//   const [selectedCostCenter, setSelectedCostCenter] = useState<number | string>(
//     "",
//   );

//   const [startDate, setStartDate] = useState<string>("2025-01-01");
//   const [endDate, setEndDate] = useState<string>("2025-12-31");
// const [ledgerLoaded, setLedgerLoaded] = useState(false);
//   const [getLedger] = useGetLedgerMutation();
//   const [rows, setRows] = useState<any[]>([]);
//   const [totals, setTotals] = useState({
//     debit: 0,
//     credit: 0,
//     balance: 0,
//   });

//   const load = async () => {
//     if (!selected) return;
//     const res = await getLedger({
//       accountId: +selected,
//       costCenter: selectedCostCenter ? +selectedCostCenter : undefined,
//       startDate,
//       endDate,
//     }).unwrap();

//     // هنا استخدم res.ledger بدل details
//     const sorted = [...(res.ledger || [])].sort((a: any, b: any) => {
//       const dateA = new Date(a.date).getTime();
//       const dateB = new Date(b.date).getTime();
//       return dateA - dateB;
//     });

//     setRows(sorted);

//     // هنا استخدم res.totals
//     setTotals({
//       debit: res.totals?.debit || 0,
//       credit: res.totals?.credit || 0,
//       balance: res.totals?.closingBalance || 0,
//     });
//     setLedgerLoaded(true);
//   };

//   const selectedAccount = accounts?.find(
//     (a: IAccount) => a.id.toString() === selected,
//   );
//   console.log("rows", rows);

//   // ---- Print Ledger ----
//   const handlePrint = () => {
//     const printWindow = window.open("", "_blank");
//     if (!printWindow) return;

//     printWindow.document.body.innerHTML = `
//       <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             table { border-collapse: collapse; width: 100%; margin-top: 20px; font-size: 12px; }
//             th, td { border: 1px solid #000; padding: 6px; text-align: center; }
//             th { background: #f2f2f2; font-weight: bold; }
//             tfoot td { font-weight: bold; }
//           </style>
//         </head>
//         <body>
//           <h2>${selectedAccount?.name} General Ledger</h2>
//           <h4>Cost Center: ${
//             selectedCostCenter
//               ? costCenters?.find((c) => c.id === selectedCostCenter)?.name ||
//                 "-"
//               : "All"
//           }</h4>
//           <table>
//             <thead>
//               <tr>
//                 <th>Entry No</th>
//                 <th>Code</th>
//                 <th>Date</th>
//                 <th>Cost Center</th>
//                 <th>Description</th>
//                 <th>Debit</th>
//                 <th>Credit</th>
//                 <th>Balance</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${rows
//                 .map(
//                   (r) => `
//                 <tr>
//                   <td>${r.entryNumber ?? r.sequenceNumber ?? ""}</td>
//                   <td>${r.code ?? ""}</td>
//                   <td>${new Date(r.date).toLocaleDateString()}</td>
//                   <td>${r.costCenter ? r.costCenter : "-"}</td>
//                   <td>${r.description ?? ""}</td>
//                   <td>${r.debit ?? 0}</td>
//                   <td>${r.credit ?? 0}</td>
//                   <td>${r.balance ?? 0}</td>
//                 </tr>`,
//                 )
//                 .join("")}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colspan="5">Totals</td>
//                 <td>${totals.debit}</td>
//                 <td>${totals.credit}</td>
//                 <td></td>
//               </tr>
//             </tfoot>
//           </table>

//   ${ledgerLoaded ? `
//   <table style="margin-top:16px; border-collapse:collapse; font-size:14px;">
//     <tr>
//       <td style="padding:6px;">
//         ${selectedAccount?.name} final balance is :
//       </td>
//       <td style="padding:6px;">
//         ${
//           totals.balance > 0
//             ? totals.balance
//             : totals.balance < 0
//             ? totals.balance * -1
//             : 0
//         }
//       </td>
//       <td style="padding:6px; color:red; font-weight:bold;">
//         ${
//           totals.balance > 0
//             ? "Debit"
//             : totals.balance < 0
//             ? "(Credit)"
//             : ""
//         }
//       </td>
//     </tr>
//   </table>
// ` : ""}
//         </body>
//       </html>
//     `;

//     printWindow.document.close();
//     printWindow.print();
//   };

//   // ---- Export to Excel ----
//   const exportExcel = () => {
//     const htmll = `
//     <h3>${selectedAccount?.name} General Ledger</h3/>
//     <h4>Cost Center: ${
//       selectedCostCenter
//         ? costCenters?.find((c) => c.id === selectedCostCenter)?.name || "-"
//         : "All"
//     }</h4>
//     <table border="1" style="border-collapse:collapse; text-align:center;">
//       <thead>
//         <tr style="background:#f2f2f2; font-weight:bold;">
//           <th>Entry No</th>
//           <th>Date</th>
//           <th>Cost Center</th>
//           <th>Description</th>
//           <th>Debit</th>
//           <th>Credit</th>
//           <th>Balance</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${rows
//           .map(
//             (r) => `
//           <tr>
//             <td>${r.entryNumber ?? r.sequenceNumber ?? ""}</td>
//             <td>${new Date(r.date).toLocaleDateString()}</td>
//             <td>${r.costCenter ? r.costCenter : "-"}</td>
//             <td>${r.description ?? ""}</td>
//             <td>${r.debit}</td>
//             <td>${r.credit}</td>
//             <td>${r.balance}</td>
//           </tr>`,
//           )
//           .join("")}
//       </tbody>
//       <tfoot>
//         <tr style="font-weight:bold; background:#eee;">
//           <td colspan="4">Totals</td>
//           <td>${totals.debit}</td>
//           <td>${totals.credit}</td>
//           <td></td>
//         </tr>
//       </tfoot>
//     </table>
// ${ledgerLoaded ? `
//   <tr>
//     <td colspan="7" style="padding:10px; font-weight:bold; text-align:left;">
//       ${selectedAccount?.name} final balance is :
//       ${totals.balance > 0
//         ? totals.balance
//         : totals.balance < 0
//         ? totals.balance * -1
//         : 0}
//       <span style="color:red;">
//         ${
//           totals.balance > 0
//             ? "Debit"
//             : totals.balance < 0
//             ? "(Credit)"
//             : ""
//         }
//       </span>
//     </td>
//   </tr>
// ` : ""}
//   `;

//     const blob = new Blob([htmll], { type: "application/vnd.ms-excel" });
//     saveAs(blob, "ledger.xls");
//   };
//   console.log("rows", rows);

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom>
//         General Ledger
//       </Typography>

//       {/* Filters */}
//       <Stack
//         direction={{ xs: "column", md: "row" }}
//         spacing={2}
//         alignItems="center"
//         mb={2}
//         flexWrap="wrap"
//       >
//         {/* Account Select */}
//         <FormControl fullWidth sx={{ flex: 1 }}>
//           <Select
//             value={selected}
//             onChange={(e) => setSelected(e.target.value)}
//             displayEmpty
//           >
//             <MenuItem value="">Choose account</MenuItem>
//             {accounts &&
//               accounts.map((a: IAccount) => (
//                 <MenuItem key={a.id} value={String(a.id)}>
//                   {a.name} ({a.accountCode})
//                 </MenuItem>
//               ))}
//           </Select>
//         </FormControl>

//         {/* Cost Center Select */}
//         <FormControl fullWidth sx={{ flex: 1 }}>
//           {/* <Select
//             value={selectedCostCenter}
//             onChange={(e) => setSelectedCostCenter(+e.target.value)}
//             displayEmpty
//           >
//             <MenuItem value="">All cost centers</MenuItem>
//             {costCenters &&
//               costCenters.map((c: ICostCenter) => (
//                 <MenuItem key={c.id} value={String(c.id)}>
//                   {c.name}
//                 </MenuItem>
//               ))}
//           </Select> */}
//           {/* 
//              <Select
//             value={selectedCostCenter}
//             onChange={(e) => setSelectedCostCenter(e.target.value)}
//             displayEmpty
//           >
//             <MenuItem value="All cost centers">All cost centers</MenuItem>
//             {costCenters &&
//               costCenters.map((c: ICostCenter) => (
//                 <MenuItem key={c.id} value={String(c.id)}>
//                   {c.name}
//                 </MenuItem>
//               ))}
//           </Select> */}

//           <Select
//             value={selectedCostCenter ?? ""}
//             onChange={(e) =>
//               setSelectedCostCenter(
//                 e.target.value === "" ? "" : Number(e.target.value),
//               )
//             }
//             displayEmpty
//           >
//             <MenuItem value="">All cost centers</MenuItem>

//             {costCenters?.map((c: ICostCenter) => (
//               <MenuItem key={c.id} value={c.id}>
//                 {c.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <TextField
//           type="date"
//           label="Start Date"
//           slotProps={{ inputLabel: { shrink: true } }}
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           sx={{
//             width: 180,
//             '& input[type="date"]::-webkit-calendar-picker-indicator': {
//               filter: (theme) =>
//                 theme.palette.mode === "dark" ? "invert(1)" : "invert(0)",
//             },
//           }}
//         />

//         <TextField
//           type="date"
//           label="End Date"
//           slotProps={{ inputLabel: { shrink: true } }}
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           sx={{
//             width: 180,
//             '& input[type="date"]::-webkit-calendar-picker-indicator': {
//               filter: (theme) =>
//                 theme.palette.mode === "dark" ? "invert(1)" : "invert(0)",
//             },
//           }}
//         />

//         <Button
//           variant="contained"
//           onClick={load}
//           disabled={!selected}
//           sx={{ minWidth: 120, height: 56 }}
//         >
//           Load
//         </Button>
//       </Stack>

//       {/* Table */}
//       <Paper>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Entry No</TableCell>
//               <TableCell>Code</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Cost Center</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell align="right">Debit</TableCell>
//               <TableCell align="right">Credit</TableCell>
//               <TableCell align="right">Balance</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((r: any, i: number) => (
//               <TableRow key={i}>
//                 <TableCell>{r.entryNumber ?? r.sequenceNumber ?? ""}</TableCell>
//                 <TableCell>{r.code}</TableCell>
//                 <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
//                 <TableCell>{r.costCenter ? r.costCenter : "-"}</TableCell>
//                 <TableCell>{r.description}</TableCell>
//                 <TableCell align="right">{r.debit}</TableCell>
//                 <TableCell align="right">{r.credit}</TableCell>
//                 <TableCell align="right">
//                   {r.balance > 0
//                     ? r.balance + "  Dr"
//                     : r.balance < 0
//                       ? (r.balance * -1) + "  Cr"
//                       : r.balance === 0
//                         ? 0
//                         : ""}
//                 </TableCell>
//               </TableRow>
//             ))}

//             <TableRow>
//               <TableCell colSpan={5}>
//                 <b>Totals</b>
//               </TableCell>
//               <TableCell align="right">
//                 <b>{totals.debit}</b>
//               </TableCell>
//               <TableCell align="right">
//                 <b>{totals.credit}</b>
//               </TableCell>
//               <TableCell align="right">
//                 <b></b>
//               </TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </Paper>

//       {ledgerLoaded && (totals.balance !== 0 ? (
//         <Typography variant="subtitle1" mt={2}>
//           {selectedAccount?.name} final balnce is :{" "}
//           {totals.balance > 0 ? totals.balance : totals.balance * -1}{" "}
//           {totals.balance > 0 ? (
//             <Typography component={"span"} sx={{ color: "red" }}>
//               Debit
//             </Typography>
//           ) : (
//             <Typography component={"span"} sx={{ color: "red" }}>
//               (Credit)
//             </Typography>
//           )}
//         </Typography>
//       ) : 
      
//         <Typography variant="subtitle1" mt={2}>
//           {selectedAccount?.name} final balnce is : 0
      
//         </Typography>
      
//     )  }
//       {/* Actions */}
//       <Stack direction="row" spacing={2} mt={2}>
//         <Button
//           variant="outlined"
//           onClick={handlePrint}
//           sx={{ textTransform: "capitalize" }}
//         >
//           Print
//         </Button>
//         <Button
//           variant="outlined"
//           onClick={exportExcel}
//           sx={{ textTransform: "capitalize" }}
//         >
//           Export to Excel
//         </Button>
//       </Stack>
//     </Box>
//   );
// }



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
  Chip,
  Divider,
} from "@mui/material";
import {
  PrintOutlined,
  DownloadOutlined,
  SearchOutlined,
  AccountBalanceOutlined,
} from "@mui/icons-material";
import { useGetAccountsQuery } from "@/redux/slices/api/accountsApiSlice";
import { useGetLedgerMutation } from "@/redux/slices/api/ledgerApiSlice";
import { IAccount } from "@/types/Account";
import { saveAs } from "file-saver";
import { useGetCostCentersQuery } from "@/redux/slices/api/CostCentersApiSlice";
import { ICostCenter } from "@/types/costCenters";

// ─── helpers ────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: string;
  color: string;
  sub?: string;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "action.hover",
        borderRadius: 2,
        px: 2,
        py: 1.5,
        minWidth: 0,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "text.secondary",
          display: "block",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 500, color, lineHeight: 1.2 }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function LedgerAccountView() {
  const { data: accounts } = useGetAccountsQuery();
  const { data: costCenters } = useGetCostCentersQuery();

  const [selected, setSelected] = useState<string>("");
  const [selectedCostCenter, setSelectedCostCenter] = useState<number | string>("");
  const [startDate, setStartDate] = useState<string>("2025-01-01");
  const [endDate, setEndDate] = useState<string>("2025-12-31");
  const [ledgerLoaded, setLedgerLoaded] = useState(false);

  const [getLedger] = useGetLedgerMutation();
  const [rows, setRows] = useState<any[]>([]);
  const [totals, setTotals] = useState({ debit: 0, credit: 0, balance: 0 });

  const selectedAccount = accounts?.find(
    (a: IAccount) => a.id.toString() === selected
  );

  // ── Load ──────────────────────────────────────────────────────────────────
  const load = async () => {
    if (!selected) return;
    const res = await getLedger({
      accountId: +selected,
      costCenter: selectedCostCenter ? +selectedCostCenter : undefined,
      startDate,
      endDate,
    }).unwrap();

    const sorted = [...(res.ledger || [])].sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setRows(sorted);
    setTotals({
      debit: res.totals?.debit || 0,
      credit: res.totals?.credit || 0,
      balance: res.totals?.closingBalance || 0,
    });
    setLedgerLoaded(true);
  };

  // ── Print ─────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const ccName = selectedCostCenter
      ? costCenters?.find((c: ICostCenter) => c.id === selectedCostCenter)?.name || "—"
      : "All";

    printWindow.document.body.innerHTML = `
      <html><head><style>
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 28px; color: #111; }
        h2 { font-size: 18px; margin-bottom: 4px; }
        .meta { font-size: 12px; color: #555; margin-bottom: 20px; }
        table { border-collapse: collapse; width: 100%; font-size: 12px; margin-top: 16px; }
        th { background: #f4f4f4; padding: 8px 10px; text-align: left; border: 1px solid #ddd;
             text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; }
        th:nth-child(n+6) { text-align: right; }
        td { padding: 8px 10px; border: 1px solid #e8e8e8; vertical-align: middle; }
        td:nth-child(n+6) { text-align: right; }
        tfoot td { font-weight: bold; background: #f9f9f9; }
        .dr { color: #185FA5; } .cr { color: #0F6E56; }
        .closing { margin-top: 20px; padding: 12px 16px; border-left: 3px solid #185FA5;
                   background: #f8faff; font-size: 14px; }
      </style></head><body>
        <h2>${selectedAccount?.name ?? ""} — General Ledger</h2>
        <div class="meta">
          Cost Center: ${ccName} &nbsp;|&nbsp;
          Period: ${startDate} → ${endDate}
        </div>
        <table>
          <thead><tr>
            <th>Entry No</th><th>Code</th><th>Date</th><th>Cost Center</th>
            <th>Description</th><th>Debit</th><th>Credit</th><th>Balance</th>
          </tr></thead>
          <tbody>
            ${rows
              .map(
                (r) => `<tr>
                <td>${r.entryNumber ?? r.sequenceNumber ?? ""}</td>
                <td>${r.code ?? ""}</td>
                <td>${new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                <td>${r.costCenter || "—"}</td>
                <td>${r.description ?? ""}</td>
                <td class="dr">${r.debit > 0 ? fmt(r.debit) : "—"}</td>
                <td class="cr">${r.credit > 0 ? fmt(r.credit) : "—"}</td>
                <td>${
                  r.balance > 0
                    ? fmt(r.balance) + " Dr"
                    : r.balance < 0
                    ? fmt(Math.abs(r.balance)) + " Cr"
                    : "0.00"
                }</td>
              </tr>`
              )
              .join("")}
          </tbody>
          <tfoot><tr>
            <td colspan="5">Period Totals</td>
            <td class="dr">${fmt(totals.debit)}</td>
            <td class="cr">${fmt(totals.credit)}</td>
            <td></td>
          </tr></tfoot>
        </table>
        ${
          ledgerLoaded
            ? `<div class="closing">
                <strong>${selectedAccount?.name}</strong> closing balance:
                <strong>${fmt(Math.abs(totals.balance))}</strong>
                <span style="color:${totals.balance > 0 ? "#185FA5" : "#0F6E56"};">
                  ${totals.balance > 0 ? "Debit" : totals.balance < 0 ? "(Credit)" : ""}
                </span>
              </div>`
            : ""
        }
      </body></html>`;
    printWindow.document.close();
    printWindow.print();
  };

  // ── Export Excel ──────────────────────────────────────────────────────────
  const exportExcel = () => {
    const ccName = selectedCostCenter
      ? costCenters?.find((c: ICostCenter) => c.id === selectedCostCenter)?.name || "—"
      : "All";

    const html = `
      <html><body>
        <h3>${selectedAccount?.name ?? ""} General Ledger</h3>
        <p>Cost Center: ${ccName} | Period: ${startDate} → ${endDate}</p>
        <table border="1" style="border-collapse:collapse; text-align:center; font-size:12px;">
          <thead><tr style="background:#f2f2f2; font-weight:bold;">
            <th>Entry No</th><th>Code</th><th>Date</th><th>Cost Center</th>
            <th>Description</th><th>Debit</th><th>Credit</th><th>Balance</th>
          </tr></thead>
          <tbody>
            ${rows
              .map(
                (r) => `<tr>
                <td>${r.entryNumber ?? r.sequenceNumber ?? ""}</td>
                <td>${r.code ?? ""}</td>
                <td>${new Date(r.date).toLocaleDateString()}</td>
                <td>${r.costCenter || "—"}</td>
                <td>${r.description ?? ""}</td>
                <td>${r.debit ?? 0}</td>
                <td>${r.credit ?? 0}</td>
                <td>${
                  r.balance > 0
                    ? fmt(r.balance) + " Dr"
                    : r.balance < 0
                    ? fmt(Math.abs(r.balance)) + " Cr"
                    : "0.00"
                }</td>
              </tr>`
              )
              .join("")}
          </tbody>
          <tfoot><tr style="font-weight:bold; background:#eee;">
            <td colspan="5">Period Totals</td>
            <td>${fmt(totals.debit)}</td>
            <td>${fmt(totals.credit)}</td>
            <td></td>
          </tr></tfoot>
        </table>
        ${
          ledgerLoaded
            ? `<p style="margin-top:16px; font-weight:bold;">
                ${selectedAccount?.name} closing balance:
                ${fmt(Math.abs(totals.balance))}
                ${totals.balance > 0 ? "Debit" : totals.balance < 0 ? "(Credit)" : ""}
              </p>`
            : ""
        }
      </body></html>`;

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    saveAs(blob, `ledger_${selectedAccount?.name ?? "export"}.xls`);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* ── Page Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "primary.50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccountBalanceOutlined sx={{ color: "primary.main", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={500}>
              General Ledger
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Account transaction history &amp; balances
            </Typography>
          </Box>
        </Box>

        {/* Header action buttons — shown only after data is loaded */}
        {ledgerLoaded && (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<PrintOutlined />}
              onClick={handlePrint}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Print
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DownloadOutlined />}
              onClick={exportExcel}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Export Excel
            </Button>
          </Stack>
        )}
      </Box>

      {/* ── Filter Bar ── */}
      <Paper
        variant="outlined"
        sx={{ p: 2, mb: 2.5, borderRadius: 2, bgcolor: "action.hover" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "flex-end" }}
        >
          {/* Account */}
          <Box sx={{ flex: 2, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.5,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "text.secondary",
              }}
            >
              Account
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                displayEmpty
                sx={{ borderRadius: 1.5, bgcolor: "background.paper" }}
              >
                <MenuItem value="">
                  <Typography color="text.secondary" fontSize={13}>
                    Select account…
                  </Typography>
                </MenuItem>
                {accounts?.map((a: IAccount) => (
                  <MenuItem key={a.id} value={String(a.id)}>
                    {a.name}{" "}
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      ml={0.5}
                    >
                      ({a.accountCode})
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Cost Center */}
          <Box sx={{ flex: 1.5, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.5,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "text.secondary",
              }}
            >
              Cost Center
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedCostCenter ?? ""}
                onChange={(e) =>
                  setSelectedCostCenter(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                displayEmpty
                sx={{ borderRadius: 1.5, bgcolor: "background.paper" }}
              >
                <MenuItem value="">All cost centers</MenuItem>
                {costCenters?.map((c: ICostCenter) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Dates */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.5,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "text.secondary",
              }}
            >
              From date
            </Typography>
            <TextField
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{
                width: 160,
                "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" },
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  filter: (theme) =>
                    theme.palette.mode === "dark" ? "invert(1)" : "invert(0)",
                },
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.5,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "text.secondary",
              }}
            >
              To date
            </Typography>
            <TextField
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            sx={{
                width: 160,
                "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" },
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  filter: (theme) =>
                    theme.palette.mode === "dark" ? "invert(1)" : "invert(0)",
                },
              }}
            />
          </Box>

          {/* Load Button */}
          <Button
            variant="contained"
            startIcon={<SearchOutlined />}
            onClick={load}
            disabled={!selected}
            sx={{
              height: 40,
              minWidth: 130,
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            Load ledger
          </Button>
        </Stack>
      </Paper>

      {/* ── Metric Cards ── */}
      {ledgerLoaded && (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mb={2.5}>
          <MetricCard
            label="Total Debit"
            value={fmt(totals.debit)}
            color="primary.main"
            sub="Across all entries"
          />
          <MetricCard
            label="Total Credit"
            value={fmt(totals.credit)}
            color="success.main"
            sub="Across all entries"
          />
          <MetricCard
            label="Closing Balance"
            value={fmt(Math.abs(totals.balance))}
            color={totals.balance > 0 ? "primary.main" : totals.balance < 0 ? "success.main" : "text.secondary"}
            sub={
              totals.balance > 0
                ? "Debit balance"
                : totals.balance < 0
                ? "Credit balance"
                : "Balanced"
            }
          />
        </Stack>
      )}

      {/* ── Table ── */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Table toolbar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.25,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              {ledgerLoaded
                ? `${selectedAccount?.name ?? ""} — Transactions`
                : "No account selected"}
            </Typography>
            {ledgerLoaded && (
              <Chip
                label={`${rows.length} ${rows.length === 1 ? "entry" : "entries"}`}
                size="small"
                sx={{
                  fontSize: 11,
                  height: 20,
                  bgcolor: "primary.50",
                  color: "primary.main",
                  fontWeight: 600,
                  border: "none",
                }}
              />
            )}
          </Box>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "action.hover" }}>
              {["Entry No", "Code", "Date", "Cost Center", "Description"].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "text.secondary",
                    py: 1.25,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </TableCell>
              ))}
              {["Debit", "Credit", "Balance"].map((h) => (
                <TableCell
                  key={h}
                  align="right"
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "text.secondary",
                    py: 1.25,
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary" fontSize={13}>
                    {selected
                      ? "No entries found for the selected filters"
                      : "Select an account and click Load ledger to view transactions"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r: any, i: number) => (
                <TableRow
                  key={i}
                  hover
                  sx={{ "&:last-child td": { borderBottom: 0 } }}
                >
                  <TableCell sx={{ fontSize: 12, color: "text.secondary" }}>
                    {r.entryNumber ?? r.sequenceNumber ?? ""}
                  </TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        fontSize: 11,
                        bgcolor: "action.hover",
                        color: "text.secondary",
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 0.75,
                        fontFamily: "monospace",
                      }}
                    >
                      {r.code}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>
                    {new Date(r.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {r.costCenter ? (
                      <Chip
                        label={r.costCenter}
                        size="small"
                        sx={{
                          fontSize: 11,
                          height: 20,
                          bgcolor: "success.50",
                          color: "success.dark",
                          border: "none",
                        }}
                      />
                    ) : (
                      <Typography fontSize={12} color="text.disabled">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 13,
                      maxWidth: 220,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.description}
                  </TableCell>

                  {/* Debit */}
                  <TableCell align="right">
                    {r.debit > 0 ? (
                      <Typography fontSize={13} fontWeight={500} color="primary.main">
                        {fmt(r.debit)}
                      </Typography>
                    ) : (
                      <Typography fontSize={12} color="text.disabled">—</Typography>
                    )}
                  </TableCell>

                  {/* Credit */}
                  <TableCell align="right">
                    {r.credit > 0 ? (
                      <Typography fontSize={13} fontWeight={500} color="success.main">
                        {fmt(r.credit)}
                      </Typography>
                    ) : (
                      <Typography fontSize={12} color="text.disabled">—</Typography>
                    )}
                  </TableCell>

                  {/* Balance */}
                  <TableCell align="right">
                    <Box
                      sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.75 }}
                    >
                      <Typography
                        fontSize={13}
                        fontWeight={500}
                        color={
                          r.balance > 0
                            ? "primary.main"
                            : r.balance < 0
                            ? "success.main"
                            : "text.secondary"
                        }
                      >
                        {r.balance === 0 ? "0.00" : fmt(Math.abs(r.balance))}
                      </Typography>
                      {r.balance !== 0 && (
                        <Box
                          component="span"
                          sx={{
                            fontSize: 9,
                            fontWeight: 700,
                            px: 0.5,
                            py: 0.2,
                            borderRadius: 0.5,
                            bgcolor: r.balance > 0 ? "primary.50" : "success.50",
                            color: r.balance > 0 ? "primary.main" : "success.main",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {r.balance > 0 ? "DR" : "CR"}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}

            {/* Totals Row */}
            {rows.length > 0 && (
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell colSpan={5} sx={{ py: 1.25 }}>
                  <Typography fontSize={12} fontWeight={600} color="text.secondary">
                    Period totals
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontSize={13} fontWeight={600} color="primary.main">
                    {fmt(totals.debit)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontSize={13} fontWeight={600} color="success.main">
                    {fmt(totals.credit)}
                  </Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ── Closing Balance Banner ── */}
      {ledgerLoaded && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: "action.hover",
            borderLeft: "3px solid",
            borderColor: totals.balance <= 0 ? "success.main" : "primary.main",
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.05em">
              {selectedAccount?.name} — Closing balance
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
              <Typography variant="h6" fontWeight={500}>
                {fmt(Math.abs(totals.balance))}
              </Typography>
              {totals.balance !== 0 && (
                <Chip
                  label={totals.balance > 0 ? "Debit" : "Credit"}
                  size="small"
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    bgcolor: totals.balance > 0 ? "primary.50" : "success.50",
                    color: totals.balance > 0 ? "primary.main" : "success.main",
                    border: "none",
                  }}
                />
              )}
              {totals.balance === 0 && (
                <Typography fontSize={12} color="text.secondary">Balanced</Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
