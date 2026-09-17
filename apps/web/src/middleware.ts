import { NextResponse, type NextRequest } from "next/server";
import { environment } from "@/lib/environment";
import { read_session_token } from "@/lib/session_token";

const public_routes = ["/login", "/register"];

const is_public_route = (pathname: string): boolean =>
  public_routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(environment.session_cookie_name())?.value;
  const session = token ? await read_session_token(token) : null;

  if (!session && !is_public_route(pathname)) {
    const login_url = new URL("/login", request.url);
    login_url.searchParams.set("redirect_to", pathname);

    return NextResponse.redirect(login_url);
  }

  if (session && is_public_route(pathname)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|bank_logos).*)"],
};
