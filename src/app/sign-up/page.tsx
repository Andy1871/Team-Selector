"use client";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Sign up coming soon…</h1>
    </div>
  );
}


// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   useCreateUserWithEmailAndPassword,
//   useSendEmailVerification,
// } from "react-firebase-hooks/auth";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "../firebase";

// export default function Page() {
//   const router = useRouter();

//   const [createUser, createdUser, creating, createError] =
//     useCreateUserWithEmailAndPassword(auth);
//   const [sendEmailVerification] = useSendEmailVerification(auth);
//   const [user, authLoading] = useAuthState(auth);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [formError, setFormError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!authLoading && user) router.replace("/");
//   }, [authLoading, user, router]);

//   const onSubmit = async () => {
//     setFormError(null);
//     const res = await createUser(email, password);

//     if (!res) {

//       if (createError?.code === "auth/email-already-in-use") {
//         setFormError("That email is already registered. Try signing in instead.");
//       } else if (createError) {
//         setFormError(createError.message);
//       }
//       return;
//     }

//     await sendEmailVerification();
//     router.push("/");
//   };

//   if (authLoading || user) return null;

//   return (
//     <div className="flex justify-center items-center flex-col">
//       <h1>Create account</h1>

//       <input
//         type="text"
//         onChange={(e) => setEmail(e.target.value)}
//         value={email}
//         placeholder="Email"
//         className="text-xl px-4 py-2 rounded-md border border-gray-300 mb-4"
//       />
//       <input
//         type="password"
//         onChange={(e) => setPassword(e.target.value)}
//         value={password}
//         placeholder="Password"
//         className="text-xl px-4 py-2 rounded-md border border-gray-300 mb-2"
//       />

//       {formError && (
//         <p className="text-red-600 text-sm mb-2">{formError}</p>
//       )}

//       <button
//         className="bg-yellow-500 text-black px-4 py-2 rounded-md font-bold"
//         onClick={onSubmit}
//         disabled={creating}
//       >
//         {creating ? "SIGNING UP..." : "SIGN UP"}
//       </button>
//     </div>
//   );
// }
