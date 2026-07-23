"use client";

import { ContactModalProvider } from "@/context/ContactModalContext";
import { ContactModal } from "@/components/ContactModal";
import { CookieConsent } from "@/components/CookieConsent";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ContactModalProvider>
      {children}
      <ContactModal />
      <CookieConsent />
    </ContactModalProvider>
  );
}
