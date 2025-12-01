// // InputTypeActionable.tsx
// "use client";

// import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import type { ComponentData, PopupData } from "./types";

// type Rule = {
//   conditionType: "equals" | "contains" | "regex" | "like";
//   value: string;
//   targetPopupId: string;
// };

// type Props = {
//   component: ComponentData;
//   updateComponentField: (field: string, value: any) => void;
//   popups: PopupData[];
//   activeMain: PopupData;
//   setSelectedComponentId?: (id: string | null) => void;
// };

// export default function InputTypeActionable({
//   component,
//   updateComponentField,
//   popups,
//   activeMain,
//   setSelectedComponentId,
// }: Props) {
//   if (!component || !updateComponentField || !popups || !activeMain) return null;
//   if (component.type !== "input") return null;

//   const [open, setOpen] = useState(false);
//   const firstInputRef = useRef<HTMLInputElement | null>(null);
//   const triggerRef = useRef<HTMLButtonElement | null>(null);

//   const rules: Rule[] = (component.actionRules as Rule[]) ?? [];
//   const operator = component.rulesOperator ?? "OR"; // default OR

//   const containingPopup = useMemo(() => {
//     for (const p of popups) {
//       if (p.components.some((c) => c.id === component.id)) return p;
//       const fu = p.followUps.find((f) => f.components.some((c) => c.id === component.id));
//       if (fu) return fu;
//     }
//     return activeMain;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [component.id, popups]);

//   const targetOptions = useMemo(
//     () => popups.flatMap((p) => [p, ...p.followUps]).filter((p) => p.id !== containingPopup.id),
//     [popups, containingPopup.id]
//   );

//   const setRules = (nextRules: Rule[]) => updateComponentField("actionRules", nextRules);

//   const setOperator = (op: "AND" | "OR") => updateComponentField("rulesOperator", op);

//   const addRule = () => setRules([...rules, { conditionType: "equals", value: "", targetPopupId: "" }]);
//   const updateRuleAt = (idx: number, patch: Partial<Rule>) => setRules(rules.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
//   const removeRuleAt = (idx: number) => setRules(rules.filter((_, i) => i !== idx));

//   // open modal helper
//   const openModal = (e?: React.MouseEvent) => {
//     e?.stopPropagation();
//     setSelectedComponentId?.(component.id);
//     setOpen(true);
//   };

//   const closeModal = () => {
//     setOpen(false);
//     triggerRef.current?.focus();
//   };

//   useLayoutEffect(() => {
//     if (!open) return;
//     const prevOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";

//     const t = setTimeout(() => {
//       try {
//         firstInputRef.current?.focus({ preventScroll: true });
//         if (firstInputRef.current) {
//           const v = firstInputRef.current.value;
//           firstInputRef.current.setSelectionRange(v.length, v.length);
//         }
//       } catch (err) {
//         console.warn("[InputTypeActionable] focus failed", err);
//       }
//     }, 20);

//     const onKey = (ev: KeyboardEvent) => {
//       if (ev.key === "Escape") closeModal();
//     };
//     window.addEventListener("keydown", onKey);

//     return () => {
//       clearTimeout(t);
//       document.body.style.overflow = prevOverflow;
//       window.removeEventListener("keydown", onKey);
//     };
//   }, [open]);

//   // trigger button
//   const trigger = (
//     <button
//       ref={triggerRef}
//       data-no-drag="true"
//       onClick={(e) => openModal(e)}
//       title="Edit input action rules"
//       className="absolute -bottom-6 left-0 text-xs bg-white border border-gray-300 rounded px-2 py-0.5 shadow"
//       style={{ zIndex: 9999 }}
//     >
//       Rules
//     </button>
//   );

//   const modal = open
//     ? createPortal(
//         <div
//           className="fixed inset-0 flex items-center justify-center"
//           style={{ zIndex: 99999 }}
//           onMouseDown={() => {
//             closeModal();
//           }}
//           role="dialog"
//           aria-modal="true"
//         >
//           <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", pointerEvents: "auto", zIndex: 99999 }} />

//           <div
//             role="document"
//             onMouseDown={(e) => e.stopPropagation()}
//             style={{
//               position: "relative",
//               zIndex: 100000,
//               width: "720px",
//               maxWidth: "96%",
//               maxHeight: "86vh",
//               overflow: "auto",
//               background: "#fff",
//               borderRadius: 8,
//               padding: 16,
//               boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
//             }}
//             data-no-drag="true"
//           >
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                 <h3 style={{ fontSize: 18, margin: 0, color: "black" }}>Input Action Rules</h3>

//                 {/* Operator selector */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                   <label style={{ fontSize: 12, color: "#444" }}>Match</label>
//                   <select
//                     value={operator}
//                     onChange={(e) => setOperator(e.target.value === "AND" ? "AND" : "OR")}
//                     data-no-drag="true"
//                     style={{ padding: "6px 8px", borderRadius: 6 }}
//                   >
//                     <option value="OR">Any (OR)</option>
//                     <option value="AND">All (AND)</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <button onClick={closeModal} style={{ padding: "6px 10px", color: "black" }}>
//                   Close
//                 </button>
//               </div>
//             </div>

