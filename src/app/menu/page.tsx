"use client";
import React, { useState, useEffect, useMemo} from "react";
import Image from "next/image";
import group from "../../../public/svg/menu/bg_header_menu.svg";
import car from "../../../public/svg/shoppingcart/car.svg";
import "../globals.css";
import FooterMenu from "@/components/footer/footer_menu";
import CarouselMenu from "@/components/carousel/carousel_menu";
import SearchBar from "@/components/search/search_bar";
import ShoppingCart from "@/components/cart/shopping_cart";
import { ProductRequest } from "../../data/repository/product_request";
import { ProductResponse } from "@/domain/product";
import { Category } from "@/domain/category";
import { CategoryRequest } from "../../data/repository/category_request";
import { Options } from "@/domain/options";

interface ProductOnCart{
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  available: boolean;
  message: string;
  orderquantity: number;
  idOrder: number;
  options: Options[];
}

const getStatus = () => {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const isOpen = (day === 2 && hours >= 17 && (hours < 23 || (hours === 22 && minutes < 60))) || // Tuesday
                 (day === 3 && hours >= 17 && (hours < 23 || (hours === 22 && minutes < 60))) || // Wednesday
                 (day === 4 && hours >= 12 && (hours < 22 || (hours === 21 && minutes < 60))) || // Thursday
                 (day === 5 && hours >= 12 && (hours < 22 || (hours === 21 && minutes < 60))) || // Friday
                 (day === 6 && hours >= 12 && (hours < 22 || (hours === 21 && minutes < 60))) || // Saturday
                 (day === 0 && hours >= 12 && (hours < 22 || (hours === 21 && minutes < 60)));   // Sunday

  return isOpen;
};

