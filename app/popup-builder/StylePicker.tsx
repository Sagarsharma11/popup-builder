// import React, { useMemo, useState, useEffect } from "react";

// // Extended CSS properties covering most HTML/CSS needs
// type CSSProperty =
//   // Layout
//   | "display" | "position" | "top" | "right" | "bottom" | "left" | "float" | "clear"
//   // Flexbox
//   | "flex" | "flexDirection" | "flexWrap" | "flexFlow" | "justifyContent" | "alignItems" | "alignContent" | "alignSelf" | "order" | "flexGrow" | "flexShrink" | "flexBasis"
//   // Grid
//   | "grid" | "gridTemplateColumns" | "gridTemplateRows" | "gridTemplateAreas" | "gridArea" | "gridColumn" | "gridRow" | "gridAutoFlow" | "gridAutoColumns" | "gridAutoRows" | "gap" | "rowGap" | "columnGap"
//   // Box Model
//   | "width" | "height" | "minWidth" | "maxWidth" | "minHeight" | "maxHeight" | "margin" | "marginTop" | "marginRight" | "marginBottom" | "marginLeft" | "padding" | "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft" | "boxSizing"
//   // Typography
//   | "fontFamily" | "fontSize" | "fontWeight" | "fontStyle" | "fontVariant" | "lineHeight" | "letterSpacing" | "textAlign" | "textDecoration" | "textTransform" | "textOverflow" | "whiteSpace" | "wordBreak" | "wordWrap" | "color"
//   // Background
//   | "backgroundColor" | "backgroundImage" | "backgroundPosition" | "backgroundSize" | "backgroundRepeat" | "backgroundAttachment" | "backgroundClip" | "backgroundOrigin"
//   // Border
//   | "border" | "borderWidth" | "borderStyle" | "borderColor" | "borderTop" | "borderRight" | "borderBottom" | "borderLeft" | "borderRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderBottomRightRadius" | "borderBottomLeftRadius" | "borderCollapse" | "borderSpacing"
//   // Effects
//   | "opacity" | "boxShadow" | "textShadow" | "filter" | "backdropFilter" | "mixBlendMode"
//   // Transform
//   | "transform" | "transformOrigin" | "transformStyle" | "perspective" | "perspectiveOrigin"
//   // Transition & Animation
//   | "transition" | "transitionProperty" | "transitionDuration" | "transitionTimingFunction" | "transitionDelay" | "animation" | "animationName" | "animationDuration" | "animationTimingFunction" | "animationDelay" | "animationIterationCount" | "animationDirection" | "animationFillMode" | "animationPlayState"
//   // Positioning
//   | "zIndex" | "overflow" | "overflowX" | "overflowY" | "objectFit" | "objectPosition" | "visibility" | "cursor"
//   // List
//   | "listStyle" | "listStyleType" | "listStylePosition" | "listStyleImage"
//   // Table
//   | "tableLayout" | "captionSide" | "emptyCells"
//   // Other
//   | "content" | "quotes" | "counterReset" | "counterIncrement" | "resize" | "userSelect" | "pointerEvents" | "scrollBehavior";

// type Props = {
//   onAdd: (key: string, value: string) => void;
//   availableAttrs?: CSSProperty[];
//   existingKeys?: string[];
//   initialKey?: CSSProperty;
//   className?: string;
// };

// // Comprehensive presets for all CSS properties
// const PRESETS: Record<CSSProperty, string[]> = {
//   // Layout
//   display: ["block", "inline", "inline-block", "flex", "inline-flex", "grid", "inline-grid", "none"],
//   position: ["static", "relative", "absolute", "fixed", "sticky"],
//   top: ["0", "50%", "100%", "auto"],
//   right: ["0", "50%", "100%", "auto"],
//   bottom: ["0", "50%", "100%", "auto"],
//   left: ["0", "50%", "100%", "auto"],
//   float: ["none", "left", "right"],
//   clear: ["none", "left", "right", "both"],

//   // Flexbox
//   flexDirection: ["row", "row-reverse", "column", "column-reverse"],
//   flexWrap: ["nowrap", "wrap", "wrap-reverse"],
//   justifyContent: ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"],
//   alignItems: ["stretch", "flex-start", "flex-end", "center", "baseline"],
//   alignContent: ["stretch", "flex-start", "flex-end", "center", "space-between", "space-around"],
//   alignSelf: ["auto", "flex-start", "flex-end", "center", "baseline", "stretch"],
//   order: ["-1", "0", "1", "2", "3"],
//   flexGrow: ["0", "1", "2", "3"],
//   flexShrink: ["0", "1", "2"],
//   flexBasis: ["auto", "0", "50%", "100%"],

//   // Grid
//   gridTemplateColumns: ["none", "1fr", "repeat(2, 1fr)", "repeat(3, 1fr)", "1fr 2fr", "auto 1fr auto"],
//   gridTemplateRows: ["none", "1fr", "repeat(2, 1fr)", "repeat(3, 1fr)", "auto 1fr auto"],
//   gridAutoFlow: ["row", "column", "row dense", "column dense"],
//   gap: ["0", "4px", "8px", "12px", "16px", "24px"],
//   rowGap: ["0", "4px", "8px", "12px", "16px"],
//   columnGap: ["0", "4px", "8px", "12px", "16px"],

