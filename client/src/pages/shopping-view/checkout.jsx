import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { sendOrderEmail } from "@/lib/emailService";

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

  const [deliveryFee] = useState(25); // Fixed delivery fee
  const [totalAmount, setTotalAmount] = useState(0);
  console.log(productList);
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
        const product = productList.find((p) => p.id === cartItem.productId);
        return {
          ...cartItem,
          ...product,
        };
      });

      const calculatedTotal = cartDetails.reduce(
        (sum, item) => sum + item.price * item.quantity,
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
      toast({
        title: "Order submitted successfully!",
        description: "We will contact you soon to confirm the order.",
        variant: "success",
      });
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
        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">ملخص الطلب</h3>
          <div className="mb-4">
            {cartItems.map((cartItem) => {
              const product = productList.find(
                (product) => product.id === cartItem.productId
              );
              return (
                <div
                  key={cartItem.productId}
                  className="flex justify-between mb-2"
                >
                  <span>{product?.name}</span>
                  <span>
                    {cartItem.quantity} x {product?.price} ريال
                  </span>
                </div>
              );
            })}
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
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="الاسم الكامل"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="age"
            placeholder="العمر"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="رقم الهاتف"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="address"
            placeholder="العنوان"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="region"
            placeholder="المنطقة"
            value={formData.region}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            name="notes"
            placeholder="ملاحظات"
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
