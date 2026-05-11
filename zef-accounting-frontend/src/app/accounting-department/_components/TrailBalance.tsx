"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
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
  FormControl,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
  Divider,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  BalanceOutlined,
  BusinessOutlined,
  AccountTreeOutlined,
  SearchOutlined,
  PrintOutlined,
  DownloadOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import { useGetAccountsQuery } from "@/redux/slices/api/accountsApiSlice";
import { useGetCostCentersQuery } from "@/redux/slices/api/CostCentersApiSlice";
import { IAccount } from "@/types/Account";
import { ICostCenter } from "@/types/costCenters";
import { saveAs } from "file-saver";
import { useGetAccountTrialBalanceMutation, useGetCompanyTrialBalanceMutation } from "@/redux/slices/api/TrialBalanceApiSlice";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TrialBalanceRow {
  accountId: number;
  accountCode: string;
  accountName: string;
  level: number;
  isMain: boolean;
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
}

interface Totals {
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n === 0
    ? "—"
    : n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

const fmtTotal = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({
  label,
  debit,
  credit,
  accent,
}: {
  label: string;
  debit: number;
  credit: number;
  accent: string;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: alpha(accent, 0.06),
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          textTransform="uppercase"
          letterSpacing="0.08em"
          color="text.secondary"
        >
          {label}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          "& > div": {
            px: 2,
            py: 1.25,
            "&:first-of-type": {
              borderRight: "1px solid",
              borderColor: "divider",
            },
          },
        }}
      >
        <Box>
          <Typography
            variant="caption"
            color="text.disabled"
            display="block"
            mb={0.25}
          >
            Debit
          </Typography>
          <Typography fontSize={14} fontWeight={600} color="primary.main">
            {fmtTotal(debit)}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="caption"
            color="text.disabled"
            display="block"
            mb={0.25}
          >
            Credit
          </Typography>
          <Typography fontSize={14} fontWeight={600} color="success.main">
            {fmtTotal(credit)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Balance Pill ─────────────────────────────────────────────────────────────
function BalancePill({ value }: { value: number }) {
  if (value === 0)
    return (
      <Typography fontSize={12} color="text.disabled">
        —
      </Typography>
    );
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        bgcolor: value > 0 ? "primary.50" : "success.50",
        color: value > 0 ? "primary.main" : "success.main",
        px: 1,
        py: 0.25,
        borderRadius: 1,
        fontWeight: 600,
        fontSize: 12,
      }}
    >
      {fmtTotal(value)}
      <Box
        component="span"
        sx={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.04em",
          opacity: 0.75,
        }}
      >
        {value > 0 ? "DR" : "CR"}
      </Box>
    </Box>
  );
}

