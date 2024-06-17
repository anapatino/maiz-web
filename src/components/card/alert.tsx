import { motion } from "framer-motion";
import { useState } from "react";

const Alert = ({
  title,
  message,
  type,
  onClose,
}: {
  title: string;
  message: string;
  type?: "success" | "error" | "warning";
  onClose?: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const animationVariants = {
    hidden: {
      y: "40%",
      opacity: 0,
      scale: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  if (!isVisible) {
    return <div></div>;
  }

  const iconClassName = `bi ${
    type === "success"
      ? "bi-check-circle-fill"
      : type === "error"
      ? "bi-x-circle-fill"
      : "bi-exclamation-circle-fill"
  } ml-4`;

  const iconColor = `${
    type === "success"
      ? "rgb(21 128 61)"
      : type === "error"
      ? "rgb(127 29 29)"
      : "rgb(180 83 9)"
  }`;

  const background = `${
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-700"
      : "bg-amber-600"
  }`;
  return (
    <motion.div
      variants={animationVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: "absolute",
        bottom: "1rem",
        right: "2rem",
      }}
      className={`w-1/3 h-auto ${background} rounded-lg text-white p-2`}
    >
      <div className="flex" style={{ width: "100%" }}>
        <i
          className={iconClassName}
          style={{ fontSize: "2.9rem", color: iconColor }}
        ></i>
        <div className="ml-8 p-1" style={{ width: "90%" }}>
          <p className="text-lg font-bold tracking-wide">{title}</p>
          <p className="text-base font-normal tracking-wide">{message}</p>
        </div>
        <button
          className="ml-auto text-white  rounded-md p-2"
          onClick={onClose}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
    </motion.div>
  );
};

export default Alert;
