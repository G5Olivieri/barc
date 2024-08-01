export type Token = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

type TokenResponse =
  | {
      access_token: string;
      token_type: string;
      expires_in: number;
    }
  | { error: string };

export const signIn = async (credentials: {
  username: string;
  password: string;
}) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=password&username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`,
  })
    .then((res) => res.json() as Promise<TokenResponse>)
    .then((data) => {
      return "error" in data
        ? { error: data.error }
        : {
            accessToken: data.access_token,
            tokenType: data.token_type,
            expiresIn: data.expires_in,
          };
    });
};
