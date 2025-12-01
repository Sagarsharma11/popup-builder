// RadioTypeActionable.tsx
"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ComponentData, PopupData } from "./types";

type Rule = {
  conditionType: "equals" | "contains" | "regex" | "like";
  value: string;
  targetPopupId: string;
  // operator ties THIS rule to the NEXT rule (ignored for last rule)
  operator?: "AND" | "OR";
};

type Props = {
  component: ComponentData;
  updateComponentField: (field: string, value: any) => void;
  popups: PopupData[];
  activeMain: PopupData;
  setSelectedComponentId?: (id: string | null) => void;
};

export default function RadioTypeActionable({
  component,
  updateComponentField,
  popups,
  activeMain,
  setSelectedComponentId,
}: Props) {
  if (!component || !updateComponentField || !popups || !activeMain) return null;
  if (component.type !== "radio buttons group") return null;

  const [open, setOpen] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Ensure we always have an array of rules and default operator
  const rules: Rule[] = ((component.actionRules as Rule[]) ?? []).map((r) => ({
    conditionType: r.conditionType ?? "equals",
    value: r.value ?? "",
    targetPopupId: r.targetPopupId ?? "",
    operator: r.operator ?? "OR",
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

  const addRule = () =>
    setRules([...rules, { conditionType: "equals", value: "", targetPopupId: "", operator: "OR" }]);

  const updateRuleAt = (idx: number, patch: Partial<Rule>) =>
    setRules(rules.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const removeRuleAt = (idx: number) => setRules(rules.filter((_, i) => i !== idx));

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
    const t = setTimeout(() => firstInputRef.current?.focus?.(), 20);
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // matches a single rule against a value
  const matchesRule = (rule: Rule, val: string) => {
    const v = (rule.value ?? "") + "";
    switch (rule.conditionType) {
      case "equals":
        return val === v;
      case "contains":
        return val.includes(v);
      case "like": {
        const escaped = v.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&");
        const pattern = "^" + escaped.replace(/%/g, ".*") + "$";
        try {
          return new RegExp(pattern, "i").test(val);
        } catch {
          return false;
        }
      }
      case "regex":
        try {
          return new RegExp(v).test(val);
        } catch {
          return false;
        }
      default:
        return false;
    }
  };

  // Evaluate rules left-to-right using each rule.operator to combine with next
  // Return overall boolean and first matched index (useful to decide which target to open)
  const evaluateRules = (value: string) => {
    if (!rules || rules.length === 0) return { match: false, matchedIndex: -1 };
    const bools = rules.map((r) => matchesRule(r, value));
    // fold left to right, using operator on rule i to combine with i+1
    let acc = bools[0];
    for (let i = 0; i < bools.length - 1; i++) {
      const op = rules[i].operator ?? "OR";
      const next = bools[i + 1];
      if (op === "AND") acc = acc && next;
      else acc = acc || next;
    }
    const firstTrue = bools.findIndex(Boolean);
    return { match: acc, matchedIndex: firstTrue };
  };

  const evaluateAndDispatch = (value: string) => {
    const { match, matchedIndex } = evaluateRules(value);
    if (!match) return;
    const idx = matchedIndex >= 0 ? matchedIndex : 0;
    const matched = rules[idx] ?? rules[0];
    if (!matched) return;
    if (matched.targetPopupId === "__close") {
      window.dispatchEvent(
        new CustomEvent("closePopupFromRadio", { detail: { sourceCompId: component.id } })
      );
    } else {
      window.dispatchEvent(
        new CustomEvent("openPopupFromRadio", { detail: { targetPopupId: matched.targetPopupId } })
      );
    }
  };

  // Layout control: write flexDirection to component.styles via updateComponentField
  const setLayoutDirection = (dir: "row" | "column") => {
    const base = component.styles ?? {};
    const next = { ...base, display: "flex", flexDirection: dir };
    updateComponentField("styles", next);
  };

  // Trigger button (rendered next to radio group in canvas)
  const trigger = (
    <button
      ref={triggerRef}
      data-no-drag="true"
      onClick={(e) => openModal(e)}
      title="Edit radio action rules"
      className="absolute -bottom-6 left-0 text-xs bg-white border border-gray-300 rounded px-2 py-0.5 shadow"
      style={{ zIndex: 9999 }}
    >
      Rules
    </button>
  );

  // Modal
  const modal = open
    ? createPortal(
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 99999 }} onMouseDown={closeModal} role="dialog" aria-modal="true">
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div
            role="document"
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              zIndex: 100000,
              width: 720,
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
                <h3 style={{ fontSize: 18, margin: 0, color: "black" }}>Radio Action Rules</h3>

                {/* Layout selector */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <label style={{ fontSize: 12, color: "#444" }}>Layout</label>
                  <select
                    value={(component.styles?.flexDirection as string) ?? "row"}
                    onChange={(e) => setLayoutDirection(e.target.value === "column" ? "column" : "row")}
                    data-no-drag="true"
                    style={{ padding: "6px 8px", borderRadius: 6, color: "#333" }}
                  >
                    <option value="row">Row (inline)</option>
                    <option value="column">Column (vertical)</option>
                  </select>
                </div>
              </div>

              <div>
                <button onClick={closeModal}>Close</button>
              </div>
            </div>

            <p style={{ color: "#555", marginBottom: 12 }}>
              Add rules to make this radio group actionable. Use the operator selector between rules to combine them (operator sits on the rule that connects to the next).
            </p>

            <div style={{ marginBottom: 12 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addRule();
                }}
                data-no-drag="true"
                style={{ padding: "6px 10px", fontSize: 13, color: "#333" }}
              >
                + Add Rule
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {rules.length === 0 && <div style={{ color: "#777" }}>No rules yet.</div>}

              {rules.map((rule, idx) => (
                <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 12, color: "#333" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <select
                      value={rule.conditionType}
                      onChange={(e) => updateRuleAt(idx, { conditionType: e.target.value as Rule["conditionType"] })}
                      style={{ padding: 6, borderRadius: 6 }}
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
                      style={{ flex: 1, padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select
                      value={rule.targetPopupId}
                      onChange={(e) => updateRuleAt(idx, { targetPopupId: e.target.value })}
                      style={{ flex: 1, padding: 6, borderRadius: 6 }}
                    >
                      <option value="">Choose target popup</option>
                      <option value="__close">Close popup</option>
                      {targetOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                          Open {p.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        removeRuleAt(idx);
                      }}
                      style={{ color: "#c00" }}
                    >
                      Delete
                    </button>
                  </div>

                  {/* operator selector shown if not last rule */}
                  {idx < rules.length - 1 && (
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ fontSize: 12, color: "#666" }}>Then</div>
                      <select
                        value={rule.operator ?? "OR"}
                        onChange={(e) => updateRuleAt(idx, { operator: e.target.value === "AND" ? "AND" : "OR" })}
                        data-no-drag="true"
                        style={{ padding: "6px 8px", borderRadius: 6 }}
                      >
                        <option value="OR">OR (any)</option>
                        <option value="AND">AND (and)</option>
                      </select>
                    </div>
                  )}

                  <div style={{ color: "#777", fontSize: 12, marginTop: 8 }}>
                    Tip: "like" supports % wildcard — regex uses JS RegExp.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  // Return trigger + modal. Note: call `evaluateAndDispatch(value)` from your radio change handler in RenderComponent.
  return (
    <>
      {trigger}
      {modal}
    </>
  );
}
