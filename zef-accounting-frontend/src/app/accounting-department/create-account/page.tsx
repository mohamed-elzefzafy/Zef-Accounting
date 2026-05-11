// 'use client';

// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   MenuItem,
//   Button,
//   Paper,
//   Breadcrumbs,
//   Link,
//   Chip,
//   Alert,
//   CircularProgress,
//   Divider,
//   Stack,
//   InputAdornment,
//   Tooltip,
//   IconButton,
//   Fade,
// } from '@mui/material';
// import {
//   AccountTree,
//   NavigateNext,
//   Info,
//   CheckCircleOutline,
//   AccountBalance,
// } from '@mui/icons-material';
// import { useForm, Controller } from 'react-hook-form';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

// // ─── RTK Query (stub — استبدلها بـ slice الحقيقي) ───────────────────────────
// // import { useGetAccountsQuery, useCreateAccountMutation } from '@/store/api/accountsApi';

// // ─── Types ────────────────────────────────────────────────────────────────────
// export enum AccountType {
//   Asset = 'asset',
//   Liability = 'liability',
//   Equity = 'equity',
//   Revenue = 'revenue',
//   Expense = 'expense',
// }

// interface Account {
//   id: number;
//   name: string;
//   accountCode: string;
//   type: AccountType;
//   isMain: boolean;
//   isSub: boolean;
// }

// interface CreateAccountFormValues {
//   name: string;
//   type: AccountType | '';
//   parentId: number | '';
// }

// // ─── Mock data (استبدلها بـ RTK Query) ───────────────────────────────────────
// const mockAccounts: Account[] = [
//   { id: 1, name: 'Asset', accountCode: '1000', type: AccountType.Asset, isMain: true, isSub: false },
//   { id: 2, name: 'Liability', accountCode: '2000', type: AccountType.Liability, isMain: true, isSub: false },
//   { id: 3, name: 'Equity', accountCode: '3000', type: AccountType.Equity, isMain: true, isSub: false },
//   { id: 4, name: 'Revenue', accountCode: '4000', type: AccountType.Revenue, isMain: true, isSub: false },
//   { id: 5, name: 'Expense', accountCode: '5000', type: AccountType.Expense, isMain: true, isSub: false },
//   { id: 6, name: 'Cash', accountCode: '1000.1', type: AccountType.Asset, isMain: false, isSub: true },
//   { id: 7, name: 'Accounts Receivable', accountCode: '1000.2', type: AccountType.Asset, isMain: false, isSub: true },
//   { id: 8, name: 'Sales Revenue', accountCode: '4000.1', type: AccountType.Revenue, isMain: false, isSub: true },
// ];

// // ─── Theme ────────────────────────────────────────────────────────────────────
// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: { main: '#1B3A6B', light: '#2A5298', dark: '#0F2444' },
//     secondary: { main: '#C9A84C', light: '#E8C96A', dark: '#9A7B2E' },
//     background: { default: '#F0F2F5', paper: '#FFFFFF' },
//     success: { main: '#2E7D32' },
//     error: { main: '#C62828' },
//     text: { primary: '#1A1A2E', secondary: '#5A6478' },
//   },
//   typography: {
//     fontFamily: '"IBM Plex Sans", "Cairo", sans-serif',
//     h4: { fontWeight: 700, letterSpacing: '-0.5px' },
//     h6: { fontWeight: 600 },
//   },
//   shape: { borderRadius: 8 },
//   components: {
//     MuiTextField: {
//       defaultProps: { variant: 'outlined', size: 'medium' },
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-root': {
//             borderRadius: 8,
//             transition: 'box-shadow 0.2s',
//             '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2A5298' },
//             '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(27,58,107,0.12)' },
//             '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1B3A6B' },
//           },
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: { borderRadius: 8, textTransform: 'none', fontWeight: 600, letterSpacing: '0.2px' },
//         containedPrimary: {
//           background: 'linear-gradient(135deg, #1B3A6B 0%, #2A5298 100%)',
//           boxShadow: '0 4px 14px rgba(27,58,107,0.3)',
//           '&:hover': { boxShadow: '0 6px 20px rgba(27,58,107,0.4)' },
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: { borderRadius: 12 },
//       },
//     },
//   },
// });

// // ─── Account Type Config ──────────────────────────────────────────────────────
// const accountTypeConfig: Record<AccountType, { label: string; color: string; bg: string; code: string; description: string }> = {
//   [AccountType.Asset]:     { label: 'Asset — أصول',     color: '#1B3A6B', bg: '#EBF0FA', code: '1XXX', description: 'Resources owned by the business' },
//   [AccountType.Liability]: { label: 'Liability — خصوم', color: '#7B1FA2', bg: '#F3E5F5', code: '2XXX', description: 'Obligations owed to others' },
//   [AccountType.Equity]:    { label: 'Equity — حقوق الملكية', color: '#00695C', bg: '#E0F2F1', code: '3XXX', description: "Owner's interest in the business" },
//   [AccountType.Revenue]:   { label: 'Revenue — إيرادات',  color: '#2E7D32', bg: '#E8F5E9', code: '4XXX', description: 'Income from business operations' },
//   [AccountType.Expense]:   { label: 'Expense — مصروفات',  color: '#C62828', bg: '#FFEBEE', code: '5XXX', description: 'Costs incurred in operations' },
// };

// // ─── Preview Card ─────────────────────────────────────────────────────────────
// function AccountPreview({ values, parentAccount }: { values: CreateAccountFormValues; parentAccount: Account | undefined }) {
//   if (!values.name && !values.type) return null;

//   const typeConf = values.type ? accountTypeConfig[values.type as AccountType] : null;
//   const previewCode = parentAccount
//     ? `${parentAccount.accountCode}.X`
//     : values.type ? `${accountTypeConfig[values.type as AccountType].code}` : '—';

