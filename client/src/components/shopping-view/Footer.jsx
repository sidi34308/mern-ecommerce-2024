import React from "react";
import instagram from "../../assets/icons/instagram.svg"; // Adjust the path as necessary
import facebook from "../../assets/icons/facebook.svg"; // Adjust the path as necessary
import tiktok from "../../assets/icons/tiktok.svg"; // Adjust the path as necessary

const Footer = () => {
  return (
    <footer style={{ direction: "rtl" }}>
      <div className="container py-10 mx-auto flex justify-between items-center">
        {/* Left Section */}
        <div className="flex flex-col items-start space-y-2">
          <button className="text-red-500 font-medium hover:underline">
            كن شريكًا
          </button>
          <div className="text-gray-600 space-x-4 text-sm">
            <a href="#" className="hover:underline">
              الشروط والخدمات
            </a>
            <a href="#" className="hover:underline">
              سياسة الخصوصية
            </a>
          </div>
          <p className="text-gray-500 text-sm">© 2025 بيكي</p>
        </div>

        {/* Right Section */}
        <div className="flex gap-2">
          <a href="#" className="hover:bg-gray-100 bg-accent p-2 rounded-xl">
            <img src={instagram} alt="إنستغرام" className="w-6 h-6" />
          </a>
          <a href="#" className="hover:bg-gray-100 bg-accent p-2 rounded-xl">
            <img src={facebook} alt="فيسبوك" className="w-6 h-6" />
          </a>
          <a href="#" className="hover:bg-gray-100 bg-accent p-2 rounded-xl">
            <img src={tiktok} alt="تيك توك" className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
