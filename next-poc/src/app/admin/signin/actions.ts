"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { signIn, Token } from "@/auth";

const isToken = (token: any): token is Token => !("error" in token);

export const signin = async (prevState: any, formData: FormData) => {
  if (!formData.has("username") || !formData.has("password")) {
    return { ...prevState, message: "Please fill in both fields" };
  }
  const token = await signIn({
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  });
  if (isToken(token)) {
    cookies().set("jwt", token.accessToken, {
      httpOnly: false,
      secure: false,
      maxAge: token.expiresIn,
      path: "/",
    });
    return redirect("/admin");
  }
  return { ...prevState, message: (token as { error: string }).error };
};
