import Logo from "@/components/logo";
import React from "react";

const Navbar = () => {
  return (
    <div className="fixed z-50 top-0 w-full h-14 border-b shadow-sm bg-white flex items-center ">
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>

        
      </div>
    </div>
  );
};

export default Navbar;