//   // Box Model
//   width: ["auto", "100%", "fit-content", "max-content", "min-content", "50px", "100px", "200px", "300px"],
//   height: ["auto", "100%", "fit-content", "max-content", "min-content", "50px", "100px", "200px", "300px"],
//   minWidth: ["0", "100%", "50px", "100px", "200px"],
//   maxWidth: ["none", "100%", "200px", "300px", "400px", "500px"],
//   minHeight: ["0", "100%", "50px", "100px", "200px"],
//   maxHeight: ["none", "100%", "200px", "300px", "400px"],
//   margin: ["0", "4px", "8px", "12px", "16px", "24px", "auto"],
//   marginTop: ["0", "4px", "8px", "12px", "16px", "auto"],
//   marginRight: ["0", "4px", "8px", "12px", "16px", "auto"],
//   marginBottom: ["0", "4px", "8px", "12px", "16px", "auto"],
//   marginLeft: ["0", "4px", "8px", "12px", "16px", "auto"],
//   padding: ["0", "4px", "8px", "12px", "16px", "24px"],
//   paddingTop: ["0", "4px", "8px", "12px", "16px"],
//   paddingRight: ["0", "4px", "8px", "12px", "16px"],
//   paddingBottom: ["0", "4px", "8px", "12px", "16px"],
//   paddingLeft: ["0", "4px", "8px", "12px", "16px"],
//   boxSizing: ["content-box", "border-box"],

//   // Typography
//   fontFamily: ["Arial, sans-serif", "Helvetica, sans-serif", "Georgia, serif", "'Times New Roman', serif", "system-ui", "monospace"],
//   fontSize: ["12px", "14px", "16px", "18px", "20px", "24px", "32px", "48px"],
//   fontWeight: ["100", "200", "300", "400", "500", "600", "700", "800", "900", "bold", "normal"],
//   fontStyle: ["normal", "italic", "oblique"],
//   textAlign: ["left", "center", "right", "justify"],
//   textDecoration: ["none", "underline", "overline", "line-through"],
//   textTransform: ["none", "capitalize", "uppercase", "lowercase"],
//   lineHeight: ["1", "1.2", "1.4", "1.6", "2"],
//   letterSpacing: ["normal", "0px", "1px", "2px", "-1px"],
//   whiteSpace: ["normal", "nowrap", "pre", "pre-wrap", "pre-line"],
//   wordBreak: ["normal", "break-all", "keep-all", "break-word"],
//   color: ["#000000", "#333333", "#666666", "#999999", "#ffffff", "#007bff", "#28a745", "#dc3545", "#ffc107"],

//   // Background
//   backgroundColor: ["transparent", "#ffffff", "#f8f9fa", "#e9ecef", "#007bff", "#28a745", "#dc3545", "#ffc107"],
//   backgroundSize: ["auto", "cover", "contain", "50%", "100%"],
//   backgroundRepeat: ["repeat", "repeat-x", "repeat-y", "no-repeat", "space", "round"],
//   backgroundPosition: ["left top", "left center", "left bottom", "right top", "right center", "right bottom", "center top", "center center", "center bottom"],

//   // Border
//   borderWidth: ["0", "1px", "2px", "3px", "4px"],
//   borderStyle: ["none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"],
//   borderColor: ["transparent", "#000000", "#333333", "#666666", "#007bff", "#28a745", "#dc3545"],
//   borderRadius: ["0", "2px", "4px", "6px", "8px", "12px", "16px", "50%"],
//   borderTopLeftRadius: ["0", "2px", "4px", "6px", "8px"],
//   borderTopRightRadius: ["0", "2px", "4px", "6px", "8px"],
//   borderBottomRightRadius: ["0", "2px", "4px", "6px", "8px"],
//   borderBottomLeftRadius: ["0", "2px", "4px", "6px", "8px"],

//   // Effects
//   opacity: ["0", "0.25", "0.5", "0.75", "1"],
//   boxShadow: ["none", "0 1px 3px rgba(0,0,0,0.12)", "0 2px 4px rgba(0,0,0,0.15)", "0 4px 8px rgba(0,0,0,0.2)", "0 8px 16px rgba(0,0,0,0.25)"],
//   textShadow: ["none", "0 1px 2px rgba(0,0,0,0.1)", "0 2px 4px rgba(0,0,0,0.15)"],

//   // Transform
//   transform: ["none", "translateX(10px)", "translateY(10px)", "translate(10px, 10px)", "scale(1.1)", "scale(0.9)", "rotate(45deg)", "skew(10deg)"],

//   // Transition
//   transitionProperty: ["none", "all", "opacity", "transform", "background-color", "color"],
//   transitionDuration: ["0s", "0.1s", "0.2s", "0.3s", "0.5s", "1s"],
//   transitionTimingFunction: ["ease", "ease-in", "ease-out", "ease-in-out", "linear", "cubic-bezier(0.4, 0, 0.2, 1)"],

