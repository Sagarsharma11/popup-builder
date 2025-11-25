"use client";
import React, { useState } from "react";
import { CanvasArea } from "./CanvasArea";

interface AreaItem {
  id: string;
  type: string;
}

export const CanvasContainer = () => {
  const [areas, setAreas] = useState<AreaItem[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("componentType");
    const kind = e.dataTransfer.getData("componentKind");

    if (kind === "layout" && type === "canvas") {
      setAreas((prev) => [...prev, { id: Date.now().toString(), type }]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div
      className="w-3/4 p-6 h-screen bg-gray-50 flex flex-col border-l overflow-auto"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2 className="text-lg font-semibold mb-4">Main Canvas</h2>

      <div className="w-full min-h-[80vh] border-2 border-dashed border-gray-300 rounded-lg p-6 grid gap-4 auto-rows-min">
        {areas.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">
            Drag a "Canvas Area" here
          </p>
        ) : (
          areas.map((area) => <CanvasArea key={area.id} id={area.id} />)
        )}
      </div>
    </div>
  );
};
