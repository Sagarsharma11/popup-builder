import React from "react";

export const PopupComponentRenderer = ({ type }: { type: string }) => {
  switch (type) {
    case "text":
      return <p className="text-sm text-gray-700">Sample Text</p>;
    case "button":
      return (
        <button className="bg-blue-500 text-white px-3 py-1 rounded">
          Button
        </button>
      );
    case "image":
      return (
        <img
          src="https://via.placeholder.com/80"
          alt="Sample"
          className="rounded"
        />
      );
    default:
      return null;
  }
};
