import React from "react";

const Logo = ({ className = '', ...props }) => {
  return (
    <img
      src="/KSTM-logo-bg-Black.jpg"
      alt=""
      width={100} height={80}
    />
  );
}

export default Logo