//   // Positioning
//   zIndex: ["auto", "0", "1", "10", "100", "1000"],
//   overflow: ["visible", "hidden", "scroll", "auto"],
//   overflowX: ["visible", "hidden", "scroll", "auto"],
//   overflowY: ["visible", "hidden", "scroll", "auto"],
//   objectFit: ["fill", "contain", "cover", "none", "scale-down"],
//   visibility: ["visible", "hidden", "collapse"],
//   cursor: ["auto", "pointer", "default", "text", "move", "not-allowed", "help"],

//   // List
//   listStyleType: ["none", "disc", "circle", "square", "decimal", "lower-alpha", "upper-alpha"],
//   listStylePosition: ["inside", "outside"],

//   // Table
//   tableLayout: ["auto", "fixed"],

//   // Other
//   userSelect: ["auto", "none", "text", "all"],
//   pointerEvents: ["auto", "none"],
//   resize: ["none", "both", "horizontal", "vertical"],
//   scrollBehavior: ["auto", "smooth"],
// };

// // Property groups for better organization
// const PROPERTY_GROUPS = {
//   layout: ["display", "position", "top", "right", "bottom", "left", "float", "clear"],
//   flexbox: ["flex", "flexDirection", "flexWrap", "flexFlow", "justifyContent", "alignItems", "alignContent", "alignSelf", "order", "flexGrow", "flexShrink", "flexBasis"],
//   grid: ["grid", "gridTemplateColumns", "gridTemplateRows", "gridTemplateAreas", "gridArea", "gridColumn", "gridRow", "gridAutoFlow", "gridAutoColumns", "gridAutoRows", "gap", "rowGap", "columnGap"],
//   boxModel: ["width", "height", "minWidth", "maxWidth", "minHeight", "maxHeight", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "boxSizing"],
//   typography: ["fontFamily", "fontSize", "fontWeight", "fontStyle", "fontVariant", "lineHeight", "letterSpacing", "textAlign", "textDecoration", "textTransform", "textOverflow", "whiteSpace", "wordBreak", "wordWrap", "color"],
//   background: ["backgroundColor", "backgroundImage", "backgroundPosition", "backgroundSize", "backgroundRepeat", "backgroundAttachment", "backgroundClip", "backgroundOrigin"],
//   border: ["border", "borderWidth", "borderStyle", "borderColor", "borderTop", "borderRight", "borderBottom", "borderLeft", "borderRadius", "borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius", "borderCollapse", "borderSpacing"],
//   effects: ["opacity", "boxShadow", "textShadow", "filter", "backdropFilter", "mixBlendMode"],
//   transform: ["transform", "transformOrigin", "transformStyle", "perspective", "perspectiveOrigin"],
//   transition: ["transition", "transitionProperty", "transitionDuration", "transitionTimingFunction", "transitionDelay", "animation", "animationName", "animationDuration", "animationTimingFunction", "animationDelay", "animationIterationCount", "animationDirection", "animationFillMode", "animationPlayState"],
//   positioning: ["zIndex", "overflow", "overflowX", "overflowY", "objectFit", "objectPosition", "visibility", "cursor"],
//   list: ["listStyle", "listStyleType", "listStylePosition", "listStyleImage"],
//   table: ["tableLayout", "captionSide", "emptyCells"],
//   other: ["content", "quotes", "counterReset", "counterIncrement", "resize", "userSelect", "pointerEvents", "scrollBehavior"],
// };

// // Default property order for the selector
// const DEFAULT_PROPERTIES: CSSProperty[] = [
//   // Most commonly used
//   "display", "position", "width", "height", "margin", "padding", "color", "backgroundColor",
//   "fontSize", "fontWeight", "textAlign", "border", "borderRadius", "boxShadow",
//   "flex", "flexDirection", "justifyContent", "alignItems", "grid", "gap",
//   // Others grouped by category
//   ...PROPERTY_GROUPS.layout.filter(p => !["display", "position"].includes(p)),
//   ...PROPERTY_GROUPS.flexbox.filter(p => !["flex", "flexDirection", "justifyContent", "alignItems"].includes(p)),
//   ...PROPERTY_GROUPS.grid.filter(p => !["grid", "gap"].includes(p)),
//   ...PROPERTY_GROUPS.boxModel,
//   ...PROPERTY_GROUPS.typography,
//   ...PROPERTY_GROUPS.background,
//   ...PROPERTY_GROUPS.border,
//   ...PROPERTY_GROUPS.effects,
//   ...PROPERTY_GROUPS.transform,
//   ...PROPERTY_GROUPS.transition,
//   ...PROPERTY_GROUPS.positioning,
//   ...PROPERTY_GROUPS.list,
//   ...PROPERTY_GROUPS.table,
//   ...PROPERTY_GROUPS.other,
// ];

// export default function StylePicker({
//   onAdd,
//   availableAttrs,
//   existingKeys = [],
//   initialKey,
//   className = "",
// }: Props) {
//   const allAttrs: CSSProperty[] = useMemo(
//     () => availableAttrs ?? DEFAULT_PROPERTIES,
//     [availableAttrs]
//   );

