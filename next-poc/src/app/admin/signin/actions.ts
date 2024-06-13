"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const signin = async (prevState: any, formData: FormData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token`,
    {
      method: "POST",
      body: formData,
    },
  ).then((res) => res.json());
  if (response.error) {
    return { ...prevState, message: response.error };
  }
  cookies().set("jwt", response.access_token, {
    httpOnly: false,
    secure: false,
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  });
  redirect("/admin");
};
