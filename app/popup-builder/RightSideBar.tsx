import React from "react";
import StylePicker from "./StylePicker";
import {
  MdTitle,
  MdTextFields,
  // MdTextarea,
  MdLink,
  MdImage,
  MdVideocam,
  MdMap,
  MdInsertEmoticon,
  MdRadioButtonChecked,
  MdInput,
  MdPhotoSizeSelectLarge,
} from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { BiLinkAlt, BiCube } from "react-icons/bi";
import { AiOutlineFileImage } from "react-icons/ai";
import { POPUP_PRESETS } from "./popupPresets";

const ICONS: Record<string, React.ReactNode> = {
  heading: <MdTitle size={24} />,
  text: <MdTextFields size={24} />,
  textarea: <FaRegFileAlt size={22} />,
  link: <MdLink size={22} />,
  linkBox: <BiLinkAlt size={22} />,
  image: <MdImage size={22} />,
  // imageBox: <AiOutlineFileImage size={22} />,
  video: <MdVideocam size={22} />,
  map: <MdMap size={22} />,
  icon: <MdInsertEmoticon size={22} />,
  button: <MdRadioButtonChecked size={22} />,
  input: <MdInput size={22} />,
};

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
  setPopups
}: any) => {
  const activeBg = (findParentAndPopup(activePopupId).popup ?? popups[0])
    .backgroundColor;

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
  ];

  const updatePopupSize = (popupId: string, width: any, height: any) => {
    setPopups((prev) =>
      prev.map((p) =>
        p.id === popupId
          ? { ...p, width, height }
          : {
              ...p,
              followUps: p.followUps.map((fu) =>
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

  return (
    <aside className="w-72 bg-white border-l p-4 overflow-y-auto text-black">
      <select
        className="w-full border px-2 py-2 rounded mb-3"
        onChange={(e) => applyPreset(e.target.value)}
      >
        <option value="">Select Popup Size</option>
        {Object.entries(POPUP_PRESETS).map(([key, preset]) => (
          <option key={key} value={key}>
            {preset.label}
          </option>
        ))}
      </select>
      <h3 className="font-semibold mb-3">Properties</h3>

      <label className="block text-sm mb-2">Popup Background:</label>
      <input
        type="color"
        onChange={(e) => updatePopupBackground("color", e.target.value)}
        value={activeBg}
        className="mb-3 w-full h-8 p-0 border-0 rounded"
      />
      <input
        type="text"
        placeholder="Image URL"
        className="w-full border rounded px-2 py-1 mb-3 text-sm"
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
          {/* Attribute inputs (content/label/href/placeholder/src etc) */}
          <input
            value={selectedComp.content ?? ""}
            onChange={(e) => updateComponentField("content", e.target.value)}
            className="w-full border rounded rounded px-2 py-1 mb-2"
            type="text"
            placeholder="Content / text"
          />
          <div className="mb-2">
            <label className="block text-xs text-gray-500 mb-1">src</label>
            <input
              value={selectedComp.src ?? ""}
              onChange={(e) => updateComponentField("src", e.target.value)}
              className="w-full border rounded px-2 py-1"
              type="text"
              placeholder="Image / media src"
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
          {/* Component buttons with icon and small label */}
          {components.map((key) => (
            <button
              key={key}
              draggable
              onDragStart={() => setDraggedType(key)}
              className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-md hover:shadow-md transition-shadow text-sm text-gray-800"
              style={{ minHeight: 88, textAlign: "center" }}
              aria-label={`Add ${key}`}
              title={`Drag to add ${key}`}
            >
              <div
                className="rounded-md p-2"
                style={{
                  background:
                    key === "button" ? "rgba(37,99,235,0.08)" : "transparent",
                }}
              >
                <div className="text-gray-700">{ICONS[key]}</div>
              </div>
              <div className="mt-1 text-xs text-gray-600">{key}</div>
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