//   // Filter out existing properties and organize by group
//   const choices = useMemo(() => {
//     const filtered = allAttrs.filter((a) => !existingKeys.includes(a));
    
//     // Group properties for better organization in dropdown
//     const grouped: { group: string; properties: CSSProperty[] }[] = [];
    
//     Object.entries(PROPERTY_GROUPS).forEach(([groupName, properties]) => {
//       const groupProperties = properties.filter(p => 
//         filtered.includes(p) && allAttrs.includes(p)
//       );
//       if (groupProperties.length > 0) {
//         grouped.push({
//           group: groupName.charAt(0).toUpperCase() + groupName.slice(1),
//           properties: groupProperties
//         });
//       }
//     });

//     // Add any remaining properties not in groups to "Other"
//     const remaining = filtered.filter(p => 
//       !grouped.some(g => g.properties.includes(p))
//     );
//     if (remaining.length > 0) {
//       grouped.push({
//         group: "Other",
//         properties: remaining
//       });
//     }

//     return grouped;
//   }, [allAttrs, existingKeys]);

//   const [attr, setAttr] = useState<CSSProperty | "">(
//     initialKey ?? (choices[0]?.properties[0] ?? "")
//   );
//   const presets = attr ? PRESETS[attr] ?? [] : [];
//   const [presetValue, setPresetValue] = useState<string>(presets[0] ?? "");
//   const [useCustom, setUseCustom] = useState<boolean>(false);
//   const [customValue, setCustomValue] = useState<string>("");

//   // Reset state when attribute changes
//   useEffect(() => {
//     if (attr) {
//       setUseCustom(false);
//       setCustomValue("");
//       setPresetValue(PRESETS[attr]?.[0] ?? "");
//     }
//   }, [attr]);

//   const handleAdd = () => {
//     if (!attr) return;
    
//     const value = useCustom ? customValue.trim() : presetValue;
//     if (!value) return;
    
//     onAdd(attr, value);
    
//     // Reset form
//     setCustomValue("");
//     setUseCustom(false);
//     if (attr) {
//       setPresetValue(PRESETS[attr]?.[0] ?? "");
//     }
//   };

//   const handleReset = () => {
//     setAttr(choices[0]?.properties[0] ?? "");
//     setCustomValue("");
//     setUseCustom(false);
//     setPresetValue(choices[0]?.properties[0] ? PRESETS[choices[0].properties[0]]?.[0] ?? "" : "");
//   };

//   const getInputPlaceholder = (property: CSSProperty): string => {
//     const placeholders: Partial<Record<CSSProperty, string>> = {
//       color: "#hex, rgb(), or color name",
//       backgroundColor: "#hex, rgb(), or color name",
//       fontFamily: "Font name or stack",
//       fontSize: "px, rem, em, %",
//       margin: "px, rem, em, %",
//       padding: "px, rem, em, %",
//       width: "px, rem, em, %, vw",
//       height: "px, rem, em, %, vh",
//       borderRadius: "px, rem, em, %",
//       boxShadow: "e.g., 0 2px 4px rgba(0,0,0,0.1)",
//       transform: "e.g., translateX(10px) rotate(45deg)",
//       transition: "property duration timing-function delay",
//     };
    
//     return placeholders[property] || "Enter value...";
//   };

//   return (
//     <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
//       <div className="p-4 space-y-4">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold text-gray-900">Add CSS Style</h3>
//           <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//             {existingKeys.length} properties set
//           </div>
//         </div>

//         {/* Property Selector */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             CSS Property
//           </label>
//           <select
//             value={attr}
//             onChange={(e) => setAttr(e.target.value as CSSProperty)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             disabled={choices.length === 0}
//           >
//             {choices.length === 0 && (
//               <option value="">All properties added</option>
//             )}
//             {choices.map((group) => (
//               <optgroup key={group.group} label={group.group}>
//                 {group.properties.map((property) => (
//                   <option key={property} value={property}>
//                     {property}
//                   </option>
//                 ))}
//               </optgroup>
//             ))}
//           </select>
//         </div>

//         {/* Value Input */}
//         {attr && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Value
//             </label>
            
//             {/* Preset Selector */}
//             {!useCustom && presets.length > 0 && (
//               <div className="mb-3">
//                 <select
//                   value={presetValue}
//                   onChange={(e) => {
//                     if (e.target.value === "__custom") {
//                       setUseCustom(true);
//                     } else {
//                       setPresetValue(e.target.value);
//                     }
//                   }}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 >
//                   {presets.map((value) => (
//                     <option key={value} value={value}>
//                       {value}
//                     </option>
//                   ))}
//                   <option value="__custom">— Custom Value —</option>
//                 </select>
//               </div>
//             )}

//             {/* Custom Input */}
//             {(useCustom || presets.length === 0) && (
//               <div className="mb-3">
//                 <input
//                   type="text"
//                   value={customValue}
//                   onChange={(e) => setCustomValue(e.target.value)}
//                   placeholder={getInputPlaceholder(attr)}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 />
//               </div>
//             )}

