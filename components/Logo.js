import React from "react";

import Image from "next/image";

import LogoSvg from "../public/app-logo.svg";

const Logo = (props) => <Image src="/app-logo.svg" alt="me" {...props} />;
{
  /* <SvgIcon {...props} component={LogoSvg}></SvgIcon>; */
}

export default Logo;
