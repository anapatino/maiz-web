"use client";
import Image from "next/image";
import bg_home from "../../public/svg/home/bg_home.svg";
import maiz from "../../public/svg/logo/maiz_yellow.svg";
import dish_with_some_food from "../../public/svg/home/dish_with_some_food.svg";
import fork_and_knife from "../../public/svg/home/fork_and_knife.svg";
import empanadas_with_points from "../../public/svg/home/empanadas_with_points.svg";
import three_points from "../../public/svg/home/three_points.svg";
import dish_with_meatballs from "../../public/svg/home/dish_with_meatballs.svg";
import FooterMain from "@/components/footer/footer_main";
import SliderHome from "@/components/slider/slider_home";
import HeaderPrincipal from "@/components/header/header_principal";

export default function Home() {
  return (
    <main className="overflow-hidden flex flex-col items-center justify-between min-h-screen p-0 m-0 bg-black relative text-white">
      <HeaderPrincipal />
      <div className="w-full overflow-hidden relative z-10">
        <Image
          src={bg_home}
          alt="Background home"
          layout="responsive"
          className="w-full h-auto"
        />
        <div className="absolute inset-0 flex items-center justify-center top-[-5.5%]">
          <div className="w-[30%] h-[30%]">
            <Image src={maiz} alt="maiz SVG" layout="responsive" />
          </div>
        </div>
        <i
          className="absolute left-[50%] top-[75%]  animate__animated animate__fadeInDown bi bi-arrow-down-circle-fill mt-12 opacity-3 animate-bounce max-phone:top-[55%] max-phone:left-[45%]"
          style={{ fontSize: "35px" }}
        ></i>
      </div>
      <div className=" relative flex flex-col overflow-hidden justify-center items-center w-full h-[700px] max-tablet:h-[400px] max-phone:h-[200px] ">
        <Image
          src={dish_with_some_food}
          alt="Image dish with some food"
          className="absolute w-[50%] h-[80%] left-[-15%] top-[15%] max-tablet:h-[70%] max-tablet:top-[20%] max-tablet:left-[-16%] max-phone:h-[80%] max-phone:top-[10%] max-phone:left-[-19%]"
        />

        <h2
          className="absolute text-6xl text-center w-[50%] max-tablet:text-5xl max-tablet:w-[70%] max-tablet:top-[20%] max-phone:top-[30%] max-phone:w-[70%] 
        "
        >
          At Maíz, discover the authentic essence of Colombian cuisine in every
          bite.
        </h2>

        <Image
          src={fork_and_knife}
          alt="Fork and Knife"
          className="absolute w-[60%] h-[90%] right-[-18%] top-[10%]  max-tablet:h-[80%] max-tablet:top-[12%] max-tablet:right-[-20%] max-phone:h-[80%] max-phone:top-[10%] max-phone:right-[-25%] z-20"
        />
      </div>
      <SliderHome />
      <div className="relative h-[600px]  max-phone:h-[450px] w-full items-center my-16">
        <Image
          src={empanadas_with_points}
          alt="Empanadas with points"
          className="h-[100%] left-1 absolute max-phone:h-[60%] max-phone:left-[-20%] max-phone:top-[35%]"
        />

        <h2 className=" absolute top-[25%] right-[10%] z-20 text-5xl text-center w-[45%] max-phone:w-[70%] max-phone:top-15 max-phone:right-[5%] max-tablet:w-[55%] max-tablet:right-[5%] max-tablet:text-4xl max-tablet:top-20 ">
          Discover Maíz: authentic, fresh and sustainable Colombian
          cuisine.Traditional flavours await you in every dish, come and enjoy!
        </h2>
      </div>
      <div className=" w-full relative overflow-hidden flex flex-col justify-center items-center my-10">
        <Image
          src={three_points}
          alt="Three points on space"
          className="absolute w-[50%] h-[70%] left-[-17%] top-[4%] max-tablet:h-[40%] z-30 max-phone:hidden"
        />
        <h1 className="text-center font-bold text-5xl mb-8 max-phone:text-4xl">
          OPENING HOURS
        </h1>
        <table className="w-[40%] mt-8 text-xl max-phone:mt-4  max-phone:text-base max-tablet:w-[65%] max-phone:w-[80%]">
          <tbody className="juctify-center items-center">
            <tr className="">
              <td className="text-3xl py-2 w-[55%]  max-phone:w-[50%] max-phone:text-xl">
                <label>Tuesday</label>
              </td>
              <td className="py-2 flex justify-start">
                <i className="bi bi-clock-fill mx-2"></i>
                <label>5:00 PM - 11:00 PM</label>
              </td>
            </tr>
            <tr>
              <td className="py-2 text-3xl  max-phone:text-xl">
                <label>Wednesday</label>
              </td>
              <td className="py-2 flex justify-start">
                <i className="bi bi-clock-fill mx-2"></i>
                <label>5:00 PM - 11:00 PM</label>
              </td>
            </tr>
            <tr>
              <td className="py-2 text-3xl max-phone:text-xl">
                <label>Thursday</label>
              </td>
              <td className="py-2 flex justify-start">
                <i className="bi bi-clock-fill mx-2"></i>
                <label>12:00 PM - 10:00 PM</label>
              </td>
            </tr>
            <tr>
              <td className="py-2 text-3xl  max-phone:text-xl">
                <label>Friday</label>
              </td>
              <td className=" py-2 flex justify-start">
                <i className="bi bi-clock-fill mx-2"></i>
                <label>12:00 PM - 10:00 PM</label>
              </td>
            </tr>
            <tr>
              <td className=" py-2 text-3xl  max-phone:text-xl text-primary">
                <label>Saturday</label>
              </td>
              <td className="py-2 flex justify-start text-primary">
                <i className="bi bi-clock-fill mx-2"></i>
                <label>12:00 PM - 10:00 PM</label>
              </td>
            </tr>
            <tr>
              <td className="py-2 text-3xl max-phone:text-xl text-primary">
                <label>Sunday</label>
              </td>
              <td className="py-2 flex justify-start text-primary">
                <i className="bi bi-clock-fill mx-2"></i>
                <label>12:00 PM - 10:00 PM</label>
              </td>
            </tr>
          </tbody>
        </table>
        <Image
          src={dish_with_meatballs}
          alt="Dish with meatballs"
          className="absolute w-[50%] h-[90%] right-[-17%] top-[4%] max-tablet:h-[50%] max-tablet:top-[8%] max-phone:opacity-40"
        />
      </div>
      <FooterMain />
    </main>
  );
}