//             {/* Custom Toggle */}
//             {presets.length > 0 && (
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   id="custom-toggle"
//                   checked={useCustom}
//                   onChange={(e) => setUseCustom(e.target.checked)}
//                   className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <label
//                   htmlFor="custom-toggle"
//                   className="text-sm text-gray-700 cursor-pointer"
//                 >
//                   Use custom value
//                 </label>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex gap-3 pt-2">
//           <button
//             onClick={handleAdd}
//             disabled={!attr || (!useCustom && !presetValue) || (useCustom && !customValue.trim())}
//             className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             Add Style
//           </button>
//           <button
//             onClick={handleReset}
//             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
//           >
//             Reset
//           </button>
//         </div>

//         {/* Help Text */}
//         {attr && (
//           <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
//             <strong>Tip:</strong> Use standard CSS values like "10px", "1rem", "#fff", "center", etc.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useMemo, useState, useEffect } from "react";

// Extended CSS properties covering most HTML/CSS needs
type CSSProperty =
  // Layout
  | "display" | "position" | "top" | "right" | "bottom" | "left" | "float" | "clear"
  // Flexbox
  | "flex" | "flexDirection" | "flexWrap" | "flexFlow" | "justifyContent" | "alignItems" | "alignContent" | "alignSelf" | "order" | "flexGrow" | "flexShrink" | "flexBasis"
  // Grid
  | "grid" | "gridTemplateColumns" | "gridTemplateRows" | "gridTemplateAreas" | "gridArea" | "gridColumn" | "gridRow" | "gridAutoFlow" | "gridAutoColumns" | "gridAutoRows" | "gap" | "rowGap" | "columnGap"
  // Box Model
  | "width" | "height" | "minWidth" | "maxWidth" | "minHeight" | "maxHeight" | "margin" | "marginTop" | "marginRight" | "marginBottom" | "marginLeft" | "padding" | "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft" | "boxSizing"
  // Typography
  | "fontFamily" | "fontSize" | "fontWeight" | "fontStyle" | "fontVariant" | "lineHeight" | "letterSpacing" | "textAlign" | "textDecoration" | "textTransform" | "textOverflow" | "whiteSpace" | "wordBreak" | "wordWrap" | "color"
  // Background
  | "backgroundColor" | "backgroundImage" | "backgroundPosition" | "backgroundSize" | "backgroundRepeat" | "backgroundAttachment" | "backgroundClip" | "backgroundOrigin"
  // Border
  | "border" | "borderWidth" | "borderStyle" | "borderColor" | "borderTop" | "borderRight" | "borderBottom" | "borderLeft" | "borderRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderBottomRightRadius" | "borderBottomLeftRadius" | "borderCollapse" | "borderSpacing"
  // Effects
  | "opacity" | "boxShadow" | "textShadow" | "filter" | "backdropFilter" | "mixBlendMode"
  // Transform
  | "transform" | "transformOrigin" | "transformStyle" | "perspective" | "perspectiveOrigin"
  // Transition & Animation
  | "transition" | "transitionProperty" | "transitionDuration" | "transitionTimingFunction" | "transitionDelay" | "animation" | "animationName" | "animationDuration" | "animationTimingFunction" | "animationDelay" | "animationIterationCount" | "animationDirection" | "animationFillMode" | "animationPlayState"
  // Positioning
  | "zIndex" | "overflow" | "overflowX" | "overflowY" | "objectFit" | "objectPosition" | "visibility" | "cursor"
  // List
  | "listStyle" | "listStyleType" | "listStylePosition" | "listStyleImage"
  // Table
  | "tableLayout" | "captionSide" | "emptyCells"
  // Other
  | "content" | "quotes" | "counterReset" | "counterIncrement" | "resize" | "userSelect" | "pointerEvents" | "scrollBehavior";

type Props = {
  onAdd: (key: string, value: string) => void;
  availableAttrs?: CSSProperty[];
  existingKeys?: string[];
  initialKey?: CSSProperty;
  className?: string;
};

