"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");


/* =========================================================
   TYPES
========================================================= */

type LoginResponse = {
  success?: boolean;
  message?: string;
  detail?: string;

  access_token?: string;
  token_type?: string;

  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
};


/* =========================================================
   LOGIN PAGE
========================================================= */

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const cleanEmail =
      email.trim().toLowerCase();


    /* ===============================
       VALIDATION
    =============================== */

    if (!cleanEmail) {
      setError(
        "Please enter your email address."
      );

      return;
    }


    if (!password) {
      setError(
        "Please enter your password."
      );

      return;
    }


    setLoading(true);


    try {
      /* ===============================
         CALL CAREPLANIX BACKEND
      =============================== */

      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        }
      );


      const data: LoginResponse =
        await response.json();


      /* ===============================
         API ERROR
      =============================== */

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Login failed."
        );
      }


      /* ===============================
         CHECK TOKEN
      =============================== */

      if (!data.access_token) {
        throw new Error(
          "Access token was not returned."
        );
      }


      /* =====================================================
         SAVE AUTH DATA
      ===================================================== */

      localStorage.setItem(
        "careplanix_access_token",
        data.access_token
      );


      if (data.user) {
        localStorage.setItem(
          "careplanix_user",
          JSON.stringify(data.user)
        );
      } else {
        localStorage.removeItem(
          "careplanix_user"
        );
      }


      /* =====================================================
         REDIRECT
      ===================================================== */

      router.push("/");
      router.refresh();

    } catch (err) {
      console.error(
        "Login error:",
        err
      );


      if (err instanceof TypeError) {
        setError(
          "Cannot connect to the CarePlanix AI server. Please check the backend connection."
        );

      } else if (err instanceof Error) {
        setError(
          err.message
        );

      } else {
        setError(
          "Something went wrong while logging in."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#EAF4F9] text-[#184E6C]">

      {/* ===================================================
          NAVBAR
      =================================================== */}

      <nav className="border-b border-[#9BCBE5]/30 bg-[#DDECF6]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#184E6C] font-black text-white">
              CP
            </div>


            <div className="text-xl font-bold">
              CarePlanix

              <span className="ml-1 text-[#5BA3C6]">
                AI
              </span>
            </div>

          </Link>


          <Link
            href="/register"
            className="rounded-xl border border-[#387EA2]/20 bg-white/70 px-5 py-3 text-sm font-semibold transition hover:bg-white"
          >
            Register
          </Link>

        </div>

      </nav>


      {/* ===================================================
          LOGIN SECTION
      =================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#9BCBE5]/20 blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#5BA3C6]/10 blur-3xl" />


        <div className="relative mx-auto grid min-h-[calc(100vh-77px)] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2">


          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="hidden lg:block">

            <div className="max-w-xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-[#9BCBE5]/40 bg-white/60 px-4 py-2 text-sm font-semibold text-[#387EA2]">
                👋 Welcome Back
              </div>


              <h1 className="mt-6 text-5xl font-black leading-tight">

                Continue your

                <span className="block text-[#387EA2]">
                  career journey
                </span>

              </h1>


              <p className="mt-6 max-w-lg text-lg leading-8 text-[#5B8298]">

                Login to CarePlanix AI to manage
                your career profile, resume analysis,
                personalized roadmap and job
                recommendations.

              </p>


              <div className="mt-8 space-y-4">

                <FeatureItem
                  icon="📄"
                  title="Resume Insights"
                  text="Access AI-powered resume and career insights."
                />


                <FeatureItem
                  icon="🗺️"
                  title="Career Roadmap"
                  text="Continue your personalized learning journey."
                />


                <FeatureItem
                  icon="💼"
                  title="Career Opportunities"
                  text="Explore suitable job roles and companies."
                />

              </div>

            </div>

          </div>


          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <div className="mx-auto w-full max-w-lg">

            <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white/85 p-7 shadow-2xl backdrop-blur-xl sm:p-9">

              <div className="text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#184E6C] text-2xl text-white shadow-lg">
                  🔐
                </div>


                <h2 className="mt-5 text-3xl font-black">
                  Login
                </h2>


                <p className="mt-2 text-sm leading-6 text-[#5B8298]">
                  Sign in to your CarePlanix AI account.
                </p>

              </div>


              {/* =================================================
                  LOGIN FORM
              ================================================= */}

              <form
                onSubmit={handleLogin}
                className="mt-8 space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold"
                  >
                    Email Address
                  </label>


                  <input
                    id="email"
                    type="email"
                    value={email}

                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }

                    placeholder="example@email.com"

                    autoComplete="email"

                    disabled={loading}

                    className="w-full rounded-2xl border border-[#9BCBE5]/50 bg-[#F8FCFE] px-5 py-4 outline-none transition placeholder:text-[#8AA7B7] focus:border-[#387EA2] focus:ring-4 focus:ring-[#5BA3C6]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>


                {/* PASSWORD */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold"
                  >
                    Password
                  </label>


                  <input
                    id="password"
                    type="password"
                    value={password}

                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }

                    placeholder="Enter your password"

                    autoComplete="current-password"

                    disabled={loading}

                    className="w-full rounded-2xl border border-[#9BCBE5]/50 bg-[#F8FCFE] px-5 py-4 outline-none transition placeholder:text-[#8AA7B7] focus:border-[#387EA2] focus:ring-4 focus:ring-[#5BA3C6]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>


                {/* ERROR */}

                {error && (

                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    ⚠️ {error}
                  </div>

                )}


                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}

                  className="w-full rounded-2xl bg-gradient-to-r from-[#184E6C] to-[#387EA2] px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >

                  {loading
                    ? "Logging in..."
                    : "Login"
                  }

                </button>

              </form>


              {/* =================================================
                  REGISTER LINK
              ================================================= */}

              <div className="mt-7 border-t border-[#9BCBE5]/30 pt-6 text-center">

                <p className="text-sm text-[#5B8298]">

                  Don&apos;t have an account?{" "}

                  <Link
                    href="/register"
                    className="font-bold text-[#184E6C] hover:text-[#387EA2]"
                  >
                    Create Account
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}


/* =========================================================
   FEATURE ITEM
========================================================= */

function FeatureItem({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (

    <div className="flex items-start gap-4 rounded-2xl border border-[#9BCBE5]/30 bg-white/60 p-5">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDECF6] text-xl">
        {icon}
      </div>


      <div>

        <h3 className="font-bold">
          {title}
        </h3>


        <p className="mt-1 text-sm leading-6 text-[#5B8298]">
          {text}
        </p>

      </div>

    </div>
  );
}