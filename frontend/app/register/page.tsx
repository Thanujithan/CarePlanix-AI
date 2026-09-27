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

type RegisterResponse = {
  success?: boolean;
  message?: string;
  detail?: string;

  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
};


/* =========================================================
   REGISTER PAGE
========================================================= */

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* =======================================================
     REGISTER
  ======================================================= */

  const handleRegister = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName =
      name.trim();

    const cleanEmail =
      email
        .trim()
        .toLowerCase();


    /* =====================================================
       FRONTEND VALIDATION
    ===================================================== */

    if (!cleanName) {
      setError(
        "Please enter your name."
      );

      return;
    }


    if (!cleanEmail) {
      setError(
        "Please enter your email address."
      );

      return;
    }


    if (!cleanEmail.includes("@")) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }


    if (!password) {
      setError(
        "Please enter a password."
      );

      return;
    }


    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }


    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }


    setLoading(true);


    try {
      /* ===================================================
         CALL CAREPLANIX BACKEND
      =================================================== */

      const response =
        await fetch(
          `${API_BASE_URL}/auth/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name: cleanName,
              email: cleanEmail,
              password,
            }),
          }
        );


      const data: RegisterResponse =
        await response.json();


      /* ===================================================
         API ERROR
      =================================================== */

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Registration failed."
        );
      }


      /* ===================================================
         SUCCESS
      =================================================== */

      setSuccess(
        data.message ||
          "Account created successfully."
      );


      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");


      /* ===================================================
         REDIRECT TO LOGIN
      =================================================== */

      setTimeout(() => {
        router.push("/login");
      }, 1200);

    } catch (err) {
      console.error(
        "Registration error:",
        err
      );


      if (
        err instanceof TypeError
      ) {
        setError(
          "Cannot connect to the CarePlanix AI server. Please check the backend connection."
        );

      } else if (
        err instanceof Error
      ) {
        setError(
          err.message
        );

      } else {
        setError(
          "Something went wrong while creating your account."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  /* =======================================================
     UI
  ======================================================= */

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
            href="/login"
            className="rounded-xl border border-[#387EA2]/20 bg-white/70 px-5 py-3 text-sm font-semibold text-[#184E6C] transition hover:bg-white"
          >
            Login
          </Link>

        </div>

      </nav>


      {/* ===================================================
          REGISTER SECTION
      =================================================== */}

      <section className="relative overflow-hidden">

        {/* BACKGROUND SHAPES */}

        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#9BCBE5]/20 blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#5BA3C6]/10 blur-3xl" />


        <div className="relative mx-auto grid min-h-[calc(100vh-77px)] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2">


          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="hidden lg:block">

            <div className="max-w-xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-[#9BCBE5]/40 bg-white/60 px-4 py-2 text-sm font-semibold text-[#387EA2]">
                ✨ Start Your Career Journey
              </div>


              <h1 className="mt-6 text-5xl font-black leading-tight text-[#184E6C]">

                Create your

                <span className="block text-[#387EA2]">
                  CarePlanix AI
                </span>

                account

              </h1>


              <p className="mt-6 max-w-lg text-lg leading-8 text-[#5B8298]">

                Create an account to manage
                your career profile, resume
                analyses, personalized career
                plans and future job
                recommendations.

              </p>


              {/* FEATURES */}

              <div className="mt-8 space-y-4">

                <FeatureItem
                  icon="📄"
                  title="Resume Analysis"
                  text="Analyze your resume using AI-powered career insights."
                />


                <FeatureItem
                  icon="📈"
                  title="Career Development"
                  text="Identify skill gaps and follow personalized learning roadmaps."
                />


                <FeatureItem
                  icon="💼"
                  title="Job Recommendations"
                  text="Discover suitable roles and companies based on your profile."
                />

              </div>

            </div>

          </div>


          {/* =================================================
              REGISTER CARD
          ================================================= */}

          <div className="mx-auto w-full max-w-lg">

            <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white/85 p-7 shadow-2xl backdrop-blur-xl sm:p-9">

              {/* HEADER */}

              <div className="text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#184E6C] text-2xl text-white shadow-lg">
                  👤
                </div>


                <h2 className="mt-5 text-3xl font-black text-[#184E6C]">
                  Create Account
                </h2>


                <p className="mt-2 text-sm leading-6 text-[#5B8298]">

                  Join CarePlanix AI and start
                  building your career path.

                </p>

              </div>


              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleRegister}
                className="mt-8 space-y-5"
              >

                {/* NAME */}

                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-[#184E6C]"
                  >
                    Full Name
                  </label>


                  <input
                    id="name"
                    type="text"

                    value={name}

                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }

                    placeholder="Enter your full name"

                    autoComplete="name"

                    disabled={loading}

                    className="w-full rounded-2xl border border-[#9BCBE5]/50 bg-[#F8FCFE] px-5 py-4 text-[#184E6C] outline-none transition placeholder:text-[#8AA7B7] focus:border-[#387EA2] focus:ring-4 focus:ring-[#5BA3C6]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>


                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-[#184E6C]"
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

                    className="w-full rounded-2xl border border-[#9BCBE5]/50 bg-[#F8FCFE] px-5 py-4 text-[#184E6C] outline-none transition placeholder:text-[#8AA7B7] focus:border-[#387EA2] focus:ring-4 focus:ring-[#5BA3C6]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>


                {/* PASSWORD */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-[#184E6C]"
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

                    placeholder="Minimum 6 characters"

                    autoComplete="new-password"

                    disabled={loading}

                    className="w-full rounded-2xl border border-[#9BCBE5]/50 bg-[#F8FCFE] px-5 py-4 text-[#184E6C] outline-none transition placeholder:text-[#8AA7B7] focus:border-[#387EA2] focus:ring-4 focus:ring-[#5BA3C6]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>


                {/* CONFIRM PASSWORD */}

                <div>

                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-bold text-[#184E6C]"
                  >
                    Confirm Password
                  </label>


                  <input
                    id="confirmPassword"
                    type="password"

                    value={confirmPassword}

                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }

                    placeholder="Enter password again"

                    autoComplete="new-password"

                    disabled={loading}

                    className="w-full rounded-2xl border border-[#9BCBE5]/50 bg-[#F8FCFE] px-5 py-4 text-[#184E6C] outline-none transition placeholder:text-[#8AA7B7] focus:border-[#387EA2] focus:ring-4 focus:ring-[#5BA3C6]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>


                {/* ERROR */}

                {error && (

                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">

                    ⚠️ {error}

                  </div>

                )}


                {/* SUCCESS */}

                {success && (

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-700">

                    ✅ {success}

                  </div>

                )}


                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={loading}

                  className="w-full rounded-2xl bg-gradient-to-r from-[#184E6C] to-[#387EA2] px-6 py-4 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >

                  {loading
                    ? "Creating Account..."
                    : "Create Account"
                  }

                </button>

              </form>


              {/* =================================================
                  LOGIN LINK
              ================================================= */}

              <div className="mt-7 border-t border-[#9BCBE5]/30 pt-6 text-center">

                <p className="text-sm text-[#5B8298]">

                  Already have an account?{" "}

                  <Link
                    href="/login"
                    className="font-bold text-[#184E6C] transition hover:text-[#387EA2]"
                  >
                    Login
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

    <div className="flex items-start gap-4 rounded-2xl border border-[#9BCBE5]/30 bg-white/60 p-5 backdrop-blur-sm">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDECF6] text-xl">
        {icon}
      </div>


      <div>

        <h3 className="font-bold text-[#184E6C]">
          {title}
        </h3>


        <p className="mt-1 text-sm leading-6 text-[#5B8298]">
          {text}
        </p>

      </div>

    </div>
  );
}