import { CompType } from "./types";

  // ---------- default styles for all known types ----------
  export const getDefaultStyles = (
    type: CompType
  ): Record<string, string | number> => {
    switch (type) {
      case "heading":
        return { fontSize: "20px", fontWeight: 600, color: "#0f172a" };
      case "text":
        return { color: "#1e293b", fontSize: "16px" };
      case "textarea":
        return {
          width: 150,
          height: 80,
          border: "1px solid #ccc",
          borderRadius: "4px",
        };
      case "link":
        return {
          color: "#2563eb",
          textDecoration: "underline",
          fontSize: "14px",
        };
      case "linkBox":
        return {
          padding: "8px 12px",
          border: "1px solid #2563eb",
          borderRadius: "6px",
          display: "inline-block",
          color: "#2563eb",
        };
      case "image":
        return {
          width: 120,
          height: 120,
          objectFit: "cover",
          borderRadius: "6px",
        };
      case "imageBox":
        return {
          width: 150,
          height: 100,
          border: "1px dashed #aaa",
          borderRadius: "6px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        };
      case "video":
        return { width: 180, height: 120, borderRadius: "6px" };
      case "map":
        return {
          width: 180,
          height: 150,
          background: "#e2e8f0",
          borderRadius: "6px",
        };
      case "icon":
        return { fontSize: "24px", color: "#111827" };
      case "button":
        return {
          backgroundColor: "#2563eb",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
        };
      case "input":
        return {
          border: "1px solid #ccc",
          padding: "6px 8px",
          borderRadius: "4px",
        };
      default:
        return {};
    }
  };
