import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Modal from "./modal";
import upload_image from "../../../public/svg/cardcategory/upload_image.svg";
import delete_circle_red from "../../../public/svg/cardcategory/delete_circle_red.svg";
import { useFieldArray, useForm } from "react-hook-form";
import { Options } from "@/domain/options";
import { Category } from "@/domain/category";
import { CategoryService } from "@/data/controllers/category_controller";
import { Data } from "@/app/dashboard/category/page";

type isVisible = {
  isOpen: boolean;
  onClose: () => void;
  category: Data;
  isFormEdit: boolean;
  refreshTable: () => void;
};

interface FormData {
  name: string;
  description: string;
  options: Options[];
}

const FormCategory: React.FC<isVisible> = ({
  isOpen,
  onClose,
  category,
  isFormEdit,
  refreshTable,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string>("");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<Category>({
    mode: "onChange",
  });

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: "options",
  });

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
    if (!image) {
      fileInputRef.current?.click();
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreviewUrl(null);
  };

  const handleClose = () => {
    setImagePreviewUrl(null);
    onClose();
    reset();
    removeOption();

    const visibilityState = {
      loading: false,
      success: false,
      error: false,
      warning: false,
    };
    setIsVisibleEdit(visibilityState);
    setIsVisible(visibilityState);
  };

  const onSubmit = async (data: Category) => {
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
      const response = isFormEdit
        ? await CategoryService.updateCategory(
            category.id,
            data,
            imagePreviewUrl
          )
        : await CategoryService.addCategory(data, imagePreviewUrl);

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
    } catch (error: any) {
      const errorMessage =
        error.message ||
        "An unexpected error occurred while processing the request.";

      const visibilityState = {
        loading: false,
        success: true,
        error: false,
        warning: false,
      };
      isFormEdit
        ? setIsVisibleEdit(visibilityState)
        : setIsVisible(visibilityState);

      setMessageError(errorMessage);
    }
  };

  useEffect(() => {
    if (category && isFormEdit) {
      setImagePreviewUrl(category.view);
      reset({
        name: category.name,
        options: category.options,
      });
    }
  }, [category, isFormEdit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-30 backdrop-blur-sm z-50">
      <div className="bg-black text-white rounded-xl py-6 px-14 relative w-[550px] max-h-[90vh] overflow-y-auto max-phone:w-[100%] max-phone:h-full max-phone:max-h-[none] max-phone:px-7">
        <div className="absolute top-5 right-5 text-3xl">
          <button onClick={handleClose}>&times;</button>
        </div>
        <h1 className="text-xl mb-4">
          {isFormEdit ? "Edit Category" : "New Category"}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex">
            <div className="w-[124px] relative">
              <div
                className="w-[100%] h-[97px] relative rounded-md border-dashed border-2 border-white p-4 flex items-center justify-center mb-4 cursor-pointer"
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
                      <div className="w-[30px] h-[30px] relative overflow-hidden rounded-lg m-2">
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
            <div className="w-2/3 ml-5">
              <h4 className="block mb-2">Name</h4>
              <input
                type="text"
                className="w-full p-2 border rounded bg-black"
                placeholder="Ex: Salchipapas"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-white">{errors.name.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between max-phone:block">
            <p>Do you want to add options to this category?</p>
            <div className="flex mb-4">
              <button
                type="button"
                className={`py-1 px-4 mr-2 rounded-full ${
                  optionFields.length > 0
                    ? "bg-[#DEA001] text-white"
                    : "bg-black border border-[#DEA001] text-[#DEA001]"
                }`}
                onClick={() =>
                  appendOption({
                    id: Math.random().toString(36).substr(2, 9),
                    label: "",
                    description: "",
                    items: [{ label: "", value: "" }],
                  })
                }
              >
                Yes
              </button>
              <button
                type="button"
                className={`py-1 px-4 rounded-full ${
                  optionFields.length === 0
                    ? "bg-[#DEA001] text-white"
                    : "bg-black border border-[#DEA001] text-[#DEA001]"
                }`}
                onClick={() => {
                  if (optionFields.length === 0) {
                    while (optionFields.length > 0) {
                      removeOption(0);
                    }
                  }
                }}
              >
                No
              </button>
            </div>
          </div>
          <div className="px-1 h-[300px] overflow-y-auto overflow-x-hidden">
            {optionFields.map((option, index) => (
              <OptionField
                key={option.id}
                control={control}
                register={register}
                option={option}
                index={index}
                removeOption={removeOption}
                errors={errors}
              />
            ))}
          </div>
          <div className="flex justify-end">
            <button
              className={`rounded-full py-2 px-4 mt-4 transform transition duration-300  hover:scale-105 ${
                !isValid || isVisible.loading || isVisibleEdit.loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#DEA001] text-white"
              }`}
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
          title="Category Created Successfully"
          message="Your category has been successfully registered in the database."
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
          title="Category Edit Successfully"
          message="Your category has been successfully edited in the database."
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
          title="Error Creating Category"
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
          title="Error Edit Category"
          message={messageError}
          type="error"
          onClose={() => {
            setIsVisibleEdit({
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
      {isVisible.warning && (
        <Modal
          title="Warning Category"
          message="There was a problem registering your category. Please check the data and try again."
          type="warning"
          onClose={() => {
            setIsVisible({
              loading: false,
              success: false,
              error: false,
              warning: false,
            }); //handleClose();
          }}
          onClick={() => {}}
        />
      )}
    </div>
  );
};

interface OptionFieldProps {
  control: any;
  register: any;
  option: Options;
  index: number;
  removeOption: (index: number) => void;
  errors: any;
}

const OptionField: React.FC<OptionFieldProps> = ({
  control,
  register,
  option,
  index,
  removeOption,
  errors,
}) => {
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `options.${index}.items`,
  });

  return (
    <div className="">
      <h4 className="mb-2 text-accent font-bold">Name Option</h4>
      <div className="flex">
        <div className="w-full">
          <input
            type="text"
            className="w-full py-2 pl-1 mr-2 border rounded bg-black"
            placeholder="Ex: Drinks"
            {...register(`options.${index}.label`, {
              required: "Option Name is required",
            })}
          />
          {errors.options?.[index]?.label?.message && (
            <p className="text-white">
              {errors.options?.[index]?.label?.message}
            </p>
          )}
        </div>
        <button
          className="bg-transparent rounded-full flex items-center justify-center"
          onClick={() => removeOption(index)}
        >
          <div className="w-[30px] h-[30px] relative overflow-hidden rounded-lg m-2">
            <Image
              src={delete_circle_red}
              alt="Delete Circle"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </button>
      </div>
      <h4 className="my-2">Description</h4>
      <input
        type="text"
        className="w-full p-2 border rounded bg-black"
        placeholder="Ex: Choose the drink"
        {...register(`options.${index}.description`, {
          required: "Description is required",
        })}
      />
      {errors.options?.[index]?.description?.message && (
        <p className="text-white">
          {errors.options?.[index]?.description?.message}
        </p>
      )}
      <div className="flex items-center my-4">
        <h4 className="">Add Items</h4>
        <button
          className="bg-accent text-black text-2xl rounded-full w-6 h-6 flex items-center justify-center ml-2"
          type="button"
          onClick={() =>
            appendItem({
              label: "",
              value: "",
            })
          }
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>
      <div>
        {itemFields.map((item, itemIndex) => (
          <div className="flex my-2" key={item.id}>
            <div className="w-[60%] mr-3">
              <input
                type="text"
                className="w-full py-2 pl-1 border rounded bg-black"
                placeholder="Ex: Drinks"
                {...register(`options.${index}.items.${itemIndex}.label`, {
                  required: "Label is required",
                })}
              />
              {errors.options?.[index]?.items?.[itemIndex]?.label?.message && (
                <p className="text-white">
                  {errors.options?.[index]?.items?.[itemIndex]?.label?.message}
                </p>
              )}
            </div>
            <div className="w-[25%]">
              <input
                type="text"
                className="w-full py-2 pl-1 border rounded bg-black"
                placeholder="Ex: Value"
                {...register(`options.${index}.items.${itemIndex}.value`, {
                  required: "Value is required",
                })}
              />
              {errors.options?.[index]?.items?.[itemIndex]?.value?.message && (
                <p className="text-white">
                  {errors.options?.[index]?.items?.[itemIndex]?.value?.message}
                </p>
              )}
            </div>
            <button
              className="bg-transparent rounded-full flex items-center justify-center"
              onClick={() => removeItem(itemIndex)}
            >
              <div className="w-[23px] h-[23px] relative overflow-hidden rounded-lg m-2">
                <Image
                  src={delete_circle_red}
                  alt="Delete Circle"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormCategory;
