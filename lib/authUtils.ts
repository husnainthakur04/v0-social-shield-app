// A simple User interface matching what AuthContext might provide.
// Ensure this aligns with the actual User type used in your AuthContext.
interface UserForAdminCheck {
  userId: string;
  email: string;
  registrationDate?: string;
  // Add any other fields that might be part of your User object from AuthContext
}

export function isAdmin(user: UserForAdminCheck | null): boolean {
  if (!user || !user.email) {
    // console.log("isAdmin check: No user or no user email.", user);
    return false;
  }
  // Ensure ADMIN_EMAIL is loaded correctly. Note: process.env is available server-side.
  // For client-side usage of ADMIN_EMAIL (like in a component), it must be prefixed with NEXT_PUBLIC_
  // However, this utility function is primarily for client-side check based on user object from context.
  // The actual admin email should ideally not be exposed client-side directly for checking logic,
  // rather the /api/auth/me endpoint should return an isAdmin flag.
  // For now, if this utility is used client-side AND ADMIN_EMAIL is not NEXT_PUBLIC_, this check might not work as expected.
  // The robust check happens on the backend APIs.
  // The approach taken will be to add an `isAdmin` flag to the user object from `/api/auth/me`.
  // This utility will then just check that flag if present on the user object.
  // For direct usage with process.env.ADMIN_EMAIL (if that env var is available client-side):
  // return user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL; // If ADMIN_EMAIL is exposed to client
  
  // This function will be more useful if the 'user' object itself contains an 'isAdmin' flag
  // populated from the backend (e.g., from /api/auth/me).
  // Let's assume the user object will be augmented with an `isAdmin` property.
  const userWithAdminFlag = user as UserForAdminCheck & { isAdmin?: boolean };
  // console.log("isAdmin check: User object:", userWithAdminFlag, "Admin flag:", userWithAdminFlag.isAdmin);
  return userWithAdminFlag.isAdmin === true;
}

// This is a server-side specific admin check using the actual ADMIN_EMAIL
export function isUserAdminByEmail(userEmail: string | undefined | null): boolean {
    if (!userEmail) return false;
    // console.log(`isUserAdminByEmail check: Comparing ${userEmail} with ${process.env.ADMIN_EMAIL}`);
    return !!process.env.ADMIN_EMAIL && userEmail === process.env.ADMIN_EMAIL;
}
