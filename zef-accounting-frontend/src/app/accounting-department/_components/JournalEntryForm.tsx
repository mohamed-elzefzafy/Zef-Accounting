// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import React from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import {
//   Box,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
//   Divider,
//   Stack,
// } from "@mui/material";
// import { useGetAccountsQuery } from "@/redux/slices/api/accountsApiSlice";
// import { useGetCostCentersQuery } from "@/redux/slices/api/CostCentersApiSlice";
// import { useCreateJournalEntryMutation } from "@/redux/slices/api/journalEntryApiSlice";
// import toast from "react-hot-toast";
// import { Delete } from "@mui/icons-material";

// export function JournalEntryForm() {
//   const { data: accounts } = useGetAccountsQuery();
//   const { data: costCenters } = useGetCostCentersQuery();
//   const [createJournal, { isLoading }] = useCreateJournalEntryMutation();

//   const { control, handleSubmit, register } = useForm({
//     defaultValues: {
//       date: new Date().toISOString().slice(0, 10),
//       description: "",
//       lines: [{ account: 0, debit: 0, credit: 0, costCenter: 0 }],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "lines",
//   });

//   const onSubmit = async (data: any) => {
//     const body = {
//       date: data.date,
//       description: data.description,
//       lines: data.lines.map((e: any) => ({
//         account: e.account,
//         debit: Number(e.debit || 0),
//         credit: Number(e.credit || 0),
//         costCenter: e.costCenter || null,
//       })),
//     };
//     try {
//       await createJournal(body).unwrap();
//       toast.success("Journal entry created");
//     } catch (err: any) {
//       toast.error("Create failed: " + (err?.data?.message || err.message));
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom>
//         Create Journal Entry
//       </Typography>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         {/* Header Fields */}
//         <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
//           <TextField
//             label="Date"
//             type="date"
//             fullWidth
//             {...register("date")}
//             slotProps={{ inputLabel: { shrink: true } }}
//             sx={{
//               '& input[type="date"]::-webkit-calendar-picker-indicator': {
//                 filter: (theme) =>
//                   theme.palette.mode === "dark" ? "invert(1)" : "invert(0)",
//               },
//             }}
//           />
//           <TextField
//             label="Description"
//             fullWidth
//             {...register("description")}
//           />
//         </Stack>

//         <Divider sx={{ my: 2 }} />

//         {/* Dynamic Entries */}
//         {fields.map((field, idx) => (
//           <Stack
//             key={field.id}
//             direction={{ xs: "column", md: "row" }}
//             spacing={2}
//             alignItems="center"
//             sx={{ mb: 2 }}
//           >
//             <Controller
//               name={`lines.${idx}.account`}
//               control={control}
//               render={({ field }) => (
//                 <FormControl fullWidth>
//                   <InputLabel>Account</InputLabel>
//                   <Select {...field} label="Account">
//                     <MenuItem value={0}>Choose Account</MenuItem>
//                     {(accounts || []).map((a: any) => (
//                       <MenuItem value={a.id} key={a.id}>
//                         {a.name} ({a.accountCode})
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               )}
//             />

//             <TextField
//               label="Debit"
//               type="number"
//               fullWidth
//               {...register(`lines.${idx}.debit`)}
//             />
//             <TextField
//               label="Credit"
//               type="number"
//               fullWidth
//               {...register(`lines.${idx}.credit`)}
//             />

//             <Controller
//               name={`lines.${idx}.costCenter`}
//               control={control}
//               render={({ field }) => (
//                 <FormControl fullWidth>
//                   <InputLabel>Cost Center (optional)</InputLabel>
//                   <Select {...field} label="Cost Center (optional)">
//                     <MenuItem value={0}>Cost Center</MenuItem>
//                     {(costCenters || []).map((c: any) => (
//                       <MenuItem key={c.id} value={c.id}>
//                         {c.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               )}
//             />

//             <Button
//               size="small"
//               variant="outlined"
//               color="error"
//               onClick={() => remove(idx)}
//               sx={{ fontSize: "14px", textTransform: "capitalize" }}
//             >
//               <Delete />
//             </Button>
//           </Stack>
//         ))}