// ─── Column Header ────────────────────────────────────────────────────────────
const ColHeader = ({
  children,
  align = "left",
  span = 1,
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  span?: number;
}) => (
  <TableCell
    align={align}
    colSpan={span}
    sx={{
      fontSize: 10,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      color: "text.secondary",
      py: 1.25,
      whiteSpace: "nowrap",
      bgcolor: "action.hover",
    }}
  >
    {children}
  </TableCell>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export function TrialBalancePage() {
  // ── Mode ──────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<"company" | "account">("company");

  // ── Filters ───────────────────────────────────────────────────────────────
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [level, setLevel] = useState<string>("");            // company mode
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>("");

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: accounts } = useGetAccountsQuery();
  const { data: costCenters } = useGetCostCentersQuery();

  const [getCompanyTB, { isLoading: loadingCompany }] =
    useGetCompanyTrialBalanceMutation();
  const [getAccountTB, { isLoading: loadingAccount }] =
    useGetAccountTrialBalanceMutation();

  const [rows, setRows] = useState<TrialBalanceRow[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [reportTitle, setReportTitle] = useState("");

  const isLoading = loadingCompany || loadingAccount;

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = async () => {
    try {
      if (mode === "company") {
        const res = await getCompanyTB({
          startDate,
          endDate,
          ...(level ? { level: Number(level) } : {}),
        }).unwrap();
        setRows(res.rows);
        setTotals(res.totals);
        setReportTitle(
          level ? `Level ${level} Accounts` : "All Accounts"
        );
      } else {
        if (!selectedAccount) return;
        const res = await getAccountTB({
          accountId: Number(selectedAccount),
          startDate,
          endDate,
          ...(selectedCostCenter
            ? { costCenter: Number(selectedCostCenter) }
            : {}),
        }).unwrap();
        setRows(res.rows);
        setTotals(res.totals);
        setReportTitle(res.account?.name ?? "");
      }
      setLoaded(true);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Print ─────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    if (!loaded || !rows.length) return;
    const win = window.open("", "_blank");
    if (!win) return;

    const tableRows = rows
      .map(
        (r) => `<tr class="${r.isMain ? "main-row" : ""}">
        <td>${r.accountCode}</td>
        <td style="padding-left:${(r.level - 1) * 16}px">${r.accountName}</td>
        <td class="num">${r.openingDebit > 0 ? fmtTotal(r.openingDebit) : "—"}</td>
        <td class="num">${r.openingCredit > 0 ? fmtTotal(r.openingCredit) : "—"}</td>
        <td class="num">${r.periodDebit > 0 ? fmtTotal(r.periodDebit) : "—"}</td>
        <td class="num">${r.periodCredit > 0 ? fmtTotal(r.periodCredit) : "—"}</td>
        <td class="num">${r.closingDebit > 0 ? fmtTotal(r.closingDebit) : "—"}</td>
        <td class="num">${r.closingCredit > 0 ? fmtTotal(r.closingCredit) : "—"}</td>
      </tr>`
      )
      .join("");

    win.document.body.innerHTML = `
      <html><head>
      <title>Trial Balance</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 32px; color: #1a1a2e; font-size: 12px; }
        .header { margin-bottom: 24px; }
        .header h1 { font-size: 20px; font-weight: 700; color: #1a1a2e; }
        .header p  { font-size: 12px; color: #666; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { padding: 8px 10px; background: #f5f7fa; border: 1px solid #e2e8f0;
             font-size: 10px; font-weight: 700; text-transform: uppercase;
             letter-spacing: .05em; color: #64748b; }
        th.num, td.num { text-align: right; }
        td { padding: 7px 10px; border: 1px solid #eef0f4; color: #374151; }
        .main-row td { background: #f8faff; font-weight: 600; }
        .group-header { background: #e8ecf5 !important; font-size: 10px;
                        font-weight: 700; text-transform: uppercase; color: #475569; }
        tfoot td { background: #f0f4ff; font-weight: 700; font-size: 12px;
                   border-top: 2px solid #c7d2fe; }
        @media print { body { padding: 16px; } }
      </style></head><body>
      <div class="header">
        <h1>Trial Balance — ${reportTitle}</h1>
        <p>Period: ${startDate} to ${endDate}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th colspan="2"></th>
            <th colspan="2" class="num">Opening Balance</th>
            <th colspan="2" class="num">Period Movement</th>
            <th colspan="2" class="num">Closing Balance</th>
          </tr>
          <tr>
            <th>Code</th><th>Account</th>
            <th class="num">Debit</th><th class="num">Credit</th>
            <th class="num">Debit</th><th class="num">Credit</th>
            <th class="num">Debit</th><th class="num">Credit</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
        <tfoot><tr>
          <td colspan="2">TOTALS</td>
          <td class="num">${totals ? fmtTotal(totals.openingDebit) : "—"}</td>
          <td class="num">${totals ? fmtTotal(totals.openingCredit) : "—"}</td>
          <td class="num">${totals ? fmtTotal(totals.periodDebit) : "—"}</td>
          <td class="num">${totals ? fmtTotal(totals.periodCredit) : "—"}</td>
          <td class="num">${totals ? fmtTotal(totals.closingDebit) : "—"}</td>
          <td class="num">${totals ? fmtTotal(totals.closingCredit) : "—"}</td>
        </tr></tfoot>
      </table>
      </body></html>`;
    win.document.close();
    win.print();
  };

  // ── Export Excel ──────────────────────────────────────────────────────────
  const handleExport = () => {
    if (!loaded || !rows.length) return;

    const tableRows = rows
      .map(
        (r) => `<tr>
        <td>${r.accountCode}</td><td>${r.accountName}</td>
        <td>${r.openingDebit}</td><td>${r.openingCredit}</td>
        <td>${r.periodDebit}</td><td>${r.periodCredit}</td>
        <td>${r.closingDebit}</td><td>${r.closingCredit}</td>
      </tr>`
      )
      .join("");

    const html = `<html><body>
      <h3>Trial Balance — ${reportTitle}</h3>
      <p>Period: ${startDate} to ${endDate}</p>
      <table border="1" style="border-collapse:collapse;font-size:12px;">
        <thead>
          <tr style="background:#f2f2f2;font-weight:bold;">
            <th colspan="2"></th>
            <th colspan="2">Opening Balance</th>
            <th colspan="2">Period Movement</th>
            <th colspan="2">Closing Balance</th>
          </tr>
          <tr style="background:#f2f2f2;font-weight:bold;">
            <th>Code</th><th>Account</th>
            <th>Opening Dr</th><th>Opening Cr</th>
            <th>Period Dr</th><th>Period Cr</th>
            <th>Closing Dr</th><th>Closing Cr</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
        <tfoot>
          <tr style="font-weight:bold;background:#eef2ff;">
            <td colspan="2">TOTALS</td>
            <td>${totals?.openingDebit ?? 0}</td>
            <td>${totals?.openingCredit ?? 0}</td>
            <td>${totals?.periodDebit ?? 0}</td>
            <td>${totals?.periodCredit ?? 0}</td>
            <td>${totals?.closingDebit ?? 0}</td>
            <td>${totals?.closingCredit ?? 0}</td>
          </tr>
        </tfoot>
      </table>
    </body></html>`;

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    saveAs(blob, `trial_balance_${reportTitle}_${startDate}.xls`);
  };

  // ─────────────────────────────────────────────────────────────────────────
  const acctObj = accounts?.find(
    (a: IAccount) => a.id.toString() === selectedAccount
  );

  const isSearchDisabled =
    isLoading || (mode === "account" && !selectedAccount);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: "auto" }}>

      {/* ══ Page Header ══════════════════════════════════════════════════════ */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          pb: 2.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              background: (t) =>
                `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.15)}, ${alpha(t.palette.primary.main, 0.05)})`,
              border: "1px solid",
              borderColor: "primary.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BalanceOutlined sx={{ color: "primary.main", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600} lineHeight={1.2}>
              Trial Balance
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Account balances & period movements
            </Typography>
          </Box>
        </Box>

        {loaded && (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<PrintOutlined />}
              onClick={handlePrint}
              sx={{ textTransform: "none", borderRadius: 1.5 }}
            >
              Print
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DownloadOutlined />}
              onClick={handleExport}
              sx={{ textTransform: "none", borderRadius: 1.5 }}
            >
              Export Excel
            </Button>
          </Stack>
        )}
      </Box>

      {/* ══ Filter Panel ═════════════════════════════════════════════════════ */}
      <Paper
        variant="outlined"
        sx={{ p: 2.5, mb: 2.5, borderRadius: 2 }}
      >
        {/* Mode Toggle */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="caption"
            fontWeight={700}
            textTransform="uppercase"
            letterSpacing="0.07em"
            color="text.secondary"
            display="block"
            mb={1}
          >
            Report Type
          </Typography>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, v) => {
              if (v) { setMode(v); setLoaded(false); setRows([]); setTotals(null); }
            }}
            size="small"
          >
            <ToggleButton
              value="company"
              sx={{
                textTransform: "none",
                px: 2.5,
                gap: 0.75,
                fontWeight: 500,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              }}
            >
              <BusinessOutlined fontSize="small" />
              All Accounts
            </ToggleButton>
            <ToggleButton
              value="account"
              sx={{
                textTransform: "none",
                px: 2.5,
                gap: 0.75,
                fontWeight: 500,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              }}
            >
              <AccountTreeOutlined fontSize="small" />
              Single Account
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Filters Row */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "flex-end" }}
          flexWrap="wrap"
        >
          {/* ── Company Mode: Level ── */}
          {mode === "company" && (
            <Box sx={{ minWidth: 180 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                textTransform="uppercase"
                letterSpacing="0.06em"
                color="text.secondary"
                display="block"
                mb={0.5}
              >
                Account Level
                <Tooltip title="Show only accounts at this depth in the chart of accounts. Level 1 = top-level, Level 2 = sub-accounts, etc.">
                  <InfoOutlined
                    sx={{ fontSize: 13, ml: 0.5, verticalAlign: "middle", opacity: 0.5 }}
                  />
                </Tooltip>
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: 1.5 }}
                >
                  <MenuItem value="">All levels</MenuItem>
                  {[1, 2, 3, 4, 5].map((l) => (
                    <MenuItem key={l} value={String(l)}>
                      Level {l}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* ── Account Mode: Account + Cost Center ── */}
          {mode === "account" && (
            <>
              <Box sx={{ flex: 2, minWidth: 220 }}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  textTransform="uppercase"
                  letterSpacing="0.06em"
                  color="text.secondary"
                  display="block"
                  mb={0.5}
                >
                  Account
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: 1.5 }}
                  >
                    <MenuItem value="">
                      <Typography color="text.secondary" fontSize={13}>
                        Select account…
                      </Typography>
                    </MenuItem>
                    {accounts?.map((a: IAccount) => (
                      <MenuItem key={a.id} value={String(a.id)}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography fontSize={13}>{a.name}</Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              bgcolor: "action.hover",
                              px: 0.75,
                              py: 0.1,
                              borderRadius: 0.75,
                              fontFamily: "monospace",
                            }}
                          >
                            {a.accountCode}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ minWidth: 180 }}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  textTransform="uppercase"
                  letterSpacing="0.06em"
                  color="text.secondary"
                  display="block"
                  mb={0.5}
                >
                  Cost Center
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedCostCenter}
                    onChange={(e) => setSelectedCostCenter(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: 1.5 }}
                  >
                    <MenuItem value="">All cost centers</MenuItem>
                    {costCenters?.map((c: ICostCenter) => (
                      <MenuItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </>
          )}

          {/* ── Dates ── */}
          <Box>
            <Typography
              variant="caption"
              fontWeight={700}
              textTransform="uppercase"
              letterSpacing="0.06em"
              color="text.secondary"
              display="block"
              mb={0.5}
            >
              From
            </Typography>
            <TextField
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
                  sx={{
                width: 155,
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
              fontWeight={700}
              textTransform="uppercase"
              letterSpacing="0.06em"
              color="text.secondary"
              display="block"
              mb={0.5}
            >
              To
            </Typography>
            <TextField
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
                    sx={{
                width: 155,
                "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" },
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  filter: (theme) =>
                    theme.palette.mode === "dark" ? "invert(1)" : "invert(0)",
                },
              }}
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<SearchOutlined />}
            onClick={handleSearch}
            disabled={isSearchDisabled}
            sx={{
              height: 40,
              minWidth: 140,
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            {isLoading ? "Loading…" : "Generate Report"}
          </Button>
        </Stack>
      </Paper>

      {/* ══ Summary Cards ════════════════════════════════════════════════════ */}
      {loaded && totals && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          mb={2.5}
        >
          <SummaryCard
            label="Opening Balance"
            debit={totals.openingDebit}
            credit={totals.openingCredit}
            accent="#3b82f6"
          />
          <SummaryCard
            label="Period Movement"
            debit={totals.periodDebit}
            credit={totals.periodCredit}
            accent="#8b5cf6"
          />
          <SummaryCard
            label="Closing Balance"
            debit={totals.closingDebit}
            credit={totals.closingCredit}
            accent="#10b981"
          />
        </Stack>
      )}

      {/* ══ Table ════════════════════════════════════════════════════════════ */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Table Toolbar */}
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
            <Typography variant="body2" fontWeight={600}>
              {loaded
                ? reportTitle || "Trial Balance"
                : "No data loaded"}
            </Typography>
            {loaded && (
              <>
                <Chip
                  label={`${rows.length} account${rows.length !== 1 ? "s" : ""}`}
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
                <Chip
                  label={`${startDate} → ${endDate}`}
                  size="small"
                  sx={{
                    fontSize: 11,
                    height: 20,
                    bgcolor: "action.hover",
                    color: "text.secondary",
                    border: "none",
                  }}
                />
              </>
            )}
          </Box>
        </Box>

        <Table size="small">
          <TableHead>
            {/* Group Headers */}
            <TableRow>
              <ColHeader span={2}>Account</ColHeader>
              <ColHeader align="right" span={2}>
                Opening Balance
              </ColHeader>
              <ColHeader align="right" span={2}>
                Period Movement
              </ColHeader>
              <ColHeader align="right" span={2}>
                Closing Balance
              </ColHeader>
            </TableRow>
            {/* Sub Headers */}
            <TableRow>
              <TableCell
                sx={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.06em", color: "text.secondary",
                  py: 1, bgcolor: "action.hover", width: 120,
                }}
              >
                Code
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.06em", color: "text.secondary",
                  py: 1, bgcolor: "action.hover",
                }}
              >
                Account Name
              </TableCell>
              {["Debit", "Credit", "Debit", "Credit", "Debit", "Credit"].map(
                (h, i) => (
                  <TableCell
                    key={i}
                    align="right"
                    sx={{
                      fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                      letterSpacing: "0.06em", color: "text.secondary",
                      py: 1, bgcolor: "action.hover",
                      borderLeft: i % 2 === 0 ? "1px solid" : "none",
                      borderColor: "divider",
                    }}
                  >
                    {h}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Loading Skeletons */}
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" width={j < 2 ? "90%" : "70%"} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* Empty State */}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <BalanceOutlined
                    sx={{ fontSize: 40, color: "text.disabled", mb: 1, display: "block", mx: "auto" }}
                  />
                  <Typography color="text.secondary" fontSize={13}>
                    {loaded
                      ? "No accounts found for the selected filters"
                      : "Configure the filters above and click Generate Report"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* Data Rows */}
            {!isLoading &&
              rows.map((r) => (
                <TableRow
                  key={r.accountId}
                  hover
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                    ...(r.isMain && {
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.03),
                      "& td": { fontWeight: 600 },
                    }),
                  }}
                >
                  {/* Code */}
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
                      {r.accountCode}
                    </Box>
                  </TableCell>

                  {/* Name with indent */}
                  <TableCell>
                    <Box
                      sx={{
                        pl: (r.level - 1) * 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                      }}
                    >
                      {r.isMain && (
                        <AccountTreeOutlined
                          sx={{ fontSize: 14, color: "primary.main", opacity: 0.6 }}
                        />
                      )}
                      <Typography
                        fontSize={13}
                        fontWeight={r.isMain ? 600 : 400}
                        color={r.isMain ? "text.primary" : "text.secondary"}
                      >
                        {r.accountName}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Opening */}
                  <TableCell
                    align="right"
                    sx={{ borderLeft: "1px solid", borderColor: "divider" }}
                  >
                    <Typography
                      fontSize={12}
                      color={r.openingDebit > 0 ? "primary.main" : "text.disabled"}
                      fontWeight={r.openingDebit > 0 ? 500 : 400}
                    >
                      {fmt(r.openingDebit)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      fontSize={12}
                      color={r.openingCredit > 0 ? "success.main" : "text.disabled"}
                      fontWeight={r.openingCredit > 0 ? 500 : 400}
                    >
                      {fmt(r.openingCredit)}
                    </Typography>
                  </TableCell>

                  {/* Period */}
                  <TableCell
                    align="right"
                    sx={{ borderLeft: "1px solid", borderColor: "divider" }}
                  >
                    <Typography
                      fontSize={12}
                      color={r.periodDebit > 0 ? "primary.main" : "text.disabled"}
                      fontWeight={r.periodDebit > 0 ? 500 : 400}
                    >
                      {fmt(r.periodDebit)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      fontSize={12}
                      color={r.periodCredit > 0 ? "success.main" : "text.disabled"}
                      fontWeight={r.periodCredit > 0 ? 500 : 400}
                    >
                      {fmt(r.periodCredit)}
                    </Typography>
                  </TableCell>

                  {/* Closing */}
                  <TableCell
                    align="right"
                    sx={{ borderLeft: "1px solid", borderColor: "divider" }}
                  >
                    <BalancePill value={r.closingDebit} />
                  </TableCell>
                  <TableCell align="right">
                    <BalancePill value={-r.closingCredit} />
                  </TableCell>
                </TableRow>
              ))}

            {/* Totals Row */}
            {!isLoading && rows.length > 0 && totals && (
              <TableRow
                sx={{
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
                  borderTop: "2px solid",
                  borderColor: "primary.100",
                }}
              >
                <TableCell colSpan={2} sx={{ py: 1.5 }}>
                  <Typography fontSize={12} fontWeight={700} textTransform="uppercase" letterSpacing="0.05em">
                    Totals
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderLeft: "1px solid", borderColor: "divider" }}>
                  <Typography fontSize={12} fontWeight={700} color="primary.main">
                    {fmtTotal(totals.openingDebit)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontSize={12} fontWeight={700} color="success.main">
                    {fmtTotal(totals.openingCredit)}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderLeft: "1px solid", borderColor: "divider" }}>
                  <Typography fontSize={12} fontWeight={700} color="primary.main">
                    {fmtTotal(totals.periodDebit)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontSize={12} fontWeight={700} color="success.main">
                    {fmtTotal(totals.periodCredit)}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderLeft: "1px solid", borderColor: "divider" }}>
                  <Typography fontSize={12} fontWeight={700} color="primary.main">
                    {fmtTotal(totals.closingDebit)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontSize={12} fontWeight={700} color="success.main">
                    {fmtTotal(totals.closingCredit)}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ══ Balance Check Banner ═════════════════════════════════════════════ */}
      {loaded && totals && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            ...(Math.abs(totals.closingDebit - totals.closingCredit) < 0.01
              ? {
                  bgcolor: (t) => alpha(t.palette.success.main, 0.05),
                  borderColor: "success.200",
                }
              : {
                  bgcolor: (t) => alpha(t.palette.error.main, 0.05),
                  borderColor: "error.200",
                }),
          }}
        >
          <Box>
            <Typography variant="caption" fontWeight={700} textTransform="uppercase" letterSpacing="0.06em" color="text.secondary">
              Balance Check
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5 }}>
              <Box>
                <Typography variant="caption" color="text.disabled">Closing Dr</Typography>
                <Typography fontWeight={600} fontSize={14} color="primary.main">
                  {fmtTotal(totals.closingDebit)}
                </Typography>
              </Box>
              <Typography color="text.disabled">=</Typography>
              <Box>
                <Typography variant="caption" color="text.disabled">Closing Cr</Typography>
                <Typography fontWeight={600} fontSize={14} color="success.main">
                  {fmtTotal(totals.closingCredit)}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Chip
            label={
              Math.abs(totals.closingDebit - totals.closingCredit) < 0.01
                ? "✓ Balanced"
                : `Difference: ${fmtTotal(Math.abs(totals.closingDebit - totals.closingCredit))}`
            }
            size="medium"
            sx={{
              fontWeight: 700,
              fontSize: 12,
              ...(Math.abs(totals.closingDebit - totals.closingCredit) < 0.01
                ? { bgcolor: "success.100", color: "success.dark" }
                : { bgcolor: "error.100", color: "error.dark" }),
            }}
          />
        </Box>
      )}
    </Box>
  );
}
