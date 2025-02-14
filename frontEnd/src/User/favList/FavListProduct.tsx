import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faStar,
  faCloudMeatball,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { useProductContext } from "../ProductContext/ProductContext.tsx";

interface Product {
  _id: string;
  name: string;
  image: string | string[];
  price: number;
  rating: number;
  countInStock: number;
  onSale?: boolean;
  discount: number;
  quantity?: number;
  isfavourite?: boolean;
}

type FavListProductProps = {
  products: Product[];
};

const FavListProduct: React.FC<FavListProductProps> = () => {
  const { products } = useProductContext();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  useEffect(() => {
    const favProducts = JSON.parse(localStorage.getItem("favourites") || "[]");
    setFavoriteProducts(favProducts);
  }, []);

  const handleDeleteFavoriteProduct = (product: Product) => {
    const updatedFavProducts = favoriteProducts.filter(
      (favProduct) => favProduct._id !== product._id
    );

    setFavoriteProducts(updatedFavProducts);
    localStorage.setItem("favourites", JSON.stringify(updatedFavProducts));
    toast.warning("Đã xóa sản phẩm khỏi danh sách yêu thích");
  };

  const getProductById = (_id: string) => {
    return products.find((product) => product._id === _id);
  };

  const handClickBuyNow = (productId: string) => {
    const product = getProductById(productId);
    if (!product) {
      return; // Handle the case where the product isn't found
    }

    // Save product details to localStorage
    localStorage.setItem("selectedProduct", JSON.stringify(product));
  };

  function formatPrice(price: number) {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      }).format(price) + " VND"
    );
  }

  return (
    <>
      <div className="title pb-5">
        <div className="flex flex-col justify-center items-center w-[95%] lg:w-[65%] mx-auto mb-2">
          <div className="page-headline mt-[100px] mb-[40px] leading-[4rem]">
            <h1 className="w-full my-3 text-[#D94B4B] text-4xl font-normal leading-5 text-center">
              Danh sách yêu thích
            </h1>
            <p className="text-[18px] text-slate-500 mb-4 text-center">
              Các sản phẩm được các khách hàng mua nhiều với đa số đều có phản
              hồi tốt
            </p>
          </div>
        </div>
      </div>

      <div className="feature-mugs w-[90%] lg:w-[80%] mx-auto mb-24">
        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4 h-auto">
            {favoriteProducts.map((product) => (
              <div
                key={product._id}
                className="product-card w-full h-[400px] sm:h-[450px] px-3 pt-5 bg-white shadow-md rounded-md mb-10"
              >
                <div
                  className="relative w-full h-[150px] sm:h-[200px] rounded-md bg-cover bg-no-repeat bg-center mb-5"
                  style={{
                    backgroundImage: Array.isArray(product.image)
                      ? `url(${product.image[0]})`
                      : `url(${product.image})`,
                  }}
                >
                  <div
                    className="absolute top-2 left-2 cursor-pointer text-red-600 hover:opacity-80 active:opacity-90"
                    onClick={() => handleDeleteFavoriteProduct(product)}
                  >
                    <FontAwesomeIcon
                      className="hover:opacity-85 active:opacity-90"
                      icon={faHeart}
                    />{" "}
                  </div>
                </div>

                <div className="flex flex-col mb-7">
                  <h1 className="text-l lg:text-[18px] font-bold text-black mb-5 overflow-hidden whitespace-nowrap overflow-ellipsis w-full">
                    {product.name}
                  </h1>
                  <h1 className=" text-xs text-[#000] mb-8">
                    <FontAwesomeIcon icon={faStar} /> {product.rating} đánh giá
                  </h1>
                  <div className="flex flex-row justify-between">
                    <h1 className=" text-l lg:text-[18px] text-[#000]">
                      {formatPrice(product.price)}
                    </h1>
                    <div className="basic-1/2 lg:basic-1/4 flex flex-col justify-end items-end">
                      <div className="text-xs xs:text-s text-pinky-600 font-semibold">
                        {product.countInStock > 0
                          ? "Còn hàng " + product.countInStock
                          : "Out of stock"}
                      </div>
                    </div>
                  </div>
                </div>

                <NavLink
                  to={`/product/${product._id}`} // Ensure the link is using the product ID
                  onClick={() => handClickBuyNow(product._id)} // Ensure product ID is passed here
                  className="buttonBuyNow flex justify-center items-center w-full h-12 rounded-xl bg-white border-2  border-red-600 text-pinky-600 hover:opacity-70 active:opacity-90 font-semibold cursor-pointer"
                >
                  MUA NGAY
                </NavLink>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <FontAwesomeIcon
              className="text-black w-[100px] h-[100px]"
              icon={faCloudMeatball}
            />
            <p className="text-black mt-5 text-xl">
              Không có sản phẩm trong giỏ hàng
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default FavListProduct;
