// import { v4 as uuid } from "uuid";
// export const createNewComponent = ({draggedType, x, y, baseStyles}:any) => {
//   return {
//     id: uuid(),
//     type: draggedType,
//     // label: draggedType === "button" ? "Next Popup" : undefined,
//     // label: draggedType === 'heading' ? "heading" 
//     label : attrValue(draggedType),
//     content: attrValue(draggedType),
//     placeholder: attrValue(draggedType),
//     src:
//       draggedType === "image" ? "https://via.placeholder.com/150" : undefined,
//     position: { x, y },
//     // always give a non-empty styles object (clone defaults)
//     styles: { ...baseStyles },
//   };
// };


// const attrValue = (draggedType: any) => {
//   switch (draggedType) {
//     case "heading":
//       return "Heading Text";

//     case "text":
//       return "Sample Text";

//     case "textarea":
//       return "Write something...";

//     case "link":
//       return {
//         label: "Click Here",
//         href: "#",
//       };

//     case "linkBox":
//       return {
//         label: "Link Box",
//       };

//     case "image":
//       return {
//         src: "https://via.placeholder.com/150",
//       };

//     case "imageBox":
//       return {
//         label: "Image Box",
//       };

//     case "video":
//       return {
//         src: "https://www.w3schools.com/html/mov_bbb.mp4",
//       };

//     case "map":
//       return {
//         label: "Map",
//       };

//     case "icon":
//       return {
//         label: "⭐",
//       };

//     case "button":
//       return {
//         label: "Click Me",
//       };

//     case "input":
//       return {
//         placeholder: "Enter text...",
//       };

//     default:
//       return undefined;
//   }
// };



import { v4 as uuid } from "uuid";
import { CiImageOff } from "react-icons/ci";

export const createNewComponent = ({ draggedType, x, y, baseStyles }: any) => {
  const text = defaultText(draggedType);

  return {
    id: uuid(),
    type: draggedType,

    // unified single source of truth
    label: text,
    content: text,
    placeholder: text,

    // src only for media types
    src: defaultSrc(draggedType),

    position: { x, y },
    styles: { ...baseStyles },
  };
};

// ✔ ALL components return string values — never objects
function defaultText(type: string): string {
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
    default:
      return "";
  }
}

// ✔ media src values (strings only)
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