//             <p style={{ color: "#555", marginBottom: 12 }}>
//               Add rules to make this input actionable. When typed value matches rules (combined with the chosen operator), the configured action will trigger.
//             </p>

//             <div style={{ marginBottom: 12 }}>
//               <button onClick={(e) => { e.stopPropagation(); addRule(); }} data-no-drag="true" style={{ padding: "6px 10px", fontSize: 13 }}>
//                 + Add Rule
//               </button>
//             </div>

//             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//               {rules.length === 0 && <div style={{ color: "#777" }}>No rules yet. Click "Add Rule" to create one.</div>}

//               {rules.map((rule, idx) => (
//                 <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 12 }}>
//                   <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
//                     <select
//                       value={rule.conditionType}
//                       onChange={(e) => updateRuleAt(idx, { conditionType: e.target.value as Rule["conditionType"] })}
//                       style={{ padding: 6, borderRadius: 6, color: "black" }}
//                     >
//                       <option value="equals">Equals</option>
//                       <option value="contains">Contains</option>
//                       <option value="like">Like</option>
//                       <option value="regex">Regex</option>
//                     </select>

//                     <input
//                       ref={idx === 0 ? firstInputRef : undefined}
//                       type="text"
//                       placeholder="value / pattern"
//                       value={rule.value}
//                       onChange={(e) => updateRuleAt(idx, { value: e.target.value })}
//                       style={{ flex: 1, padding: 6, borderRadius: 6, border: "1px solid #ccc", color: "black" }}
//                     />
//                   </div>

//                   <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//                     <select
//                       value={rule.targetPopupId}
//                       onChange={(e) => updateRuleAt(idx, { targetPopupId: e.target.value })}
//                       style={{ flex: 1, padding: 6, borderRadius: 6, color: "black" }}
//                     >
//                       <option value="">Choose target popup</option>
//                       <option value="__close">Close popup</option>
//                       {targetOptions.map((p) => (
//                         <option key={p.id} value={p.id}>
//                           Open {p.name}
//                         </option>
//                       ))}
//                     </select>

//                     <button onClick={(ev) => { ev.stopPropagation(); removeRuleAt(idx); }} style={{ color: "#c00" }}>
//                       Delete
//                     </button>
//                   </div>

//                   <div style={{ color: "#777", fontSize: 12, marginTop: 8 }}>
//                     Tip: "like" supports `%` as wildcard (e.g. <code>%sagar%</code>) — regex uses JavaScript RegExp (e.g. <code>^hello</code>).
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>,
//         document.body
//       )
//     : null;

//   if (process.env.NODE_ENV !== "production") {
//     console.debug("[InputTypeActionable] render", { compId: component.id, open, rulesCount: rules.length, operator });
//   }

//   return (
//     <>
//       {trigger}
//       {modal}
//     </>
//   );
// }


// InputTypeActionable.tsx
"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ComponentData, PopupData } from "./types";

type Rule = {
  conditionType: "equals" | "contains" | "regex" | "like";
  value: string;
  targetPopupId: string;
  // operator that connects THIS rule to the NEXT rule (ignored for last rule)
  operator?: "AND" | "OR";
};

type Props = {
  component: ComponentData;
  updateComponentField: (field: string, value: any) => void;
  popups: PopupData[];
  activeMain: PopupData;
  setSelectedComponentId?: (id: string | null) => void;
};

