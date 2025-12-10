import React from "react";

interface ValidationProps {
  setShowModalStart: (show: boolean) => void;
  action: () => void;
  title: string;
  desc: string;
  confirm_text: string;
}

function ValidationModal({ setShowModalStart, action, title, desc, confirm_text }: ValidationProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 font-plus-jakarta-sans">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-base text-gray-600 mb-6">{desc}</p>
        <div className="flex justify-between gap-4">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowModalStart(false)}>
            Batal
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={action}>
            {confirm_text}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ValidationModal;