//   return (
//     <Fade in>
//       <Paper
//         elevation={0}
//         sx={{
//           border: '1.5px solid',
//           borderColor: typeConf ? typeConf.color : 'divider',
//           borderRadius: 2,
//           overflow: 'hidden',
//         }}
//       >
//         <Box sx={{ px: 2, py: 1.2, bgcolor: typeConf?.bg ?? 'grey.50', display: 'flex', alignItems: 'center', gap: 1 }}>
//           <AccountBalance sx={{ fontSize: 16, color: typeConf?.color ?? 'text.secondary' }} />
//           <Typography variant="caption" fontWeight={700} sx={{ color: typeConf?.color, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
//             Preview
//           </Typography>
//         </Box>
//         <Box sx={{ px: 2.5, py: 2 }}>
//           <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
//             <Box>
//               <Typography variant="h6" sx={{ color: 'text.primary', lineHeight: 1.3 }}>
//                 {values.name || '—'}
//               </Typography>
//               {parentAccount && (
//                 <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//                   Sub-account of: <strong>{parentAccount.name}</strong>
//                 </Typography>
//               )}
//             </Box>
//             <Chip
//               label={previewCode}
//               size="small"
//               sx={{
//                 bgcolor: typeConf?.bg,
//                 color: typeConf?.color,
//                 fontWeight: 700,
//                 fontFamily: 'monospace',
//                 fontSize: '0.8rem',
//                 border: `1px solid ${typeConf?.color ?? '#ccc'}`,
//               }}
//             />
//           </Stack>
//           {typeConf && (
//             <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//               <Chip label={typeConf.label} size="small" sx={{ bgcolor: typeConf.bg, color: typeConf.color, fontWeight: 500, fontSize: '0.75rem' }} />
//               <Chip label="Sub-account" size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
//             </Box>
//           )}
//         </Box>
//       </Paper>
//     </Fade>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function CreateAccountPage() {
//   const [successMsg, setSuccessMsg] = useState('');
//   const [errorMsg, setErrorMsg] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // RTK Query hooks (uncomment when using real API):
//   // const { data: accountsData, isLoading: accountsLoading } = useGetAccountsQuery();
//   // const [createAccount, { isLoading }] = useCreateAccountMutation();
//   const accounts = mockAccounts;

//   const {
//     control,
//     handleSubmit,
//     watch,
//     reset,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm<CreateAccountFormValues>({
//     defaultValues: { name: '', type: '', parentId: '' },
//   });

//   const watchedType = watch('type');
//   const watchedParentId = watch('parentId');
//   const watchedValues = watch();

//   // Auto-set type when parent is selected
//   useEffect(() => {
//     if (watchedParentId) {
//       const parent = accounts.find((a) => a.id === watchedParentId);
//       if (parent) setValue('type', parent.type);
//     }
//   }, [watchedParentId, accounts, setValue]);

//   const filteredParents = watchedType
//     ? accounts.filter((a) => a.type === watchedType)
//     : accounts;

//   const selectedParent = accounts.find((a) => a.id === watchedParentId);

//   const onSubmit = async (data: CreateAccountFormValues) => {
//     setErrorMsg('');
//     setSuccessMsg('');
//     setIsLoading(true);
//     try {
//       // Replace with: await createAccount({ name: data.name, type: data.type, parentId: data.parentId }).unwrap();
//       await new Promise((r) => setTimeout(r, 900)); // mock delay
//       setSuccessMsg(`Account "${data.name}" created successfully!`);
//       reset();
//     } catch {
//       setErrorMsg('Failed to create account. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, sm: 3, md: 4 } }}>
//         {/* Header */}
//         <Box sx={{ mb: 4 }}>
//           <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 1.5 }}>
//             <Link href="#" underline="hover" color="text.secondary" sx={{ fontSize: '0.85rem' }}>Dashboard</Link>
//             <Link href="#" underline="hover" color="text.secondary" sx={{ fontSize: '0.85rem' }}>Chart of Accounts</Link>
//             <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>New Account</Typography>
//           </Breadcrumbs>

//           <Stack direction="row" alignItems="center" gap={2}>
//             <Box
//               sx={{
//                 width: 48, height: 48, borderRadius: 2,
//                 background: 'linear-gradient(135deg, #1B3A6B 0%, #2A5298 100%)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 boxShadow: '0 4px 14px rgba(27,58,107,0.3)',
//               }}
//             >
//               <AccountTree sx={{ color: '#fff', fontSize: 24 }} />
//             </Box>
//             <Box>
//               <Typography variant="h4" color="text.primary">Create New Account</Typography>
//               <Typography variant="body2" color="text.secondary">Add a sub-account to your chart of accounts</Typography>
//             </Box>
//           </Stack>
//         </Box>

//         <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' }, gap: 3, alignItems: 'start' }}>
//           {/* ── Form ── */}
//           <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2.5, sm: 3.5 } }}>
//             <Typography variant="h6" sx={{ mb: 0.5 }}>Account Information</Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//               Fill in the details below. All accounts require a parent.
//             </Typography>
//             <Divider sx={{ mb: 3 }} />

//             {successMsg && (
//               <Fade in>
//                 <Alert
//                   severity="success"
//                   icon={<CheckCircleOutline />}
//                   sx={{ mb: 3, borderRadius: 2 }}
//                   onClose={() => setSuccessMsg('')}
//                 >
//                   {successMsg}
//                 </Alert>
//               </Fade>
//             )}
//             {errorMsg && (
//               <Fade in>
//                 <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMsg('')}>
//                   {errorMsg}
//                 </Alert>
//               </Fade>
//             )}

//             <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
//               <Stack spacing={3}>
//                 {/* Account Name */}
//                 <Box>
//                   <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, color: 'text.primary' }}>
//                     Account Name <span style={{ color: '#C62828' }}>*</span>
//                   </Typography>
//                   <Controller
//                     name="name"
//                     control={control}
//                     rules={{
//                       required: 'Account name is required',
//                       minLength: { value: 2, message: 'Name must be at least 2 characters' },
//                     }}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         fullWidth
//                         placeholder="e.g. Cash on Hand"
//                         error={!!errors.name}
//                         helperText={errors.name?.message}
//                         InputProps={{
//                           startAdornment: (
//                             <InputAdornment position="start">
//                               <AccountBalance sx={{ fontSize: 18, color: 'text.secondary' }} />
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     )}
//                   />
//                 </Box>