export default function InputTypeActionable({
  component,
  updateComponentField,
  popups,
  activeMain,
  setSelectedComponentId,
}: Props) {
  if (!component || !updateComponentField || !popups || !activeMain) return null;
  if (component.type !== "input") return null;

  const [open, setOpen] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // normalize rules array from component (may be undefined)
  const rules: Rule[] = ((component.actionRules as Rule[]) ?? []).map((r) => ({
    // ensure shape so UI can assume operator exists (may be undefined for older items)
    operator: r.operator,
    conditionType: r.conditionType ?? "equals",
    value: r.value ?? "",
    targetPopupId: r.targetPopupId ?? "",
  }));

  const containingPopup = useMemo(() => {
    for (const p of popups) {
      if (p.components.some((c) => c.id === component.id)) return p;
      const fu = p.followUps.find((f) => f.components.some((c) => c.id === component.id));
      if (fu) return fu;
    }
    return activeMain;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component.id, popups]);

  const targetOptions = useMemo(
    () => popups.flatMap((p) => [p, ...p.followUps]).filter((p) => p.id !== containingPopup.id),
    [popups, containingPopup.id]
  );

  const setRules = (nextRules: Rule[]) => updateComponentField("actionRules", nextRules);

  // add a rule; default operator for newly added rule is "OR".
  // if there was a previous rule with no operator, leave it untouched (user can set it).
  const addRule = () =>
    setRules([
      ...rules,
      {
        conditionType: "equals",
        value: "",
        targetPopupId: "",
        operator: "OR",
      },
    ]);

  const updateRuleAt = (idx: number, patch: Partial<Rule>) => {
    const next = rules.map((r, i) => (i === idx ? { ...r, ...patch } : r));
    setRules(next);
  };

  const removeRuleAt = (idx: number) => {
    const next = rules.filter((_, i) => i !== idx);
    // if you remove a rule, we keep the operator values on remaining rules as-is;
    // optionally you could normalize operators here.
    setRules(next);
  };

  // open modal helper
  const openModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedComponentId?.(component.id);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useLayoutEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = setTimeout(() => {
      try {
        firstInputRef.current?.focus({ preventScroll: true });
        if (firstInputRef.current) {
          const v = firstInputRef.current.value;
          firstInputRef.current.setSelectionRange(v.length, v.length);
        }
      } catch (err) {
        console.warn("[InputTypeActionable] focus failed", err);
      }
    }, 20);

    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // trigger button
  const trigger = (
    <button
      ref={triggerRef}
      data-no-drag="true"
      onClick={(e) => openModal(e)}
      title="Edit input action rules"
      className="absolute -bottom-6 left-0 text-xs bg-white border border-gray-300 rounded px-2 py-0.5 shadow"
      style={{ zIndex: 9999 }}
    >
      Rules
    </button>
  );

  const modal = open
    ? createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 99999 }}
          onMouseDown={() => {
            closeModal();
          }}
          role="dialog"
          aria-modal="true"
        >
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", pointerEvents: "auto", zIndex: 99999 }} />

          <div
            role="document"
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              zIndex: 100000,
              width: "720px",
              maxWidth: "96%",
              maxHeight: "86vh",
              overflow: "auto",
              background: "#fff",
              borderRadius: 8,
              padding: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
            data-no-drag="true"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h3 style={{ fontSize: 18, margin: 0, color: "black" }}>Input Action Rules</h3>
              </div>

              <div>
                <button onClick={closeModal} style={{ padding: "6px 10px", color: "black" }}>
                  Close
                </button>
              </div>
            </div>

            <p style={{ color: "#555", marginBottom: 12 }}>
              Add rules to make this input actionable. Each rule can be connected to the next rule with AND / OR.
            </p>

            <div style={{ marginBottom: 12 }}>
              <button onClick={(e) => { e.stopPropagation(); addRule(); }} data-no-drag="true" style={{ padding: "6px 10px", fontSize: 13 }}>
                + Add Rule
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {rules.length === 0 && <div style={{ color: "#777" }}>No rules yet. Click "Add Rule" to create one.</div>}

              {rules.map((rule, idx) => {
                const isLast = idx === rules.length - 1;
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {/* rule panel */}
                    <div style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 12, background: "#fff" }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <select
                          value={rule.conditionType}
                          onChange={(e) => updateRuleAt(idx, { conditionType: e.target.value as Rule["conditionType"] })}
                          style={{ padding: 6, borderRadius: 6, color: "black" }}
                        >
                          <option value="equals">Equals</option>
                          <option value="contains">Contains</option>
                          <option value="like">Like</option>
                          <option value="regex">Regex</option>
                        </select>

                        <input
                          ref={idx === 0 ? firstInputRef : undefined}
                          type="text"
                          placeholder="value / pattern"
                          value={rule.value}
                          onChange={(e) => updateRuleAt(idx, { value: e.target.value })}
                          style={{ flex: 1, padding: 6, borderRadius: 6, border: "1px solid #ccc", color: "black" }}
                        />
                      </div>

                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <select
                          value={rule.targetPopupId}
                          onChange={(e) => updateRuleAt(idx, { targetPopupId: e.target.value })}
                          style={{ flex: 1, padding: 6, borderRadius: 6, color: "black" }}
                        >
                          <option value="">Choose target popup</option>
                          <option value="__close">Close popup</option>
                          {targetOptions.map((p) => (
                            <option key={p.id} value={p.id}>
                              Open {p.name}
                            </option>
                          ))}
                        </select>

                        <button onClick={(ev) => { ev.stopPropagation(); removeRuleAt(idx); }} style={{ color: "#c00" }}>
                          Delete
                        </button>
                      </div>

                      <div style={{ color: "#777", fontSize: 12, marginTop: 8 }}>
                        Tip: "like" supports `%` as wildcard (e.g. <code>%sagar%</code>) — regex uses JavaScript RegExp (e.g. <code>^hello</code>).
                      </div>
                    </div>

                    {/* operator between this rule and the next (not shown after last rule) */}
                    {!isLast && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                        <div style={{ color: "#666", fontSize: 12 }}>Then</div>
                        <select
                          value={rule.operator ?? "OR"}
                          onChange={(e) => updateRuleAt(idx, { operator: e.target.value === "AND" ? "AND" : "OR" })}
                          style={{ padding: "6px 8px", borderRadius: 6 }}
                        >
                          <option value="OR">OR</option>
                          <option value="AND">AND</option>
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  if (process.env.NODE_ENV !== "production") {
    console.debug("[InputTypeActionable] render", { compId: component.id, open, rulesCount: rules.length });
  }

  return (
    <>
      {trigger}
      {modal}
    </>
  );
}
