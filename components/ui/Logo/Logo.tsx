import React from "react";

const Logo = ({ className = '', ...props }) => {
  return (
    <img
      src="/logo-cx-commerce.png"
      alt=""
      width={50} height={36}
    />
  );
}

export default Logo
