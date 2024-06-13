import Link from "next/link";

export default function Admin() {
  return (
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
  );
}
