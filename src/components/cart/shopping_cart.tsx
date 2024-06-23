import React, { useEffect, useState } from "react";
import Image from "next/image";
import car from "../../../public/svg/shoppingcart/car.svg";
import arrowleft from "../../../public/svg/arrows/arrow_left.svg";
import FooterMenu from "@/components/footer/footer_menu";
import { useForm, SubmitHandler } from "react-hook-form";
import ModalConfirm from "@/components/card/modal";
import { Options } from "@/domain/options";
import StarRating from "../rating/star_rating";

interface ProductOnCart {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  available: boolean;
  message: string;
  orderquantity: number;
  idOrder: number;
  options?: Options[];
}

interface ShoppingCartProps {
  cart: ProductOnCart[];
  updateQuantityPage: (id: number, delta: number) => void;
  resetCartMenu: () => void;
  setIsCartVisible: (visible: boolean) => void;
}

interface FormInput {
  name: string;
  phone: string;
  address?: string;
  paymentMethod: string;
  cashValue?: number;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cart,
  updateQuantityPage,
  resetCartMenu,
  setIsCartVisible,
}) => {
  const [items, setItems] = useState<ProductOnCart[]>(
    cart.map((product) => ({
      ...product,
      orderquantity: product.orderquantity || 1,
    }))
  );

  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [isToGo, setIsToGo] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [showStarRating, setShowStarRating] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [userPhone, setUserPhone] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    trigger,
  } = useForm<FormInput>({ mode: "onChange" });
  
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isVisible]);


  const handleToGoChange = (toGo: boolean) => {
    setIsToGo(toGo);
    reset({
      name: "",
      phone: "",
      address: "",
      paymentMethod: "",
      cashValue: undefined,
    });
  };

  const total = items.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.orderquantity;
  }, 0);

  const formatWhatsAppMessage = (data: FormInput) => {
    let priceWF = 0;
    let message = "👋🏻Order Details:%0A%0A";
    message += `Name: ${data.name}%0A`;
    message += `Phone: ${data.phone}%0A`;
    message += `Order Type: ${isToGo ? "To go" : "Table"}%0A`;

    if (isToGo) {
      message += `Address: ${data.address}%0A`;
    }

    message += `Payment Method: ${data.paymentMethod}%0A`;

    if (data.paymentMethod === "cash") {
      message += `Cash Value: ${data.cashValue}%0A`;
    }

    message += "%0AProducts:%0A";
    items.forEach((item) => {
      message += `%0A--> ${item.name} - Quantity: ${item.orderquantity} - Price: ${item.price}€ %0A`;

      if (item.options && item.options.length > 0) {
        item.options.forEach(option => {
          if (option.items.length > 0){
            message += `Option: ${option.label}%0A`;
            option.items.forEach(optionItem => {
              message += `- ${optionItem.label}%0A`;
            });
          }
        });
      }

      if (item.message) {
        message += `Comments: ${item.message}%0A`;
      }
    });

    if (isToGo) {
      priceWF = total + 2;
    } else {
      priceWF = total;
    }
    message += `%0ATotal: ${priceWF}€`;
    return message;
  };

  const handleConfirm: SubmitHandler<FormInput> = async (data) => {
    const isCashValid = await trigger("cashValue");
    if (!isValid || (data.paymentMethod === "cash" && !isCashValid)) {
      return;
    }

    setUserName(data.name);
    setUserPhone(parseFloat(data.phone));
    const message = formatWhatsAppMessage(data);
    const whatsappLink = `https://wa.me/3015849730?text=${message}`;
    window.open(whatsappLink, "_blank");
    setShowModalConfirm(true);
  };

  const handleModalConfirmClose = () => {
    setShowModalConfirm(false);
    resetCart();
    handleCloseModal();
    setShowStarRating(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    reset({
      name: "",
      phone: "",
      address: "",
      paymentMethod: "",
      cashValue: undefined,
    });
  };

  const resetCart = () => {
    resetCartMenu();
    setItems([]);
  };

  if (!isVisible) return null;

  const handleUpdateQuantity = (idOrder: number, delta: number) => {
    updateQuantityPage(idOrder, delta);
    updateQuantitySC(idOrder, delta);
  };

  const updateQuantitySC = (id: number, delta: number) => {
    setItems((items) =>
      items
        .map((item) =>
          item.idOrder === id
            ? {
                ...item,
                orderquantity: Math.max(0, item.orderquantity + delta),
              }
            : item
        )
        .filter((item) => item.orderquantity > 0)
    );
  };

  const handleModalRatingClose = () => {
    setShowStarRating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75  flex-col min-h-screen p-0 m-0 text-white">
      <div className="relative w-full mx-auto bg-black overflow-auto flex flex-col min-h-screen">
        <div className="w-full relative z-10 flex justify-center items-center p-32 max-phone:pt-16 max-phone:pb-10 max-phone:px-16 pb-10">
          <div className="text-center">
            <h3 className="text-9xl max-tablet:text-7xl max-phone:text-5xl">
              SHOPPING CART
            </h3>
          </div>
        </div>
        <button
          className="absolute top-4 left-4 z-10"
          onClick={() => setIsCartVisible(false)}
        >
          <Image src={arrowleft} alt="Back" className="w-8 h-8" />
        </button>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 p-4">
            <Image
              src={car}
              alt="Empty cart"
              className="w-24 h-24 mb-4 max-phone:w-16 "
            />
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <h2 className="mb-4 text-center">
              It seems that no products have been added yet
            </h2>
            <button
              className="text-white px-4 py-2 rounded-full"
              style={{ backgroundColor: "#DEA001" }}
              onClick={() => setIsVisible(false)}
            >
              <h4>Continue shopping</h4>
            </button>
          </div>
        ) : (
          <div className="w-[100%]">
            <div className="flex justify-center items-center mb-4">
              <h1 className="text-4xl max-phone:text-2xl max-tablet:text-3xl">
                TOTAL: €{total}{" "}
              </h1>
            </div>

            <div className="flex flex-col items-center justify-center bg-black text-white p-4 w-[80%] mx-auto max max-phone:w-[100%] max-phone:px-2">
              <div className="flex justify-end mb-4 w-full pr-2">
                <button
                  className="text-white px-8 py-5 w-1/12 rounded-full relative"
                  style={{ backgroundColor: "#DEA001" }}
                  onClick={() => setShowModal(true)}
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full">
                    Buy
                  </span>
                </button>
              </div>
              <div className="space-y-10 w-full">
                {items.map((product) => (
                  <div
                    key={product.idOrder}
                    className="group flex items-center relative"
                  >
                    <div className="w-[163px] h-[160px] max-phone:w-[100px] max-phone:h-[100px] max-tablet:w-[130px] max-tablet:h-[130px] relative overflow-hidden rounded-lg">
                      <Image
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="ml-5 w-1 max-phone:ml-2 py-3 flex-grow flex flex-col justify-between max-phone:w-2/3 h-[160px] max-phone:h-[100px] max-tablet:h-[130px]">
                      <h4 className="text-white font-semibold truncate text-[20px] max-phone:text-[14px] max-tablet:text-[15px]">
                        {product.name}
                      </h4>
                      <div className="">
                        <h4 className="text-[17px] font-medium truncate-multiline text-gray-400 max-phone:text-[12px] max-tablet:text-[13px]">
                          {product.description}
                        </h4>
                      </div>
                      <div className="flex mt-auto">
                        <h4 className="text-lg font-bold text-white max-phone:text-[15px] max-tablet:text-[17px]">
                          {product.price}€
                        </h4>
                        <div className="flex items-center justify-end space-x-2 w-full">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(product.idOrder, -1)
                            }
                            className="text-white bg-[#4A4A4A] px-2 rounded-full"
                          >
                            -
                          </button>
                          <span className="text-[20px] max-phone:text-[14px] max-tablet:text-[15px]">
                            {product.orderquantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(product.idOrder, 1)
                            }
                            className="text-white bg-[#5A430B] px-1.5 rounded-full"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white rounded-3xl p-9 max-w-lg w-full max-h-[90vh] overflow-y-auto sm:max-h-[80vh] sm:p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="">
                <button
                  onClick={handleCloseModal}
                  className="text-black absolute top-5 right-5 text-3xl "
                >
                  &times;
                </button>
              </div>
              <h2 className="font-semibold text-3xl mb-4 text-center text-black">
                Order Confirmation
              </h2>
              <div className="flex justify-between mb-4">
                <button
                  className={`py-2 px-10 rounded-full ${
                    !isToGo
                      ? "bg-[#DEA001] text-white"
                      : "bg-white text-[#DEA001] border-2 border-[#DEA001]"
                  }`}
                  onClick={() => handleToGoChange(false)}
                >
                  Table
                </button>
                <button
                  className={`py-2 px-10 rounded-full ${
                    isToGo
                      ? "bg-[#DEA001] text-white"
                      : "bg-white text-[#DEA001] border-2 border-[#DEA001]"
                  }`}
                  onClick={() => handleToGoChange(true)}
                >
                  To go
                </button>
              </div>
              <form>
                <div className="mb-4">
                  <label className="font-semibold block text-[#4A4A4A]">
                    Names
                  </label>
                  <input
                    type="text"
                    className="font-semibold w-full p-2 border rounded"
                    placeholder="Ex: Ana Patiño"
                    style={{ color: "#4A4A4A" }}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="font-semibold text-gray-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="font-semibold block text-[#4A4A4A]">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="font-semibold w-full p-2 border rounded"
                    placeholder="Ex: 3015634567"
                    style={{ color: "#4A4A4A" }}
                    {...register("phone", {
                      required: "Phone is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numeric values are allowed",
                      },
                    })}
                  />
                  {errors.phone && (
                    <p className="font-semibold text-gray-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                {isToGo && (
                  <div className="mb-4">
                    <label className="font-semibold block text-[#4A4A4A]">
                      Address
                    </label>
                    <input
                      type="text"
                      className="font-semibold w-full p-2 border rounded"
                      placeholder="Ex: Los cortijos"
                      style={{ color: "#4A4A4A" }}
                      {...register("address", {
                        required: "Address is required",
                      })}
                    />
                    {errors.address && (
                      <p className="font-semibold text-gray-600">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                )}
                <div className="mb-4">
                  <label className="font-semibold block text-[#4A4A4A]">
                    Method of payment
                  </label>
                  <div className="flex items-center space-x-4 pt-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="mr-2 accent-[#DEA001]"
                        value="cash"
                        {...register("paymentMethod", {
                          required: "Payment method is required",
                        })}
                      />
                      <span className="font-semibold text-[#4A4A4A]">
                        Payment in cash
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="mr-2 accent-[#DEA001]"
                        value="transfer"
                        {...register("paymentMethod", {
                          required: "Payment method is required",
                        })}
                      />
                      <span className="font-semibold text-[#4A4A4A]">
                        Transfer
                      </span>
                    </label>
                  </div>
                  {errors.paymentMethod && (
                    <p className="font-semibold text-gray-600">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>
                {watch("paymentMethod") === "cash" && (
                  <div className="mb-4">
                    <label className="font-semibold block text-[#4A4A4A]">
                      Cash value
                    </label>
                    <input
                      type="number"
                      className="font-semibold w-full p-2 border rounded"
                      placeholder="Ex: 5"
                      style={{ color: "#4A4A4A" }}
                      {...register("cashValue", {
                        required: "Cash value is required",
                        min: {
                          value: total,
                          message: `Cash value must be greater than or equal to $${total}`,
                        },
                      })}
                    />
                    {errors.cashValue && (
                      <p className="font-semibold text-gray-600">
                        {errors.cashValue.message}
                      </p>
                    )}
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit(handleConfirm)}
                    className="bg-[#FCCC00] text-white py-2 px-8 rounded-full"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showModalConfirm && (
          <ModalConfirm
            title="Order successfully placed"
            message="Your order has been placed successfully
            Go to WhatsApp chat"
            type="order"
            onClose={handleModalConfirmClose}
            onClick={() => handleModalConfirmClose()}
          />
        )}
        {showStarRating && (
          <StarRating
            name={userName}
            phone={userPhone}
            onClose={handleModalRatingClose}
          />
        )}
        <FooterMenu />
      </div>
    </div>
  );
};

export default ShoppingCart;
