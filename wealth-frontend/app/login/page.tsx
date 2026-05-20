// "use client";
// import { useState } from "react";
// import { api } from "@/lib/api";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const { loginUser } = useAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [err, setErr] = useState("");

//   const submit = async (e: any) => {
//     e.preventDefault();
//     setErr("");

//     try {
//       const res = await api.post("/auth/login", { email, password });

//       loginUser(
//         res.data.accessToken,
//         res.data.refreshToken,
//         res.data.user
//       );

//       router.push("/dashboard");
//     } catch (e: any) {
//       setErr(e.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="flex h-screen justify-center items-center bg-slate-900">
//       <form onSubmit={submit} className="bg-slate-800 p-8 rounded-xl w-96">
//         <h1 className="text-white text-xl mb-4">Login</h1>
//         {err && <p className="text-red-400">{err}</p>}

//         <input
//           className="w-full p-2 mb-3"
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           className="w-full p-2 mb-3"
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button className="bg-emerald-600 w-full p-2 text-white">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      setErr("Please supply all missing credentials.");
      return;
    }
    setErr("");
    setSubmitting(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      loginUser(
        res.data.accessToken,
        res.data.refreshToken,
        res.data.user
      );

      router.push("/dashboard");
    } catch (e: any) {
      setErr(e.response?.data?.message || "Invalid account credentials entered.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 font-sans text-slate-800 antialiased">
      <div className="w-full max-w-md p-4">
        {/* Card Structure Wrapper */}
        <div className="rounded-3xl bg-white p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
          {/* Brand Logo Identity */}
          <div className="flex items-center gap-3 mb-8 self-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">dompet</span>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
            <p className="text-xs text-slate-400 mt-1">Provide credentials to enter your private console panel.</p>
          </div>

          {/* Exception Error Banner Alert Node */}
          {err && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-3.5 text-xs font-medium text-red-600 flex items-start gap-2.5">
              <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{err}</span>
            </div>
          )}

          {/* Form Processing System Container */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
                </span>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-xs font-medium focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Password Token</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-xs font-medium focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center rounded-xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {submitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                "Sign In to Portfolio"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-xs text-slate-400">
              Don&apos;t possess an active node registry account?{" "}
              <a href="/register" className="font-semibold text-emerald-600 hover:underline">
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}