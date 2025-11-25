[
  {
    id: "6d29f4a4-36bb-473d-9dcf-bc2777b1fa8b",
    name: "Popup 1",
    width: 500,
    height: 400,
    backgroundColor: "#ffffff",
    backgroundImage: "",
    components: [
      {
        id: "12ba9fea-b700-4761-8bde-572806f6a4f1",
        type: "text",
        content: "Sample Text",
        position: { x: 31, y: 62 },
        styles: { color: "#1e293b", fontSize: "16px" },
      },
      {
        id: "c122332b-8cd2-482b-857e-65520345052c",
        type: "button",
        label: "Next Popup",
        position: { x: 34, y: 135 },
        styles: {
          backgroundColor: "#2563eb",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
        },
        action: {
          type: "openPopup",
          targetPopupId: "848fa617-788c-4219-83ed-77bb61b62a01",
        },
      },
    ],
  },
  {
    id: "848fa617-788c-4219-83ed-77bb61b62a01",
    name: "Popup 2",
    width: 500,
    height: 400,
    backgroundColor: "#ffffff",
    components: [
      {
        id: "3ef50ed7-eaaa-4737-82b1-a6fa235f5939",
        type: "button",
        label: "Next Popup",
        position: { x: 51, y: 118.3359375 },
        styles: {
          backgroundColor: "#2563eb",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
        },
        action: {
          type: "openPopup",
          targetPopupId: "5d330d80-f311-4407-9ebf-72fa22f49d77",
        },
      },
    ],
    folloup:[
        
    ]
  },
  {
    id: "5d330d80-f311-4407-9ebf-72fa22f49d77",
    name: "Popup 3",
    width: 500,
    height: 400,
    backgroundColor: "#ffffff",
    components: [
      {
        id: "9a78179b-2312-4f1f-8d48-ce88a07cf56c",
        type: "text",
        content: "Sample Text",
        position: { x: 111, y: 82.671875 },
        styles: { color: "#1e293b", fontSize: "16px" },
      },
    ],
  },
];
