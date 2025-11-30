import React from "react";

const ButtonTypeActionable = (comp, setButtonAction, activeMain, popups) => {
  return (
    <>
      {" "}
      {comp.type === "button" && (
        <select
          onChange={(e) =>
            setButtonAction(activeMain.id, comp.id, e.target.value)
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
          className="absolute -bottom-6 left-0 text-xs bg-white border border-gray-300 rounded text-black"
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
    </>
  );
};

export default ButtonTypeActionable;
