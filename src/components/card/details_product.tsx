import React, { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "./modal";
import { Product, ProductResponse } from "@/domain/product";

type isVisible = {
  isOpen: boolean;
  onClose: () => void;
  product: ProductResponse;
};

const DetailsProduct: React.FC<isVisible> = ({ isOpen, onClose, product }) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleClose = () => {
    setImagePreviewUrl(null);
    onClose();
  };

  useEffect(() => {
    if (product) {
      setImagePreviewUrl(product.image);
    }
  }, [product]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
      <div className=" flex flex-row bg-black text-white rounded-xl pr-14 relative w-[950px] max-h-[90vh] overflow-y-auto max-phone:w-[100%] max-phone:h-full max-phone:max-h-[none] max-phone:px-7 box-shadow-white-smooth">
        <div className="relative w-[90%]  rounded-xl mr-6 overflow-hidden">
          {imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
              alt="Upload Preview"
              className="object-cover w-full h-full rounded-xl"
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className="flex flex-col pt-4 pb-2">
          <div className="absolute top-5 right-5 text-3xl">
            <button onClick={handleClose}>&times;</button>
          </div>
          <h1 className="text-2xl mt-6 text-primary">{product.name}</h1>
          <h1 className="text-xl my-2 text-primary">{product.price}€</h1>
          <h4 className="text-lg font-bold">Description</h4>
          <label className="text-lg">{product.description}</label>
          <div className="w-[430px] h-[330px] pl-1 overflow-y-auto overflow-x-hidden">
            {product.options!.map((option, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-xl font-bold text-accent">
                  {option.label}:
                </label>
                <label className="text-lg">{option.description}</label>
                {option.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <li className="text-lg ">
                      {item.label} - {item.value}€
                    </li>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsProduct;
