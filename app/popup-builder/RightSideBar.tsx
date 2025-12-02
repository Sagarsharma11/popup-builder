"use client";

import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import StylePicker from "./StylePicker";
import { RenderComponent } from "./RenderComponent"; // named export in your RenderComponent file
import {
  MdTitle,
  MdTextFields,
  MdLink,
  MdImage,
  MdVideocam,
  MdMap,
  MdInsertEmoticon,
  MdRadioButtonChecked,
  MdInput,
  MdPhotoSizeSelectLarge,
  MdCheckBoxOutlineBlank,
  MdArrowDropDownCircle,
} from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { BiLinkAlt } from "react-icons/bi";
import { POPUP_PRESETS } from "./popupPresets";
import TinyRoundedBadge from "./components/TinyRoundedBadge";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ICONS: Record<string, React.ReactNode> = {
  heading: <MdTitle size={24} />,
  text: <MdTextFields size={24} />,
  textarea: <FaRegFileAlt size={22} />,
  link: <MdLink size={22} />,
  linkBox: <BiLinkAlt size={22} />,
  image: <MdImage size={22} />,
  video: <MdVideocam size={22} />,
  map: <MdMap size={22} />,
  icon: <MdInsertEmoticon size={22} />,

  button: <TinyRoundedBadge label="BUTTON" size="sm" />,
  input: <MdInput size={22} />,

  // NEW COMPONENT TYPES
  "radio buttons group": <MdRadioButtonChecked size={22} />,
  "checkboxes group": <MdCheckBoxOutlineBlank size={22} />,
  "select dropdown": <MdArrowDropDownCircle size={22} />,
};

