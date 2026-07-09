"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ContextValue = {
  selectedSizeToken: string | null;
  setSelectedSizeToken: (token: string | null) => void;
};

const ProductDimensionContext = createContext<ContextValue | null>(null);

export function ProductDimensionProvider({
  initialSizeToken = null,
  children,
}: {
  initialSizeToken?: string | null;
  children: ReactNode;
}) {
  const [selectedSizeToken, setSelectedSizeToken] = useState<string | null>(
    initialSizeToken
  );

  return (
    <ProductDimensionContext.Provider
      value={{ selectedSizeToken, setSelectedSizeToken }}
    >
      {children}
    </ProductDimensionContext.Provider>
  );
}

export function useProductDimension() {
  const context = useContext(ProductDimensionContext);

  // Composants utilisés hors provider (ex: produits sans option Dimensions) :
  // no-op silencieux, la fiche technique affiche alors tout par défaut.
  if (!context) {
    return {
      selectedSizeToken: null,
      setSelectedSizeToken: () => {},
    };
  }

  return context;
}
