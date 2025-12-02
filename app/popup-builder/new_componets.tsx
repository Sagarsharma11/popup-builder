import { v4 as uuid } from "uuid";

export const createNewComponent = ({ draggedType, x, y, baseStyles }: any) => {
  const listLayoutStyles =
    draggedType === "radio buttons group" || draggedType === "checkboxes group"
      ? {
          display: "flex",
          flexDirection: "column",
        }
      : {};
  return {
    id: uuid(),
    type: draggedType,

    inputType: inputTypeForSelectDropdown(),

    // unified text-based fields
    label: defaultLabel(draggedType),
    content: defaultLabel(draggedType),
    placeholder: defaultLabel(draggedType),

    // selectable/image/video
    src: defaultSrc(draggedType),

    // list types (safe string arrays)
    options: defaultOptions(draggedType),

    position: { x, y },

    styles: { ...baseStyles,  ...listLayoutStyles },
  };
};


function inputTypeForSelectDropdown(): string {
  return "text"; // default to single select
}

/* ---------------- DEFAULT LABEL/TEXT ---------------- */
function defaultLabel(type: string): string {
  switch (type) {
    case "heading":
      return "Heading Text";
    case "text":
      return "Sample Text";
    case "textarea":
      return "Write something...";
    case "link":
      return "Click Here";
    case "linkBox":
      return "Link Box";
    case "imageBox":
      return "Image Box";
    case "map":
      return "Map";
    case "icon":
      return "⭐";
    case "button":
      return "Click Me";
    case "input":
      return "Enter text...";

    /* --- NEW TYPES --- */
    case "radio buttons group":
      return "Choose an option";
    case "checkboxes group":
      return "Select choices";
    case "select dropdown":
      return "Pick an item";

    default:
      return "";
  }
}

/* ---------------- DEFAULT SRC FOR MEDIA ---------------- */
function defaultSrc(type: string): string | undefined {
  switch (type) {
    case "image":
      return "https://placehold.co/600x400";
    case "video":
      return "https://www.w3schools.com/html/mov_bbb.mp4";
    default:
      return undefined;
  }
}

/* ---------------- OPTIONS FOR LIST-BASED COMPONENTS ---------------- */
function defaultOptions(type: string): string[] | undefined {
  switch (type) {
    case "radio buttons group":
      return ["Option 1", "Option 2", "Option 3"];

    case "checkboxes group":
      return ["Choice A", "Choice B", "Choice C"];

    case "select dropdown":
      return ["Item 1", "Item 2", "Item 3"];

    default:
      return undefined;
  }
}
