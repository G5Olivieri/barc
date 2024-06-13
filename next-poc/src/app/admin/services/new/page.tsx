import { NewServiceForm } from "./form";

export default function NewService() {
  return (
    <div className="flex flex-col py-10 px-4 gap-4">
      <h1 className="text-2xl">Adicionar serviço</h1>
      <NewServiceForm />
    </div>
  );
}
