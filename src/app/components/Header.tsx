import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="header flex items-center justify-between px-8 py-4 bg-white shadow-md w-full">
      <div className="flex items-center">
        <Image
          src="/apartment-logo.svg"
          alt="Apartment Logo"
          width={40}
          height={40}
          className="mr-3"
        />
        <span className="text-xl font-bold text-blue-700">AMS</span>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="mr-2"><path d="M12 13.065c-2.761 0-5-2.239-5-5 0-2.761 2.239-5 5-5s5 2.239 5 5c0 2.761-2.239 5-5 5zm0-8c-1.654 0-3 1.346-3 3 0 1.654 1.346 3 3 3s3-1.346 3-3c0-1.654-1.346-3-3-3zm0 10c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4zm-6 4c.001-.729 2.686-2 6-2s5.999 1.271 6 2h-12z"/></svg>
          <span>mrsathishe@gmail.com</span>
        </div>
        <div className="flex items-center text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="mr-2"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.11-.21c1.12.45 2.33.69 3.58.69a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 22 2 16.39 2 9.5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.25.24 2.46.69 3.58a1.003 1.003 0 01-.21 1.11l-2.2 2.2z"/></svg>
          <span>+91 - 97900 60943</span>
        </div>
      </div>
    </header>
  );
}