//                 {/* Account Type */}
//                 <Box>
//                   <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 0.8 }}>
//                     <Typography variant="body2" fontWeight={600} color="text.primary">
//                       Account Type <span style={{ color: '#C62828' }}>*</span>
//                     </Typography>
//                     <Tooltip title="Type is locked to match the parent account" arrow>
//                       <IconButton size="small" sx={{ p: 0.3 }}>
//                         <Info sx={{ fontSize: 15, color: 'text.secondary' }} />
//                       </IconButton>
//                     </Tooltip>
//                   </Stack>
//                   <Controller
//                     name="type"
//                     control={control}
//                     rules={{ required: 'Account type is required' }}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         select
//                         fullWidth
//                         error={!!errors.type}
//                         helperText={errors.type?.message}
//                         disabled={!!watchedParentId}
//                         sx={{
//                           '& .MuiSelect-select': {
//                             display: 'flex', alignItems: 'center', gap: 1,
//                           },
//                         }}
//                       >
//                         <MenuItem value="" disabled>
//                           <Typography color="text.secondary">Select type…</Typography>
//                         </MenuItem>
//                         {Object.values(AccountType).map((t) => {
//                           const conf = accountTypeConfig[t];
//                           return (
//                             <MenuItem key={t} value={t}>
//                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
//                                 <Box
//                                   sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: conf.color, flexShrink: 0 }}
//                                 />
//                                 <Box sx={{ flex: 1 }}>
//                                   <Typography variant="body2" fontWeight={600}>{conf.label}</Typography>
//                                   <Typography variant="caption" color="text.secondary">{conf.description}</Typography>
//                                 </Box>
//                                 <Chip
//                                   label={conf.code}
//                                   size="small"
//                                   sx={{ fontFamily: 'monospace', fontSize: '0.7rem', bgcolor: conf.bg, color: conf.color, fontWeight: 700 }}
//                                 />
//                               </Box>
//                             </MenuItem>
//                           );
//                         })}
//                       </TextField>
//                     )}
//                   />
//                   {watchedParentId && (
//                     <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
//                       Type is locked to match the selected parent account.
//                     </Typography>
//                   )}
//                 </Box>

//                 {/* Parent Account */}
//                 <Box>
//                   <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 0.8 }}>
//                     <Typography variant="body2" fontWeight={600} color="text.primary">
//                       Parent Account <span style={{ color: '#C62828' }}>*</span>
//                     </Typography>
//                     <Tooltip title="Sub-accounts inherit the type from their parent" arrow>
//                       <IconButton size="small" sx={{ p: 0.3 }}>
//                         <Info sx={{ fontSize: 15, color: 'text.secondary' }} />
//                       </IconButton>
//                     </Tooltip>
//                   </Stack>
//                   <Controller
//                     name="parentId"
//                     control={control}
//                     rules={{ required: 'Parent account is required' }}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         select
//                         fullWidth
//                         error={!!errors.parentId}
//                         helperText={errors.parentId?.message ?? (watchedType ? `Showing ${filteredParents.length} accounts of type "${watchedType}"` : undefined)}
//                       >
//                         <MenuItem value="" disabled>
//                           <Typography color="text.secondary">Select parent…</Typography>
//                         </MenuItem>
//                         {filteredParents.map((account) => {
//                           const conf = accountTypeConfig[account.type];
//                           return (
//                             <MenuItem key={account.id} value={account.id}>
//                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
//                                 <Chip
//                                   label={account.accountCode}
//                                   size="small"
//                                   sx={{ fontFamily: 'monospace', fontSize: '0.72rem', bgcolor: conf.bg, color: conf.color, fontWeight: 700, minWidth: 64 }}
//                                 />
//                                 <Box sx={{ flex: 1 }}>
//                                   <Typography variant="body2">{account.name}</Typography>
//                                   <Typography variant="caption" color="text.secondary">
//                                     {account.isMain ? 'Main account' : 'Sub-account'} · {account.type}
//                                   </Typography>
//                                 </Box>
//                               </Box>
//                             </MenuItem>
//                           );
//                         })}
//                       </TextField>
//                     )}
//                   />
//                 </Box>

//                 <Divider />

//                 {/* Actions */}
//                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     size="large"
//                     disabled={isLoading || isSubmitting}
//                     sx={{ flex: 1, height: 48 }}
//                     startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <AccountTree />}
//                   >
//                     {isLoading ? 'Creating…' : 'Create Account'}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outlined"
//                     size="large"
//                     onClick={() => { reset(); setErrorMsg(''); setSuccessMsg(''); }}
//                     sx={{ height: 48, minWidth: 100 }}
//                   >
//                     Reset
//                   </Button>
//                 </Stack>
//               </Stack>
//             </Box>
//           </Paper>

//           {/* ── Right Panel ── */}
//           <Stack spacing={2.5}>
//             {/* Live Preview */}
//             <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2.5 }}>
//               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.72rem' }}>
//                 Live Preview
//               </Typography>
//               <AccountPreview values={watchedValues} parentAccount={selectedParent} />
//               {!watchedValues.name && !watchedValues.type && (
//                 <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
//                   <AccountTree sx={{ fontSize: 36, opacity: 0.25, mb: 1 }} />
//                   <Typography variant="caption">Fill the form to see a preview</Typography>
//                 </Box>
//               )}
//             </Paper>

//             {/* Account Hierarchy Info */}
//             <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2.5 }}>
//               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.72rem' }}>
//                 Chart of Accounts Structure
//               </Typography>
//               <Stack spacing={1}>
//                 {Object.values(AccountType).map((t) => {
//                   const conf = accountTypeConfig[t];
//                   const count = accounts.filter((a) => a.type === t).length;
//                   return (
//                     <Box
//                       key={t}
//                       sx={{
//                         display: 'flex', alignItems: 'center', gap: 1.5,
//                         p: 1.2, borderRadius: 1.5,
//                         bgcolor: watchedType === t ? conf.bg : 'transparent',
//                         border: '1px solid',
//                         borderColor: watchedType === t ? conf.color : 'transparent',
//                         transition: 'all 0.2s',
//                       }}
//                     >
//                       <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: conf.color, flexShrink: 0 }} />
//                       <Typography variant="body2" sx={{ flex: 1, fontWeight: watchedType === t ? 600 : 400 }}>
//                         {conf.label}
//                       </Typography>
//                       <Chip label={count} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: conf.bg, color: conf.color }} />
//                     </Box>
//                   );
//                 })}
//               </Stack>
//             </Paper>

