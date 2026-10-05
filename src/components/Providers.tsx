"use client";

import { SessionProvider } from "next-auth/react";
import React, { createContext, useContext, useState } from "react";
import { AuthModal } from "@/components/AuthModal";

interface AuthModalContextType {
  openAuthModal: (tab?: "signin" | "signup") => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
  openAuthModal: () => {},
  closeAuthModal: () => {}
});

export const useAuthModal = () => useContext(AuthModalContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"signin" | "signup">("signin");

  const openAuthModal = (tab: "signin" | "signup" = "signin") => {
    setDefaultTab(tab);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
  };

  return (
    <SessionProvider>
      <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
        {children}
        {isOpen && (
          <AuthModal 
            isOpen={isOpen} 
            onClose={closeAuthModal} 
            defaultTab={defaultTab} 
          />
        )}
      </AuthModalContext.Provider>
    </SessionProvider>
  );
}