// Comprehensive presets for all CSS properties
const PRESETS: Record<CSSProperty, string[]> = {
  // Layout
  display: ["block", "inline", "inline-block", "flex", "inline-flex", "grid", "inline-grid", "none"],
  position: ["static", "relative", "absolute", "fixed", "sticky"],
  top: ["0", "50%", "100%", "auto"],
  right: ["0", "50%", "100%", "auto"],
  bottom: ["0", "50%", "100%", "auto"],
  left: ["0", "50%", "100%", "auto"],
  float: ["none", "left", "right"],
  clear: ["none", "left", "right", "both"],

  // Flexbox
  flexDirection: ["row", "row-reverse", "column", "column-reverse"],
  flexWrap: ["nowrap", "wrap", "wrap-reverse"],
  justifyContent: ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"],
  alignItems: ["stretch", "flex-start", "flex-end", "center", "baseline"],
  alignContent: ["stretch", "flex-start", "flex-end", "center", "space-between", "space-around"],
  alignSelf: ["auto", "flex-start", "flex-end", "center", "baseline", "stretch"],
  order: ["-1", "0", "1", "2", "3"],
  flexGrow: ["0", "1", "2", "3"],
  flexShrink: ["0", "1", "2"],
  flexBasis: ["auto", "0", "50%", "100%"],

  // Grid
  gridTemplateColumns: ["none", "1fr", "repeat(2, 1fr)", "repeat(3, 1fr)", "1fr 2fr", "auto 1fr auto"],
  gridTemplateRows: ["none", "1fr", "repeat(2, 1fr)", "repeat(3, 1fr)", "auto 1fr auto"],
  gridAutoFlow: ["row", "column", "row dense", "column dense"],
  gap: ["0", "4px", "8px", "12px", "16px", "24px"],
  rowGap: ["0", "4px", "8px", "12px", "16px"],
  columnGap: ["0", "4px", "8px", "12px", "16px"],

  // Box Model
  width: ["auto", "100%", "fit-content", "max-content", "min-content", "50px", "100px", "200px", "300px"],
  height: ["auto", "100%", "fit-content", "max-content", "min-content", "50px", "100px", "200px", "300px"],
  minWidth: ["0", "100%", "50px", "100px", "200px"],
  maxWidth: ["none", "100%", "200px", "300px", "400px", "500px"],
  minHeight: ["0", "100%", "50px", "100px", "200px"],
  maxHeight: ["none", "100%", "200px", "300px", "400px"],
  margin: ["0", "4px", "8px", "12px", "16px", "24px", "auto"],
  marginTop: ["0", "4px", "8px", "12px", "16px", "auto"],
  marginRight: ["0", "4px", "8px", "12px", "16px", "auto"],
  marginBottom: ["0", "4px", "8px", "12px", "16px", "auto"],
  marginLeft: ["0", "4px", "8px", "12px", "16px", "auto"],
  padding: ["0", "4px", "8px", "12px", "16px", "24px"],
  paddingTop: ["0", "4px", "8px", "12px", "16px"],
  paddingRight: ["0", "4px", "8px", "12px", "16px"],
  paddingBottom: ["0", "4px", "8px", "12px", "16px"],
  paddingLeft: ["0", "4px", "8px", "12px", "16px"],
  boxSizing: ["content-box", "border-box"],

  // Typography
  fontFamily: ["Arial, sans-serif", "Helvetica, sans-serif", "Georgia, serif", "'Times New Roman', serif", "system-ui", "monospace"],
  fontSize: ["12px", "14px", "16px", "18px", "20px", "24px", "32px", "48px"],
  fontWeight: ["100", "200", "300", "400", "500", "600", "700", "800", "900", "bold", "normal"],
  fontStyle: ["normal", "italic", "oblique"],
  textAlign: ["left", "center", "right", "justify"],
  textDecoration: ["none", "underline", "overline", "line-through"],
  textTransform: ["none", "capitalize", "uppercase", "lowercase"],
  lineHeight: ["1", "1.2", "1.4", "1.6", "2"],
  letterSpacing: ["normal", "0px", "1px", "2px", "-1px"],
  whiteSpace: ["normal", "nowrap", "pre", "pre-wrap", "pre-line"],
  wordBreak: ["normal", "break-all", "keep-all", "break-word"],
  color: ["#000000", "#333333", "#666666", "#999999", "#ffffff", "#007bff", "#28a745", "#dc3545", "#ffc107"],

  // Background
  backgroundColor: ["transparent", "#ffffff", "#f8f9fa", "#e9ecef", "#007bff", "#28a745", "#dc3545", "#ffc107"],
  backgroundSize: ["auto", "cover", "contain", "50%", "100%"],
  backgroundRepeat: ["repeat", "repeat-x", "repeat-y", "no-repeat", "space", "round"],
  backgroundPosition: ["left top", "left center", "left bottom", "right top", "right center", "right bottom", "center top", "center center", "center bottom"],

  // Border (shorthand) — ADDED
  border: [
    "none",
    "1px solid #000",
    "1px solid #eee",
    "1px solid #2563eb",
    "2px solid #000",
    "2px dashed #ccc",
    "3px double #333",
  ],
  borderWidth: ["0", "1px", "2px", "3px", "4px"],
  borderStyle: ["none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"],
  borderColor: ["transparent", "#000000", "#333333", "#666666", "#007bff", "#28a745", "#dc3545"],
  borderRadius: ["0", "2px", "4px", "6px", "8px", "12px", "16px", "50%"],
  borderTopLeftRadius: ["0", "2px", "4px", "6px", "8px"],
  borderTopRightRadius: ["0", "2px", "4px", "6px", "8px"],
  borderBottomRightRadius: ["0", "2px", "4px", "6px", "8px"],
  borderBottomLeftRadius: ["0", "2px", "4px", "6px", "8px"],

  // Effects
  opacity: ["0", "0.25", "0.5", "0.75", "1"],
  boxShadow: ["none", "0 1px 3px rgba(0,0,0,0.12)", "0 2px 4px rgba(0,0,0,0.15)", "0 4px 8px rgba(0,0,0,0.2)", "0 8px 16px rgba(0,0,0,0.25)"],
  textShadow: ["none", "0 1px 2px rgba(0,0,0,0.1)", "0 2px 4px rgba(0,0,0,0.15)"],

  // Transform
  transform: ["none", "translateX(10px)", "translateY(10px)", "translate(10px, 10px)", "scale(1.1)", "scale(0.9)", "rotate(45deg)", "skew(10deg)"],

  // Transition
  transitionProperty: ["none", "all", "opacity", "transform", "background-color", "color"],
  transitionDuration: ["0s", "0.1s", "0.2s", "0.3s", "0.5s", "1s"],
  transitionTimingFunction: ["ease", "ease-in", "ease-out", "ease-in-out", "linear", "cubic-bezier(0.4, 0, 0.2, 1)"],

  // Positioning
  zIndex: ["auto", "0", "1", "10", "100", "1000"],
  overflow: ["visible", "hidden", "scroll", "auto"],
  overflowX: ["visible", "hidden", "scroll", "auto"],
  overflowY: ["visible", "hidden", "scroll", "auto"],
  objectFit: ["fill", "contain", "cover", "none", "scale-down"],
  visibility: ["visible", "hidden", "collapse"],
  cursor: ["auto", "pointer", "default", "text", "move", "not-allowed", "help"],

  // List
  listStyleType: ["none", "disc", "circle", "square", "decimal", "lower-alpha", "upper-alpha"],
  listStylePosition: ["inside", "outside"],

  // Table
  tableLayout: ["auto", "fixed"],

  // Other
  userSelect: ["auto", "none", "text", "all"],
  pointerEvents: ["auto", "none"],
  resize: ["none", "both", "horizontal", "vertical"],
  scrollBehavior: ["auto", "smooth"],
};

