"use client"

import { useState } from "react";
import axios from "axios";
import { buttonVariants } from "@/components/ui/button";

const CancelBookingButton = ({ token }) => {
  const [state, setState] = useState("idle"); // idle | busy | done | error
  const [message, setMessage] = useState("");

  const cancel = async () => {
    setState("busy");
    try {
      await axios.post("/api/booking/cancel", { token });
      setState("done");
    } catch (error) {
      setMessage(typeof error.response?.data === "string" ? error.response.data : "Couldn't cancel the booking. Please try again.");
      setState("error");
    }
  };

  if (state === "done") {
    return <p role="status" className="mt-6 text-sm font-medium">Your consultation has been cancelled. We&apos;ve let the team know.</p>;
  }
  return (
    <div className="mt-6">
      <button type="button" onClick={cancel} disabled={state === "busy"} className={buttonVariants({ variant: "destructive" })}>
        {state === "busy" ? "Cancelling…" : "Cancel consultation"}
      </button>
      {state === "error" && <p role="alert" className="mt-2 text-sm text-destructive">{message}</p>}
    </div>
  );
};

export default CancelBookingButton;
