// CheckboxesTypeActionable.tsx
"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ComponentData, PopupData } from "./types";

type Rule = {
  conditionType: "equals" | "contains" | "regex" | "like";
  value: string;
  targetPopupId: string;
};

type Props = {
  component: ComponentData;
  updateComponentField: (field: string, value: any) => void;
  popups: PopupData[];
  activeMain: PopupData;
  setSelectedComponentId?: (id: string | null) => void;
};

export default function CheckboxesTypeActionable({
  component,
  updateComponentField,
  popups,
  activeMain,
  setSelectedComponentId,
}: Props) {
  if (!component || !updateComponentField || !popups || !activeMain) return null;
  if (component.type !== "checkboxes group") return null;

  const [open, setOpen] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const rules: Rule[] = (component.actionRules as Rule[]) ?? [];
  const operator = component.rulesOperator ?? "OR";

  const containingPopup = useMemo(() => {
    for (const p of popups) {
      if (p.components.some((c) => c.id === component.id)) return p;
      const fu = p.followUps.find((f) => f.components.some((c) => c.id === component.id));
      if (fu) return fu;
    }
    return activeMain;
  }, [component.id, popups, activeMain]);

  const targetOptions = useMemo(
    () => popups.flatMap((p) => [p, ...p.followUps]).filter((p) => p.id !== containingPopup.id),
    [popups, containingPopup.id]
  );

  const setRules = (nextRules: Rule[]) => updateComponentField("actionRules", nextRules);
  const setOperator = (op: "AND" | "OR") => updateComponentField("rulesOperator", op);
  const addRule = () => setRules([...rules, { conditionType: "equals", value: "", targetPopupId: "" }]);
  const updateRuleAt = (idx: number, patch: Partial<Rule>) => setRules(rules.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  const removeRuleAt = (idx: number) => setRules(rules.filter((_, i) => i !== idx));

  const openModal = (e?: React.MouseEvent) => { e?.stopPropagation(); setSelectedComponentId?.(component.id); setOpen(true); };
  const closeModal = () => { setOpen(false); triggerRef.current?.focus(); };

  useLayoutEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstInputRef.current?.focus?.(), 20);
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const matchesRule = (rule: Rule, val: string) => {
    const v = (rule.value ?? "") + "";
    switch (rule.conditionType) {
      case "equals": return val === v;
      case "contains": return val.includes(v);
      case "like": {
        const escaped = v.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&");
        const pattern = "^" + escaped.replace(/%/g, ".*") + "$";
        try { return new RegExp(pattern, "i").test(val); } catch { return false; }
      }
      case "regex": try { return new RegExp(v).test(val); } catch { return false; }
      default: return false;
    }
  };

  const evaluateAndDispatch = (value: string) => {
    if (!rules || rules.length === 0) return;
    const results = rules.map((r) => matchesRule(r, value));
    const finalMatch = operator === "AND" ? results.every(Boolean) : results.some(Boolean);
    if (!finalMatch) return;
    const idx = operator === "OR" ? results.findIndex(Boolean) : 0;
    const matched = rules[idx] ?? rules[0];
    if (!matched) return;
    if (matched.targetPopupId === "__close") {
      window.dispatchEvent(new CustomEvent("closePopupFromInput", { detail: { sourceCompId: component.id } }));
    } else {
      window.dispatchEvent(new CustomEvent("openPopupFromInput", { detail: { targetPopupId: matched.targetPopupId } }));
    }
  };

  const trigger = (
    <button ref={triggerRef} data-no-drag="true" onClick={(e) => { e.stopPropagation(); setSelectedComponentId?.(component.id); setOpen(true); }} title="Edit checkbox action rules" className="absolute -bottom-6 left-0 text-xs bg-white border border-gray-300 rounded px-2 py-0.5 shadow" style={{ zIndex: 9999 }}>Rules</button>
  );

  const modal = open ? createPortal(
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 99999 }} onMouseDown={closeModal}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
      <div role="document" onMouseDown={(e) => e.stopPropagation()} style={{ position: "relative", zIndex: 100000, width: 720, maxWidth: "96%", maxHeight: "86vh", overflow: "auto", background: "#fff", borderRadius: 8, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h3 style={{ fontSize: 18, margin: 0 , color:"#333"}}>Checkbox Action Rules</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color:"#333" }}>
              <label style={{ fontSize: 12 }}>Match</label>
              <select value={operator} onChange={(e) => setOperator(e.target.value === "AND" ? "AND" : "OR")} data-no-drag="true" style={{ padding: "6px 8px", borderRadius: 6 }}>
                <option value="OR">Any (OR)</option>
                <option value="AND">All (AND)</option>
              </select>
            </div>
          </div>
          <div><button onClick={closeModal}>Close</button></div>
        </div>

        <p style={{ color: "#555" }}>Add rules to make this checkbox group actionable. The engine receives checked values joined by commas (e.g. "a,b").</p>

        <div style={{ marginBottom: 12 }}>
          <button onClick={(e) => { e.stopPropagation(); addRule(); }} data-no-drag="true" style={{ padding: "6px 10px", color:"#333" }}>+ Add Rule</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rules.length === 0 && <div style={{ color: "#777" }}>No rules yet.</div>}
          {rules.map((rule, idx) => (
            <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 12 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 , color:"#333"}}>
                <select value={rule.conditionType} onChange={(e) => updateRuleAt(idx, { conditionType: e.target.value as Rule["conditionType"] })} style={{ padding: 6, borderRadius: 6 }}>
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="like">Like</option>
                  <option value="regex">Regex</option>
                </select>
                <input ref={idx === 0 ? firstInputRef : undefined} type="text" placeholder="value / pattern" value={rule.value} onChange={(e) => updateRuleAt(idx, { value: e.target.value })} style={{ flex: 1, padding: 6, borderRadius: 6, border: "1px solid #ccc" }} />
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", color:"#333" }}>
                <select value={rule.targetPopupId} onChange={(e) => updateRuleAt(idx, { targetPopupId: e.target.value })} style={{ flex: 1, padding: 6, borderRadius: 6 }}>
                  <option value="">Choose target popup</option>
                  <option value="__close">Close popup</option>
                  {targetOptions.map((p) => (<option key={p.id} value={p.id}>Open {p.name}</option>))}
                </select>
                <button onClick={(ev) => { ev.stopPropagation(); removeRuleAt(idx); }} style={{ color: "#c00" }}>Delete</button>
              </div>

              <div style={{ color: "#777", fontSize: 12, marginTop: 8 }}>Tip: "like" supports % wildcard — regex uses JS RegExp.</div>
            </div>
          ))}
        </div>
      </div>
    </div>, document.body) : null;

  return (
    <>
      {trigger}
      {modal}
    </>
  );
}