// Property groups for better organization
const PROPERTY_GROUPS: Record<string, CSSProperty[]> = {
  layout: ["display", "position", "top", "right", "bottom", "left", "float", "clear"],
  flexbox: ["flex", "flexDirection", "flexWrap", "flexFlow", "justifyContent", "alignItems", "alignContent", "alignSelf", "order", "flexGrow", "flexShrink", "flexBasis"],
  grid: ["grid", "gridTemplateColumns", "gridTemplateRows", "gridTemplateAreas", "gridArea", "gridColumn", "gridRow", "gridAutoFlow", "gridAutoColumns", "gridAutoRows", "gap", "rowGap", "columnGap"],
  boxModel: ["width", "height", "minWidth", "maxWidth", "minHeight", "maxHeight", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "boxSizing"],
  typography: ["fontFamily", "fontSize", "fontWeight", "fontStyle", "fontVariant", "lineHeight", "letterSpacing", "textAlign", "textDecoration", "textTransform", "textOverflow", "whiteSpace", "wordBreak", "wordWrap", "color"],
  background: ["backgroundColor", "backgroundImage", "backgroundPosition", "backgroundSize", "backgroundRepeat", "backgroundAttachment", "backgroundClip", "backgroundOrigin"],
  border: ["border", "borderWidth", "borderStyle", "borderColor", "borderTop", "borderRight", "borderBottom", "borderLeft", "borderRadius", "borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius", "borderCollapse", "borderSpacing"],
  effects: ["opacity", "boxShadow", "textShadow", "filter", "backdropFilter", "mixBlendMode"],
  transform: ["transform", "transformOrigin", "transformStyle", "perspective", "perspectiveOrigin"],
  transition: ["transition", "transitionProperty", "transitionDuration", "transitionTimingFunction", "transitionDelay", "animation", "animationName", "animationDuration", "animationTimingFunction", "animationDelay", "animationIterationCount", "animationDirection", "animationFillMode", "animationPlayState"],
  positioning: ["zIndex", "overflow", "overflowX", "overflowY", "objectFit", "objectPosition", "visibility", "cursor"],
  list: ["listStyle", "listStyleType", "listStylePosition", "listStyleImage"],
  table: ["tableLayout", "captionSide", "emptyCells"],
  other: ["content", "quotes", "counterReset", "counterIncrement", "resize", "userSelect", "pointerEvents", "scrollBehavior"],
};

// Default property order for the selector
const DEFAULT_PROPERTIES: CSSProperty[] = [
  // Most commonly used
  "display", "position", "width", "height", "margin", "padding", "color", "backgroundColor",
  "fontSize", "fontWeight", "textAlign", "border", "borderRadius", "boxShadow",
  "flex", "flexDirection", "justifyContent", "alignItems", "grid", "gap",
  // Others grouped by category
  ...PROPERTY_GROUPS.layout.filter(p => !["display", "position"].includes(p)),
  ...PROPERTY_GROUPS.flexbox.filter(p => !["flex", "flexDirection", "justifyContent", "alignItems"].includes(p)),
  ...PROPERTY_GROUPS.grid.filter(p => !["grid", "gap"].includes(p)),
  ...PROPERTY_GROUPS.boxModel,
  ...PROPERTY_GROUPS.typography,
  ...PROPERTY_GROUPS.background,
  ...PROPERTY_GROUPS.border,
  ...PROPERTY_GROUPS.effects,
  ...PROPERTY_GROUPS.transform,
  ...PROPERTY_GROUPS.transition,
  ...PROPERTY_GROUPS.positioning,
  ...PROPERTY_GROUPS.list,
  ...PROPERTY_GROUPS.table,
  ...PROPERTY_GROUPS.other,
];

