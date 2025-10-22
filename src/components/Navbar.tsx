"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "../app/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user] = useAuthState(auth);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="font-semibold text-lg">
          Squad Selector
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <button className="hover:text-yellow-600" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <>
              {pathname !== "/sign-in" && (
                <Link href="/sign-in" className="hover:text-yellow-600">
                  Sign In
                </Link>
              )}
              {pathname !== "/sign-up" && (
                <Link
                  href="/sign-up"
                  className="bg-yellow-400 px-3 py-1 rounded-md font-medium text-sm hover:bg-yellow-500"
                >
                  Create Account
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
