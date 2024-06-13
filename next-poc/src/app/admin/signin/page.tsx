import { SignInForm } from "./form";

export default function Signin() {
  return (
    <main className="flex flex-col gap-4 py-10 px-4">
      <h1 className="text-2xl">Entrar</h1>
      <SignInForm />
    </main>
  );
}
