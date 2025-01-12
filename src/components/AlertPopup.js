import React, { useEffect } from 'react';

function AlertPopup({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="alert-popup">
      {message}
    </div>
  );
}

export default AlertPopup; 