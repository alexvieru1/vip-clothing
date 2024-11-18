"use client"
import React from "react";
import { IconMenu2 } from "@tabler/icons-react";
import { useDrawer } from "@/context/drawer-context";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  const { openDrawer } = useDrawer();

  return (
    <header className="bg-neutral-100 dark:bg-neutral-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <IconMenu2
          className="md:hidden text-gray-700 dark:text-gray-300 cursor-pointer"
          size={24}
          onClick={openDrawer}
        />
        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">LOGO</p>
        <ModeToggle/>
      </div>
    </header>
  );
};

export default Navbar;