//             {/* Rules */}
//             <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2.5, bgcolor: '#FFFBF0' }}>
//               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: '#9A7B2E', textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.72rem' }}>
//                 Business Rules
//               </Typography>
//               <Stack spacing={0.8}>
//                 {[
//                   'Every account must have a parent.',
//                   "Sub-account type must match the parent's type.",
//                   'Account codes are auto-generated (parent.N).',
//                   'Main accounts (1000–5000) cannot be created manually.',
//                 ].map((rule, i) => (
//                   <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
//                     <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#C9A84C', mt: '6px', flexShrink: 0 }} />
//                     <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>{rule}</Typography>
//                   </Box>
//                 ))}
//               </Stack>
//             </Paper>
//           </Stack>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }




// 'use client';

// import React, { useEffect, useState } from 'react';
// import {
//   Box, Typography, TextField, MenuItem, Button, Paper,
//   Breadcrumbs, Link, Chip, Alert, CircularProgress, Divider,
//   Stack, InputAdornment, Tooltip, IconButton, Fade, Skeleton,
// } from '@mui/material';
// import { AccountTree, NavigateNext, Info, CheckCircleOutline, AccountBalance } from '@mui/icons-material';
// import { useForm, Controller } from 'react-hook-form';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { AccountType, IAccount } from '@/types/Account';
// import { useCreateAccountMutation, useGetAccountsQuery } from '@/redux/slices/api/accountsApiSlice';



// interface CreateAccountFormValues {
//   name:     string;
//   type:     AccountType | '';
//   parentId: number | '';
// }

// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary:    { main: '#1B3A6B', light: '#2A5298', dark: '#0F2444' },
//     secondary:  { main: '#C9A84C' },
//     background: { default: '#F0F2F5', paper: '#FFFFFF' },
//     success:    { main: '#2E7D32' },
//     error:      { main: '#C62828' },
//     text:       { primary: '#1A1A2E', secondary: '#5A6478' },
//   },
//   typography: { fontFamily: '"IBM Plex Sans","Cairo",sans-serif', h4: { fontWeight: 700 }, h6: { fontWeight: 600 } },
//   shape: { borderRadius: 8 },
//   components: {
//     MuiTextField: {
//       defaultProps: { variant: 'outlined', size: 'medium' },
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-root': {
//             borderRadius: 8,
//             '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2A5298' },
//             '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(27,58,107,0.12)' },
//             '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1B3A6B' },
//           },
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
//         containedPrimary: {
//           background: 'linear-gradient(135deg,#1B3A6B 0%,#2A5298 100%)',
//           boxShadow: '0 4px 14px rgba(27,58,107,0.3)',
//           '&:hover': { boxShadow: '0 6px 20px rgba(27,58,107,0.4)' },
//         },
//       },
//     },
//     MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
//   },
// });

// const typeConfig: Record<AccountType, { label: string; color: string; bg: string; code: string; description: string }> = {
//   [AccountType.Asset]:     { label: 'Asset — أصول',          color: '#1B3A6B', bg: '#EBF0FA', code: '1XXX', description: 'Resources owned by the business' },
//   [AccountType.Liability]: { label: 'Liability — خصوم',      color: '#7B1FA2', bg: '#F3E5F5', code: '2XXX', description: 'Obligations owed to others' },
//   [AccountType.Equity]:    { label: 'Equity — حقوق الملكية', color: '#00695C', bg: '#E0F2F1', code: '3XXX', description: "Owner's interest" },
//   [AccountType.Revenue]:   { label: 'Revenue — إيرادات',     color: '#2E7D32', bg: '#E8F5E9', code: '4XXX', description: 'Income from operations' },
//   [AccountType.Expense]:   { label: 'Expense — مصروفات',     color: '#C62828', bg: '#FFEBEE', code: '5XXX', description: 'Costs incurred' },
// };

// function AccountPreview({ values, parent }: { values: CreateAccountFormValues; parent?: IAccount }) {
//   if (!values.name && !values.type) return null;
//   const conf    = values.type ? typeConfig[values.type as AccountType] : null;
//   const preview = parent ? `${parent.accountCode}.X` : conf?.code ?? '—';
//   return (
//     <Fade in>
//       <Paper elevation={0} sx={{ border: '1.5px solid', borderColor: conf?.color ?? 'divider', borderRadius: 2, overflow: 'hidden' }}>
//         <Box sx={{ px: 2, py: 1.2, bgcolor: conf?.bg ?? 'grey.50', display: 'flex', alignItems: 'center', gap: 1 }}>
//           <AccountBalance sx={{ fontSize: 16, color: conf?.color ?? 'text.secondary' }} />
//           <Typography variant="caption" fontWeight={700} sx={{ color: conf?.color, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Preview</Typography>
//         </Box>
//         <Box sx={{ px: 2.5, py: 2 }}>
//           <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
//             <Box>
//               <Typography variant="h6" sx={{ lineHeight: 1.3 }}>{values.name || '—'}</Typography>
//               {parent && <Typography variant="caption" color="text.secondary">Sub-account of: <strong>{parent.name}</strong></Typography>}
//             </Box>
//             <Chip label={preview} size="small" sx={{ bgcolor: conf?.bg, color: conf?.color, fontWeight: 700, fontFamily: 'monospace', border: `1px solid ${conf?.color ?? '#ccc'}` }} />
//           </Stack>
//           {conf && (
//             <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
//               <Chip label={conf.label} size="small" sx={{ bgcolor: conf.bg, color: conf.color, fontWeight: 500, fontSize: '0.75rem' }} />
//               <Chip label="Sub-account" size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
//             </Box>
//           )}
//         </Box>
//       </Paper>
//     </Fade>
//   );
// }

