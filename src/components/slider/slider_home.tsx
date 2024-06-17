import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Slider1 from "../../../public/images/home/slider1.jpg";
import Slider2 from "../../../public/images/home/slider2.jpg";
import Slider3 from "../../../public/images/home/slider3.jpg";
import Slider4 from "../../../public/images/home/slider4.jpg";
import Slider5 from "../../../public/images/home/slider5.jpg";

export default function SliderHome() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index: any) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const sliders = [
    {
      image: Slider1,
      title: "Empanadas",
    },
    {
      image: Slider2,
      title: "Bandeja paisa",
    },
    {
      image: Slider3,
      title: "Buñuelos",
    },
    {
      image: Slider4,
      title: "Arroz de coco",
    },
    {
      image: Slider5,
      title: "Platanitos",
    },
  ];

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
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
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-[100%] my-6 max-tablet:my-2">
      <Slider {...settings}>
        {sliders.map((slider, index) => (
          <div
            key={index}
            className="text-center relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={slider.image}
              alt={`slider${index + 1}`}
              width={300}
              height={300}
              className="mx-auto rounded-full w-[300px] h-[300px] max-tablet:w-[200px] max-tablet:h-[200px] max-phone:w-[150px] max-phone:h-[150px]"
            />
            {hoveredIndex === index && (
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="rounded-full w-[300px] h-[300px] max-tablet:w-[200px] max-tablet:h-[200px] max-phone:w-[150px] max-phone:h-[150px]  backdrop-filter backdrop-blur-sm bg-white bg-opacity-0 flex justify-center items-center">
                  <h1 className="text-white text-4xl max-tablet:text-2xl max-phone:text-lg">
                    {slider.title}
                  </h1>
                </div>
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
}
