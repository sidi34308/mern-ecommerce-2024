// import { Minus, Plus, Trash } from "lucide-react";
// import { Button } from "../ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
// import { useToast } from "../ui/use-toast";

// function UserCartItemsContent({ cartItem }) {
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { productList } = useSelector((state) => state.shopProducts);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   function handleUpdateQuantity(getCartItem, typeOfAction) {
//     if (typeOfAction == "plus") {
//       let getCartItems = cartItems.items || [];

//       if (getCartItems.length) {
//         const indexOfCurrentCartItem = getCartItems.findIndex(
//           (item) => item.productId === getCartItem?.productId
//         );

//         const getCurrentProductIndex = productList.findIndex(
//           (product) => product._id === getCartItem?.productId
//         );
//         const getTotalStock = productList[getCurrentProductIndex].totalStock;

//         console.log(getCurrentProductIndex, getTotalStock, "getTotalStock");

//         if (indexOfCurrentCartItem > -1) {
//           const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
//           if (getQuantity + 1 > getTotalStock) {
//             toast({
//               title: `Only ${getQuantity} quantity can be added for this item`,
//               variant: "destructive",
//             });

//             return;
//           }
//         }
//       }
//     }

//     dispatch(
//       updateCartQuantity({
//         userId: user?.id,
//         productId: getCartItem?.productId,
//         quantity:
//           typeOfAction === "plus"
//             ? getCartItem?.quantity + 1
//             : getCartItem?.quantity - 1,
//       })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         toast({
//           title: "Cart item is updated successfully",
//         });
//       }
//     });
//   }

//   function handleCartItemDelete(getCartItem) {
//     dispatch(
//       deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         toast({
//           title: "Cart item is deleted successfully",
//         });
//       }
//     });
//   }

//   return (
//     <div className="flex items-center space-x-4">
//       <img
//         src={cartItem?.image}
//         alt={cartItem?.title}
//         className="w-20 h-20 rounded object-cover"
//       />
//       <div className="flex-1">
//         <h3 className="font-extrabold">{cartItem?.title}</h3>
//         <div className="flex items-center gap-2 mt-1">
//           <Button
//             variant="outline"
//             className="h-8 w-8 rounded-full"
//             size="icon"
//             disabled={cartItem?.quantity === 1}
//             onClick={() => handleUpdateQuantity(cartItem, "minus")}
//           >
//             <Minus className="w-4 h-4" />
//             <span className="sr-only">Decrease</span>
//           </Button>
//           <span className="font-semibold">{cartItem?.quantity}</span>
//           <Button
//             variant="outline"
//             className="h-8 w-8 rounded-full"
//             size="icon"
//             onClick={() => handleUpdateQuantity(cartItem, "plus")}
//           >
//             <Plus className="w-4 h-4" />
//             <span className="sr-only">Decrease</span>
//           </Button>
//         </div>
//       </div>
//       <div className="flex flex-col items-end">
//         <p className="font-semibold">
//           $
//           {(
//             (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
//             cartItem?.quantity
//           ).toFixed(2)}
//         </p>
//         <Trash
//           onClick={() => handleCartItemDelete(cartItem)}
//           className="cursor-pointer mt-1"
//           size={20}
//         />
//       </div>
//     </div>
//   );
// }

// export default UserCartItemsContent;

import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { useState } from "react";

function UserCartItemsContent({ cartItem }) {
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Find product details based on productId
  const product = productList.find(
    (product) => product._id === cartItem?.productId
  );

  // Show loading state or placeholder if product list is being fetched

  // If product not found, show a placeholder or warning
  if (!product) {
    return (
      <div className="flex items-center justify-between space-x-4">
        <p className="text-red-500">المنتج غير موجود</p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    );
  }

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      if (getCartItem?.quantity + 1 > product?.totalStock) {
        toast({
          title: `فقط ${product?.totalStock} عناصر متاحة في المخزون`,
          variant: "destructive",
        });
        return;
      }
    }

    dispatch(
      updateCartQuantity({
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then(() => {
      toast({
        title: "تم تحديث عنصر السلة بنجاح",
      });
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(deleteCartItem({ productId: getCartItem?.productId })).then(() => {
      toast({
        title: "تم حذف عنصر السلة بنجاح",
        variant: "success",
      });
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={product?.images[0]}
        alt={product?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{product?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">تقليل</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">زيادة</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          {(
            (product?.salePrice > 0 ? product?.salePrice : product?.price) *
            cartItem?.quantity
          ).toFixed(2)}
          {" ر.ق "}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
          color="red"
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
