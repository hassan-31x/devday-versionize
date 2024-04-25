import { RedirectToSignIn } from "@clerk/nextjs";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
 
export default authMiddleware({
    // publicRoutes: ["/"],
    afterAuth(auth, req) {
      if (auth.userId && auth.isPublicRoute) {
        let path = '/select-org'

        if (auth.orgId) {
          path = `/organization/${auth.orgId}`
        }

        const orgSelection = new URL(path, req.url)
        return NextResponse.redirect(orgSelection)
      }

      if (!auth.userId && !auth.isPublicRoute) {
        const signIn = new URL(`/login?redirect_url=${new URL(req.url)}`, req.url)
        return NextResponse.redirect(signIn)
      }

      if (auth.userId && !auth.orgId && req.nextUrl.pathname !== '/select-org') {
        const orgSelection = new URL('/select-org', req.url)
        return NextResponse.redirect(orgSelection)
      }
    }
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};