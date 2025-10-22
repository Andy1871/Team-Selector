"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function Page() {
  const router = useRouter();
  const [createUser] = useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);
  const [user, loading] = useAuthState(auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  const onSubmit = async () => {
    const res = await createUser(email, password);
    if (res) {
      await sendEmailVerification();
      router.push("/");
    }
  };

  if (loading || user) return null;

  return (
    <div className="flex justify-center items-center flex-col">
      <h1>Create account</h1>
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
        SIGN UP
      </button>
    </div>
  );
}
