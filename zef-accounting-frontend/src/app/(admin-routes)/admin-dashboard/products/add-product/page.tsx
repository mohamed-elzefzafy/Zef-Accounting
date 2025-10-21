/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useCreateProductMutation } from "@/redux/slices/api/productApiSlice";
import { useGetCategoriesQuery } from "@/redux/slices/api/categoryApiSlice";
import { useGetsubcategoriesQuery } from "@/redux/slices/api/subcategoryApiSlice";
import { useGetBrandsQuery } from "@/redux/slices/api/brandApiSlice";
import { ChangeEvent, useEffect, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import toast from "react-hot-toast";
import { IProductInput } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";

// // ✅ Schema validation
// const schema = z.object({
//   title: z.string().min(3, "Title is required"),
//   description: z.string().min(10, "Description is required"),
//   price: z.number().min(1, "Price must be at least 1"),
//   discount: z.number().optional(),
//   stock: z.number().min(0, "Stock cannot be negative"),
//   category: z.string().nonempty("Category is required"),
//   subCategory: z.string().nonempty("Subcategory is required"),
//   brand: z.string().optional(),
// });

// type FormData = z.infer<typeof schema>;

// // 📝 Dummy data (هتجيبها من API عندك)
// const categories = [
//   { id: "cat1", name: "Electronics" },
//   { id: "cat2", name: "Clothing" },
// ];

// const subCategories = {
//   cat1: [
//     { id: "sub1", name: "Phones" },
//     { id: "sub2", name: "Laptops" },
//   ],
//   cat2: [
//     { id: "sub3", name: "Men" },
//     { id: "sub4", name: "Women" },
//   ],
// };

// const brands = [
//   { id: "brand1", name: "Apple" },
//   { id: "brand2", name: "Samsung" },
//   { id: "brand3", name: "Nike" },
// ];

export default function AddProductPage() {
  const router = useRouter();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: categoriesResponse } = useGetCategoriesQuery();
  // const { data: subCategoriesResponse } = useGetsubcategoriesQuery();
  const { data: brandsResponse } = useGetBrandsQuery();
  // const [SelectedCategory, setSelectedCategory] = useState("")
  const [category, setCategory] = useState("");
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<IProductInput>({
    // resolver: zodResolver(schema),
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

  const [images, setImages] = useState<File[] | null>([]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
    }
  };

  const { data: subCategoriesResponse } = useGetsubcategoriesQuery(
    `?category=${category}`
  );

  const onSubmit = async (data: IProductInput) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    if (data.discount) {
      formData.append("discount", data.discount.toString());
    }
    formData.append("stock", data.stock.toString());
    formData.append("category", data.category);
    formData.append("subCategory", data.subCategory);
    if (data.brand) {
      formData.append("brand", data.brand);
    }

    images?.forEach((image) => formData.append("images", image));
    try {
      await createProduct(formData).unwrap();
      toast.success("Product created successfully");
      reset();
      setImages(null);
      router.push("/admin-dashboard/products");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add product 🚀");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }} textAlign={"center"}>
        <Typography variant="h6" component="h2" sx={{ ml: 2, mb: 2 }}>
          Add Product
          <Tooltip
            title={"back to Categories admin dashboard"}
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

            {/* Price & Stock */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="price"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Price"
                    fullWidth
                    // error={!!fieldState.error}
                    // helperText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="discount"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Discount"
                    fullWidth
                    // error={!!fieldState.error}
                    // helperText={fieldState.error?.message}
                  />
                )}
              />
            </Stack>

            <Controller
              name="stock"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Stock"
                  fullWidth
                  // error={!!fieldState.error}
                  // helperText={fieldState.error?.message}
                />
              )}
            />

            {/* Category */}
            {/* <Controller
              name="category"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select {...field} label="Category">
                    {categoriesResponse?.categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.title}
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
            /> */}

            <TextField
              select
              label="Category"
              fullWidth
              defaultValue=""
              {...register("category", { required: "Category is required" })}
              error={!!errors.category}
              helperText={errors.category && "Category is required"}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {(categoriesResponse?.categories?.length ?? 0) > 0 ? (
                categoriesResponse?.categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.title}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  No categories available
                </MenuItem>
              )}
            </TextField>

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
                    {brandsResponse?.brands.map((brand) => (
                      <MenuItem key={brand._id} value={brand._id}>
                        {brand.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

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
                      marginLeft: "1px",
                      marginRight: "1px",
                    }}
                    alt="product"
                  />
                ))}
            </Stack>

            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{ textTransform: "capitalize" }}
              startIcon={<ImageIcon />}
            >
              {images && images?.length > 0
                ? "images selected"
                : "Upload images"}
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </Button>

            <Button
              type="button"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{ textTransform: "capitalize", position: "relative" }}
            >
              {isSubmitting ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white",
                  }}
                />
              ) : (
                "Add images"
              )}
            </Button>

            {/* Submit Button */}
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
                "Add Product"
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
