import Link from "next/link";

export default function Admin() {
  return (
    <>
      <header>
        <button>
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
      </header>
      <main>
        <h1>Admin</h1>
        <nav>
          <ul>
            <li>
              <Link href="/admin/barbers">Barbeiros</Link>
            </li>
            <li>
              <Link href="/admin/services">Serviços</Link>
            </li>
          </ul>
        </nav>
      </main>
    </>
  );
}
