/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MdDelete } from "react-icons/md";

const SideBar = ({
  popups,
  setActivePopupId,
  addFollowUp,
  deleteFollowUp,
  activeMain,
  activePopupId,
  addStep,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  return (
    <aside className="w-80 bg-white p-4 rounded-xl shadow border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Steps</h2>
        <span className="text-xs text-gray-500">{popups.length} Step</span>
      </div>

      <div className="space-y-2">
        {popups.map((popup: any) => (
          <div key={popup.id}>
            {/* main step */}
            <div
              onClick={() => {
                setActivePopupId(popup.id);
              }}
              className={`border rounded-lg px-3 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                activeMain.id === popup.id && "ring-1 ring-blue-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm">1</span>
                <span className="text-gray-900 text-sm font-medium">
                  {popup.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation(); /* optional duplicate behavior */
                  }}
                >
                  {/* duplicate icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-2 12H10a2 2 0 01-2-2v-8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* follow-ups list under this main */}
            <div className="pl-6 mt-2 space-y-2">
              {popup.followUps.map((fu: any) => (
                <div
                  key={fu.id}
                  onClick={() => setActivePopupId(fu.id)}
                  className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer ${
                    activePopupId === fu.id ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="text-sm">
                    <div className="text-xs text-gray-500">Follow-up</div>
                    <div className="font-medium text-sm">{fu.name}</div>
                  </div>

                  <div className="flex items-center gap-2 cursor-pointer">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFollowUp(fu.id);
                      }}
                      className="text-red-500"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              ))}
              {/* add follow-up button under each main */}
              <div className="pt-1 cursor-pointer">
                <button
                  onClick={() => {
                    setActivePopupId(popup.id);
                    addFollowUp();
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  + Add follow-up
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        {/* <button
          onClick={addStep}
          className="w-full border border-gray-300 text-gray-700 rounded-lg py-2 text-sm hover:bg-gray-50"
        >
          + Add a step
        </button> */}
      </div>
    </aside>
  );
};

export default SideBar;
