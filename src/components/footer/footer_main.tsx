import Image from "next/image";
import bg_footer from "../../../public/svg/footer/bg_footer.svg";
import bg_footer_mobile from "../../../public/svg/footer/bg_footer_mobile.svg";
import instagram from "../../../public/svg/footer/instagram.svg";
import maiz_white from "../../../public/svg/logo/maiz_white.svg";
import facebook from "../../../public/svg/footer/facebook.svg";

export default function FooterMain() {
  return (
    <div className="w-full h-full overflow-hidden relative z-10 mt-6">
      <Image
        src={bg_footer}
        alt="footer"
        layout="responsive"
        className="max-phone:hidden"
      />
      <div className="max-phone:hidden">
        <div className="absolute bottom-[20%] h-[30%] left-0 right-0 flex justify-center items-center">
          <div className="absolute left-[15%] ">
            <Image src={maiz_white} alt="Maiz" className="w-32 h-auto"/>
          </div>
          <div className="flex justify-center items-center gap-8">
            <a href="" className="w-10">
              <Image src={facebook} alt="Facebook" width={50} />
            </a>
            <a href="https://www.instagram.com/maizmalta">
              <Image src={instagram} alt="Instagram" width={40} />
            </a>
          </div>
          <div className="flex flex-col absolute right-[15%] text-center items-center space-y-2 text-xl">
            <a href="">
              <label className="cursor-pointer">Home</label>
            </a>
            <a href="/menu">
              <label className="cursor-pointer">Menu</label>
            </a>
            <a href="">
              <label className="cursor-pointer">Schedule</label>
            </a>
          </div>
          <div className="absolute -bottom-1/2 left-0 right-0 flex justify-center items-end ">
            <a
              href="https://www.linkedin.com/in/ana-sofia-pati%C3%B1o-19a0a8237/"
              target="_blank"
            >
              <label className="text-xl">Powered by Anape</label>
            </a>
          </div>
        </div>
      </div>
      <Image
        src={bg_footer_mobile}
        alt="footer_mobile"
        layout="responsive"
        className="hidden max-phone:block top-20"
      />
      <div className=" hidden max-phone:block">
        <div className="flex flex-col absolute bottom-[20%] h-[30%] left-0 right-0 justify-center items-center space-y-6 text-xl">
          <Image src={maiz_white} alt="Maiz" className="w-[150px] h-auto" />
          <div className="text-center items-center space-x-8">
            <a href="">
              <label className="cursor-pointer">Home</label>
            </a>
            <a href="/menu">
              <label className="cursor-pointer">Menu</label>
            </a>
            <a href="">
              <label className="cursor-pointer">Schedule</label>
            </a>
          </div>
          <div className="flex flex-row justify-center items-center gap-8">
            <a href="" target="_blank" className="">
              <Image src={facebook} alt="Facebook" width={30} />
            </a>
            <a
              href="https://www.instagram.com/maizmalta"
              target="_blank"
              className=""
            >
              <Image src={instagram} alt="Instagram" width={30} />
            </a>
          </div>
          <a
            href="https://www.linkedin.com/in/ana-sofia-pati%C3%B1o-19a0a8237/"
            target="_blank"
          >
            <label>Powered by Anape</label>
          </a>
        </div>
      </div>
    </div>
  );
}
