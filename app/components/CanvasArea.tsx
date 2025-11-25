"use client";
import React, { useState, useRef } from "react";
import { PopupComponentRenderer } from "./PopupComponentRenderer";

interface CanvasAreaProps {
  id: string;
}

interface InnerComponent {
  id: string;
  type: string;
}

export const CanvasArea = ({ id }:any) => {
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [components, setComponents] = useState<InnerComponent[]>([]);
  const areaRef = useRef<HTMLDivElement>(null);
  const resizing = useRef(false);

  // resize logic
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    resizing.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!resizing.current) return;
      const newWidth = Math.max(150, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(100, startHeight + (moveEvent.clientY - startY));
      setSize({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      resizing.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // drag drop for UI components
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("componentType");
    const kind = e.dataTransfer.getData("componentKind");
    if (kind === "ui") {
      setComponents((prev) => [
        ...prev,
        { id: Date.now().toString(), type },
      ]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div
      ref={areaRef}
      className="relative bg-white border shadow-sm rounded-lg p-4 cursor-default"
      style={{
        width: size.width,
        height: size.height,
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <p className="text-sm text-gray-600 mb-2 font-medium">Canvas Area {id}</p>

      <div className="w-full h-full overflow-auto">
        {components.length === 0 ? (
          <p className="text-gray-400 text-xs italic text-center">
            Drag components here
          </p>
        ) : (
          <div className="space-y-2">
            {components.map((c) => (
              <div key={c.id}>
                <PopupComponentRenderer type={c.type} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={startResize}
        className="absolute bottom-1 right-1 w-3 h-3 bg-blue-500 rounded cursor-se-resize"
      ></div>
    </div>
  );
};
