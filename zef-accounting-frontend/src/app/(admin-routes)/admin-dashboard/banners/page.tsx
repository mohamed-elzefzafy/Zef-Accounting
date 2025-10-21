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
import { useDeleteBannerMutation, useGetBannersAdminQuery, useGetBannersQuery } from "@/redux/slices/api/bannerApiSlice";

const AdminCategoriesPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data ,isLoading,refetch} = useGetBannersQuery();
  const [deleteBanner] = useDeleteBannerMutation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const updateCategory = useUpdateCategoryMutation();

console.log(data);

  
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Serial",
      width: isSmallScreen ? 50 : 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "text",
      headerName: "Text",
      flex: 1,
      minWidth: isSmallScreen ? 100 : 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "discount",
      headerName: "Discount",
      flex: 1,
      minWidth: isSmallScreen ? 100 : 150,
      align: "center",
      headerAlign: "center",
    },
   
      {
        field: "image",
        headerName: "Image",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
          <Image
            // onClick={() =>
            //   router.push(
            //     `/profile/${params.row.userId}?fromInstructorDashBoard=fromInstructorDashBoard`
            //   )
            // }
            src={params.row.image.url}
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
      field: "actions",
      headerName: "Actions",
      flex: isSmallScreen ? 0.8 : 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<string[]>) => (
        <>
          <IconButton onClick={() => onDeleteBanner(params.value)}>
            <Delete color="error" />
          </IconButton>
          <IconButton onClick={() => router.push(`/admin-dashboard/banners/edit-banner/${params.value}`)}>
            <Edit color="info" />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = data?.map((banner, index) => ({
    id: index + 1,
    text: banner.text,
    discount: banner.discount,
    image: banner.image,
    actions: banner._id,
  })) || [];

  const onDeleteBanner = async (_id: string) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this category? all courses belong it will deleted",
        icon: "warning",
        dangerMode: true,
      });

      if (willDelete) {
        await deleteBanner({bannerId:_id}).unwrap();
        refetch();
        toast.success("banner deleted successfully");
      }
    } catch (error) {
      console.error("Delete banner error:", error);
      const errorMessage =
        (error as { data?: { message?: string } }).data?.message ||
        "Failed to delete banner";
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
          Banners 
        </Typography>
    
              <Chip
                          label="Add banner"
                          size="small"
                          color="secondary"
                          sx={{ p: 2, cursor: "pointer" }}
                          onClick={() => router.push("/admin-dashboard/banners/add-banner")}
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
    </Box>
  );
};

export default AdminCategoriesPage;
