"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ModalType = "appel" | "devis";

type ContactModalContextValue = {
  open: boolean;
  type: ModalType;
  openModal: (type?: ModalType) => void;
  closeModal: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(
  null,
);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ModalType>("appel");

  const openModal = useCallback((nextType: ModalType = "appel") => {
    setType(nextType);
    setOpen(true);
    document.body.classList.add("modal-open");
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    document.body.classList.remove("modal-open");
  }, []);

  const value = useMemo(
    () => ({ open, type, openModal, closeModal }),
    [open, type, openModal, closeModal],
  );

  return (
    <ContactModalContext.Provider value={value}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return ctx;
}
