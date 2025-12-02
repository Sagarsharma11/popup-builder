import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ShowPopupJSON = ({ jsonData, onClose }: any) => {
  if (!jsonData) return null;

  const prettyJson = JSON.stringify(jsonData, null, 2);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        padding: "40px",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "8px",
          borderRadius: "10px",
          width: "80%",
          maxWidth: "800px",
          maxHeight: "80%",
          overflow: "auto",
          userSelect: "text", // 🔥 Allow selecting inside modal
        }}
      >
        <div style={{ textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{
              padding: "4px 8px",
              background: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontSize: "14px",
            userSelect: "text", // 🔥 Very important for copying
          }}
        >
          {prettyJson}
        </pre>
      </div>
    </div>
  );
};

export default ShowPopupJSON;