//         {/* Buttons */}
//         <Stack direction="row" spacing={2}>
//           <Button
//             variant="outlined"
//             onClick={() =>
//               append({
//                 account: (accounts && accounts[0]?.id) || 0,
//                 debit: 0,
//                 credit: 0,
//                 costCenter: 0,
//               })
//             }
//             sx={{ textTransform: "capitalize" }}
//           >
//             Add line
//           </Button>
//           <Button
//             type="submit"
//             variant="contained"
//             disabled={isLoading}
//             sx={{ textTransform: "capitalize" }}
//           >
//             Save
//           </Button>
//         </Stack>
//       </form>
//     </Box>
//   );
// }


// "use client";
// import React from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import {
//   Box,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
//   Divider,
//   Stack,
// } from "@mui/material";
// import { useGetAccountsQuery } from "@/redux/slices/api/accountsApiSlice";
// import { useGetCostCentersQuery } from "@/redux/slices/api/CostCentersApiSlice";
// import { useCreateJournalEntryMutation } from "@/redux/slices/api/journalEntryApiSlice";
// import toast from "react-hot-toast";
// import { Delete } from "@mui/icons-material";

// export function JournalEntryForm() {
//   const { data: accounts } = useGetAccountsQuery();
//   const { data: costCenters } = useGetCostCentersQuery();
//   const [createJournal, { isLoading }] = useCreateJournalEntryMutation();