export default function StylePicker({
  onAdd,
  availableAttrs,
  existingKeys = [],
  initialKey,
  className = "",
}: Props) {
  const allAttrs: CSSProperty[] = useMemo(
    () => availableAttrs ?? DEFAULT_PROPERTIES,
    [availableAttrs]
  );

  // Filter out existing properties and organize by group
  const choices = useMemo(() => {
    const filtered = allAttrs.filter((a) => !existingKeys.includes(a));
    
    // Group properties for better organization in dropdown
    const grouped: { group: string; properties: CSSProperty[] }[] = [];
    
    Object.entries(PROPERTY_GROUPS).forEach(([groupName, properties]) => {
      const groupProperties = properties.filter(p => 
        filtered.includes(p) && allAttrs.includes(p)
      );
      if (groupProperties.length > 0) {
        grouped.push({
          group: groupName.charAt(0).toUpperCase() + groupName.slice(1),
          properties: groupProperties
        });
      }
    });

    // Add any remaining properties not in groups to "Other"
    const remaining = filtered.filter(p => 
      !grouped.some(g => g.properties.includes(p))
    );
    if (remaining.length > 0) {
      grouped.push({
        group: "Other",
        properties: remaining
      });
    }

    return grouped;
  }, [allAttrs, existingKeys]);

  const [attr, setAttr] = useState<CSSProperty | "">(
    initialKey ?? (choices[0]?.properties[0] ?? "")
  );
  const presets = attr ? PRESETS[attr] ?? [] : [];
  const [presetValue, setPresetValue] = useState<string>(presets[0] ?? "");
  const [useCustom, setUseCustom] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string>("");

  // Reset state when attribute changes
  useEffect(() => {
    if (attr) {
      setUseCustom(false);
      setCustomValue("");
      setPresetValue(PRESETS[attr]?.[0] ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attr]);

  const handleAdd = () => {
    if (!attr) return;
    
    const value = useCustom ? customValue.trim() : presetValue;
    if (!value) return;
    
    onAdd(attr, value);
    
    // Reset form
    setCustomValue("");
    setUseCustom(false);
    if (attr) {
      setPresetValue(PRESETS[attr]?.[0] ?? "");
    }
  };

  const handleReset = () => {
    setAttr(choices[0]?.properties[0] ?? "");
    setCustomValue("");
    setUseCustom(false);
    setPresetValue(choices[0]?.properties[0] ? PRESETS[choices[0].properties[0]]?.[0] ?? "" : "");
  };

  const getInputPlaceholder = (property: CSSProperty): string => {
    const placeholders: Partial<Record<CSSProperty, string>> = {
      color: "#hex, rgb(), or color name",
      backgroundColor: "#hex, rgb(), or color name",
      fontFamily: "Font name or stack",
      fontSize: "px, rem, em, %",
      margin: "px, rem, em, %",
      padding: "px, rem, em, %",
      width: "px, rem, em, %, vw",
      height: "px, rem, em, %, vh",
      borderRadius: "px, rem, em, %",
      boxShadow: "e.g., 0 2px 4px rgba(0,0,0,0.1)",
      transform: "e.g., translateX(10px) rotate(45deg)",
      transition: "property duration timing-function delay",
      border: "e.g., '1px solid #000' or '2px dashed #ccc'",
    };
    
    return placeholders[property] || "Enter value...";
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Add CSS Style</h3>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {existingKeys.length} properties set
          </div>
        </div>

        {/* Property Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CSS Property
          </label>
          <select
            value={attr}
            onChange={(e) => setAttr(e.target.value as CSSProperty)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={choices.length === 0}
          >
            {choices.length === 0 && (
              <option value="">All properties added</option>
            )}
            {choices.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.properties.map((property) => (
                  <option key={property} value={property}>
                    {property}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Value Input */}
        {attr && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            
            {/* Preset Selector */}
            {!useCustom && presets.length > 0 && (
              <div className="mb-3">
                <select
                  value={presetValue}
                  onChange={(e) => {
                    if (e.target.value === "__custom") {
                      setUseCustom(true);
                    } else {
                      setPresetValue(e.target.value);
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {presets.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                  <option value="__custom">— Custom Value —</option>
                </select>
              </div>
            )}

            {/* Custom Input */}
            {(useCustom || presets.length === 0) && (
              <div className="mb-3">
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder={getInputPlaceholder(attr)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            )}

            {/* Custom Toggle */}
            {presets.length > 0 && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="custom-toggle"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="custom-toggle"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Use custom value
                </label>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleAdd}
            disabled={!attr || (!useCustom && !presetValue) || (useCustom && !customValue.trim())}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Style
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Help Text */}
        {attr && (
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
            <strong>Tip:</strong> Use standard CSS values like "10px", "1rem", "#fff", "center", etc.
          </div>
        )}
      </div>
    </div>
  );
}

