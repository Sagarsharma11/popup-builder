/* ---------- helper renderer ---------- */
export function RenderComponent(comp: any) {
  console.log("comp type ", comp);
  switch (comp.type) {
    case "heading":
      return <h2 style={{ margin: 0, fontWeight: 600 }}>{comp.content}</h2>;

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
          {comp.content || "Link"}
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
          {comp.content || "Link Box"}
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
        <iframe
          width={comp.styles?.width || 200}
          height={comp.styles?.height || 150}
          style={{
            border: 0,
            borderRadius: comp.styles?.borderRadius || "6px",
          }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={
            comp.src
              ? comp.src
              : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1160991241!2d72.74109816795278!3d19.082197839797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63df29a5aff%3A0xdeb62a36e4b232e0!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000"
          }
        ></iframe>
      );

    // case "icon": {
    //   const iconName = comp.content || "star";

    //   const icons: Record<string, string> = {
    //     star: "⭐",
    //     heart: "❤️",
    //     check: "✔️",
    //     cross: "❌",
    //     smile: "😊",
    //     fire: "🔥",
    //     warning: "⚠️",
    //     tick: "🟢",
    //     sun: "☀️",
    //     moon: "🌙",
    //   };

    //   return (
    //     <div
    //       style={{
    //         fontSize: comp.styles?.fontSize || "24px",
    //         color: comp.styles?.color || "#000",
    //         display: "inline-flex",
    //         alignItems: "center",
    //         justifyContent: "center",
    //       }}
    //     >
    //       {icons[iconName] || "⭐"}
    //     </div>
    //   );
    // }

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
