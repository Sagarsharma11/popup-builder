// new version

"use client";

import React, { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import styles from "./page.module.css";
import SideBar from "./SideBar";
import ShowPopupJSON from "./ShowPopupJSON";
import RightSideBar from "./RightSideBar";
import { RenderComponent } from "./RenderComponent";
import { createNewComponent } from "./new_componets";

/**
 * NOTE:
 * - Expanded component types to include all variants used in RenderComponent.
 * - getDefaultStyles returns defaults for each type.
 * - ensureStylesInPopups now treats an empty object `{}` as "missing" and fills defaults.
 */

type CompType =
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

interface ComponentData {
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

interface PopupData {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  components: ComponentData[];
  followUps: PopupData[]; // single-level nested follow-ups
}

export default function PopupBuilder() {
  const [popups, setPopups] = useState<PopupData[]>([
    {
      id: uuid(),
      name: "Popup 1",
      width: 500,
      height: 400,
      backgroundColor: "#ffffff",
      backgroundImage: "",
      components: [],
      followUps: [],
    },
  ]);

  const [draggedType, setDraggedType] = useState<CompType | null>(null);
  const [activePopupId, setActivePopupId] = useState<string>(popups[0].id);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );

  // dragging refs
  const dragOffset = useRef<{ x: number; y: number } | null>(null);
  const draggingComp = useRef<{ popupId: string; compId: string } | null>(null);

  // ref to canvas wrapper if you need it later
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = canvasWrapRef;

  // zoom state & refs
  const [scale, setScale] = useState<number>(1); // current zoom: 1 = 100%
  const MIN_SCALE = 0.4;
  const MAX_SCALE = 2.5;
  const SCALE_STEP = 0.1;

  const outerScrollRef = useRef<HTMLDivElement | null>(null);

  // ---------- default styles for all known types ----------
  const getDefaultStyles = (
    type: CompType
  ): Record<string, string | number> => {
    switch (type) {
      case "heading":
        return { fontSize: "20px", fontWeight: 600, color: "#0f172a" };
      case "text":
        return { color: "#1e293b", fontSize: "16px" };
      case "textarea":
        return {
          width: 150,
          height: 80,
          border: "1px solid #ccc",
          borderRadius: "4px",
        };
      case "link":
        return {
          color: "#2563eb",
          textDecoration: "underline",
          fontSize: "14px",
        };
      case "linkBox":
        return {
          padding: "8px 12px",
          border: "1px solid #2563eb",
          borderRadius: "6px",
          display: "inline-block",
          color: "#2563eb",
        };
      case "image":
        return {
          width: 120,
          height: 120,
          objectFit: "cover",
          borderRadius: "6px",
        };
      case "imageBox":
        return {
          width: 150,
          height: 100,
          border: "1px dashed #aaa",
          borderRadius: "6px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        };
      case "video":
        return { width: 180, height: 120, borderRadius: "6px" };
      case "map":
        return {
          width: 180,
          height: 150,
          background: "#e2e8f0",
          borderRadius: "6px",
        };
      case "icon":
        return { fontSize: "24px", color: "#111827" };
      case "button":
        return {
          backgroundColor: "#2563eb",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
        };
      case "input":
        return {
          border: "1px solid #ccc",
          padding: "6px 8px",
          borderRadius: "4px",
        };
      default:
        return {};
    }
  };

  // ---------- Normalize existing popups (fill defaults when styles missing or empty) ----------
  const ensureStylesInPopups = (popupsArr: PopupData[]): PopupData[] =>
    popupsArr.map((p) => ({
      ...p,
      components: p.components.map((c) => {
        const hasStyles = c.styles && Object.keys(c.styles).length > 0;
        return {
          ...c,
          styles: hasStyles ? { ...c.styles } : getDefaultStyles(c.type),
        };
      }),
      followUps: p.followUps.map((fu) => ({
        ...fu,
        components: fu.components.map((c) => {
          const hasStyles = c.styles && Object.keys(c.styles).length > 0;
          return {
            ...c,
            styles: hasStyles ? { ...c.styles } : getDefaultStyles(c.type),
          };
        }),
      })),
    }));

  useEffect(() => {
    // run once on mount to normalize any existing components without styles or with empty {}
    setPopups((prev) => ensureStylesInPopups(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // apply new scale and attempt to keep center visible
  const applyScale = (newScale: number) => {
    if (!outerScrollRef.current || !innerRef.current) {
      setScale(newScale);
      return;
    }

    const outer = outerScrollRef.current;
    const inner = innerRef.current;

    // center coordinates in viewport before scaling
    const centerX = outer.scrollLeft + outer.clientWidth / 2;
    const centerY = outer.scrollTop + outer.clientHeight / 2;

    // relative position inside the inner content (unscaled)
    const relX = centerX / (inner.offsetWidth * scale); // fraction across content
    const relY = centerY / (inner.offsetHeight * scale); // fraction down content

    // set scale
    setScale(newScale);

    // use requestAnimationFrame so layout updates before we compute
    requestAnimationFrame(() => {
      // new content visual width/height after scale
      const newContentW = inner.offsetWidth * newScale;
      const newContentH = inner.offsetHeight * newScale;

      const newCenterX = relX * newContentW;
      const newCenterY = relY * newContentH;

      const newScrollLeft = Math.max(0, newCenterX - outer.clientWidth / 2);
      const newScrollTop = Math.max(0, newCenterY - outer.clientHeight / 2);

      outer.scrollLeft = newScrollLeft;
      outer.scrollTop = newScrollTop;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    // support ctrl + wheel (like native zoom) or Meta/Cmd + wheel
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const dir = e.deltaY > 0 ? -1 : 1;
      const next = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, +(scale + dir * SCALE_STEP).toFixed(2))
      );
      applyScale(next);
    }
  };

  /* ---------- helpers to find parent/main popup ---------- */
  function findParentAndPopup(id: string): {
    parent: PopupData | null;
    popup: PopupData | null;
  } {
    for (const p of popups) {
      if (p.id === id) return { parent: null, popup: p };
      const f = p.followUps.find((fu) => fu.id === id);
      if (f) return { parent: p, popup: f };
    }
    return { parent: null, popup: null };
  }

  // returns the main popup to render in editor given any activePopupId
  function getActiveMainPopup(): PopupData {
    const { parent, popup } = findParentAndPopup(activePopupId);
    if (parent) return parent;
    if (popup) return popup;
    return popups[0];
  }

  /* ---------- create top-level step (adds another main popup) ---------- */
  const addStep = () => {
    const newPopup: PopupData = {
      id: uuid(),
      name: `Popup ${popups.length + 1}`,
      width: 500,
      height: 400,
      backgroundColor: "#ffffff",
      backgroundImage: "",
      components: [],
      followUps: [],
    };
    setPopups((p) => [...p, newPopup]);
    setActivePopupId(newPopup.id);
  };

  /* ---------- add follow-up inside the currently active MAIN popup ---------- */
  const addFollowUp = () => {
    const activeMain = getActiveMainPopup();
    const newFollowUp: PopupData = {
      id: uuid(),
      name: `Follow-up ${activeMain.followUps.length + 1}`,
      width: 420, // slightly smaller by default
      height: 300,
      backgroundColor: "#ffffff",
      backgroundImage: "",
      components: [],
      followUps: [],
    };

    setPopups((prev) =>
      prev.map((p) =>
        p.id === activeMain.id
          ? { ...p, followUps: [...p.followUps, newFollowUp] }
          : p
      )
    );

    setActivePopupId(newFollowUp.id);
  };

  /* ---------- delete follow-up (or top-level) ---------- */
  const deleteFollowUp = (followUpId: string) => {
    setPopups(
      (prev) =>
        prev
          .map((p) => ({
            ...p,
            followUps: p.followUps.filter((fu) => fu.id !== followUpId),
          }))
          .filter(Boolean) as PopupData[]
    );

    const { parent, popup } = findParentAndPopup(followUpId);
    if (popup && parent) {
      setActivePopupId(parent.id);
    } else {
      if (popups.length > 0 && popups[0].id !== followUpId) {
        setActivePopupId(popups[0].id);
      }
    }
  };

  /* ---------- drag & drop inside popup ---------- */
  const allowDrop = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, popupId: string) => {
    e.preventDefault();
    if (!draggedType) {
      return;
    }

    const popupEl = document.getElementById(popupId);
    if (!popupEl) return;

    const rect = popupEl.getBoundingClientRect();

    // convert screen coords -> unscaled coords
    const x = Math.max(0, Math.round((e.clientX - rect.left) / scale));
    const y = Math.max(0, Math.round((e.clientY - rect.top) / scale));

    const baseStyles = getDefaultStyles(draggedType);
    const newComp = createNewComponent({ draggedType, x, y, baseStyles });
    setPopups((prev:any) =>
      prev.map((p:any) => {
        if (p.id === popupId) {
          return { ...p, components: [...p.components, newComp] };
        }
        return {
          ...p,
          followUps: p.followUps.map((fu) =>
            fu.id === popupId
              ? { ...fu, components: [...fu.components, newComp] }
              : fu
          ),
        };
      })
    );

    setDraggedType(null);
  };

  // ------------------------- startDragComponent -------------------------
  const startDragComponent = (
    e: React.MouseEvent,
    popupId: string,
    compId: string
  ) => {
    const target = e.target as HTMLElement | null;
    if (target) {
      if (
        target.closest("select, option") ||
        target.getAttribute?.("data-no-drag") === "true"
      ) {
        return;
      }
    }

    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    draggingComp.current = { popupId, compId };

    e.preventDefault();
  };

  // ------------------------- handleMouseMove -------------------------
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingComp.current || !dragOffset.current) return;
    const { popupId, compId } = draggingComp.current;
    const popupEl = document.getElementById(popupId);
    if (!popupEl) return;
    const rect = popupEl.getBoundingClientRect();

    const offsetXScaled = dragOffset.current.x;
    const offsetYScaled = dragOffset.current.y;

    const newX = Math.max(
      0,
      Math.round((e.clientX - rect.left - offsetXScaled) / scale)
    );
    const newY = Math.max(
      0,
      Math.round((e.clientY - rect.top - offsetYScaled) / scale)
    );

    setPopups((prev) =>
      prev.map((p) => {
        if (p.id === popupId) {
          return {
            ...p,
            components: p.components.map((c) =>
              c.id === compId ? { ...c, position: { x: newX, y: newY } } : c
            ),
          };
        }
        return {
          ...p,
          followUps: p.followUps.map((fu) =>
            fu.id === popupId
              ? {
                  ...fu,
                  components: fu.components.map((c) =>
                    c.id === compId
                      ? { ...c, position: { x: newX, y: newY } }
                      : c
                  ),
                }
              : fu
          ),
        };
      })
    );
  };

  const stopDragComponent = () => {
    draggingComp.current = null;
    dragOffset.current = null;
  };

  const setButtonAction = (
    popupId: string,
    compId: string,
    targetPopupId: string
  ) => {
    setPopups((prev) =>
      prev.map((p) => {
        if (p.id === popupId) {
          return {
            ...p,
            components: p.components.map((c) =>
              c.id === compId
                ? {
                    ...c,
                    action:
                      targetPopupId === "__close"
                        ? { type: "closePopup" }
                        : { type: "openPopup", targetPopupId },
                  }
                : c
            ),
          };
        }
        return {
          ...p,
          followUps: p.followUps.map((fu) =>
            fu.id === popupId
              ? {
                  ...fu,
                  components: fu.components.map((c) =>
                    c.id === compId
                      ? {
                          ...c,
                          action:
                            targetPopupId === "__close"
                              ? { type: "closePopup" }
                              : { type: "openPopup", targetPopupId },
                        }
                      : c
                  ),
                }
              : fu
          ),
        };
      })
    );
  };

  // ------------------------- updateComponentStyle (safe merge) -------------------------
  const updateComponentStyle = (key: string, value: string) => {
    if (!selectedComponentId) return;

    setPopups((prev) =>
      prev.map((p) => {
        return {
          ...p,
          components: p.components.map((c) =>
            c.id === selectedComponentId
              ? { ...c, styles: { ...(c.styles || {}), [key]: value } }
              : c
          ),
          followUps: p.followUps.map((fu) => ({
            ...fu,
            components: fu.components.map((c) =>
              c.id === selectedComponentId
                ? { ...c, styles: { ...(c.styles || {}), [key]: value } }
                : c
            ),
          })),
        };
      })
    );
  };

  const updatePopupBackground = (type: "color" | "image", value: string) => {
    setPopups((prev) =>
      prev.map((p) => {
        if (p.id === activePopupId) {
          return type === "color"
            ? { ...p, backgroundColor: value, backgroundImage: "" }
            : { ...p, backgroundImage: value };
        }
        return {
          ...p,
          followUps: p.followUps.map((fu) =>
            fu.id === activePopupId
              ? type === "color"
                ? { ...fu, backgroundColor: value, backgroundImage: "" }
                : { ...fu, backgroundImage: value }
              : fu
          ),
        };
      })
    );
  };

  const [showJson, setShowJson] = useState(false);

  // Helpers for rendering
  const activeMain = getActiveMainPopup();
  const { popup: maybeActive } = findParentAndPopup(activePopupId);
  const selectedComp =
    maybeActive?.components.find((c) => c.id === selectedComponentId) ??
    activeMain?.components.find((c) => c.id === selectedComponentId) ??
    null;

  const activePopup = popups.find((p) => p.id === activePopupId) ?? popups[0];

  const changeIntoActiveId = (id: string) => {
    setActivePopupId(id);
  };

  // const updateComponentField = (e, content, active_popup_id, component) => {
  //   console.log("=> ", e.target.value, content, active_popup_id, component);
  //   const obj = popups;
  //   const the_popup = obj.find((ele) => ele.id === active_popup_id);
  //   console.log("the popup ", the_popup);
  //   const the_component = the_popup?.components?.find(
  //     (ele) => ele.id === component.id
  //   );

  //   console.log("the component ", the_component);
  //   the_component[content] = e.target.value;
  //   the_component["label"] = e.target.value;
  // };

  // PopupBuilder scope (uses selectedComponentId, setPopups, popups)
  const updateComponentField = (field: string, value: any) => {
    if (!selectedComponentId) return;

    setPopups((prev) => {
      let changed = false;

      const next = prev.map((p) => {
        // update top-level components if present
        if (p.components.some((c) => c.id === selectedComponentId)) {
          const components = p.components.map((c) => {
            if (c.id !== selectedComponentId) return c;
            // early return same object if identical (prevents re-renders)
            if ((c as any)[field] === value) return c;
            changed = true;
            return { ...c, [field]: value };
          });
          return changed ? { ...p, components } : p;
        }

        // update followUps (single-level)
        const followUps = p.followUps.map((fu) => {
          if (!fu.components.some((c) => c.id === selectedComponentId))
            return fu;
          let fuChanged = false;
          const components = fu.components.map((c) => {
            if (c.id !== selectedComponentId) return c;
            if ((c as any)[field] === value) return c;
            fuChanged = true;
            return { ...c, [field]: value };
          });
          if (fuChanged) {
            changed = true;
            return { ...fu, components };
          }
          return fu;
        });

        // if followUps changed, return new popup object
        return followUps === p.followUps ? p : { ...p, followUps };
      });

      return changed ? next : prev;
    });
  };

  // --- render ---
  return (
    <div
      className="flex h-screen bg-gray-100 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragComponent}
    >
      {showJson && (
        <ShowPopupJSON jsonData={popups} onClose={() => setShowJson(false)} />
      )}

      <SideBar
        popups={popups}
        setActivePopupId={setActivePopupId}
        addFollowUp={addFollowUp}
        deleteFollowUp={deleteFollowUp}
        activeMain={activeMain}
        activePopupId={activePopupId}
        addStep={addStep}
      />

      <main
        ref={outerScrollRef}
        onWheel={handleWheel}
        className={styles.editor}
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,0,0,0.50) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className={styles.canvasOuter}>
          <div
            ref={canvasWrapRef}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              transition: "transform 120ms ease-out",
              willChange: "transform",
            }}
            className={styles.canvasWrapVertical}
          >
            {popups?.map((ele) => {
              return (
                <section key={ele.id} className={styles.canvasWrap}>
                  <div
                    id={activePopup.id}
                    className={`relative rounded-2xl shadow-lg overflow-hidden bg-white popupCanvas cursor-pointer ${
                      activePopupId === activePopup.id ? "shadow-sky-300" : ""
                    }`}
                    onClick={() => changeIntoActiveId(activePopup.id)}
                    onDrop={(e) => handleDrop(e, activePopup.id)}
                    onDragOver={allowDrop}
                    style={{
                      flex: "0 0 auto",
                      minWidth: `${activeMain.width}px`,
                      minHeight: `${activeMain.height}px`,
                      width: `${activeMain.width}px`,
                      height: `${activeMain.height}px`,
                      backgroundColor: activeMain.backgroundColor,
                      backgroundImage: activeMain.backgroundImage
                        ? `url(${activeMain.backgroundImage})`
                        : undefined,
                      backgroundSize: "cover",
                      boxSizing: "border-box",
                    }}
                  >
                    <p className="text-center p-2">{ele.id}</p>

                    {activeMain.components.map((comp) => (
                      <div
                        key={comp.id}
                        className={`absolute cursor-move ${
                          comp.id === selectedComponentId
                            ? "ring-2 ring-blue-400"
                            : ""
                        }`}
                        onMouseDown={(e) =>
                          startDragComponent(e, activeMain.id, comp.id)
                        }
                        onClick={() => setSelectedComponentId(comp.id)}
                        style={{
                          left: comp.position.x,
                          top: comp.position.y,
                          ...comp.styles,
                        }}
                      >
                        {RenderComponent(comp)}

                        {comp.type === "button" && (
                          <select
                            onChange={(e) =>
                              setButtonAction(
                                activeMain.id,
                                comp.id,
                                e.target.value
                              )
                            }
                            data-no-drag="true"
                            value={
                              //@ts-ignore
                              comp.action?.type === "closePopup"
                                ? "__close"
                                : comp.action?.type === "openPopup"
                                ? comp.action.targetPopupId
                                : ""
                            }
                            className="absolute -bottom-6 left-0 text-xs bg-white border border-gray-300 rounded"
                          >
                            <option value="">No Action</option>
                            <option value="__close">Close Popup</option>
                            {popups
                              .flatMap((p) => [p, ...p.followUps])
                              .filter((p) => p.id !== activeMain.id)
                              .map((p) => (
                                <option key={p.id} value={p.id}>
                                  Open {p.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>

                  <small>Follow ups</small>

                  {activeMain.followUps.map((fu) => (
                    <div
                      key={fu.id}
                      id={fu.id}
                      className={`relative rounded-2xl shadow-lg overflow-hidden bg-white popupCanvas cursor-pointer ${
                        activePopupId === fu.id ? "shadow-sky-300" : ""
                      }`}
                      onClick={() => changeIntoActiveId(fu.id)}
                      onDrop={(e) => handleDrop(e, fu.id)}
                      onDragOver={allowDrop}
                      style={{
                        flex: "0 0 auto",
                        minWidth: `${fu.width}px`,
                        minHeight: `${fu.height}px`,
                        width: `${fu.width}px`,
                        height: `${fu.height}px`,
                        backgroundColor: fu.backgroundColor,
                        backgroundImage: fu.backgroundImage
                          ? `url(${fu.backgroundImage})`
                          : undefined,
                        backgroundSize: "cover",
                        boxSizing: "border-box",
                        marginLeft: "1rem",
                      }}
                    >
                      <p className="text-center p-2">{fu.id}</p>
                      {fu.components.map((comp) => (
                        <div
                          key={comp.id}
                          className={`absolute cursor-move ${
                            comp.id === selectedComponentId
                              ? "ring-2 ring-blue-400"
                              : ""
                          }`}
                          onMouseDown={(e) =>
                            startDragComponent(e, fu.id, comp.id)
                          }
                          onClick={() => setSelectedComponentId(comp.id)}
                          style={{
                            left: comp.position.x,
                            top: comp.position.y,
                            ...comp.styles,
                          }}
                        >
                          {RenderComponent(comp)}
                          {comp.type === "button" && (
                            <select
                              onChange={(e) =>
                                setButtonAction(fu.id, comp.id, e.target.value)
                              }
                              value={
                                //@ts-ignore
                                comp.action?.type === "closePopup"
                                  ? "__close"
                                  : comp.action?.type === "openPopup"
                                  ? comp.action.targetPopupId
                                  : ""
                              }
                              className="absolute -bottom-6 left-0 text-xs bg-white border border-gray-300 rounded"
                            >
                              <option value="">No Action</option>
                              <option value="__close">Close Popup</option>
                              {popups
                                .flatMap((p) => [p, ...p.followUps])
                                .filter((p) => p.id !== fu.id)
                                .map((p) => (
                                  <option key={p.id} value={p.id}>
                                    Open {p.name}
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </section>
              );
            })}
          </div>
        </div>
      </main>

      <RightSideBar
        updatePopupBackground={updatePopupBackground}
        findParentAndPopup={findParentAndPopup}
        activePopupId={activePopupId}
        popups={popups}
        selectedComp={selectedComp}
        updateComponentStyle={updateComponentStyle}
        setDraggedType={setDraggedType}
        setShowJson={setShowJson}
        updateComponentField={updateComponentField} // <-- new prop
      />
    </div>
  );
}
