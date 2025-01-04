import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({ product, handleAddtoCart }) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <Link to={`/shop/product/${product._id}`}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-3xl"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <div className="flex gap-3 items-center mb-2">
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-red-600">
                {product?.salePrice} ر.ق
              </span>
            ) : null}
            <span
              className={`${
                product?.salePrice > 0
                  ? "line-through text-[#757575]"
                  : "text-red-600"
              } text-lg font-semibold `}
            >
              {product?.price} ر.ق
            </span>
          </div>
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-[#757575]">
              {categoryOptionsMap[product?.category]}
            </span>
            {/* <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span> */}
          </div>
        </CardContent>
      </Link>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full bg-primary text-white py-3 rounded-2xl hover:opacity-90"
          >
            إضافة للسلة
          </button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
