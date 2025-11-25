import React from "react";
import { ComponentsPanel } from "./components/ComponentsPanel";
import { CanvasContainer } from "./components/CanvasContainer";

export const PopupBuilder = () => {
  return (
    <div className="flex w-full">
      <ComponentsPanel />
      <CanvasContainer />
    </div>
  );
};
