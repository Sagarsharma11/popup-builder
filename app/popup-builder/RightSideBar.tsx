import React, { useState } from "react";
import StylePicker from "./StylePicker";

const RightSideBar = ({
  updatePopupBackground,
  findParentAndPopup,
  activePopupId,
  popups,
  selectedComp,
  updateComponentStyle,
  updateComponentField, // <-- new prop
  setDraggedType,
  setShowJson,
}: any) => {
  const activeBg = (findParentAndPopup(activePopupId).popup ?? popups[0])
    .backgroundColor;

  const components = [
    "heading",
    "text",
    "textarea",
    "link",
    "linkBox",
    "image",
    "imageBox",
    "video",
    "map",
    "icon",
    "button",
    "input",
  ];

  return (
    <aside className="w-72 bg-white border-l p-4 overflow-y-auto">
      <h3 className="font-semibold mb-3">Properties</h3>

      <label className="block text-sm mb-2">Popup Background:</label>
      <input
        type="color"
        onChange={(e) => updatePopupBackground("color", e.target.value)}
        value={activeBg}
        className="mb-3 w-full h-8 p-0 border-0"
      />
      <input
        type="text"
        placeholder="Image URL"
        className="w-full border px-2 py-1 mb-3 text-sm"
        onBlur={(e) => updatePopupBackground("image", e.target.value)}
      />

      <div className="text-xs text-gray-600 mb-2">
        Selected component:{" "}
        <span className="font-medium">
          {selectedComp ? selectedComp.type : "None"}
        </span>
      </div>

      {selectedComp && (
        <>
          <hr className="my-3" />
          <h4 className="font-medium mb-2">
            Selected: {selectedComp.type.toUpperCase()}
          </h4>
          {/* Render attribute inputs (content/label/href/placeholder/src etc) */}
          <input
            value={selectedComp.content ?? ""}
            onChange={(e) => updateComponentField("content", e.target.value)}
            className="w-full border rounded px-2 py-1"
            type="text"
          />
          <div>
            <label htmlFor="src">src</label>
            <input
              value={selectedComp.content ?? ""}
              onChange={(e) => updateComponentField("src", e.target.value)}
              className="w-full border rounded px-2 py-1"
              type="text"
            />
          </div>
          <hr className="my-3" />
          {/* Styles editor */}
          <h5 className="text-sm font-medium mb-2">Styles</h5>
          {/* Existing style keys */}
          {Object.entries(selectedComp.styles || {}).map(([key, val]) => (
            <div key={key} className="mb-2">
              <label className="block text-xs text-gray-500 mb-1">{key}</label>
              <input
                className="w-full border px-2 py-1"
                value={String(val ?? "")}
                onChange={(e) => updateComponentStyle(key, e.target.value)}
              />
            </div>
          ))}
          {/* Add new style key/value */}
          <StylePicker
            onAdd={(k, v) => {
              updateComponentStyle(k, v);
            }}
            existingKeys={Object.keys(selectedComp?.styles || {})}
          />
        </>
      )}

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-3">Add basic content elements</h4>

        <div className="grid grid-cols-2 gap-3">
          {/* This part expects setDraggedType to be passed from parent */}
          {components.map((key) => (
            <button
              key={key}
              draggable
              onDragStart={() => setDraggedType(key)}
              className="flex flex-col items-center justify-center gap-2 p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm text-gray-800"
              style={{ minHeight: 72, textAlign: "center" }}
              aria-label={`Add ${key}`}
            >
              <div className="text-gray-700">{key}</div>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowJson(true)}
            className="w-full bg-black text-white py-2 rounded-md hover:opacity-95"
          >
            Log JSON
          </button>
        </div>
      </div>
    </aside>
  );
};

export default RightSideBar;
