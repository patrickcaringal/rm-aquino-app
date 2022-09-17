import React from "react";

const PdfFrame = ({ src, height = 600 }) => {
  // #view=Fit
  return <iframe src={src} width="100%" height={height} />;
};

export default PdfFrame;
