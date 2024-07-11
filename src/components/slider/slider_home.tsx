import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { HomeDetailsRequest } from "../../data/repository/home_details_request";
import { Details } from "@/domain/home_details";

const SliderHome: React.FC = () => {
  const [details, setDetails] = useState<Details | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const homeDetails = await HomeDetailsRequest.getHomeDetails();
        setDetails(homeDetails);
      } catch (error) {
        console.error("Error fetching home details:", error);
      }
    };
    fetchDetails();
  }, []);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

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
      {details ? (
        <Slider {...settings}>
          {details.images.map((image, index) => (
            <div
              key={index}
              className="text-center relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={image.url}
                alt={image.title}
                width={300}
                height={300}
                className="mx-auto rounded-full w-[300px] h-[300px] max-tablet:w-[200px] max-tablet:h-[200px] max-phone:w-[150px] max-phone:h-[150px]"
              />
              {hoveredIndex === index && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="rounded-full w-[300px] h-[300px] max-tablet:w-[200px] max-tablet:h-[200px] max-phone:w-[150px] max-phone:h-[150px] backdrop-filter backdrop-blur-sm bg-white bg-opacity-0 flex justify-center items-center">
                    <h1 className="text-white text-4xl max-tablet:text-2xl max-phone:text-lg">
                      {image.title}
                    </h1>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Slider>
      ) : (
        <div className="text-center justify-center">
          <h2 className="absolute text-4xl text-center w-[100%]">
            Loading...
          </h2>
        </div>
      )}
    </div>
  );
};

export default SliderHome;
