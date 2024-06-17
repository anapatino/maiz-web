import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Modal from "./modal";
import upload_image from "../../../public/svg/cardcategory/upload_image.svg";
import delete_circle_red from "../../../public/svg/cardcategory/delete_circle_red.svg";
import { useForm } from "react-hook-form";
import { Product, ProductResponse } from "@/domain/product";
import { CategoryService } from "@/data/controllers/category_controller";
import { Category } from "@/domain/category";
import { ProductController } from "@/data/controllers/product_controller";

type isVisible = {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  isFormEdit: boolean;
  refreshTable: () => void;
};

const FormProduct: React.FC<isVisible> = ({
  isOpen,
  onClose,
  product,
  isFormEdit,
  refreshTable,
}) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ProductResponse>({
    mode: "onChange",
  });
  const [messageError, setMessageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isVisible, setIsVisible] = useState({
    loading: false,
    success: false,
    error: false,
    warning: false,
  });
  const [isVisibleEdit, setIsVisibleEdit] = useState({
    loading: false,
    success: false,
    error: false,
    warning: false,
  });
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageRemove = () => {
    setImagePreviewUrl(null);
  };

  const handleClose = () => {
    setMessageError("");
    setImagePreviewUrl(null);
    setIsVisibleEdit({
      loading: false,
      success: false,
      error: false,
      warning: false,
    });
    setIsVisible({
      loading: false,
      success: false,
      error: false,
      warning: false,
    });
    onClose();
    reset();
  };

  const onSubmit = async (data: ProductResponse) => {
    setIsVisible({
      loading: true,
      success: false,
      error: false,
      warning: false,
    });
    if (!imagePreviewUrl) {
      setIsVisible({
        loading: true,
        success: false,
        error: false,
        warning: true,
      });
      return;
    }

    try {
      const selectedCategory = categories.find(
        (category) => category.id === data.idCategory
      );
      if (selectedCategory) {
        data.options = selectedCategory.options;
        data.labelCategory = selectedCategory.name;
        const boolean = data.available.toString() === "true" ? true : false;
        data.available = boolean;
      }
      const response = isFormEdit
        ? await ProductController.updateProduct(
            product.id,
            data,
            imagePreviewUrl
          )
        : await ProductController.addProduct(data, imagePreviewUrl);

      if (response) {
        const visibilityState = {
          loading: false,
          success: true,
          error: false,
          warning: false,
        };
        isFormEdit
          ? setIsVisibleEdit(visibilityState)
          : setIsVisible(visibilityState);
        refreshTable();
      }
    } catch (error: any) {
      const errorMessage =
        error.message ||
        "An unexpected error occurred while processing the request.";
      const visibilityState = {
        loading: false,
        success: false,
        error: true,
        warning: false,
      };
      isFormEdit
        ? setIsVisibleEdit(visibilityState)
        : setIsVisible(visibilityState);
      setMessageError(errorMessage);
    }
  };

  const fetchCategories = async () => {
    try {
      const allCategories = await CategoryService.getAllCategories();
      setCategories(allCategories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product && isFormEdit) {
      setImagePreviewUrl(product.image);
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        idCategory: product.idCategory,
      });
    }
  }, [product, isFormEdit]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-30 backdrop-blur-sm z-50">
      <div className="bg-black text-white rounded-xl py-6 px-14 relative w-[550px] max-h-[90vh] overflow-y-auto max-phone:w-[100%] max-phone:h-full max-phone:max-h-[none] max-phone:px-7">
        <div className="absolute top-5 right-5 text-3xl">
          <button onClick={handleClose}>&times;</button>
        </div>
        <h1 className="text-xl mb-4">
          {isFormEdit ? "Edit Product" : "New Product"}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex">
            <div className="relative">
              <div
                className="w-[450px] h-[200px] relative rounded-md border-dashed border-2 border-white p-4 flex items-center justify-center mb-4 cursor-pointer"
                onClick={handleDivClick}
              >
                {imagePreviewUrl ? (
                  <>
                    <img
                      src={imagePreviewUrl}
                      alt="Upload Preview"
                      className="object-cover w-full h-full"
                      style={{ position: "absolute", top: 0, left: 0 }}
                    />
                    <button
                      className="absolute top-0 right-0 bg-transparent rounded-full flex items-center justify-center"
                      onClick={handleImageRemove}
                    >
                      <div className="w-[40px] h-[40px] relative overflow-hidden rounded-lg m-2">
                        <Image
                          src={delete_circle_red}
                          alt="Delete Circle"
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <Image src={upload_image} alt="Upload Image" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>
          <div className="flex gap-4 items-center mb-2">
            <h4 className="block ">Available:</h4>
            <div className="flex items-center gap-6">
              <label className="mr-4">
                <input
                  type="radio"
                  value="true"
                  {...register("available", {
                    required: "Availability is required",
                  })}
                  className="mr-2 form-radio bg-primary"
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  value="false"
                  {...register("available", {
                    required: "Availability is required",
                  })}
                  className="mr-2 form-radio bg-primary"
                />
                No
              </label>
            </div>
            {errors.available && (
              <p className="text-white">{errors.available.message}</p>
            )}
          </div>
          <div className="mb-4">
            <h4 className="mb-2">Name</h4>
            <input
              type="text"
              className="w-full p-2 border rounded bg-black"
              placeholder="Write name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-white">{errors.name.message}</p>}
          </div>
          <div className="mb-4">
            <h4 className="mb-2">Description</h4>
            <input
              type="text"
              className="w-full p-2 border rounded bg-black"
              placeholder="Write description"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-white">{errors.description.message}</p>
            )}
          </div>
          <div className="mb-4">
            <h4 className="block mb-2">Category</h4>
            <select
              className="w-full p-2 border rounded bg-black"
              {...register("idCategory", { required: "Category is required" })}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.idCategory && (
              <p className="text-white">{errors.idCategory.message}</p>
            )}
          </div>
          <div className="mb-4">
            <h4 className="mb-2">Price</h4>
            <input
              type="text"
              className="w-full p-2 border rounded bg-black"
              placeholder="Ex: 5"
              {...register("price", {
                required: "Price is required",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Please enter a valid price",
                },
              })}
            />
            {errors.price && (
              <p className="text-white">{errors.price.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              className={`rounded-full py-2 px-4 mt-4 ${
                !isValid || isVisible.loading || isVisibleEdit.loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#DEA001] text-white"
              } `}
              type="submit"
              disabled={!isValid || isVisible.loading || isVisibleEdit.loading}
            >
              {isVisible.loading || isVisibleEdit.loading
                ? "Sending..."
                : "Confirm"}
            </button>
          </div>
        </form>
      </div>
      {isVisible.success && (
        <Modal
          title="Product Created Successfully"
          message="Your product has been successfully registered in the database."
          type="success"
          onClose={() => {
            setIsVisible({
              loading: false,
              success: false,
              error: false,
              warning: false,
            });
            handleClose();
          }}
          onClick={() => {}}
        />
      )}
      {isVisibleEdit.success && (
        <Modal
          title="Product Edit Successfully"
          message="Your product has been successfully edited in the database."
          type="success"
          onClose={() => {
            setIsVisibleEdit({
              loading: false,
              success: false,
              error: false,
              warning: false,
            });
            handleClose();
          }}
          onClick={() => {}}
        />
      )}
      {isVisible.error && (
        <Modal
          title="Error Creating Product"
          message={messageError}
          type="error"
          onClose={() => {
            setIsVisible({
              loading: false,
              success: false,
              error: false,
              warning: false,
            });
            setMessageError("");
            //handleClose();
          }}
          onClick={() => {}}
        />
      )}
      {isVisibleEdit.error && (
        <Modal
          title="Error Edit Product"
          message={messageError}
          type="error"
          onClose={() => {
            setIsVisibleEdit({
              loading: false,
              success: false,
              error: false,
              warning: false,
            });
            //handleClose();
          }}
          onClick={() => {}}
        />
      )}
      {isVisible.warning && (
        <Modal
          title="Warning Product"
          message="There was a problem registering your product. Please check the data and try again."
          type="warning"
          onClose={() => {
            setIsVisible({
              loading: false,
              success: false,
              error: false,
              warning: false,
            });
            //handleClose();
          }}
          onClick={() => {}}
        />
      )}
    </div>
  );
};

export default FormProduct;
