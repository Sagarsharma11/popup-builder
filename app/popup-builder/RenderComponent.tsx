/* ---------- helper renderer ---------- */

export function RenderComponent(comp: any) {
  switch (comp.type) {
    case "heading":
      return (
        <h2 style={{ margin: 0, fontWeight: 600 }}>
          {comp.content }
        </h2>
      );

    case "text":
      return <p style={{ margin: 0 }}>{comp.content}</p>;

    case "textarea":
      return (
        <textarea
          defaultValue={comp.content || ""}
          style={{
            width: "150px",
            height: "80px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            resize: "none",
          }}
        />
      );

    case "link":
      return (
        <a
          href={comp.href || "#"}
          style={{ color: "#2563eb", textDecoration: "underline" }}
        >
          {comp.label.label || "Link"}
        </a>
      );

    case "linkBox":
      return (
        <div
          style={{
            padding: "8px 12px",
            border: "1px solid #2563eb",
            borderRadius: "6px",
            display: "inline-block",
            color: "#2563eb",
          }}
        >
          {comp.label.label || "Link Box"}
        </div>
      );

    case "image":
      return (
        <img
          src={comp.src}
          alt=""
          style={{
            width: comp.styles?.width || 120,
            height: comp.styles?.height || 120,
            objectFit: "cover",
            borderRadius: "6px",
          }}
        />
      );

    case "imageBox":
      return (
        <div
          style={{
            width: comp.styles?.width || 150,
            height: comp.styles?.height || 100,
            border: "1px dashed #aaa",
            borderRadius: "6px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px",
            color: "#666",
          }}
        >
          Image Box
        </div>
      );

    case "video":
      return (
        <video
          src={comp.src}
          controls
          style={{
            width: comp.styles?.width || 180,
            height: comp.styles?.height || 120,
            borderRadius: "6px",
          }}
        />
      );

    case "map":
      return (
        <div
          style={{
            width: comp.styles?.width || 180,
            height: comp.styles?.height || 150,
            background: "#e2e8f0",
            borderRadius: "6px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px",
            color: "#555",
          }}
        >
          Map Placeholder
        </div>
      );

    case "icon":
      return (
        <div
          style={{
            fontSize: "24px",
            color: comp.styles?.color || "#000",
          }}
        >
          ⭐
        </div>
      );

    case "button":
      return (
        <button
          style={{
            border: "none",
            padding: "8px 16px",
            backgroundColor: comp.styles?.backgroundColor || "#2563eb",
            color: comp.styles?.color || "#fff",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {comp.label.label || "Button"}
        </button>
      );

    case "input":
      return (
        <input
          placeholder={comp.placeholder || "Enter text"}
          style={{
            border: "1px solid #ccc",
            padding: "6px 8px",
            borderRadius: "4px",
          }}
        />
      );

    default:
      return null;
  }
}
