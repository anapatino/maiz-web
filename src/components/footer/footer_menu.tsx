import Image from "next/image";
import instagram from "../../../public/svg/footer/instagram.svg";
import maiz_yellow from "../../../public/svg/logo/maiz_yellow.svg";
import facebook from "../../../public/svg/footer/facebook.svg";
import Link from 'next/link';

export default function FooterMenu() {
    return(
      <div className="w-full overflow-hidden relative z-10">
        <div className="h-[300px] bg-transparent">
          <div className="max-phone:hidden">
            <div className="absolute bottom-[20%] h-[30%] left-0 right-0 flex justify-center items-center">
              <div className="absolute left-[15%] ">
                <Image src={maiz_yellow} alt="Maiz" className="w-32 h-auto" />
              </div>
              <div className="flex justify-center items-center gap-8">
                <a href="" className="w-10">
                  <Image src={facebook} alt="Facebook" width={50} className="svg-color"/>
                </a>
                <a href="https://www.instagram.com/maizmalta">
                  <Image src={instagram} alt="Instagram" width={40} className="svg-color"/>
                </a>
              </div>
              <div className="flex flex-col absolute right-[15%] text-center items-center space-y-2 text-xl">
                <Link href="/" className="text-[#FCCC00] cursor-pointer">
                  <label>Home</label>
                </Link>
                <Link href="/menu" className="text-[#FCCC00] cursor-pointer">
                  <label>Menu</label>
                </Link>
                <Link href="/" className="text-[#FCCC00] cursor-pointer">
                  <label>Schedule</label>
                </Link>
              </div>
              <div className="absolute -bottom-1/2 left-0 right-0 flex justify-center items-end ">
                <a
                  href="https://www.linkedin.com/in/ana-sofia-pati%C3%B1o-19a0a8237/"
                  target="_blank"
                >
                  <label className="text-xl text-[#FCCC00]">Powered by Anape</label>
                </a>
              </div>
            </div>
          </div>
          <div className=" hidden max-phone:block">
            <div className="flex flex-col absolute bottom-[20%] h-[30%] left-0 right-0 justify-center items-center space-y-6 text-xl">
              <Image src={maiz_yellow} alt="Maiz" className="h-10" />
              <div className="text-center items-center space-x-8">
                <Link href="/" className="text-[#FCCC00] cursor-pointer">
                  <label>Home</label>
                </Link>
                <Link href="/menu" className="text-[#FCCC00] cursor-pointer">
                  <label>Menu</label>
                </Link>
                <Link href="/" className="text-[#FCCC00] cursor-pointer">
                  <label>Schedule</label>
                </Link>
              </div>

              <div className="flex flex-row justify-center items-center gap-8">
                <a href="" target="_blank" className="">
                  <Image src={facebook} alt="Facebook" width={30} className="svg-color"/>
                </a>
                <a href="" target="_blank" className="">
                  <Image src={instagram} alt="Instagram" width={30} className="svg-color"/>
                </a>
              </div>
              <a
                href="https://www.linkedin.com/in/ana-sofia-pati%C3%B1o-19a0a8237/"
                target="_blank"
              >
                <label className="text-[#FCCC00]">Powered by Anape</label>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
}
