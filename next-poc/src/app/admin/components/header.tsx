"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [hidden, setHidden] = useState(true);

  return (
    <header className="px-4 pt-4">
      <button type="button" onClick={() => setHidden(false)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="24"
          width="24"
        >
          <path d="M2 4a1 1 0 011-1h18a1 1 0 010 2H3a1 1 0 01-1-1zm1 9h18a1 1 0 000-2H3a1 1 0 000 2zm0 8h18a1 1 0 000-2H3a1 1 0 000 2z"></path>
        </svg>
        <span className="sr-only">abrir menu navegação</span>
      </button>
      <div
        hidden={hidden}
        onClick={() => setHidden(true)}
        className="absolute h-screen w-screen top-0 left-0 z-10 bg-black/80"
      ></div>
      <div
        className={`${hidden ? "translate-x-[-100%]" : ""} absolute top-0 left-0 h-screen w-80 transition-transform bg-white z-20 p-4`}
      >
        <nav>
          <ul className="flex flex-col gap-2">
            <li>
              <Link onClick={() => setHidden(true)} href="/admin/">
                Home
              </Link>
            </li>
            <li>
              <Link onClick={() => setHidden(true)} href="/admin/barbers">
                Barbeiros
              </Link>
            </li>
            <li>
              <Link onClick={() => setHidden(true)} href="/admin/services">
                Serviços
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
