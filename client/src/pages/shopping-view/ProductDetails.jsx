import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductDetails } from "@/store/shop/products-slice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageMagnifier from "../../components/shopping-view/ImageMagnifier";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { useToast } from "@/components/ui/use-toast";

function ProductDetails() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productDetails, loading } = useSelector(
    (state) => state.shopProducts
  );
  const [currentImage, setCurrentImage] = useState(0);

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems());
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [dispatch, productId]);

  if (loading || !productDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="w-full max-w-4xl h-[600px] bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentImage(index),
  };

  const images =
    productDetails.images && productDetails.images.length > 0
      ? productDetails.images
      : [productDetails.image];

  const handleThumbnailClick = (index) => {
    setCurrentImage(index);
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Arrow */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto   rounded-xl overflow-hidden"
      >
        {" "}
        <button
          onClick={() => navigate(-1)}
          className=" p-2 rounded-md  hover:bg-gray-100 transition duration-300 z-10"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <div className="flex flex-col lg:flex-row">
          {/* Product Image and Thumbnails */}
          <div className="lg:w-3/5 p-8">
            <div className="mb-4">
              <Slider {...sliderSettings} className="product-image-slider">
                {images.map((image, index) => (
                  <div key={index} className="focus:outline-none">
                    <ImageMagnifier
                      src={image}
                      alt={`${productDetails.title} - Image ${index + 1}`}
                      width="100%"
                      height="600px"
                      className="object-cover w-full h-[500px] rounded-xl"
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div className="flex space-x-4 overflow-x-auto py-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-24 h-24 flex-shrink-0 cursor-pointer border-2 transition-all duration-200 ${
                    index === currentImage
                      ? "border-primary "
                      : "border-transparent hover:border-gray-300"
                  } rounded-md overflow-hidden`}
                >
                  <img
                    src={image}
                    alt={`${productDetails.title} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div
            className="lg:w-2/5 p-8 flex flex-col justify-between bg-gray-50 rounded-2xl"
            style={{ direction: "rtl" }}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {productDetails.title}
              </h1>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {productDetails.description}
              </p>
              <div className="text-3xl font-semibold text-gray-900 mb-6">
                {productDetails.price.toFixed(2)} ر.ق
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-primary text-white py-4 rounded-lg font-medium text-lg hover:bg-primary transition duration-300 flex items-center justify-center space-x-2"
              onClick={() =>
                handleAddToCart(productDetails?._id, productDetails?.totalStock)
              }
            >
              <ShoppingCart size={24} />
              <span className="pr-6">إضافة للسلة</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProductDetails;