// export default function CreateAccountPage() {
//   const [successMsg, setSuccessMsg] = useState('');

//   const { data: accounts = [], isLoading: accountsLoading, isError: accountsError } = useGetAccountsQuery();
//   const [createAccount, { isLoading: creating, error: createError }] = useCreateAccountMutation();

//   const { control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<CreateAccountFormValues>({
//     defaultValues: { name: '', type: '', parentId: '' },
//   });

//   const watchedType     = watch('type');
//   const watchedParentId = watch('parentId');
//   const watchedValues   = watch();

//   useEffect(() => {
//     if (watchedParentId) {
//       const p = accounts.find((a) => a.id === watchedParentId);
//       if (p) setValue('type', p.type);
//     }
//   }, [watchedParentId, accounts, setValue]);

//   const filteredParents = watchedType ? accounts.filter((a) => a.type === watchedType) : accounts;
//   const selectedParent  = accounts.find((a) => a.id === watchedParentId);
//   const apiErrorMsg     = createError
//     ? (createError as { data?: { message?: string } })?.data?.message ?? 'Something went wrong.'
//     : '';

//   const onSubmit = async (data: CreateAccountFormValues) => {
//     setSuccessMsg('');
//     try {
//       const result = await createAccount({
//         name:     data.name,
//         type:     data.type as AccountType,
//         parentId: Number(data.parentId),
//       }).unwrap();
//       setSuccessMsg(`Account "${result.name}" (${result.accountCode}) created successfully!`);
//       reset();
//     } catch { /* apiErrorMsg handles display */ }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, sm: 3, md: 4 } }}>
//         <Box sx={{ mb: 4 }}>
//           <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 1.5 }}>
//             <Link href="#" underline="hover" color="text.secondary" sx={{ fontSize: '0.85rem' }}>Dashboard</Link>
//             <Link href="#" underline="hover" color="text.secondary" sx={{ fontSize: '0.85rem' }}>Chart of Accounts</Link>
//             <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>New Account</Typography>
//           </Breadcrumbs>
//           <Stack direction="row" alignItems="center" gap={2}>
//             <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'linear-gradient(135deg,#1B3A6B,#2A5298)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(27,58,107,0.3)' }}>
//               <AccountTree sx={{ color: '#fff', fontSize: 24 }} />
//             </Box>
//             <Box>
//               <Typography variant="h4">Create New Account</Typography>
//               <Typography variant="body2" color="text.secondary">Add a sub-account to your chart of accounts</Typography>
//             </Box>
//           </Stack>
//         </Box>

//         <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' }, gap: 3, alignItems: 'start' }}>
//           <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2.5, sm: 3.5 } }}>
//             <Typography variant="h6" sx={{ mb: 0.5 }}>Account Information</Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>All accounts require a parent.</Typography>
//             <Divider sx={{ mb: 3 }} />

//             {successMsg && (
//               <Fade in><Alert severity="success" icon={<CheckCircleOutline />} sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert></Fade>
//             )}
//             {apiErrorMsg && (
//               <Fade in><Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{apiErrorMsg}</Alert></Fade>
//             )}
//             {accountsError && (
//               <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>Could not load accounts. Check API connection.</Alert>
//             )}

//             <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
//               <Stack spacing={3}>
//                 <Box>
//                   <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8 }}>Account Name <span style={{ color: '#C62828' }}>*</span></Typography>
//                   <Controller
//                     name="name" control={control}
//                     rules={{ required: 'Required', minLength: { value: 2, message: 'Min 2 chars' } }}
//                     render={({ field }) => (
//                       <TextField {...field} fullWidth placeholder="e.g. Cash on Hand" error={!!errors.name} helperText={errors.name?.message}
//                         InputProps={{ startAdornment: <InputAdornment position="start"><AccountBalance sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }} />
//                     )}
//                   />
//                 </Box>

//                 <Box>
//                   <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 0.8 }}>
//                     <Typography variant="body2" fontWeight={600}>Account Type <span style={{ color: '#C62828' }}>*</span></Typography>
//                     <Tooltip title="Locked when a parent is selected" arrow><IconButton size="small" sx={{ p: 0.3 }}><Info sx={{ fontSize: 15, color: 'text.secondary' }} /></IconButton></Tooltip>
//                   </Stack>
//                   <Controller
//                     name="type" control={control}
//                     rules={{ required: 'Required' }}
//                     render={({ field }) => (
//                       <TextField {...field} select fullWidth error={!!errors.type} helperText={errors.type?.message} disabled={!!watchedParentId}>
//                         <MenuItem value="" disabled><Typography color="text.secondary">Select type…</Typography></MenuItem>
//                         {Object.values(AccountType).map((t) => {
//                           const c = typeConfig[t];
//                           return (
//                             <MenuItem key={t} value={t}>
//                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
//                                 <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.color, flexShrink: 0 }} />
//                                 <Box sx={{ flex: 1 }}>
//                                   <Typography variant="body2" fontWeight={600}>{c.label}</Typography>
//                                   <Typography variant="caption" color="text.secondary">{c.description}</Typography>
//                                 </Box>
//                                 <Chip label={c.code} size="small" sx={{ fontFamily: 'monospace', fontSize: '0.7rem', bgcolor: c.bg, color: c.color, fontWeight: 700 }} />
//                               </Box>
//                             </MenuItem>
//                           );
//                         })}
//                       </TextField>
//                     )}
//                   />
//                   {watchedParentId && <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>Locked to match parent type.</Typography>}
//                 </Box>

