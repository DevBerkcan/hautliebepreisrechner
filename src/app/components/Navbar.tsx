import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex w-full justify-center">
      <Image src="/assets/Nazar-Logo.png" alt="Logo" width={400} height={400} />
    </div>
  );
};

export default Navbar;
