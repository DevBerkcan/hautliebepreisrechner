import { signOut } from "next-auth/react";
import Image from "next/image";
import React from "react";
import ChangePassword from "./changePassword";

const Navbar = () => {
  return (
    <div className="flex mb-8 justify-between items-center w-full p-4 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center justify-start">
        <Image
          src="/assets/Nazar-Logo.png"
          alt="Logo"
          width={160}
          height={160}
          className="object-contain"
        />
      </div>

      <div className="flex gap-5 items-center">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-solid border-main-color text-sm text-main-color hover:bg-gray-100"
          onClick={() => signOut()}
        >
          <Image
            src="/assets/logout-icon.png"
            alt="logout icon"
            width={25}
            height={27}
            className="object-contain"
          />
          Abmelden
        </button>

        <ChangePassword />
      </div>
    </div>
  );
};

export default Navbar;
