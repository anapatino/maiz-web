import React from "react";
import Image from "next/image";
import dangerous_exclamation from "../../../public/svg/modal/dangerous_exclamation.svg";
import check_category_y from "../../../public/svg/modal/check_yellow.svg";

interface types {
  title: string;
  message: string;
  type: "error" | "success" | "warning" | "delete" | "order";
  onClose: () => void;
  onClick: () => void;
}

const Modal: React.FC<types> = ({ title, message, type, onClose, onClick }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="relative bg-white rounded-lg px-10 py-5 w-96 shadow-lg text-center">
        <button
          className="absolute top-2 right-2 p-2 text-gray-500 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>
        {type === "error" && (
          <div>
            <div className="text-2xl mb-4 flex justify-center items-center">
              <i
                className="bi bi-x-circle-fill text-danger"
                style={{ fontSize: "3.5rem" }}
              ></i>
            </div>
            <h1 className="text-xl mb-2 text-danger">{title}</h1>
          </div>
        )}
        {type === "delete" && (
          <div>
            <div className="text-2xl mb-4 flex justify-center items-center">
              <i
                className="bi bi-exclamation-circle-fill text-danger"
                style={{ fontSize: "3.5rem" }}
              ></i>
            </div>
            <h1 className="text-xl mb-2 text-danger">{title}</h1>
          </div>
        )}
        {type === "success" && (
          <div>
            <i
              className="bi bi-check-circle-fill text-accent"
              style={{ fontSize: "3.5rem" }}
            ></i>
            <h4 className="text-xl mb-2 font-semibold text-accent">{title}</h4>
          </div>
        )}
        {type === "order" && (
          <div>
              <i className="bi bi-check-circle-fill text-accent"  style={{ fontSize: "3.5rem" }}></i>
            <h4 className="text-xl mb-2 font-semibold text-accent">{title}</h4>
          </div>
        )}
        {type === "warning" && (
          <div>
            <i
              className="bi bi-exclamation-circle-fill text-warning"
              style={{ fontSize: "3.5rem" }}
            ></i>
            <h4 className="text-xl mb-2 font-bold text-warning">{title}</h4>
          </div>
        )}

        <h4 className="mb-4 text-black">{message}</h4>
        {type === "delete" && (
          <div className="flex justify-between mt-4">
            <button
              className="bg-white text-grayLabel font-semibold rounded px-4 py-2 "
              onClick={onClose}
            >
              <h4>Back</h4>
            </button>
            <button
              onClick={onClick}
              className="bg-danger font-semibold text-white rounded px-4 py-2 "
            >
              <h4>Continue</h4>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
