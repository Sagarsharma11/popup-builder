// app/popup-builder/PreviewModal.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { RenderComponent } from "./RenderComponent";

type Popup = any;

type Props = {
  popups: Popup[]; // full popups list (including followUps)
  initialPopupId?: string;
  onClose?: () => void;
};

export default function PreviewRenderer({ popups, initialPopupId, onClose }: Props) {
  const [open, setOpen] = useState(true);
  const flat = useMemo(() => {
    const all: Popup[] = [];
    function walk(p: Popup) {
      all.push(p);
      (p.followUps || []).forEach(walk);
    }
    (popups || []).forEach(walk);
    return all;
  }, [popups]);

  const [activeId, setActiveId] = useState<string | undefined>(initialPopupId ?? flat[0]?.id);

  useEffect(() => {
    if (!open && onClose) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const onOpenFromPreview = (ev: Event) => {
      const d = (ev as CustomEvent).detail;
      if (d?.targetPopupId) setActiveId(d.targetPopupId);
    };
    const onCloseFromPreview = () => setOpen(false);

    window.addEventListener("preview:openPopup", onOpenFromPreview as any);
    window.addEventListener("preview:close", onCloseFromPreview);
    // support dispatch from button actions inside RenderComponent
    window.addEventListener("preview:close", onCloseFromPreview);

    return () => {
      window.removeEventListener("preview:openPopup", onOpenFromPreview as any);
      window.removeEventListener("preview:close", onCloseFromPreview);
    };
  }, []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  if (!open) return null;
  const active = flat.find((p) => p.id === activeId) ?? flat[0];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div
        className="relative bg-white rounded-lg shadow-2xl max-w-[96%] max-h-[92vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ minWidth: 360 }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium">{active?.name ?? "Preview"}</h3>
            <div className="text-xs text-gray-500">({active?.width}px × {active?.height}px)</div>
          </div>

          <div className="flex items-center gap-2">
            {flat.length > 1 && (
              <select
                value={active?.id}
                onChange={(e) => setActiveId(e.target.value)}
                className="rounded px-2 py-1 border"
              >
                {flat.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-6">
          {/* main popup frame */}
          <div
            className="relative bg-white rounded-md overflow-hidden"
            style={{
              width: active?.width ?? 400,
              height: active?.height ?? 300,
              boxSizing: "border-box",
              backgroundColor: active?.backgroundColor ?? "#fff",
              backgroundImage: active?.backgroundImage ? `url(${active.backgroundImage})` : undefined,
              backgroundSize: "cover",
            }}
          >
            {(active?.components || []).map((comp: any) => (
              <div
                key={comp.id}
                style={{
                  position: "absolute",
                  left: comp.position?.x ?? 0,
                  top: comp.position?.y ?? 0,
                  pointerEvents: "auto",
                }}
              >
                <RenderComponent comp={comp} />
              </div>
            ))}
          </div>

          {/* follow-ups */}
          {active?.followUps && active.followUps.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Follow-ups</h4>
              <div className="flex gap-4">
                {active.followUps.map((fu: any) => (
                  <div key={fu.id} className="relative bg-white rounded-md p-3 shadow-sm" style={{ width: fu.width, height: fu.height }}>
                    {fu.components.map((comp: any) => (
                      <div key={comp.id} style={{ position: "absolute", left: comp.position?.x ?? 0, top: comp.position?.y ?? 0 }}>
                        <RenderComponent comp={comp} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
