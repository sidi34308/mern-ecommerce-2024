import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { sendOrderEmail } from "@/lib/emailService";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import SuccessMessage from "./SuccessMessage";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts); // Updated state selector
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    phone: "",
    address: "",
    region: "",
    notes: "",
  });
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (value) => {
    setPhone(value);
    if (!isValidPhoneNumber(value)) {
      console.error("Invalid phone number");
    }
  };
  const [deliveryFee] = useState(25); // Fixed delivery fee
  const [totalAmount, setTotalAmount] = useState(0);
  console.log(productList);

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch cart items and products
  useEffect(() => {
    dispatch(fetchCartItems());
    dispatch(
      fetchAllFilteredProducts({ filterParams: {}, sortParams: "defaultSort" })
    );
  }, [dispatch]);

  // Calculate total amount based on cart and product data
  useEffect(() => {
    if (cartItems.length > 0 && productList.length > 0) {
      const cartDetails = cartItems.map((cartItem) => {
        const product = productList.find((p) => p._id === cartItem.productId);
        return {
          ...cartItem,
          ...product,
        };
      });

      const calculatedTotal = cartDetails.reduce(
        (sum, item) =>
          sum + (item.salePrice ? item.salePrice : item.price) * item.quantity,
        0
      );

      setTotalAmount(calculatedTotal + deliveryFee);
    }
  }, [cartItems, productList, deliveryFee]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit order
  const handleSubmitOrder = async () => {
    if (!formData.fullName || !formData.phone || !formData.region) {
      toast({
        title: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await sendOrderEmail(orderData);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }

    const orderData = {
      ...formData,
      cartItems: cartItems.map((cartItem) => {
        const product = productList.find((p) => p._id === cartItem.productId);
        return {
          title: product.title,
          quantity: cartItem.quantity,
          name: product.name,
          price: product.price,
        };
      }),
      totalAmount,
      orderDate: new Date().toISOString(),
    };

    try {
      await sendOrderEmail(orderData);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Error submitting order.",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="min-w-full flex flex-col gap-6 px-20 py-10"
      style={{ direction: "rtl" }}
    >
      <h2 className="text-lg font-bold text-center">
        املأ البيانات أدناه وسنقوم بالتواصل معك في أقرب وقت لتأكيد الطلب وتوصيله
        إلى بابك.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-bold">
              الاسم الكامل <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="يرجى إدخال الاسم الكامل"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="يرجى إدخال البريد الإلكتروني"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">العمر</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="يرجى إدخال العمر"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">
              رقم الهاتف <span className="text-red-600">*</span>
            </label>
            <PhoneInput
              country={"qa"}
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="يرجى إدخال رقم الهاتف"
              containerStyle={{
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontFamily: "Alexander",
                backgroundColor: "",
                padding: "4px",
                direction: "ltr",
              }}
              inputStyle={{
                border: "none",
                outline: "none",
                fontSize: "16px",
                paddingLeft: "",
                width: "100%",
              }}
              buttonStyle={{
                border: "none",
                borderRight: "1px solid #d1d5db",
                marginRight: "8px",
              }}
              dropdownStyle={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
              }}
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">
              اسم المنطقة <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="يرجى إدخال اسم المنطقة"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">ملاحظات إضافية</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="إذا كانت لديكم أي تعليمات خاصة، يرجى كتابتها هنا."
            />
          </div>
        </div>
        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg ">
          <h3 className="text-lg font-bold mb-4">ملخص الطلب</h3>
          <div className="mb-4">
            <div className="mt-8 space-y-4" style={{ direction: "ltr" }}>
              {cartItems && cartItems.length > 0
                ? cartItems.map((item) => (
                    <UserCartItemsContent cartItem={item} />
                  ))
                : null}
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <span>رسوم التوصيل</span>
            <span>{deliveryFee} ريال</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>المجموع</span>
            <span>{totalAmount} ريال</span>
          </div>
          <Button
            onClick={handleSubmitOrder}
            className="mt-6 w-full bg-pink-500 text-white hover:bg-pink-600"
          >
            إرسال الطلب
          </Button>
          <SuccessMessage
            isVisible={showSuccess}
            onClose={() => setShowSuccess(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