//   const { control, handleSubmit, register, reset } = useForm({
//     defaultValues: {
//       date: new Date().toISOString().slice(0, 10),
//       description: "", // ✅ رجعناها
//       lines: [
//         {
//           account: 0,
//           debit: 0,
//           credit: 0,
//           costCenter: 0,
//           description: "",
//         },
//       ],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "lines",
//   });

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const onSubmit = async (data: any) => {
//     const body = {
//       date: data.date,
//       description: data.description, // ✅ description القيد
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       lines: data.lines.map((e: any) => ({
//         account: e.account,
//         debit: Number(e.debit || 0),
//         credit: Number(e.credit || 0),
//         costCenter: e.costCenter || null,
//         description: e.description, // ✅ description السطر
//       })),
//     };

//     try {
//       await createJournal(body).unwrap();
//       toast.success("Journal entry created");

//       // ✅ reset
//       reset({
//         date: new Date().toISOString().slice(0, 10),
//         description: "",
//         lines: [
//           {
//             account: 0,
//             debit: 0,
//             credit: 0,
//             costCenter: 0,
//             description: "",
//           },
//         ],
//       });
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//       toast.error("Create failed: " + (err?.data?.message || err.message));
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom>
//         Create Journal Entry
//       </Typography>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         {/* Header */}
//         <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
//           <TextField
//             label="Date"
//             type="date"
//             fullWidth
//             {...register("date")}
//             slotProps={{ inputLabel: { shrink: true } }}
//           />

//           {/* ✅ description العامة */}
//           <TextField
//             label="Description"
//             fullWidth
//             {...register("description")}
//           />
//         </Stack>

//         <Divider sx={{ my: 2 }} />

//         {/* Lines */}
//         {fields.map((field, idx) => (
//           <Stack
//             key={field.id}
//             direction={{ xs: "column", md: "row" }}
//             spacing={2}
//             alignItems="center"
//             sx={{ mb: 2 }}
//           >
//             {/* Account */}
//             <Controller
//               name={`lines.${idx}.account`}
//               control={control}
//               render={({ field }) => (
//                 <FormControl fullWidth>
//                   <InputLabel>Account</InputLabel>
//                   <Select {...field} label="Account">
//                     <MenuItem value={0}>Choose Account</MenuItem>
//                     {(accounts || []).map((a) => (
//                       <MenuItem value={a.id} key={a.id}>
//                         {a.name} ({a.accountCode})
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               )}
//             />

//             <TextField
//               label="Debit"
//               type="number"
//               fullWidth
//               {...register(`lines.${idx}.debit`)}
//             />

//             <TextField
//               label="Credit"
//               type="number"
//               fullWidth
//               {...register(`lines.${idx}.credit`)}
//             />

//             {/* description لكل سطر */}
//             <TextField
//               label="Line Description"
//               fullWidth
//               {...register(`lines.${idx}.description`)}
//             />

//             <Controller
//               name={`lines.${idx}.costCenter`}
//               control={control}
//               render={({ field }) => (
//                 <FormControl fullWidth>
//                   <InputLabel>Cost Center</InputLabel>
//                   <Select {...field} label="Cost Center">
//                     <MenuItem value={0}>Cost Center</MenuItem>
//                     {(costCenters || []).map((c) => (
//                       <MenuItem key={c.id} value={c.id}>
//                         {c.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               )}
//             />

//             <Button
//               size="small"
//               variant="outlined"
//               color="error"
//               onClick={() => remove(idx)}
//             >
//               <Delete />
//             </Button>
//           </Stack>
//         ))}

//         {/* Buttons */}
//         <Stack direction="row" spacing={2}>
//           <Button
//             variant="outlined"
//             onClick={() =>
//               append({
//                 account: 0,
//                 debit: 0,
//                 credit: 0,
//                 costCenter: 0,
//                 description: "",
//               })
//             }
//           >
//             Add line
//           </Button>

//           <Button type="submit" variant="contained" disabled={isLoading}>
//             Save
//           </Button>
//         </Stack>
//       </form>
//     </Box>
//   );
// }






// "use client";
// import React from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import {
//   Box,
//   TextField,
//   Button,
//   FormControl,
//   Select,
//   MenuItem,
//   Typography,
//   Stack,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
// } from "@mui/material";
// import { useGetAccountsQuery } from "@/redux/slices/api/accountsApiSlice";
// import { useGetCostCentersQuery } from "@/redux/slices/api/CostCentersApiSlice";
// import { useCreateJournalEntryMutation } from "@/redux/slices/api/journalEntryApiSlice";
// import toast from "react-hot-toast";
// import DeleteIcon from "@mui/icons-material/Delete";

// export function JournalEntryForm() {
//   const { data: accounts } = useGetAccountsQuery();
//   const { data: costCenters } = useGetCostCentersQuery();
//   const [createJournal, { isLoading }] = useCreateJournalEntryMutation();

//   const { control, handleSubmit, register, reset } = useForm({
//     defaultValues: {
//       date: new Date().toISOString().slice(0, 10),
//       description: "",
//       lines: [
//         {
//           account: 0,
//           debit: 0,
//           credit: 0,
//           costCenter: 0,
//           description: "",
//         },
//       ],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "lines",
//   });

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const onSubmit = async (data: any) => {
//     const body = {
//       date: data.date,
//       description: data.description,
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       lines: data.lines.map((e: any) => ({
//         account: e.account,
//         debit: Number(e.debit || 0),
//         credit: Number(e.credit || 0),
//         costCenter: e.costCenter || null,
//         description: e.description,
//       })),
//     };

//     try {
//       await createJournal(body).unwrap();
//       toast.success("Journal entry created");

//       reset({
//         date: new Date().toISOString().slice(0, 10),
//         description: "",
//         lines: [
//           {
//             account: 0,
//             debit: 0,
//             credit: 0,
//             costCenter: 0,
//             description: "",
//           },
//         ],
//       });
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//       toast.error("Create failed: " + (err?.data?.message || err.message));
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
//       <Typography variant="h6" gutterBottom>
//         Create Journal Entry
//       </Typography>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         {/* Header */}
//         <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
//           {/* <TextField
//             size="small"
//             label="Date"
//             type="date"
//             fullWidth
//             {...register("date")}
//             InputLabelProps={{ shrink: true }}
//           /> */}

//                  <TextField
//             size="small"
//             label="Date"
//             type="date"
//             fullWidth
//             {...register("date")}
//             slotProps={{ inputLabel: { shrink: true } }}
//             sx={{
//               '& input[type="date"]::-webkit-calendar-picker-indicator': {
//                 filter: (theme) =>
//                   theme.palette.mode === "dark" ? "invert(1)" : "invert(0)",
//               },
//             }}
//           />
      

//           <TextField
//             size="small"
//             label="Description"
//             fullWidth
//             {...register("description")}
//           />
//         </Stack>

//         {/* TABLE */}
//         <Paper sx={{ mt: 2, overflowX: "auto" }}>
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Account</TableCell>
//                 <TableCell width={120}>Debit</TableCell>
//                 <TableCell width={120}>Credit</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>Cost Center</TableCell>
//                 <TableCell align="center">Action</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {fields.map((field, idx) => (
//                 <TableRow key={field.id}>
//                   {/* Account */}
//                   <TableCell>
//                     <Controller
//                       name={`lines.${idx}.account`}
//                       control={control}
//                       render={({ field }) => (
//                         <FormControl fullWidth size="small">
//                           <Select {...field}>
//                             <MenuItem value={0}>Choose Account</MenuItem>
//                             {(accounts || []).map((a) => (
//                               <MenuItem key={a.id} value={a.id}>
//                                 {a.name} ({a.accountCode})
//                               </MenuItem>
//                             ))}
//                           </Select>
//                         </FormControl>
//                       )}
//                     />
//                   </TableCell>

//                   {/* Debit */}
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       type="number"
//                       fullWidth
//                       {...register(`lines.${idx}.debit`)}
//                     />
//                   </TableCell>

//                   {/* Credit */}
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       type="number"
//                       fullWidth
//                       {...register(`lines.${idx}.credit`)}
//                     />
//                   </TableCell>

//                   {/* Description */}
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       fullWidth
//                       {...register(`lines.${idx}.description`)}
//                     />
//                   </TableCell>

//                   {/* Cost Center */}
//                   <TableCell>
//                     <Controller
//                       name={`lines.${idx}.costCenter`}
//                       control={control}
//                       render={({ field }) => (
//                         <FormControl fullWidth size="small">
//                           <Select {...field}>
//                             <MenuItem value={0}>None</MenuItem>
//                             {(costCenters || []).map((c) => (
//                               <MenuItem key={c.id} value={c.id}>
//                                 {c.name}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                         </FormControl>
//                       )}
//                     />
//                   </TableCell>

//                   {/* Delete */}
//                   <TableCell align="center">
//                     <Button
//                       size="small"
//                       color="error"
//                       onClick={() => remove(idx)}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Paper>

//         {/* Buttons */}
//         <Stack direction="row" spacing={2} mt={2}>
//           <Button
//             size="small"
//             variant="outlined"
//             onClick={() =>
//               append({
//                 account: 0,
//                 debit: 0,
//                 credit: 0,
//                 costCenter: 0,
//                 description: "",
//               })
//             }
//           >
//             + Add Line
//           </Button>

//           <Button
//             size="small"
//             type="submit"
//             variant="contained"
//             disabled={isLoading}
//           >
//             Save Entry
//           </Button>
//         </Stack>
//       </form>
//     </Box>
//   );
// }







"use client";
import React from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Stack,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  DeleteOutlineRounded,
  AddRounded,
  SaveOutlined,
  RefreshOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";
import { useGetAccountsQuery } from "@/redux/slices/api/accountsApiSlice";
import { useGetCostCentersQuery } from "@/redux/slices/api/CostCentersApiSlice";
import { useCreateJournalEntryMutation } from "@/redux/slices/api/journalEntryApiSlice";
import toast from "react-hot-toast";
import { IAccount } from "@/types/Account";
import { ICostCenter } from "@/types/costCenters";

// ─── types ────────────────────────────────────────────────────────────────────
interface JournalLine {
  account: number;
  debit: number;
  credit: number;
  costCenter: number;
  description: string;
}
interface JournalFormValues {
  date: string;
  description: string;
  lines: JournalLine[];
}

const EMPTY_LINE: JournalLine = {
  account: 0,
  debit: 0,
  credit: 0,
  costCenter: 0,
  description: "",
};

const DEFAULT_VALUES: JournalFormValues = {
  date: new Date().toISOString().slice(0, 10),
  description: "",
  lines: [{ ...EMPTY_LINE }, { ...EMPTY_LINE }],
};

// ─── helper ───────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Balance bar ──────────────────────────────────────────────────────────────
function BalanceBar({
  totalDebit,
  totalCredit,
}: {
  totalDebit: number;
  totalCredit: number;
}) {
  const diff = Math.abs(totalDebit - totalCredit);
  const balanced = diff < 0.001;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 1.5,
        mb: 1.5,
        borderRadius: 2,
        bgcolor: "action.hover",
        border: "1px solid",
        borderColor: "divider",
        borderLeft: "3px solid",
        borderLeftColor: balanced ? "success.main" : "error.main",
      }}
    >
      {/* Debit */}
      <Box>
        <Typography
          variant="caption"
          sx={{ display: "block", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}
        >
          Total debit
        </Typography>
        <Typography variant="body1" fontWeight={500} color="primary.main" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {fmt(totalDebit)}
        </Typography>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Credit */}
      <Box>
        <Typography
          variant="caption"
          sx={{ display: "block", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}
        >
          Total credit
        </Typography>
        <Typography variant="body1" fontWeight={500} color="success.main" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {fmt(totalCredit)}
        </Typography>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Difference */}
      <Box>
        <Typography
          variant="caption"
          sx={{ display: "block", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}
        >
          Difference
        </Typography>
        <Typography
          variant="body1"
          fontWeight={500}
          color={balanced ? "text.secondary" : "error.main"}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {fmt(diff)}
        </Typography>
      </Box>

      {/* Status badge */}
      <Box sx={{ ml: "auto" }}>
        <Chip
          label={balanced ? "Balanced" : "Out of balance"}
          size="small"
          sx={{
            fontSize: 11,
            fontWeight: 600,
            bgcolor: balanced ? "success.50" : "error.50",
            color: balanced ? "success.dark" : "error.dark",
            border: "none",
          }}
        />
      </Box>
    </Box>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function JournalEntryForm() {
  const { data: accounts } = useGetAccountsQuery();
  const { data: costCenters } = useGetCostCentersQuery();
  const [createJournal, { isLoading }] = useCreateJournalEntryMutation();

  const { control, handleSubmit, register, reset, watch } =
    useForm<JournalFormValues>({ defaultValues: DEFAULT_VALUES });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });

  // Live totals
  const lines = useWatch({ control, name: "lines" });
  const totalDebit = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001;

  // ── Submit ──────────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    const body = {
      date: data.date,
      description: data.description,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lines: data.lines.map((e: any) => ({
        account: e.account,
        debit: Number(e.debit || 0),
        credit: Number(e.credit || 0),
        costCenter: e.costCenter || null,
        description: e.description,
      })),
    };

    try {
      await createJournal(body).unwrap();
      toast.success("Journal entry created successfully");
      reset(DEFAULT_VALUES);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error("Failed to save: " + (err?.data?.message || err.message));
    }
  };

  // ── Header labels helper ────────────────────────────────────────────────────
  const headerSx = {
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    color: "text.secondary",
    py: 1.25,
    whiteSpace: "nowrap" as const,
    bgcolor: "action.hover",
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 3 } }}>
      <form onSubmit={handleSubmit(onSubmit)}>

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
              <ReceiptLongOutlined sx={{ color: "primary.main", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={500}>
                New journal entry
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Double-entry bookkeeping
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshOutlined />}
              onClick={() => reset(DEFAULT_VALUES)}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Reset
            </Button>
            <Button
              size="small"
              type="submit"
              variant="contained"
              startIcon={<SaveOutlined />}
              disabled={isLoading || !isBalanced}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
            >
              {isLoading ? "Saving…" : "Save entry"}
            </Button>
          </Stack>
        </Box>

        {/* ── Entry Details ── */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 1,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "text.secondary",
          }}
        >
          Entry details
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
          {/* Date */}
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
              Date
            </Typography>
            <TextField
              type="date"
              size="small"
              {...register("date")}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{
                width: 180,
                "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" },
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  filter: (theme) =>
                    theme.palette.mode === "dark" ? "invert(1)" : "invert(0)",
                },
              }}
            />
          </Box>

          {/* Description */}
          <Box sx={{ flex: 1 }}>
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
              Description
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="e.g. Monthly rent payment — January 2025"
              {...register("description")}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" } }}
            />
          </Box>
        </Stack>

        {/* ── Balance Bar ── */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 1,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "text.secondary",
          }}
        >
          Journal lines
        </Typography>

        <BalanceBar totalDebit={totalDebit} totalCredit={totalCredit} />

        {/* ── Lines Table ── */}
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}>
          {/* Table toolbar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.25,
              bgcolor: "action.hover",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                Lines
              </Typography>
              <Chip
                label={`${fields.length} ${fields.length === 1 ? "line" : "lines"}`}
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
            </Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddRounded />}
              onClick={() => append({ ...EMPTY_LINE })}
              sx={{ textTransform: "none", borderRadius: 1.5, fontSize: 12 }}
            >
              Add line
            </Button>
          </Box>

          <Table size="small" sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerSx, width: 36 }}>#</TableCell>
                <TableCell sx={{ ...headerSx, width: "28%" }}>Account</TableCell>
                <TableCell sx={{ ...headerSx, width: "11%", textAlign: "right" }}>Debit</TableCell>
                <TableCell sx={{ ...headerSx, width: "11%", textAlign: "right" }}>Credit</TableCell>
                <TableCell sx={{ ...headerSx, width: "22%" }}>Description</TableCell>
                <TableCell sx={{ ...headerSx, width: "18%" }}>Cost center</TableCell>
                <TableCell sx={{ ...headerSx, width: 44 }} />
              </TableRow>
            </TableHead>

            <TableBody>
              {fields.map((field, idx) => (
                <TableRow key={field.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>

                  {/* Row number */}
                  <TableCell sx={{ fontSize: 11, color: "text.secondary", textAlign: "center" }}>
                    {idx + 1}
                  </TableCell>

                  {/* Account */}
                  <TableCell>
                    <Controller
                      name={`lines.${idx}.account`}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <Select
                            {...field}
                            sx={{
                              fontSize: 12,
                              borderRadius: 1.5,
                              bgcolor: "background.paper",
                            }}
                          >
                            <MenuItem value={0}>
                              <Typography color="text.secondary" fontSize={12}>
                                Choose account…
                              </Typography>
                            </MenuItem>
                            {(accounts || []).map((a: IAccount) => (
                              <MenuItem key={a.id} value={a.id} sx={{ fontSize: 12 }}>
                                {a.name}{" "}
                                <Typography component="span" variant="caption" color="text.secondary" ml={0.5}>
                                  ({a.accountCode})
                                </Typography>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </TableCell>

                  {/* Debit */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      fullWidth
                      placeholder="0.00"
                      inputProps={{ min: 0, step: 0.01, style: { textAlign: "right", fontSize: 12 } }}
                      {...register(`lines.${idx}.debit`)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" } }}
                    />
                  </TableCell>

                  {/* Credit */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      fullWidth
                      placeholder="0.00"
                      inputProps={{ min: 0, step: 0.01, style: { textAlign: "right", fontSize: 12 } }}
                      {...register(`lines.${idx}.credit`)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" } }}
                    />
                  </TableCell>

                  {/* Line description */}
                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Line note…"
                      inputProps={{ style: { fontSize: 12 } }}
                      {...register(`lines.${idx}.description`)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "background.paper" } }}
                    />
                  </TableCell>

                  {/* Cost Center */}
                  <TableCell>
                    <Controller
                      name={`lines.${idx}.costCenter`}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <Select
                            {...field}
                            sx={{
                              fontSize: 12,
                              borderRadius: 1.5,
                              bgcolor: "background.paper",
                            }}
                          >
                            <MenuItem value={0} sx={{ fontSize: 12, color: "text.secondary" }}>
                              None
                            </MenuItem>
                            {(costCenters || []).map((c: ICostCenter) => (
                              <MenuItem key={c.id} value={c.id} sx={{ fontSize: 12 }}>
                                {c.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </TableCell>

                  {/* Delete */}
                  <TableCell align="center">
                    <Tooltip title="Remove line">
                      <IconButton
                        size="small"
                        onClick={() => remove(idx)}
                        disabled={fields.length <= 1}
                        sx={{
                          border: "0.5px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                          "&:hover": { bgcolor: "error.50", borderColor: "error.light" },
                          "&:hover svg": { color: "error.main" },
                        }}
                      >
                        <DeleteOutlineRounded sx={{ fontSize: 16, color: "text.secondary" }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            {/* Totals footer */}
            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={2}
                  sx={{ bgcolor: "action.hover", fontSize: 11, color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", py: 1.25 }}
                >
                  Period totals
                </TableCell>
                <TableCell align="right" sx={{ bgcolor: "action.hover", py: 1.25 }}>
                  <Typography fontSize={13} fontWeight={600} color="primary.main" sx={{ fontVariantNumeric: "tabular-nums" }}>
                    {fmt(totalDebit)}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ bgcolor: "action.hover", py: 1.25 }}>
                  <Typography fontSize={13} fontWeight={600} color="success.main" sx={{ fontVariantNumeric: "tabular-nums" }}>
                    {fmt(totalCredit)}
                  </Typography>
                </TableCell>
                <TableCell colSpan={3} sx={{ bgcolor: "action.hover" }} />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>

        {/* ── Bottom Actions ── */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddRounded />}
            onClick={() => append({ ...EMPTY_LINE })}
            sx={{ textTransform: "none", borderRadius: 1.5 }}
          >
            Add line
          </Button>

          <Stack direction="row" spacing={1.5}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshOutlined />}
              onClick={() => reset(DEFAULT_VALUES)}
              sx={{ textTransform: "none", borderRadius: 1.5 }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveOutlined />}
              disabled={isLoading || !isBalanced}
              sx={{
                textTransform: "none",
                borderRadius: 1.5,
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
            >
              {isLoading ? "Saving…" : "Save entry"}
            </Button>
          </Stack>
        </Stack>

      </form>
    </Box>
  );
}
