export type CompType =
  | "heading"
  | "text"
  | "textarea"
  | "link"
  | "linkBox"
  | "image"
  | "imageBox"
  | "video"
  | "map"
  | "icon"
  | "button"
  | "input";

export interface ComponentData {
  id: string;
  type: CompType;
  label?: string;
  content?: string;
  placeholder?: string;
  href?: string;
  position: { x: number; y: number };
  styles?: Record<string, string | number>;
  src?: string;
  action?:
    | { type: "openPopup"; targetPopupId: string }
    | { type: "closePopup" };
}

export interface PopupData {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  components: ComponentData[];
  followUps: PopupData[]; // single-level nested follow-ups
}