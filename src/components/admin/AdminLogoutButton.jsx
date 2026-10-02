"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { buttonVariants } from "@/components/ui/button";

const AdminLogoutButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post("/api/admin/logout");
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={buttonVariants({ variant: "outline", size: "sm" })}
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
};

export default AdminLogoutButton;
