"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = (props) => {
  const router = useRouter();
  return (
    <Image
      src="/assets/logo.png"
      alt="logo"
      width={180}
      height={60}
      className="h-auto w-[180px] cursor-pointer hover:opacity-80 object-cover"
      onClick={() => router.push("/")}
      {...props}
    />
  );
};
export default Logo;
