import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { Category } from "@/domain/category";
import { CategoryRequest } from "../../data/repository/category_request";
import arrowright from "../../../public/svg/arrows/arrow_right.svg";
import arrowleft from "../../../public/svg/arrows/arrow_left.svg";

interface ArrowProps {
  onClick?: () => void;
}

const CustomArrowLeft: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 z-10"
    onClick={onClick}
  >
    <Image src={arrowleft} alt="Previous"
      className="w-[36px] h-[36px] max-phone:w-[24px] max-phone:h-[24px] max-tablet:w-[30px] max-tablet:h-[30px]"
      width={36} height={36}
    />
  </button>
);

const CustomArrowRight: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 z-10"
    onClick={onClick}
  >
    <Image src={arrowright} alt="Next"
      className="w-[36px] h-[36px] max-phone:w-[24px] max-phone:h-[24px] max-tablet:w-[30px] max-tablet:h-[30px]"
      width={36} height={36}
    />
  </button>
);

interface CarouselMenuProps {
  onCategorySelect: (category: Category) => void;
}

export default function CarouselMenu({ onCategorySelect }: CarouselMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await CategoryRequest.getAllCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 750,
    slidesToShow: 6,
    slidesToScroll: 1,
    prevArrow: <CustomArrowLeft />,
    nextArrow: <CustomArrowRight />,
    draggable: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-[70%] mx-auto relative">
      <Slider {...settings}>
        {categories.map((category, index) => (
          <div
            key={index}
            className="text-center relative cursor-pointer"
            onClick={() => onCategorySelect(category)} // Pasar el objeto completo de la categoría
          >
            <div className="mx-auto rounded-full bg-[#5A430B] w-[110px] h-[110px] max-tablet:w-[90px] max-tablet:h-[90px] max-phone:w-[70px] max-phone:h-[70px]">
              <Image
                src={category.image}
                alt={category.name}
                className="p-6 max-phone:p-5"
                width={110}
                height={110}
              />
            </div>
            <h4 className="text-[18px] pt-[6px] max-phone:text-[14px] max-tablet:text-[15px]">{category.name}</h4>
          </div>
        ))}
      </Slider>
    </div>
  );
}