const RightSideBar = ({
  updatePopupBackground,
  findParentAndPopup,
  activePopupId,
  popups,
  selectedComp,
  updateComponentStyle,
  updateComponentField,
  setDraggedType,
  setShowJson,
  setPopups,
}: any) => {
  const activePopup = (findParentAndPopup(activePopupId).popup ??
    popups[0]) as any;
  const activeBg = activePopup?.backgroundColor ?? "#ffffff";

  const components = [
    "heading",
    "text",
    // "textarea",
    "link",
    "linkBox",
    "image",
    // "imageBox",
    "video",
    "map",
    "icon",
    "button",
    "input",
    "radio buttons group",
    "checkboxes group",
    "select dropdown",
  ];

  const updatePopupSize = (popupId: string, width: any, height: any) => {
    setPopups((prev: any) =>
      prev.map((p: any) =>
        p.id === popupId
          ? { ...p, width, height }
          : {
              ...p,
              followUps: p.followUps.map((fu: any) =>
                fu.id === popupId ? { ...fu, width, height } : fu
              ),
            }
      )
    );
  };

  const applyPreset = (presetKey: string) => {
    if (!presetKey) return;
    const preset = POPUP_PRESETS[presetKey];
    if (!preset) return;
    const { desktop } = preset;
    updatePopupSize(activePopupId, desktop.width, desktop.height);
  };

  // helpers for options editor
  const isOptionType = (type?: string) =>
    type === "radio buttons group" ||
    type === "checkboxes group" ||
    type === "select dropdown";

  const onChangeOption = (idx: number, newVal: string) => {
    if (!selectedComp) return;
    const current: string[] = Array.isArray(selectedComp.options)
      ? selectedComp.options
      : [];
    const next = current.map((o: string, i: number) =>
      i === idx ? newVal : o
    );
    updateComponentField("options", next);
  };

  const addOption = () => {
    if (!selectedComp) return;
    const current: string[] = Array.isArray(selectedComp.options)
      ? selectedComp.options
      : [];
    updateComponentField("options", [
      ...current,
      `Option ${current.length + 1}`,
    ]);
  };

  const removeOption = (idx: number) => {
    if (!selectedComp) return;
    const current: string[] = Array.isArray(selectedComp.options)
      ? selectedComp.options
      : [];
    const next = current.filter((_, i) => i !== idx);
    updateComponentField("options", next);
  };

  // ----- Width/Height UI logic (shared for popup & component styles) -----
  const PIXEL_CHOICES = useMemo(() => {
    const arr: number[] = [];
    for (let i = 100; i <= 1000; i += 50) arr.push(i);
    return arr;
  }, []);

  // local controlled inputs for popup custom px fields
  const [customW, setCustomW] = useState<string>(
    String(activePopup.width ?? "")
  );
  const [customH, setCustomH] = useState<string>(
    String(activePopup.height ?? "")
  );

  React.useEffect(() => {
    setCustomW(String(activePopup.width ?? ""));
    setCustomH(String(activePopup.height ?? ""));
  }, [activePopup.width, activePopup.height]);

  const applyWidthPx = (px: number | string) => {
    const w = typeof px === "string" ? parseInt(px, 10) : px;
    if (!w || isNaN(w) || w <= 0) return;
    updatePopupSize(activePopupId, w, activePopup.height);
  };

  const applyHeightPx = (px: number | string) => {
    const h = typeof px === "string" ? parseInt(px, 10) : px;
    if (!h || isNaN(h) || h <= 0) return;
    updatePopupSize(activePopupId, activePopup.width, h);
  };

  // ----- Component style special controls state -----
  const compStyleWidth = selectedComp?.styles?.width ?? "";
  const compStyleHeight = selectedComp?.styles?.height ?? "";

  const [compCustomW, setCompCustomW] = useState<string>(
    compStyleWidth !== undefined && compStyleWidth !== null
      ? String(compStyleWidth)
      : ""
  );
  const [compCustomH, setCompCustomH] = useState<string>(
    compStyleHeight !== undefined && compStyleHeight !== null
      ? String(compStyleHeight)
      : ""
  );

  React.useEffect(() => {
    setCompCustomW(
      selectedComp &&
        selectedComp.styles &&
        selectedComp.styles.width !== undefined
        ? String(selectedComp.styles.width)
        : ""
    );
    setCompCustomH(
      selectedComp &&
        selectedComp.styles &&
        selectedComp.styles.height !== undefined
        ? String(selectedComp.styles.height)
        : ""
    );
  }, [
    selectedComp?.id,
    selectedComp?.styles?.width,
    selectedComp?.styles?.height,
  ]);

  const applyComponentStylePx = (
    key: "width" | "height",
    px: number | string
  ) => {
    if (!selectedComp) return;
    const v = typeof px === "string" ? parseInt(px, 10) : px;
    if (!v || isNaN(v) || v <= 0) return;
    updateComponentStyle(key, v);
  };

  // ---------- Preview Modal ----------
  const [previewOpen, setPreviewOpen] = useState(false);
  const openPreview = () => setPreviewOpen(true);
  const closePreview = () => setPreviewOpen(false);

  const PreviewModal = previewOpen
    ? createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-6"
          onMouseDown={closePreview}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-white rounded-lg shadow-2xl overflow-auto max-w-[98%] max-h-[92vh]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-black">
                Preview — {activePopup.name}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={closePreview}
                  className="px-3 py-1 rounded bg-gray-50 hover:bg-gray-100 text-black"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-6 items-start">
              {/* main popup area */}
              <div
                className="relative rounded-md  shadow-sm p-4"
                style={{
                  width: activePopup.width,
                  height: activePopup.height,
                  boxSizing: "border-box",
                  backgroundColor: activePopup.backgroundColor,
                  backgroundImage: activePopup.backgroundImage
                    ? `url(${activePopup.backgroundImage})`
                    : undefined,
                  backgroundSize: "cover",
                }}
              >
                {(activePopup.components || []).map((comp: any) => (
                  <div
                    key={comp.id}
                    style={{
                      position: "absolute",
                      left: comp.position?.x ?? 0,
                      top: comp.position?.y ?? 0,
                      pointerEvents: "auto",
                    }}
                    className="preview-component "
                  >
                    {/* RenderComponent expects the whole component object */}
                    {/* <RenderComponent {...(comp as any)} /> */}
                    {RenderComponent(comp)}
                  </div>
                ))}
              </div>

              {/* follow-ups row */}
              {activePopup.followUps && activePopup.followUps.length > 0 && (
                <div className="w-full">
                  <h4 className="text-sm font-medium mb-2 text-black">Follow-ups</h4>
                  <div className="flex gap-4">
                    {activePopup.followUps.map((fu: any) => (
                      <div
                        key={fu.id}
                        className="relative rounded-md  shadow-sm p-3"
                        style={{
                          width: fu.width,
                          height: fu.height,
                          boxSizing: "border-box",
                          backgroundColor: fu.backgroundColor,
                          backgroundImage: fu.backgroundImage
                            ? `url(${fu.backgroundImage})`
                            : undefined,
                          backgroundSize: "cover",
                        }}
                      >
                        {(fu.components || []).map((comp: any) => (
                          <div
                            key={comp.id}
                            style={{
                              position: "absolute",
                              left: comp.position?.x ?? 0,
                              top: comp.position?.y ?? 0,
                              pointerEvents: "auto",
                            }}
                            className="preview-component "
                          >
                            {/* <RenderComponent {...(comp as any)} /> */}
                            {RenderComponent(comp)}
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
      )
    : null;

  return (
    <aside className="w-85 bg-white border-l border-gray-200 p-4 overflow-y-auto text-black">
      {/* Preview / Save */}
      <div className="w-full flex items-center gap-3 p-2 mb-2">
        <button
          onClick={openPreview}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          Preview
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm transition">
          Save
        </button>
      </div>

      {/* preset select */}
      <select
        className="w-full px-2 py-2 rounded mb-3 text-sm shadow-sm ring-1 ring-gray-100"
        onChange={(e) => applyPreset(e.target.value)}
      >
        <option value="">Select Popup Size</option>
        {Object.entries(POPUP_PRESETS).map(([key, preset]) => (
          <option key={key} value={key}>
            {preset.label}
          </option>
        ))}
      </select>

      {/* Width & Height (popup) */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Width (px)</label>
        <div className="flex gap-2 mb-2">
          <select
            className="flex-1 px-2 py-2 rounded text-sm shadow-sm ring-1 ring-gray-100"
            value={String(activePopup.width ?? "")}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) applyWidthPx(v);
            }}
          >
            <option value="">Choose width</option>
            {PIXEL_CHOICES.map((px) => (
              <option key={px} value={px}>
                {px}px
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            className="flex-1 rounded px-2 py-1 text-sm shadow-sm ring-1 ring-gray-100"
            value={customW}
            onChange={(e) => setCustomW(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyWidthPx(customW);
            }}
            onBlur={() => applyWidthPx(customW)}
            placeholder="Custom px"
          />
          <button
            onClick={() => applyWidthPx(customW)}
            className="px-3 py-1 rounded text-sm bg-gray-50 hover:bg-gray-100"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Height (px)</label>
        <div className="flex gap-2 mb-2">
          <select
            className="flex-1 px-2 py-2 rounded text-sm shadow-sm ring-1 ring-gray-100"
            value={String(activePopup.height ?? "")}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) applyHeightPx(v);
            }}
          >
            <option value="">Choose height</option>
            {PIXEL_CHOICES.map((px) => (
              <option key={px} value={px}>
                {px}px
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            className="flex-1 rounded px-2 py-1 text-sm shadow-sm ring-1 ring-gray-100"
            value={customH}
            onChange={(e) => setCustomH(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyHeightPx(customH);
            }}
            onBlur={() => applyHeightPx(customH)}
            placeholder="Custom px"
          />
          <button
            onClick={() => applyHeightPx(customH)}
            className="px-3 py-1 rounded text-sm bg-gray-50 hover:bg-gray-100"
          >
            Apply
          </button>
        </div>
      </div>

      <h3 className="font-semibold mb-3">Properties</h3>

      <div className="flex items-center gap-2">
        <input
          type="color"
          onChange={(e) => updatePopupBackground("color", e.target.value)}
          value={activeBg}
          className="mb-3 h-8 p-0 rounded shadow-sm"
        />
        <label className="block text-sm mb-2">Popup Background:</label>
      </div>

      <input
        type="text"
        placeholder="Image URL"
        className="w-full rounded px-2 py-1 mb-3 text-sm shadow-sm ring-1 ring-gray-100"
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
          <div className="my-3" />
          {/* ---------- Input type selector ---------- */}
          {selectedComp.type === "input" && (
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">
                Input type
              </label>
              <select
                className="w-full rounded px-2 py-1 shadow-sm ring-1 ring-gray-100 text-sm"
                value={selectedComp.inputType ?? "text"}
                onChange={(e) =>
                  updateComponentField("inputType", e.target.value)
                }
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="tel">Phone (tel)</option>
                <option value="number">Number</option>
                <option value="password">Password</option>
                <option value="url">URL</option>
                <option value="search">Search</option>
                <option value="date">Date</option>
                <option value="time">Time</option>
              </select>

              <div className="text-xxs text-gray-500 mt-1">
                This sets <code>comp.inputType</code> used by the input
                renderer.
              </div>
            </div>
          )}

          <div className="rounded p-3 bg-white shadow-sm ring-1 ring-gray-50">
            <h4 className="font-medium mb-2">
              Selected: {selectedComp.type.toUpperCase()}
            </h4>

            {/* Attribute inputs */}
            <input
              value={selectedComp.content ?? ""}
              onChange={(e) => updateComponentField("content", e.target.value)}
              className="w-full rounded px-2 py-1 mb-2 shadow-sm ring-1 ring-gray-100"
              type="text"
              placeholder="Content / text"
            />
            {/* Show 'src' only for types that need it */}
            {(() => {
              // edit this list to include any component types that require a src
              const SRC_TYPES = ["image", "video", "map", "imageBox"];
              if (!selectedComp) return null;
              if (!SRC_TYPES.includes(selectedComp.type)) return null;

              // friendly label based on type
              const labelMap: Record<string, string> = {
                image: "Image URL",
                video: "Video URL",
                map: "Map embed URL",
                imageBox: "Image Box URL",
              };
              const lbl = labelMap[selectedComp.type] ?? "Source URL";

              return (
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">
                    {lbl}
                  </label>
                  <input
                    value={selectedComp.src ?? ""}
                    onChange={(e) =>
                      updateComponentField("src", e.target.value)
                    }
                    className="w-full rounded px-2 py-1 shadow-sm ring-1 ring-gray-100"
                    type="text"
                    placeholder={lbl}
                  />
                </div>
              );
            })()}

            {/* Options editor */}
            {isOptionType(selectedComp.type) && (
              <>
                <div className="my-3" />
                <div className="mb-2 flex items-center justify-between">
                  <h5 className="text-sm font-medium">Options</h5>
                  <button
                    onClick={addOption}
                    className="text-xs px-2 py-1 rounded bg-gray-50 hover:bg-gray-100"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2 mb-3">
                  {(Array.isArray(selectedComp.options)
                    ? selectedComp.options
                    : []
                  ).map((opt: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex gap-2 items-center bg-white rounded p-2 shadow-sm ring-1 ring-gray-50"
                    >
                      <input
                        className="flex-1 rounded px-2 py-1 text-sm shadow-sm ring-1 ring-gray-100"
                        value={opt}
                        onChange={(e) => onChangeOption(idx, e.target.value)}
                      />
                      <button
                        onClick={() => removeOption(idx)}
                        className="text-xs text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="my-3" />

            <h5 className="text-sm font-medium mb-2">Styles</h5>
            <div className="space-y-3">
              {Object.entries(selectedComp.styles || {}).map(([key, val]) => {
                if (key === "width" || key === "height") {
                  const cur = val ?? "";
                  return (
                    <div
                      key={key}
                      className="bg-white rounded p-2 shadow-sm ring-1 ring-gray-50"
                    >
                      <label className="block text-xs text-gray-500 mb-1">
                        {key}
                      </label>
                      <div className="flex gap-2 mb-2">
                        <select
                          className="flex-1 px-2 py-2 rounded text-sm shadow-sm ring-1 ring-gray-100"
                          value={String(cur ?? "")}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (!isNaN(v))
                              applyComponentStylePx(
                                key as "width" | "height",
                                v
                              );
                          }}
                        >
                          <option value="">Choose {key}</option>
                          {PIXEL_CHOICES.map((px) => (
                            <option key={px} value={px}>
                              {px}px
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={1}
                          className="flex-1 rounded px-2 py-1 text-sm shadow-sm ring-1 ring-gray-100"
                          value={key === "width" ? compCustomW : compCustomH}
                          onChange={(e) =>
                            key === "width"
                              ? setCompCustomW(e.target.value)
                              : setCompCustomH(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              applyComponentStylePx(
                                key as "width" | "height",
                                key === "width" ? compCustomW : compCustomH
                              );
                          }}
                          onBlur={() =>
                            applyComponentStylePx(
                              key as "width" | "height",
                              key === "width" ? compCustomW : compCustomH
                            )
                          }
                          placeholder="Custom px"
                        />
                        <button
                          onClick={() =>
                            applyComponentStylePx(
                              key as "width" | "height",
                              key === "width" ? compCustomW : compCustomH
                            )
                          }
                          className="px-3 py-1 rounded text-sm bg-gray-50 hover:bg-gray-100"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={key}
                    className="bg-white rounded p-2 shadow-sm ring-1 ring-gray-50"
                  >
                    <label className="block text-xs text-gray-500 mb-1">
                      {key}
                    </label>
                    <input
                      className="w-full rounded px-2 py-1 shadow-sm ring-1 ring-gray-100"
                      value={String(val ?? "")}
                      onChange={(e) =>
                        updateComponentStyle(key, e.target.value)
                      }
                    />
                  </div>
                );
              })}
            </div>

            <div className="my-3" />
            <StylePicker
              onAdd={(k: string, v: any) => updateComponentStyle(k, v)}
              existingKeys={Object.keys(selectedComp?.styles || {})}
            />

            <div className="my-3" />
          </div>
        </>
      )}

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-3">Add basic content elements</h4>

        <div className="grid grid-cols-2 gap-3">
          {components.map((key) => (
            <button
              key={key}
              draggable
              onDragStart={() => setDraggedType(key)}
              className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm text-gray-800"
              style={{ minHeight: 88, textAlign: "center" }}
              aria-label={`Add ${key}`}
              title={`Drag to add ${key}`}
            >
              <div
                className="rounded-md p-2"
                style={{ background: "transparent" }}
              >
                <div className="text-gray-700">
                  {ICONS[key] ?? <MdPhotoSizeSelectLarge />}
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-600">{key}</div>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowJson(true)}
            className="w-full py-2 rounded-md bg-black text-white hover:opacity-95"
          >
            Show Code
          </button>
        </div>
      </div>

      {/* preview portal */}
      {PreviewModal}
    </aside>
  );
};

export default RightSideBar;
