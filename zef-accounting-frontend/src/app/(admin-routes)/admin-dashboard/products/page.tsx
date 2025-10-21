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
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PaginationComponent from "@/app/components/PaginationComponent";
import {
  useDeleteProductAdminDashboardMutation,
  useGetAdminDashboardProductsQuery,
} from "@/redux/slices/api/productApiSlice";

const InstructorCoursesPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, refetch } = useGetAdminDashboardProductsQuery({
    page: currentPage,
    limit: pageSize,
  });
  const [deleteProductAdminDashboard] =
    useDeleteProductAdminDashboardMutation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Serial",
      width: isSmallScreen ? 50 : 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "title",
      headerName: "Title",
    flex: isSmallScreen ? 0.6 : 0.8,
      minWidth: isSmallScreen ? 80 : 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            lineHeight: 1.2,
            padding: "4px",
          }}
        >
          <Link
            href={`/products/${params.row.productId}?fromAdminDashBoard=fromAdminDashBoard`}
            style={{
              color: theme.palette.primary.main,
              textDecoration: "none",
            }}
          >
            {params.value}
          </Link>
        </Box>
      ),
    },
    {
      field: "image",
      headerName: "Image",
      align: "center",
      headerAlign: "center",
      flex: isSmallScreen ? 0.6 : 0.8,
      minWidth: isSmallScreen ? 80 : 120,
      renderCell: (params: GridRenderCellParams) => (
        <Image
          onClick={() =>
            router.push(
              `/products/${params.row.productId}?fromAdminDashBoard=fromAdminDashBoard`
            )
          }
          src={params.value}
          alt="userProfile"
          width={40}
          height={40}
          style={{
            width: "40px",
            height: "40px",
            objectFit: "cover",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        />
      ),
    },
    {
      field: "category",
      headerName: "Category",
      flex: isSmallScreen ? 0.6 : 0.8,
      minWidth: isSmallScreen ? 80 : 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "finalPrice",
      headerName: "Price",
      flex: isSmallScreen ? 0.6 : 0.8,
      minWidth: isSmallScreen ? 80 : 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: isSmallScreen ? 0.6 : 0.8,
      minWidth: isSmallScreen ? 80 : 120,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "stock",
      headerName: "Stock",
      flex: isSmallScreen ? 0.6 : 0.8,
      minWidth: isSmallScreen ? 80 : 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sold",
      headerName: "Sold",
      flex: isSmallScreen ? 0.6 : 0.8,
      minWidth: isSmallScreen ? 80 : 120,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: isSmallScreen ? 1 : 1,
      width: isSmallScreen ? 120 : 140,
      align: "center",
      headerAlign: "center",

      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            onClick={() =>
              router.push(
                `/admin-dashboard/products/edit-product/${params.row.productId}`
              )
            }
          >
            <Edit color="info" />
          </IconButton>
          <IconButton
            onClick={() =>
              onDeleteProduct({ _id: params.row.productId, page: currentPage })
            }
            sx={{ padding: isSmallScreen ? "6px" : "8px" }}
          >
            <Delete
              color="error"
              fontSize={isSmallScreen ? "small" : "medium"}
            />
          </IconButton>
        </>
      ),
    },
  ];

  const rows =
    data?.products.map((product, index) => ({
      id: index + 1 + (currentPage - 1) * pageSize, // Adjust serial number for pagination
      title: product.title,
      image: product.images[0].url,
      category: product.category.title,
      rating: product.rating,
      stock: product.stock,
      sold: product.sold,
      finalPrice: product.finalPrice,
      createdAt: product.createdAt.substring(0, 10),
      productId: product._id,
    })) || [];

  const onDeleteProduct = async ({
    _id,
    page,
  }: {
    _id: string;
    page: number;
  }) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "you want to delete this product",
        icon: "warning",
        dangerMode: true,
      });

      if (willDelete) {
        await deleteProductAdminDashboard({ _id, page }).unwrap();
        router.refresh();
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.error("Delete product error:", error);
      const errorMessage =
        (error as { data?: { message?: string } }).data?.message ||
        "Failed to delete product";
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
          px: 1,
        }}
      >
        <Typography
          variant={isSmallScreen ? "h6" : "h5"}
          sx={{ my: 1, fontWeight: "bold" }}
        >
          Products
        </Typography>

        {/* <Button
          variant="contained"
          size="small"
          sx={{ textTransform: "capitalize" ,borderRadius:"30px"}}
          onClick={() =>
            router.push("/admin-dashboard/products/add-product")
          }
        >
          Add Product
        </Button> */}

        <Chip
          label="Add Product"
          size="small"
          color="secondary"
          sx={{ p: 2, cursor: "pointer" }}
          onClick={() => router.push("/admin-dashboard/products/add-product")}
        />
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

export default InstructorCoursesPage;
