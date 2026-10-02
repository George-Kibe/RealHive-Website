"use client"

import { useEffect, useRef, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

const UPLOAD_OPTIONS = {
  sources: ["local", "url"],
  multiple: false,
  maxFiles: 1,
  clientAllowedFormats: ["image"],
  maxFileSize: 10_000_000,
};

// Opens the widget as soon as its script has loaded (the first click arms it).
const OpenWhenReady = ({ open, isLoading }) => {
  const opened = useRef(false);
  useEffect(() => {
    if (!isLoading && !opened.current) {
      opened.current = true;
      open();
    }
  }, [isLoading, open]);
  return null;
};

/**
 * A button that uploads one image to Cloudinary through the signed widget
 * (/api/cloudinary/sign) and reports its public ID.
 *
 * The widget is only created on the first click. CldUploadWidget otherwise
 * loads its script and builds a hidden iframe on mount, and that iframe takes
 * keyboard focus a couple of seconds after the page loads, silently eating
 * whatever the admin is typing in the editor or form at that moment.
 */
const CloudinaryUploadButton = ({ folder, onUploaded, className, label, children, onMouseDown }) => {
  const [armed, setArmed] = useState(false);
  // The first open in a session can take several seconds while Cloudinary's
  // widget loads from its CDN, so show progress until it's actually on screen.
  const [opening, setOpening] = useState(false);
  const buttonProps = { type: "button", className, "aria-label": label, title: label, onMouseDown };

  if (!armed) {
    return <button {...buttonProps} onClick={() => { setOpening(true); setArmed(true); }}>{children}</button>;
  }

  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary/sign"
      options={{ ...UPLOAD_OPTIONS, folder }}
      onDisplayChanged={(result) => {
        if (result.info === "shown") setOpening(false);
      }}
      onClose={() => setOpening(false)}
      onError={() => setOpening(false)}
      onSuccess={(result, { widget }) => {
        widget.close();
        onUploaded(result.info.public_id);
      }}
    >
      {({ open, isLoading }) => (
        <>
          <OpenWhenReady open={open} isLoading={isLoading} />
          <button {...buttonProps} disabled={isLoading || opening} aria-busy={isLoading || opening}
            onClick={() => { setOpening(true); open(); }}>
            {isLoading || opening ? "Opening…" : children}
          </button>
        </>
      )}
    </CldUploadWidget>
  );
};

export default CloudinaryUploadButton;
