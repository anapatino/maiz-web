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
    infinite: categories.length > 1,
    speed: 750,
    slidesToShow: Math.min(6, categories.length),
    slidesToScroll: 1,
    prevArrow: <CustomArrowLeft />,
    nextArrow: <CustomArrowRight />,
    draggable: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(4, categories.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(3, categories.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: Math.min(3, categories.length),
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-[70%] mx-auto relative">
      {categories.length > 0 ? (
        <Slider {...settings}>
          {categories.map((category, index) => (
            <div
              key={index}
              className="text-center relative cursor-pointer"
              onClick={() => onCategorySelect(category)}
            >
              <div className="mx-auto rounded-full bg-[#5A430B] w-[110px] h-[110px] max-tablet:w-[90px] max-tablet:h-[90px] max-phone:w-[70px] max-phone:h-[70px] flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    layout="fill"
                    objectFit="cover"
                    className=""
                  />
                </div>
              </div>
              <h4 className="text-[18px] pt-[6px] max-phone:text-[14px] max-tablet:text-[15px]">{category.name}</h4>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <h2 className="mb-4 text-3xl text-center">
            No categories available.
          </h2>
        </div>
      )}
    </div>
  );
}
