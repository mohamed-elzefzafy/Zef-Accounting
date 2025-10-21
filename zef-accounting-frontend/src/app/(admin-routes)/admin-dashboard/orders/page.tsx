/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import {
  useDeleteCategoryAdminPageMutation,
  useGetCategoriesAdminQuery,
  useUpdateCategoryMutation,
} from "@/redux/slices/api/categoryApiSlice";
import Link from "next/link";
import Image from "next/image";
import PaginationComponent from "@/app/components/PaginationComponent";
import { useGetOrdersAdminQuery } from "@/redux/slices/api/orderApiSlice";

const AdminCategoriesPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data ,isLoading} = useGetOrdersAdminQuery(`?page=${currentPage}`);
  const [deleteCategoryAdminPage] = useDeleteCategoryAdminPageMutation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const updateCategory = useUpdateCategoryMutation();

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Syrial",
      width: isSmallScreen ? 50 : 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "userName",
      headerName: "User Name",
      flex: 1,
      minWidth: isSmallScreen ? 100 : 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<any>) => (
        <Typography sx={{fontSize : {xs : "12px" , md : "13px"} , mt : 2}}> {/* Custom font size */}
          {params.value}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: isSmallScreen ? 90 : 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<any>) => (
        <Typography sx={{fontSize : {xs : "12px" , md : "13px"} , mt : 2}}> {/* Custom font size */}
          {params.value}
        </Typography>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Order Amount",
      flex: 1,
      minWidth: isSmallScreen ? 100 : 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Paid",
      headerName: "Paid",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Deliverd",
      headerName: "Deliverd",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
      
    {
      field: "actions",
      headerName: "Actions",
      flex: isSmallScreen ? 0.8 : 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<any>) => (
          <Button variant='contained' onClick={()=> router.push(`/orders/${params.value}`)}>Details</Button>
      ),
    },
  ];
  
  const rows = data?.orders?.map((order, index) => ({
    id: index + 1,
    userName: order.user.firstName + "  " + order.user.lastName,
    date: new Date(order.createdAt).toDateString(),
    totalAmount: order.totalOrderPriceAfterDiscount,
    Paid: order.isPaid ? "Piad" : "Not-Paid",
    Deliverd: order.isDelivered ? "Delivered" : "Not-Delivered",
    actions: order._id,
  })) || [];


  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const onDeleteCategory = async ({ _id, page }: { _id: string; page: number }) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this category? all courses belong it will deleted",
        icon: "warning",
        dangerMode: true,
      });

      if (willDelete) {
        await deleteCategoryAdminPage({ _id, page }).unwrap();
        router.refresh();
        toast.success("category deleted successfully");
      }
    } catch (error) {
      console.error("Delete category error:", error);
      const errorMessage =
        (error as { data?: { message?: string } }).data?.message ||
        "Failed to delete category";
      toast.error(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        mx: "auto",
        mt: 2,
        px: isSmallScreen ? 1 : 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          mr: 7,
        }}
      >
        <Typography
          variant={isSmallScreen ? "h6" : "h5"}
          sx={{ my: 1, fontWeight: "bold" }}
        >
          Orders 
        </Typography>

      </Stack>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          "& .MuiDataGrid-root": {
            borderRadius: 1,
            boxShadow: theme.shadows[2],
            height: "calc(100vh - 65px)",
          },
        }}
      >
            <DataGrid
          rows={rows}
          columns={columns}
          paginationMode="server" // Use server-side pagination
          rowCount={data?.pagination.total || 0} // Total number of rows from backend
          pageSizeOptions={[5, 10, 15]} // Match backend limit options
          paginationModel={{
            page: currentPage - 1, // DataGrid uses 0-based indexing
            pageSize,
          }}
          onPaginationModelChange={(model) => {
            setCurrentPage(model.page + 1); // Convert to 1-based indexing for backend
            setPageSize(model.pageSize);
          }}
          loading={isLoading}
              localeText={{
            noRowsLabel: "📭 No data to display",
          }}
          sx={{
            fontSize: isSmallScreen ? "12px" : "14px",
            "& .MuiDataGrid-cell": {
              padding: isSmallScreen ? "4px" : "8px",
              lineHeight: 1.2,
            },
            "& .MuiDataGrid-columnHeader": {
              padding: isSmallScreen ? "4px" : "8px",
              backgroundColor: theme.palette.background.paper,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              fontSize: isSmallScreen ? "12px" : "14px",
            },
            "& .MuiDataGrid-virtualScroller": {
              overflowX: isSmallScreen ? "auto" : "hidden",
            },
          }}
        />
      </Box>

      {data?.pagination && data?.pagination.pagesCount > 1 && (
        <PaginationComponent
          count={data.pagination.pagesCount}
          currentPage={data.pagination.page}
          handlePageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

export default AdminCategoriesPage;
