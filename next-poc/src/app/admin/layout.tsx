import React from "react";
import { Header } from "./components/header";

export default function Admin({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
