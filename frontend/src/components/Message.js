import React from 'react';

function Message({ variant = "danger", message, children }) {
  return (
    <div className="">
      <div className={`alert alert-${variant}`} role="alert">
        {message} {children}
      </div>
    </div>
  );
}

export default Message;
