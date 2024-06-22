import Image from "next/image";
import instagram from "../../../public/svg/footer/instagram.svg";
import maiz_yellow from "../../../public/svg/logo/maiz_yellow.svg";
import facebook from "../../../public/svg/footer/facebook.svg";
import Link from 'next/link';

export default function FooterMenu() {
  return (
    <footer className="bg-black bg-opacity-75 py-4 w-full mt-auto">
      <div className="w-full overflow-hidden relative">
        <div className="bg-transparent">
          <div className="hidden max-phone:flex flex-col justify-center items-center p-4">
            <Image src={maiz_yellow} alt="Maiz" className="h-10 mb-4" />
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
            <div className="flex flex-row justify-center items-center gap-8 mt-4">
              <a href="" target="_blank" className="">
                <Image src={facebook} alt="Facebook" width={30} className="svg-color" />
              </a>
              <a href="https://www.instagram.com/maizmalta" target="_blank" className="">
                <Image src={instagram} alt="Instagram" width={30} className="svg-color" />
              </a>
            </div>
            <a
              href="https://www.linkedin.com/in/ana-sofia-pati%C3%B1o-19a0a8237/"
              target="_blank"
              className="mt-4"
            >
              <label className="text-[#FCCC00]">Powered by Anape</label>
            </a>
          </div>
          
          <div className="max-phone:hidden flex justify-center items-center relative py-8">
            <div className="absolute left-[15%]">
              <Image src={maiz_yellow} alt="Maiz" className="w-32 h-auto" />
            </div>
            <div className="pb-10">
              <div className="flex justify-center items-center gap-8">
                <a href="" className="w-10">
                  <Image src={facebook} alt="Facebook" width={50} className="svg-color" />
                </a>
                <a href="https://www.instagram.com/maizmalta">
                  <Image src={instagram} alt="Instagram" width={40} className="svg-color" />
                </a>
              </div>
              <div className="absolute left-0 right-0 flex justify-center items-end pt-4">
                <a
                  href="https://www.linkedin.com/in/ana-sofia-pati%C3%B1o-19a0a8237/"
                  target="_blank"
                >
                  <label className="text-xl text-[#FCCC00]">Powered by Anape</label>
                </a>
              </div>
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
          </div>
        </div>
      </div>
    </footer>
  );
}