//                 <Box>
//                   <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 0.8 }}>
//                     <Typography variant="body2" fontWeight={600}>Parent Account <span style={{ color: '#C62828' }}>*</span></Typography>
//                     <Tooltip title="Sub-accounts inherit parent type" arrow><IconButton size="small" sx={{ p: 0.3 }}><Info sx={{ fontSize: 15, color: 'text.secondary' }} /></IconButton></Tooltip>
//                   </Stack>
//                   {accountsLoading
//                     ? <Skeleton variant="rounded" height={56} sx={{ borderRadius: 2 }} />
//                     : (
//                       <Controller
//                         name="parentId" control={control}
//                         rules={{ required: 'Required' }}
//                         render={({ field }) => (
//                           <TextField {...field} select fullWidth error={!!errors.parentId}
//                             helperText={errors.parentId?.message ?? (watchedType ? `${filteredParents.length} accounts of type "${watchedType}"` : undefined)}>
//                             <MenuItem value="" disabled><Typography color="text.secondary">Select parent…</Typography></MenuItem>
//                             {filteredParents.map((acc) => {
//                               const c = typeConfig[acc.type];
//                               return (
//                                 <MenuItem key={acc.id} value={acc.id}>
//                                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
//                                     <Chip label={acc.accountCode} size="small" sx={{ fontFamily: 'monospace', fontSize: '0.72rem', bgcolor: c.bg, color: c.color, fontWeight: 700, minWidth: 64 }} />
//                                     <Box sx={{ flex: 1 }}>
//                                       <Typography variant="body2">{acc.name}</Typography>
//                                       <Typography variant="caption" color="text.secondary">{acc.isMain ? 'Main' : 'Sub'} · {acc.type}</Typography>
//                                     </Box>
//                                   </Box>
//                                 </MenuItem>
//                               );
//                             })}
//                           </TextField>
//                         )}
//                       />
//                     )}
//                 </Box>

//                 <Divider />

//                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
//                   <Button type="submit" variant="contained" size="large" disabled={creating || accountsLoading} sx={{ flex: 1, height: 48 }}
//                     startIcon={creating ? <CircularProgress size={18} color="inherit" /> : <AccountTree />}>
//                     {creating ? 'Creating…' : 'Create Account'}
//                   </Button>
//                   <Button type="button" variant="outlined" size="large" onClick={() => reset()} sx={{ height: 48, minWidth: 100 }}>
//                     Reset
//                   </Button>
//                 </Stack>
//               </Stack>
//             </Box>
//           </Paper>

//           <Stack spacing={2.5}>
//             <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2.5 }}>
//               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.72rem' }}>Live Preview</Typography>
//               <AccountPreview values={watchedValues} parent={selectedParent} />
//               {!watchedValues.name && !watchedValues.type && (
//                 <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
//                   <AccountTree sx={{ fontSize: 36, opacity: 0.25, mb: 1 }} />
//                   <Typography variant="caption">Fill the form to see a preview</Typography>
//                 </Box>
//               )}
//             </Paper>

//             <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2.5 }}>
//               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.72rem' }}>Chart of Accounts</Typography>
//               {accountsLoading
//                 ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="rounded" height={40} sx={{ mb: 1, borderRadius: 1.5 }} />)
//                 : Object.values(AccountType).map((t) => {
//                     const c = typeConfig[t];
//                     const count = accounts.filter((a) => a.type === t).length;
//                     return (
//                       <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.2, borderRadius: 1.5, mb: 0.5, bgcolor: watchedType === t ? c.bg : 'transparent', border: '1px solid', borderColor: watchedType === t ? c.color : 'transparent', transition: 'all 0.2s' }}>
//                         <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.color }} />
//                         <Typography variant="body2" sx={{ flex: 1, fontWeight: watchedType === t ? 600 : 400 }}>{c.label}</Typography>
//                         <Chip label={count} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: c.bg, color: c.color }} />
//                       </Box>
//                     );
//                   })}
//             </Paper>

//             <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2.5, bgcolor: '#FFFBF0' }}>
//               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: '#9A7B2E', textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.72rem' }}>Business Rules</Typography>
//               {['Every account must have a parent.', "Sub-account type must match parent's type.", 'Account codes are auto-generated (parent.N).', 'Main accounts (1000–5000) are seeded only.'].map((rule, i) => (
//                 <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 0.8 }}>
//                   <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#C9A84C', mt: '6px', flexShrink: 0 }} />
//                   <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>{rule}</Typography>
//                 </Box>
//               ))}
//             </Paper>
//           </Stack>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }



'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, MenuItem, Button, Paper,
  Breadcrumbs, Link, Chip, Alert, CircularProgress, Divider,
  Stack, InputAdornment, Tooltip, IconButton, Fade, Skeleton, useTheme,
} from '@mui/material';
import { AccountTree, NavigateNext, Info, CheckCircleOutline, AccountBalance } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { AccountType, IAccount } from '@/types/Account';
import { useCreateAccountMutation, useGetAccountsQuery } from '@/redux/slices/api/accountsApiSlice';


// ─── Types ────────────────────────────────────────────────────────────────────
interface CreateAccountFormValues {
  name:     string;
  type:     AccountType | '';
  parentId: number | '';
}

// ─── Type Config — ألوان semantic بدل hardcoded ──────────────────────────────
// الـ bg و color هنحسبهم جوا الـ component باستخدام useTheme
const typeStaticConfig: Record<AccountType, { label: string; description: string; code: string; lightBg: string; darkBg: string; lightColor: string; darkColor: string }> = {
  [AccountType.Asset]:     { label: 'Asset — أصول',          description: 'Resources owned by the business', code: '1XXX', lightBg: '#EBF0FA', darkBg: '#0d1f3c', lightColor: '#1B3A6B', darkColor: '#90aee0' },
  [AccountType.Liability]: { label: 'Liability — خصوم',      description: 'Obligations owed to others',       code: '2XXX', lightBg: '#F3E5F5', darkBg: '#2a0d33', lightColor: '#7B1FA2', darkColor: '#ce93d8' },
  [AccountType.Equity]:    { label: 'Equity — حقوق الملكية', description: "Owner's interest",                 code: '3XXX', lightBg: '#E0F2F1', darkBg: '#003833', lightColor: '#00695C', darkColor: '#4db6ac' },
  [AccountType.Revenue]:   { label: 'Revenue — إيرادات',     description: 'Income from operations',           code: '4XXX', lightBg: '#E8F5E9', darkBg: '#0a2e0d', lightColor: '#2E7D32', darkColor: '#81c784' },
  [AccountType.Expense]:   { label: 'Expense — مصروفات',     description: 'Costs incurred',                   code: '5XXX', lightBg: '#FFEBEE', darkBg: '#330a0a', lightColor: '#C62828', darkColor: '#ef9a9a' },
};