export default function Menu() {  
  const isOpen = getStatus();
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [comments, setComments] = useState("");
  const [quantityA, setQuantity] = useState(1);
  const [cart, setCart] = useState<ProductOnCart[]>([]);
  const [isCartVisible, setIsCartVisible] = useState<boolean>(false);
  const [nextOrder, setNextOrder] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [optionError, setOptionError] = useState<{ [key: string]: string | null }>({});

  const [isMobileScreen, setIsMobileScreen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= 900; // Change to your custom breakpoint
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 900); // Change to your custom breakpoint
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await ProductRequest.getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await CategoryRequest.getAllCategories();
        setCategories(categories);
        if (categories.length > 0) {
          setSelectedCategory(categories[0]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const openModal = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setSelectedOption(null);
    setComments("");
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedProduct(null); 
    setSelectedOptions({});
    setIsModalOpen(false);
  };

  

  const handleOptionChange = (optionLabel: string, itemLabel: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionLabel]: itemLabel }));
    setOptionError(prev => ({ ...prev, [optionLabel]: null }));
  };

  const handleAdd = () => {
    let hasError = false;
    const newOptionError = { ...optionError };

    selectedProduct?.options.forEach(option => {
      if (!selectedOptions[option.label]) {
        hasError = true;
        newOptionError[option.label] = "Please select an option.";
      }
    });

    setOptionError(newOptionError);

    if (hasError) {
      return;
    }
    
    if (selectedProduct) {
      let totalOrder = calculateTotalPrice();
      const total = ""+totalOrder/quantityA;
      const selectedOptionDetails = selectedProduct.options.map((option) => ({
        ...option,
        items: option.items.filter((item) => item.label === selectedOptions[option.label]),
      }));

      const productToAdd: ProductOnCart = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        description: selectedProduct.description,
        category: selectedProduct.labelCategory,
        price: total,
        imageSrc: selectedProduct.image,
        imageAlt: selectedProduct.name,
        available: selectedProduct.available,
        message: comments,
        orderquantity: quantityA,
        idOrder: nextOrder,
        options: selectedOptionDetails,
      };
      setCart((prevCart) => {
        const existingItem = prevCart.find(item => item.id === productToAdd.id);
        const checkComment = prevCart.find(item => item.message === productToAdd.message);
        const checkOptions = prevCart.find(item => item.options === productToAdd.options);
        if (existingItem && checkComment && checkOptions) {
          return prevCart.map(item =>
            item.id === productToAdd.id &&
            item.message === productToAdd.message &&
            item.options === productToAdd.options
              ? { ...item, orderquantity: item.orderquantity + productToAdd.orderquantity }
              : item
          );
        } else {
          return [...prevCart, productToAdd];
        }
      });
      setNextOrder(nextOrder + 1);
      closeModal();
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantityA + 1);
  };

  const decrementQuantity = () => {
    if (quantityA > 1) {
      setQuantity(quantityA - 1);
    }
  };

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  const resetCartMenu = () => {
    setCart([]);
  };

  const updateQuantityPage = (idOrder: number, delta: number) => {
    setCart((items) => {
      const updatedItems = items.map((item) => {
        if (item.idOrder === idOrder && item.orderquantity + delta > 0) {
          return {
            ...item,
            orderquantity: item.orderquantity + delta,
          };
        }
        else if (item.idOrder === idOrder && item.orderquantity + delta <= 0) {
          return null;
        }
        else {
          return item;
        }
      }).filter((item): item is ProductOnCart => item !== null);
  
      return updatedItems;
    });
  };
  
  

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const nameMatches = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatches = selectedCategory?.id === product.idCategory;
      return nameMatches && categoryMatches;
    });
  }, [searchQuery, selectedCategory, products]);

  const calculateTotalPrice = () => {
    let total = parseFloat(selectedProduct?.price || "0") * quantityA;
  
    selectedProduct?.options.forEach(option => {
      const selectedItemLabel = selectedOptions[option.label];
      const selectedItem = option.items.find(item => item.label === selectedItemLabel);
      if (selectedItem) {
        total += parseFloat(selectedItem.value) * quantityA;
      }
    });
    return total;
  };
    

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-0 m-0 bg-black relative text-white">
      <div className="w-full overflow-hidden relative z-10 flex justify-center items-center">
        <Image
          src={group}
          alt="Background Menu"
          className="w-full h-auto"
        />
        <div className="absolute text-center">
          <h3 className="text-9xl max-phone:text-5xl max-tablet:text-8xl">
            MENU
          </h3>
        </div>
      </div>

      <div className="absolute top-4 right-16 z-50 flex items-center flex-row max-phone:top-1">
        <div className="flex items-center">
          <div className={`bg-white rounded-full py-2 px-4 flex items-center m-2`}>
            <div className={`w-4 h-4 rounded-full mr-2 ${isOpen ? 'bg-[#369f3f]' : 'bg-[#9F3636]'}`}></div>
            <div>
              <h4 className="text-sm font-semibold text-black">{isOpen ? 'OPEN' : 'CLOSED'}</h4>
              <h4 className="text-xs text-black">{isOpen ? 'order now' : 'order by later'}</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed top-4 right-4 z-50 flex items-center justify-end w-16 h-16 max-phone:top-1">
        <a
          onClick={toggleCartVisibility}
          className="flex items-center justify-center"
        >
          <Image
            src={car}
            alt="car"
            className="w-full h-full max-phone:w-2/3 max-phone:h-1/2 justicy-center cursor-pointer"
          />
        </a>
      </div>
      <CarouselMenu onCategorySelect={handleCategorySelect}/>

      <div className="w-[80%]">
        <div className="mx-auto pt-9">
          <div className="flex flex-row justify-between items-center mb-10">
            <div className="w-full phone:w-1/2">
              <h3 className="text-4xl phone:text-5xl tablet:text-6xl laptop:text-7xl desktop:text-8xl 2xl:text-9xl">
                {selectedCategory?.name}
              </h3>
            </div>
            <div className="flex justify-between items-center mt-4 phone:mt-0">
              {searchBarVisible ? (
                <div className="flex justify-center items-center">
                  <SearchBar onChange={setSearchQuery} />
                </div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-10 max-phone:h-5 cursor-pointer"
                  onClick={toggleSearchBar}
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 phone:grid-cols-2 tablet:grid-cols-2 laptop:grid-cols-2 desktop:grid-cols-2 xl:gap-x-10">
          {filteredProducts.map((product) => (
              <a
                key={product.id}
                className="group flex items-center relative"
                onClick={() => openModal(product)}
              >
                <div className="w-[163px] h-[160px] max-phone:w-[100px] max-phone:h-[100px] max-tablet:w-[130px] max-tablet:h-[130px] mr-4 relative overflow-hidden rounded-lg ">
                  <Image
                    src={product.image}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="w-1/2 overflow-y-scroll max-phone:w-2/3 h-[160px] max-phone:h-[100px] max-phone:overflow-hidden max-tablet:h-[130px] max-tablet:overflow-hidden">
                  <h4 className="text-white font-semibold text-[20px] max-phone:text-[14px] max-tablet:text-[15px]">
                    {product.name}
                  </h4>
                  <h4 className="text-[15px] font-medium max-phone:hidden max-tablet:hidden text-gray-400 max-phone:text-[12px] max-tablet:text-[13px]">
                    {product.description}
                  </h4>
                  <div className="flex items-center inset-0">
                    {!product.available && (
                      <h4
                        className="text-sm max-phone:text-[11px] max-tablet:text-[12px] bg-[#4A4A4A] font-semibold text-white px-2 rounded-full"
                        style={{ zIndex: 10 }}
                      >
                        No available
                      </h4>
                    )}
                    {product.available && (
                      <div className="w-2 h-2 bg-transparent" />
                    )}
                  </div>
                  <h4 className=" text-lg font-bold text-white max-phone:text-[15px] max-tablet:text-[17px]">
                    {product.price}€
                  </h4>
                  {product.available && (
                    <button
                      className="absolute bottom-0 right-0 p-2 rounded-full text-white w-8 h-8 flex items-center justify-center"
                      style={{ background: "#7F5B01" }}
                    >
                      <h2 className="text-4xl">+</h2>
                    </button>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && selectedProduct && selectedProduct.available && (
        <>
          {isMobileScreen ? (
            <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-hidden flex items-center justify-center">
              
              <div className="bg-black p-8 relative w-full max-w-lg max-h-screen overflow-y-auto">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-[#4A4A4A] rounded-full w-8 h-8 flex items-center justify-center text-white text-2xl"
                >
                  &times;
                </button>
                <div className="w-full flex justify-center">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    width={484}
                    height={527}
                    className="rounded-3xl w-full"
                  />
                </div>
                <div className="bg-black p-8 relative items-center overflow-auto">
                  <div className="">
                    <h2 className="text-3xl font-semibold mt-4">
                      {selectedProduct.name}
                    </h2>
                    <h1 className="text-lg mt-2">{calculateTotalPrice()}€</h1>

                    <h4 className="text-medium font-bold">Description</h4>
                    <label className="text-medium">{selectedProduct.description}</label>
                    <div className="pl-1">
                      {selectedProduct?.options!.map((option, index) => (
                        <div key={index} className="flex flex-col mt-4">
                          <label className="text-medium font-bold">{option.label}:</label>
                          <label className="text-medium">{option.description}</label>
                          {option.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="mt-2">
                              <label>
                                <input
                                  type="radio"
                                  name={`option-${option.label}`}
                                  value={item.label}
                                  onChange={() => handleOptionChange(option.label, item.label)}
                                  className="mr-2 accent-[#DEA001]"
                                />
                                {item.label} - {item.value}€
                              </label>
                            </div>
                          ))}
                          {optionError[option.label] && (
                            <p className="text-gray-500">{optionError[option.label]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 w-full">
                      <h4 className="text-lg">Comments:</h4>
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="w-full mt-2 p-2 border rounded text-white bg-transparent resize-none"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <button
                          onClick={decrementQuantity}
                          className="bg-[#4A4A4A] text-white rounded-full w-8 h-8 flex items-center justify-center"
                          disabled={quantityA <= 1}
                        >
                          -
                        </button>
                        <span className="mx-4">{quantityA}</span>
                        <button
                          onClick={incrementQuantity}
                          className="bg-[#7F5B01] text-white rounded-full w-8 h-8 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={handleAdd}
                        className="bg-[#DEA001] text-white py-2 px-4 rounded-full"
                      >
                        <h4 className="px-3">Add</h4>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50 overflow-hidden">
              <div className="bg-black flex rounded-3xl h-[450px] w-[80%]">
                <div className="relative w-[500px] h-[450px] rounded-xl mr-6">
                  <img
                    src={selectedProduct?.image}
                    alt={selectedProduct?.name}
                    className="object-cover w-full h-full rounded-xl"
                    style={{ position: "absolute", top: 0, left: 0 }}
                  />
                </div>
                
                <div className="bg-black p-8 relative min-w-1/2 items-center">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 bg-[#4a4a4a] rounded-full w-8 h-8 flex items-center justify-center text-white text-2xl"
                  >
                    <h4>&times;</h4>
                  </button>

                  <h2 className="text-3xl font-semibold mt-4">
                    {selectedProduct?.name}
                  </h2>
                  <h1 className="text-lg mt-2">{calculateTotalPrice()}€</h1>
                  
                  <div className="overflow-y-scroll h-[126px]"> 
                    <h4 className="text-medium font-bold">Description</h4>
                    <label className="text-medium">{selectedProduct?.description}</label>
                    <div className="pl-1">
                      {selectedProduct?.options!.map((option, index) => (
                        <div key={index} className="flex flex-col mt-4">
                          <label className="text-medium font-bold">{option.label}:</label>
                          <label className="text-medium">{option.description}</label>
                            {option.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="mt-2">
                                <label>
                                  <input
                                    type="radio"
                                    name={`option-${option.label}`}
                                    value={item.label}
                                    onChange={() => handleOptionChange(option.label, item.label)}
                                    className="mr-2 accent-[#DEA001]"
                                  />
                                  {item.label} - {item.value}€
                                </label>
                              </div>
                            ))}
                            {optionError[option.label] && (
                              <p className="text-gray-500">{optionError[option.label]}</p>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 w-full">
                    <h4 className="text-lg">Comments:</h4>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="w-full mt-2 p-2 border rounded text-white bg-transparent resize-none"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <button
                        onClick={decrementQuantity}
                        className="bg-[#4A4A4A] text-white rounded-full w-8 h-8 flex items-center justify-center"
                        disabled={quantityA <= 1}
                      >
                        -
                      </button>
                      <span className="mx-4">{quantityA}</span>
                      <button
                        onClick={incrementQuantity}
                        className="bg-[#7F5B01] text-white rounded-full w-8 h-8 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAdd}
                      className="bg-[#DEA001] text-white py-2 px-4 rounded-full"
                    >
                      <h4 className="px-3">Add</h4>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {isCartVisible && <ShoppingCart cart={cart} updateQuantityPage={updateQuantityPage} resetCartMenu={resetCartMenu} setIsCartVisible={setIsCartVisible} />}
      <FooterMenu />
    </main>
  );
}
