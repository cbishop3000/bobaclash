"use client"
import { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "login" | "signup" | null;

type ModalContextType = {
  isOpen: boolean;
  modalType: ModalType;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  setModalType: (type: ModalType) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  const openModal = (type: ModalType) => {
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
  };

  return (
    <ModalContext.Provider
      value={{ isOpen, modalType, openModal, closeModal, setModalType }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
