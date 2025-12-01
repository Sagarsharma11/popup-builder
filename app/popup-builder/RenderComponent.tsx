// RenderComponent.tsx
import React from "react";

/* ---------- helper renderer ---------- */
export function RenderComponent(comp: any) {
  // helper: safely test a single rule against a value
  function matchesRule(rule: any, val: string) {
    if (!rule || !rule.conditionType) return false;
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
  }

  // helper: evaluate all rules with operator AND/OR and dispatch actions if matched
  function evaluateRulesAndDispatch(value: string) {
    const rules = (comp.actionRules ?? []) as any[];
    if (!rules || rules.length === 0) return;

    const op =
      (comp.rulesOperator ?? "OR").toUpperCase() === "AND" ? "AND" : "OR";
    const results = rules.map((r) => matchesRule(r, value));
    const finalMatch =
      op === "AND" ? results.every(Boolean) : results.some(Boolean);
    if (!finalMatch) return;

    const chosenIndex = op === "OR" ? results.findIndex(Boolean) : 0;
    const matchedRule = rules[chosenIndex] ?? rules[0];

    if (!matchedRule) return;
    if (matchedRule.targetPopupId === "__close") {
      window.dispatchEvent(
        new CustomEvent("closePopupFromInput", {
          detail: { sourceCompId: comp.id },
        })
      );
    } else if (matchedRule.targetPopupId) {
      window.dispatchEvent(
        new CustomEvent("openPopupFromInput", {
          detail: { targetPopupId: matchedRule.targetPopupId },
        })
      );
    }
  }

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
            padding: ".5rem",
            backgroundColor: "#fff",
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
          {typeof comp.label === "string"
            ? comp.label
            : comp.label?.label ?? "Button"}
        </button>
      );

    case "input":
      return (
        <input
          placeholder={comp.content || "Enter text"}
          defaultValue={comp.value ?? ""}
          onChange={(e) => {
            const val = e.target.value ?? "";
            try {
              evaluateRulesAndDispatch(val);
            } catch (err) {
              console.warn("Error evaluating input rules", err);
            }
          }}
          style={{
            border: "1px solid #ccc",
            padding: "6px 8px",
            borderRadius: "4px",
          }}
        />
      );

    /* ---------- NEW: radio group ---------- */
    case "radio buttons group": {
      const name = "radio-" + comp.id;
      const options = Array.isArray(comp.options) ? comp.options : [];

      // NEW → Read layout from styles (row / column)
      const direction =
        comp.styles?.flexDirection === "column" ? "column" : "row";

      return (
        <div
          style={{
            display: "flex",
            flexDirection: direction,
            gap: 10,
          }}
        >
          {options.map((opt: string, i: number) => (
            <label
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 6,
                cursor: "pointer",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                name={name}
                value={opt}
                onChange={(e) => {
                  window.dispatchEvent(
                    new CustomEvent("radioValueChanged:" + comp.id, {
                      detail: { value: e.target.value },
                    })
                  );
                }}
              />
              <span style={{ fontSize: 14 }}>{opt}</span>
            </label>
          ))}
        </div>
      );
    }

    /* ---------- NEW: checkboxes group ---------- */
    case "checkboxes group": {
      const name = "checkbox-" + comp.id;
      const options = Array.isArray(comp.options) ? comp.options : [];

      // Read layout from styles (row | column). Default to row.
      const direction =
        comp.styles?.flexDirection === "column" ? "column" : "row";

      // helper to gather checked values and dispatch a custom event
      const dispatchChecked = () => {
        // find all checkboxes by name
        const nodeList = document.querySelectorAll<HTMLInputElement>(
          `input[name="${name}"]`
        );
        const values = Array.from(nodeList)
          .filter((el) => el.checked)
          .map((el) => el.value);
        // also send the comma-joined string (your CheckboxesTypeActionable expects "a,b")
        const valueString = values.join(",");

        window.dispatchEvent(
          new CustomEvent("checkboxValueChanged:" + comp.id, {
            detail: { values, valueString },
          })
        );
      };

      return (
        <div
          style={{
            display: "flex",
            flexDirection: direction,
            gap: 10,
          }}
        >
          {options.map((opt: string, i: number) => (
            <label
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 6,
                cursor: "pointer",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                name={name}
                value={opt}
                onChange={() => {
                  // compute current checked values and dispatch
                  dispatchChecked();
                }}
              />
              <span style={{ fontSize: 14 }}>{opt}</span>
            </label>
          ))}
        </div>
      );
    }

    /* ---------- NEW: select dropdown ---------- */
    case "select dropdown": {
      const options = Array.isArray(comp.options) ? comp.options : [];
      return (
        <select
          defaultValue={comp.options && comp.options[0] ? comp.options[0] : ""}
          onChange={(e) => evaluateRulesAndDispatch(e.target.value)}
          style={{
            padding: ".5rem",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          {options.map((opt: string, i: number) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    default:
      return null;
  }
}
