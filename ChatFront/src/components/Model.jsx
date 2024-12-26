import React from "react";

const Model = ({ isModelOpen, children }) => {
  if (!isModelOpen) return;

  return (
    <div className="fixed inset-0 items-center justify-center z-50">
      <div>{children}</div>
    </div>
  );
};

export default Model;
