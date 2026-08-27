import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const isAppRoute = pathname.startsWith('/app');
    const isOnboardingRoute = ['/auth/profile-setup', '/venue-management', '/subscription', '/pending'].includes(pathname);

    // Check if the route is a protected app route or profile setup
    if (isAppRoute || isOnboardingRoute) {
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            // Redirect to login if no token is found in cookies
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    return NextResponse.next();
}

// Ensure the proxy only runs on specific paths
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)'],
};
