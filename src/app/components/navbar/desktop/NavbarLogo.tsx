"use client";

import Image from "next/image";
import Link from "next/link";

interface NavbarLogoProps {
  pathname: string;
}

export default function NavbarLogo({ pathname }: NavbarLogoProps) {
  return (
    <Link
      href="/#"
      onClick={(e) => {
        if (pathname === '/') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
      className="flex-shrink-0 group"
    >
      <Image
        src="/logos/logo-positivo.svg"
        alt="MaxShop"
        width={130}
        height={45}
        className="h-9 md:h-11 w-auto transition-transform duration-300 group-hover:scale-105 brightness-0 invert"
        style={{ width: "auto" }}
      />
    </Link>
  );
}

