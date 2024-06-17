import Image from "next/image";
import React, { useState, useEffect } from "react";
import maiz_white from "../../../public/svg/logo/maiz_white.svg";
import background from "../../../public/svg/menu/background_menu.svg";
import { useRouter } from "next/navigation";

export default function HeaderPrincipal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const tabs = [
    {
      id: 1,
      name: "Home",
      label: "",
    },
    {
      id: 2,
      name: "Menu",
      label: "",
    },
    {
      id: 3,
      name: "Shendule",
      label: "",
    },
  ];

  const handleClick = (tab: string) => {
    setActiveTab(tab);

    switch (tab) {
      case "Home":
        router.push("/");
        break;
      case "Menu":
        router.push("/menu");
        break;
      case "Shendule":
        router.push("/");
        break;
      case "Login":
        router.push("/login");
        break;
      default:
        break;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleBodyOverflow = () => {
      if (isMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };
    handleBodyOverflow();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`animate__animated animate__fadeInDown flex items-center justify-around w-[100%] text-white z-40 text-2xl font-semibold fixed ${
        scrollPosition > 0 ? "backdrop-blur-sm" : "backdrop-blur-sm"
      }`}
    >
      <div className="w-full text-center py-4">
        <div className="flex flex-row max-phone:hidden items-center justify-center mt-3 gap-36">
          <label onClick={() => handleClick("Menu")} className="cursor-pointer">
            Menu
          </label>
          <a href="/" className="mb-3">
            <Image src={maiz_white} alt="log maiz" width={120} height={90} />
          </a>
          <label
            className="cursor-pointer"
            onClick={() => handleClick("Login")}
          >
            Login
          </label>
        </div>
        <div className="hidden max-phone:block ">
          <div className="flex flex-row  px-5 items-center justify-between mt-3  ">
            <a href="/" className="mb-3">
              <Image src={maiz_white} alt="Logo maiz" width={80} height={80} />
            </a>
            <button onClick={toggleMenu} className="z-60">
              {isMenuOpen ? (
                <i className="bi bi-x-lg h-10 w-10 text-white"></i>
              ) : (
                <i className="bi bi-list h-10 w-10 text-white"></i>
              )}
            </button>
          </div>
        </div>

        {!isMenuOpen && (
          <ul className="hidden md:flex items-center justify-around my-3">
            {tabs.slice(0, 2).map((tab) => (
              <li
                key={tab.id}
                className={`cursor-pointer w-[50%]`}
                onClick={() => handleClick(tab.name)}
              >
                <span
                  className={`pb-2 ${
                    activeTab === tab.name ? "border-b-2 border-white " : ""
                  } hover:border-b-2`}
                >
                  {tab.name}
                </span>
              </li>
            ))}
            <a
              href="/"
              className="2xl:w-[20%] xl:w-[20%] md:w-[16%] sm:w-[16%] max-[750px]:w-[16%] transition-all hover:scale-110"
            >
              <Image priority src={maiz_white} alt="Logotype maiz" />
            </a>
            {tabs.slice(2, 4).map((tab) => (
              <li
                key={tab.id}
                className={`cursor-pointer w-[50%]`}
                onClick={() => handleClick(tab.name)}
              >
                <span
                  className={`pb-2 ${
                    activeTab === tab.name ? "border-b-2 border-white " : ""
                  } hover:border-b-2`}
                >
                  {tab.name}
                </span>
              </li>
            ))}
          </ul>
        )}
        {isMenuOpen && (
          <div
            className="absolute top-0 left-0 w-full h-screen bg-black overflow-hidden"
            style={{
              backgroundImage: `url(${background.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="flex items-center justify-between mx-8 mt-5 h-[10%]">
              <Image
                src={maiz_white}
                alt="Logo Foodpoint"
                width={80}
                height={80}
              />
              <button onClick={toggleMenu}>
                <i className="bi bi-x-lg h-10 w-10 text-white"></i>
              </button>
            </div>
            <div className="flex flex-col items-center justify-center h-[65%]">
              <ul>
                {tabs.map((tab) => (
                  <li
                    key={tab.id}
                    className={`cursor-pointer mb-10 pb-2 ${
                      activeTab === tab.name ? "border-b-2 border-white " : ""
                    }`}
                    onClick={() => {
                      handleClick(tab.name);
                      toggleMenu();
                    }}
                  >
                    <label>{tab.name}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
