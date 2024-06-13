import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (request.nextUrl.pathname === "/admin/signin") return;

    const currentUser = request.cookies.get("jwt")?.value;

    if (!currentUser) {
      return Response.redirect(new URL("/admin/signin", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