// Hook مساعد يرجع الألوان الصحيحة حسب الـ mode
function useTypeConfig() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return Object.fromEntries(
    Object.entries(typeStaticConfig).map(([k, v]) => [
      k,
      {
        label:       v.label,
        description: v.description,
        code:        v.code,
        bg:          isDark ? v.darkBg   : v.lightBg,
        color:       isDark ? v.darkColor : v.lightColor,
      },
    ])
  ) as Record<AccountType, { label: string; description: string; code: string; bg: string; color: string }>;
}

// ─── Account Preview ──────────────────────────────────────────────────────────
function AccountPreview({ values, parent }: { values: CreateAccountFormValues; parent?: IAccount }) {
  const typeConfig = useTypeConfig();
  const theme      = useTheme();

  if (!values.name && !values.type) return null;
  const conf    = values.type ? typeConfig[values.type as AccountType] : null;
  const preview = parent ? `${parent.accountCode}.X` : conf?.code ?? '—';

  return (
    <Fade in>
      <Paper
        elevation={0}
        sx={{
          border: '1.5px solid',
          borderColor: conf?.color ?? 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ px: 2, py: 1.2, bgcolor: conf?.bg ?? 'action.hover', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalance sx={{ fontSize: 16, color: conf?.color ?? 'text.secondary' }} />
          <Typography variant="caption" fontWeight={700} sx={{ color: conf?.color, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Preview
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, py: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1.3 }}>{values.name || '—'}</Typography>
              {parent && (
                <Typography variant="caption" color="text.secondary">
                  Sub-account of: <strong>{parent.name}</strong>
                </Typography>
              )}
            </Box>
            <Chip
              label={preview}
              size="small"
              sx={{
                bgcolor: conf?.bg,
                color: conf?.color,
                fontWeight: 700,
                fontFamily: 'monospace',
                border: `1px solid ${conf?.color ?? theme.palette.divider}`,
              }}
            />
          </Stack>
          {conf && (
            <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
              <Chip label={conf.label} size="small" sx={{ bgcolor: conf.bg, color: conf.color, fontWeight: 500, fontSize: '0.75rem' }} />
              <Chip label="Sub-account" size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
            </Box>
          )}
        </Box>
      </Paper>
    </Fade>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CreateAccountPage() {
  const theme      = useTheme();
  const typeConfig = useTypeConfig();
  const isDark     = theme.palette.mode === 'dark';

  const [successMsg, setSuccessMsg] = useState('');

  const { data: accounts = [], isLoading: accountsLoading, isError: accountsError } = useGetAccountsQuery();
  const [createAccount, { isLoading: creating, error: createError }] = useCreateAccountMutation();

  const { control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<CreateAccountFormValues>({
    defaultValues: { name: '', type: '', parentId: '' },
  });

  const watchedType     = watch('type');
  const watchedParentId = watch('parentId');
  const watchedValues   = watch();

  useEffect(() => {
    if (watchedParentId) {
      const p = accounts.find((a) => a.id === watchedParentId);
      if (p) setValue('type', p.type);
    }
  }, [watchedParentId, accounts, setValue]);

  const filteredParents = watchedType ? accounts.filter((a) => a.type === watchedType) : accounts;
  const selectedParent  = accounts.find((a) => a.id === watchedParentId);
  const apiErrorMsg     = createError
    ? (createError as { data?: { message?: string } })?.data?.message ?? 'Something went wrong.'
    : '';

  const onSubmit = async (data: CreateAccountFormValues) => {
    console.log("data" , data);
    
    setSuccessMsg('');
    try {
      const result = await createAccount({
        name:     data.name,
        type:     data.type as AccountType,
        parentId: Number(data.parentId),
      }).unwrap();
      setSuccessMsg(`Account "${result.name}" (${result.accountCode}) created successfully!`);
      reset();
    } catch { /* apiErrorMsg handles display */ }
  };

  // ── Derived colors (theme-aware) ──────────────────────────────────────────
  // بدل #FFFBF0 hardcoded — بيتكيف مع dark/light
  const rulesPanelBg    = isDark ? theme.palette.background.paper : '#FFFBF0';
  const rulesAccent     = isDark ? '#e8c96a' : '#C9A84C';
  const requiredColor   = theme.palette.error.main;
  const primaryGradient = `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, sm: 3, md: 4 } }}>

      {/* ── Header ── */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 1.5 }}>
          <Link href="#" underline="hover" color="text.secondary" sx={{ fontSize: '0.85rem' }}>Dashboard</Link>
          <Link href="#" underline="hover" color="text.secondary" sx={{ fontSize: '0.85rem' }}>Chart of Accounts</Link>
          <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>New Account</Typography>
        </Breadcrumbs>
        <Stack direction="row" alignItems="center" gap={2}>
          <Box sx={{ width: 48, height: 48, borderRadius: 2, background: primaryGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${theme.palette.primary.main}55` }}>
            <AccountTree sx={{ color: '#fff', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h4" color="text.primary">Create New Account</Typography>
            <Typography variant="body2" color="text.secondary">Add a sub-account to your chart of accounts</Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' }, gap: 3, alignItems: 'start' }}>

        {/* ── Form Panel ── */}
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2.5, sm: 3.5 } }}>
          <Typography variant="h6" color="text.primary" sx={{ mb: 0.5 }}>Account Information</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>All accounts require a parent.</Typography>
          <Divider sx={{ mb: 3 }} />

          {successMsg && (
            <Fade in>
              <Alert severity="success" icon={<CheckCircleOutline />} sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMsg('')}>
                {successMsg}
              </Alert>
            </Fade>
          )}
          {apiErrorMsg && (
            <Fade in><Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{apiErrorMsg}</Alert></Fade>
          )}
          {accountsError && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>Could not load accounts. Check API connection.</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>

              {/* Name */}
              <Box>
                <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 0.8 }}>
                  Account Name <span style={{ color: requiredColor }}>*</span>
                </Typography>
                <Controller
                  name="name" control={control}
                  rules={{ required: 'Required', minLength: { value: 2, message: 'Min 2 chars' } }}
                  render={({ field }) => (
                    <TextField
                      {...field} fullWidth placeholder="e.g. Cash on Hand"
                      error={!!errors.name} helperText={errors.name?.message}
                      InputProps={{ startAdornment: <InputAdornment position="start"><AccountBalance sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
                    />
                  )}
                />
              </Box>

              {/* Type */}
              <Box>
                <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 0.8 }}>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    Account Type <span style={{ color: requiredColor }}>*</span>
                  </Typography>
                  <Tooltip title="Locked when a parent is selected" arrow>
                    <IconButton size="small" sx={{ p: 0.3 }}><Info sx={{ fontSize: 15, color: 'text.secondary' }} /></IconButton>
                  </Tooltip>
                </Stack>
                <Controller
                  name="type" control={control}
                  rules={{ required: 'Required' }}
                  render={({ field }) => (
                    <TextField {...field} select fullWidth error={!!errors.type} helperText={errors.type?.message} disabled={!!watchedParentId}>
                      <MenuItem value="" disabled><Typography color="text.secondary">Select type…</Typography></MenuItem>
                      {Object.values(AccountType).map((t) => {
                        const c = typeConfig[t];
                        return (
                          <MenuItem key={t} value={t}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.color, flexShrink: 0 }} />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={600} color="text.primary">{c.label}</Typography>
                                <Typography variant="caption" color="text.secondary">{c.description}</Typography>
                              </Box>
                              <Chip label={c.code} size="small" sx={{ fontFamily: 'monospace', fontSize: '0.7rem', bgcolor: c.bg, color: c.color, fontWeight: 700 }} />
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  )}
                />
                {watchedParentId && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Locked to match parent type.
                  </Typography>
                )}
              </Box>

              {/* Parent */}
              <Box>
                <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 0.8 }}>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    Parent Account <span style={{ color: requiredColor }}>*</span>
                  </Typography>
                  <Tooltip title="Sub-accounts inherit parent type" arrow>
                    <IconButton size="small" sx={{ p: 0.3 }}><Info sx={{ fontSize: 15, color: 'text.secondary' }} /></IconButton>
                  </Tooltip>
                </Stack>
                {accountsLoading
                  ? <Skeleton variant="rounded" height={56} sx={{ borderRadius: 2 }} />
                  : (
                    <Controller
                      name="parentId" control={control}
                      rules={{ required: 'Required' }}
                      render={({ field }) => (
                        <TextField
                          {...field} select fullWidth error={!!errors.parentId}
                          helperText={errors.parentId?.message ?? (watchedType ? `${filteredParents.length} accounts of type "${watchedType}"` : undefined)}
                        >
                          <MenuItem value="" disabled><Typography color="text.secondary">Select parent…</Typography></MenuItem>
                          {filteredParents.map((acc) => {
                            const c = typeConfig[acc.type];
                            return (
                              <MenuItem key={acc.id} value={acc.id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                                  <Chip label={acc.accountCode} size="small" sx={{ fontFamily: 'monospace', fontSize: '0.72rem', bgcolor: c.bg, color: c.color, fontWeight: 700, minWidth: 64 }} />
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" color="text.primary">{acc.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{acc.isMain ? 'Main' : 'Sub'} · {acc.type}</Typography>
                                  </Box>
                                </Box>
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      )}
                    />
                  )}
              </Box>

              <Divider />

              {/* Actions */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  type="submit" variant="contained" size="large"
                  disabled={creating || accountsLoading}
                  sx={{ flex: 1, height: 48 }}
                  startIcon={creating ? <CircularProgress size={18} color="inherit" /> : <AccountTree />}
                >
                  {creating ? 'Creating…' : 'Create Account'}
                </Button>
                <Button type="button" variant="outlined" size="large" onClick={() => reset()} sx={{ height: 48, minWidth: 100 }}>
                  Reset
                </Button>
              </Stack>

            </Stack>
          </Box>
        </Paper>

        {/* ── Right Panel ── */}
        <Stack spacing={2.5}>

          {/* Live Preview */}
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2.5 }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.72rem' }}>
              Live Preview
            </Typography>
            <AccountPreview values={watchedValues} parent={selectedParent} />
            {!watchedValues.name && !watchedValues.type && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <AccountTree sx={{ fontSize: 36, opacity: 0.2, mb: 1, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">Fill the form to see a preview</Typography>
              </Box>
            )}
          </Paper>

          {/* Chart of Accounts summary */}
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2.5 }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.72rem' }}>
              Chart of Accounts
            </Typography>
            {accountsLoading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="rounded" height={40} sx={{ mb: 1, borderRadius: 1.5 }} />)
              : Object.values(AccountType).map((t) => {
                  const c     = typeConfig[t];
                  const count = accounts.filter((a) => a.type === t).length;
                  const active = watchedType === t;
                  return (
                    <Box
                      key={t}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 1.5,
                        p: 1.2, borderRadius: 1.5, mb: 0.5,
                        bgcolor: active ? c.bg : 'transparent',
                        border: '1px solid',
                        borderColor: active ? c.color : 'transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.color, flexShrink: 0 }} />
                      <Typography variant="body2" color="text.primary" sx={{ flex: 1, fontWeight: active ? 600 : 400 }}>{c.label}</Typography>
                      <Chip label={count} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: c.bg, color: c.color }} />
                    </Box>
                  );
                })}
          </Paper>

          {/* Business Rules */}
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2.5, bgcolor: rulesPanelBg }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: rulesAccent, textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.72rem' }}>
              Business Rules
            </Typography>
            {[
              'Every account must have a parent.',
              "Sub-account type must match parent's type.",
              'Account codes are auto-generated (parent.N).',
              'Main accounts (1000–5000) are seeded only.',
            ].map((rule, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 0.8 }}>
                <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: rulesAccent, mt: '6px', flexShrink: 0 }} />
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>{rule}</Typography>
              </Box>
            ))}
          </Paper>

        </Stack>
      </Box>
    </Box>
  );
}
