// // middleware.ts
// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true";

//   // Only allow access to /uform2 if logged in
//   if (!isLoggedIn && request.nextUrl.pathname === "/uform2") {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/uform2"],
// };
