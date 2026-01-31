'use client';
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname();
  return (
    <header>
      <div className="main-container inner">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="logo"
            width={70}
            height={40}
          ></Image>
        </Link>
        <nav>
          <Link
            href="/"
            className={cn("nav-link", {
              "is-active": pathname === "/",
              "is-home": true,
            })}
          >
            Home
          </Link>
          <p>Search Modal</p>
          <Link
            href="/coins"
            className={cn("nav-link", {
              "is-active": pathname === "/coins",
            })}
          >
            All Coins
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
