"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../firebase";

export default function Page() {
  const router = useRouter();

  const [signInUserWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);

  const onSubmit = async () => {
    await signInUserWithEmailAndPassword(email, password);
    router.push("/");
  };

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <h1>Sign in page</h1>
      <input
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
        className="text-xl px-4 py-2 rounded-md border border-gray-300 mb-4"
      />
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Password"
        className="text-xl px-4 py-2 rounded-md border border-gray-300 mb-4"
      />
      <button
        className="bg-yellow-500 text-black px-4 py-2 rounded-md font-bold"
        onClick={onSubmit}
      >
        SIGN IN
      </button>
    </div>
  );
}
