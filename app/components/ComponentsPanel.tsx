"use client";
import React from "react";

const COMPONENTS = [
  { id: "canvas", label: "Canvas Area", type: "layout", components: [] },
  { id: "text", label: "Text", type: "ui" },
  { id: "button", label: "Button", type: "ui" },
  { id: "image", label: "Image", type: "ui" },
];

export const ComponentsPanel = () => {
  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData("componentType", item.id);
    e.dataTransfer.setData("componentKind", item.type); // layout/ui
  };

  return (
    <div className="w-1/4 bg-gray-100 border-r p-4 h-screen">
      <h2 className="text-lg font-semibold mb-3">Components</h2>

      <div className="space-y-4">
        {COMPONENTS.map((c) => (
          <div
            key={c.id}
            draggable
            onDragStart={(e) => handleDragStart(e, c)}
            className="p-2 bg-white rounded shadow hover:bg-gray-50 cursor-grab text-center"
          >
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
};
