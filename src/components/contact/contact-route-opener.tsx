"use client";

import { useEffect } from "react";
import { useContactDialog } from "./contact-dialog";

export function ContactRouteOpener() {
  const { openContact } = useContactDialog();

  useEffect(() => {
    openContact();
  }, [openContact]);

  return null;
}
