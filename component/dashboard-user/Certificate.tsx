import { DownloadIcon } from "lucide-react";
import React from "react";

function Certificate() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/certificate.pdf";
    link.download = "certificate.pdf";
    link.click();
  };
  return (
    <>
      <div className="">
        <h1 className="text-2xl lg:text-3xl font-bold">CERTIFICATE</h1>
      </div>
      <div className="w-full max-w-5xl xl:max-w-7xl lg:px-3 flex flex-col items-center gap-10">
        <iframe
          src="/certificate.pdf"
          title="Certificate Preview"
          className="w-full h-[70vh] lg:h-[700px]  rounded-md shadow-md overflow-hidden"
        ></iframe>
        <button
          onClick={handleDownload}
          className="bg-[#FBFF00] flex justify-center items-center py-2 px-7 rounded gap-3 cursor-pointer hover:bg-yellow-300 transition-all lg:text-base lg:font-semibold text-sm"
        >
          <p className="hidden lg:block">Download</p>
          <DownloadIcon className="w-5" />
        </button>
      </div>
    </>
  );
}

export default Certificate;
