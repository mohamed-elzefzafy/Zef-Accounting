/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useGetCategoriesQuery } from "@/redux/slices/api/categoryApiSlice";
import { useGetsubcategoriesQuery } from "@/redux/slices/api/subcategoryApiSlice";
import { useGetBrandsQuery } from "@/redux/slices/api/brandApiSlice";
import { ChangeEvent, useEffect, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import toast from "react-hot-toast";
import { IProductInput } from "@/types/product";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import {
  useGetOneProductQuery,
  useUpdateProductMutation,
} from "@/redux/slices/api/productApiSlice";

export default function EditProductPage() {
  const router = useRouter();
  const { productId } = useParams<{ productId: string }>();

  // API hooks
  const {
    data: product,
    isLoading: productLoading,
    refetch: refetchProduct,
  } = useGetOneProductQuery(productId);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const { data: brandsResponse } = useGetBrandsQuery();
console.log(product);

  const [category, setCategory] = useState("");
  const [images, setImages] = useState<File[] | null>([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<IProductInput>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock: 0,
      discount: 0,
      category: "",
      subCategory: "",
      brand: "",
    },
  });

  // get subcategories when category changes
  const { data: subCategoriesResponse } = useGetsubcategoriesQuery(
    `?category=${category}`
  );

  // Prefill form when product data is loaded
  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        category: product.category?._id,
        subCategory: product.subCategory?._id,
        brand: product.brand?._id,
      });
      setCategory(product.category?._id || "");
    }
  }, [product, reset]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
    }
  };

  const onSubmit = async (data: IProductInput) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    if (data.discount) {
      formData.append("discount", data.discount.toString());
    }
    formData.append("category", data.category);
    formData.append("subCategory", data.subCategory);
    if (data.brand) {
      formData.append("brand", data.brand);
    }
    images?.forEach((image) => formData.append("images", image));

    try {
      // await updateProduct({ productId, formData }).unwrap();
      await updateProduct({ productId, payLoad: formData }).unwrap();
      refetchProduct();
      toast.success("Product updated successfully 🚀");
      router.push("/admin-dashboard/products");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update product");
    }
  };

  if (productLoading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }} textAlign={"center"}>
        <Typography variant="h6" component="h2" sx={{ ml: 2, mb: 2 }}>
          Edit Product
          <Tooltip
            title={"back to Products admin dashboard"}
            placement="right-end"
            enterDelay={200}
          >
            <IconButton
              onClick={() => router.push(`/admin-dashboard/products`)}
            >
              <KeyboardDoubleArrowRight sx={{ color: "primary.main" }} />
            </IconButton>
          </Tooltip>
        </Typography>

        <Box>
          <Stack
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
            spacing={3}
          >
            {/* Title */}
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            {/* Price & Discount */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField {...field} type="number" label="Price" fullWidth />
                )}
              />
              <Controller
                name="discount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Discount"
                    fullWidth
                  />
                )}
              />
            </Stack>

            {/* Stock */}
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="number" label="Stock" fullWidth />
              )}
            />

            {/* Category */}
            <TextField
              select
              label="Category"
              fullWidth
              {...register("category", { required: "Category is required" })}
              error={!!errors.category}
              helperText={errors.category && "Category is required"}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {(categoriesResponse?.categories || []).map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.title}
                </MenuItem>
              ))}
            </TextField>

            {/* SubCategory */}
            <Controller
              name="subCategory"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth disabled={!category}>
                  <InputLabel>SubCategory</InputLabel>
                  <Select {...field} label="SubCategory">
                    {(subCategoriesResponse?.subCategories || []).map((sub) => (
                      <MenuItem key={sub._id} value={sub._id}>
                        {sub.title}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography color="error" variant="caption">
                      {fieldState.error.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            {/* Brand */}
            <Controller
              name="brand"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Brand</InputLabel>
                  <Select {...field} label="Brand">
                    {(brandsResponse?.brands || []).map((brand) => (
                      <MenuItem key={brand._id} value={brand._id}>
                        {brand.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            {/* Images preview */}
            {images && images?.length > 0 ? (
              <Stack
                direction="row"
                flexWrap="wrap"
                sx={{ justifyContent: "center", alignItems: "center" }}
              >
                {images &&
                  images.map((image) => (
                    <Image
                      key={image.name}
                      src={URL.createObjectURL(image)}
                      width={100}
                      height={100}
                      style={{
                        objectFit: "contain",
                        borderRadius: "3px",
                        margin: "2px",
                      }}
                      alt="product"
                    />
                  ))}
              </Stack>
            ) : (
              <Stack
                direction="row"
                flexWrap="wrap"
                sx={{ justifyContent: "center", alignItems: "center" }}
              >
                {product?.images.map((image) => (
                  <Image
                    key={image.public_id}
                    src={image.url}
                    width={100}
                    height={100}
                    style={{
                      objectFit: "contain",
                      borderRadius: "3px",
                      marginLeft: "1px",
                      marginRight: "1px",
                    }}
                    alt="product"
                  />
                ))}
              </Stack>
            )}
            {/* Upload Images */}
            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{ textTransform: "capitalize" }}
              startIcon={<ImageIcon />}
            >
              {images && images?.length > 0
                ? "Images selected"
                : "Upload images"}
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </Button>

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              fullWidth
            >
              {isSubmitting ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white",
                  }}
                />
              ) : (
                "Update Product"
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
