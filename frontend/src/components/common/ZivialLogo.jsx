import React from 'react';
import logoImg from "../../assets/images/logo.png";

export default function ZivialLogo({ className = "h-10" }) {
  return (
    <div className="flex items-center">
      <img
        src={logoImg}
        alt="Zivial logo"
        className={`${className} aspect-square object-cover object-left select-none`}
      />
      <span className="text-white font-bold text-2xl tracking-tight ml-2.5 select-none font-sans">
        zivial
      </span>
    </div>
  );
}
