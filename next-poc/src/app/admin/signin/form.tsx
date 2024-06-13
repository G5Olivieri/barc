"use client";
import React from "react";
import { useFormState } from "react-dom";
import { signin } from "./actions";

type SignInFormProps = {};

const initialState = {
  message: "",
};

export const SignInForm: React.FC<SignInFormProps> = () => {
  const [state, formAction] = useFormState(signin, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="form-group">
        <label htmlFor="username-input">Usuário</label>
        <input
          className="form-control"
          type="text"
          id="username-input"
          name="username"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password-input">Senha</label>
        <input
          className="form-control"
          type="password"
          id="password-input"
          name="password"
          required
        />
      </div>
      {state?.message && <p>{state?.message}</p>}
      <button className="btn-primary" type="submit">
        Entrar
      </button>
    </form>
  );
};
