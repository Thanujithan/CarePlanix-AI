"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";


/* =========================================================
   TYPES
========================================================= */

type User = {
  id: string;
  name: string;
  email: string;
};


type HistoryItem = {
  history_id: string;
  filename: string;
  created_at: string | null;
  top_career: string;
  career_match: number;
  job_readiness: number;
};


type HistoryResponse = {
  success: boolean;
  count: number;
  history: HistoryItem[];
};


type MeResponse = {
  success: boolean;
  user: User;
};


/* =========================================================
   DASHBOARD PAGE
========================================================= */

export default function DashboardPage() {

  const router = useRouter();


  const [user, setUser] =
    useState<User | null>(null);


  const [history, setHistory] =
    useState<HistoryItem[]>([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [
    openingHistoryId,
    setOpeningHistoryId,
  ] = useState<string | null>(null);


  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  useEffect(() => {

    const logoutUser = () => {

      localStorage.removeItem(
        "careplanix_access_token"
      );

      localStorage.removeItem(
        "careplanix_user"
      );

      router.replace(
        "/login"
      );
    };


    const loadDashboard =
      async () => {

        const token =
          localStorage.getItem(
            "careplanix_access_token"
          );


        /* -------------------------------------------------
           NOT LOGGED IN
        ------------------------------------------------- */

        if (!token) {

          router.replace(
            "/login"
          );

          return;
        }


        try {

          setLoading(true);

          setError("");


          /* ===============================================
             GET CURRENT USER
          =============================================== */

          const userResponse =
            await fetch(
              "http://127.0.0.1:8000/auth/me",
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          if (
            userResponse.status === 401 ||
            userResponse.status === 403
          ) {

            logoutUser();

            return;
          }


          const userData:
            MeResponse =
              await userResponse.json();


          if (!userResponse.ok) {

            throw new Error(
              "Could not load user information."
            );
          }


          setUser(
            userData.user
          );


          /* ===============================================
             GET ANALYSIS HISTORY
          =============================================== */

          const historyResponse =
            await fetch(
              "http://127.0.0.1:8000/resume/history",
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          if (
            historyResponse.status === 401 ||
            historyResponse.status === 403
          ) {

            logoutUser();

            return;
          }


          const historyData:
            HistoryResponse =
              await historyResponse.json();


          if (!historyResponse.ok) {

            throw new Error(
              "Could not load analysis history."
            );
          }


          setHistory(
            Array.isArray(
              historyData.history
            )
              ? historyData.history
              : []
          );


        } catch (err) {

          if (
            err instanceof TypeError
          ) {

            setError(
              "Cannot connect to the CarePlanix AI backend."
            );

          } else if (
            err instanceof Error
          ) {

            setError(
              err.message
            );

          } else {

            setError(
              "Something went wrong while loading your dashboard."
            );
          }

        } finally {

          setLoading(false);
        }
      };


    loadDashboard();

  }, [router]);


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {

    localStorage.removeItem(
      "careplanix_access_token"
    );

    localStorage.removeItem(
      "careplanix_user"
    );

    sessionStorage.removeItem(
      "careplanix_resume_result"
    );

    router.push(
      "/login"
    );
  };


  /* =======================================================
     OPEN SAVED ANALYSIS
  ======================================================= */

  const openSavedAnalysis =
    async (
      historyId: string
    ) => {

      const token =
        localStorage.getItem(
          "careplanix_access_token"
        );


      if (!token) {

        router.push(
          "/login"
        );

        return;
      }


      try {

        setError("");

        setOpeningHistoryId(
          historyId
        );


        const response =
          await fetch(
            `http://127.0.0.1:8000/resume/history/${historyId}`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const data =
          await response.json();


        /* -----------------------------------------------
           INVALID / EXPIRED TOKEN
        ----------------------------------------------- */

        if (
          response.status === 401 ||
          response.status === 403
        ) {

          localStorage.removeItem(
            "careplanix_access_token"
          );

          localStorage.removeItem(
            "careplanix_user"
          );

          sessionStorage.removeItem(
            "careplanix_resume_result"
          );


          router.push(
            "/login"
          );

          return;
        }


        /* -----------------------------------------------
           OTHER BACKEND ERROR
        ----------------------------------------------- */

        if (!response.ok) {

          throw new Error(
            data.detail ||
            "Could not open saved analysis."
          );
        }


        /* -----------------------------------------------
           SAVE FULL RESULT
        ----------------------------------------------- */

        sessionStorage.setItem(
          "careplanix_resume_result",
          JSON.stringify(data)
        );


        /* -----------------------------------------------
           OPEN RESULTS PAGE
        ----------------------------------------------- */

        router.push(
          "/results"
        );


      } catch (err) {

        if (
          err instanceof TypeError
        ) {

          setError(
            "Cannot connect to the CarePlanix AI backend."
          );

        } else if (
          err instanceof Error
        ) {

          setError(
            err.message
          );

        } else {

          setError(
            "Could not open saved analysis."
          );
        }

      } finally {

        setOpeningHistoryId(
          null
        );
      }
    };


  /* =======================================================
     DASHBOARD VALUES
  ======================================================= */

  const latestAnalysis =
    history.length > 0
      ? history[0]
      : null;


  const totalAnalyses =
    history.length;


  const latestCareer =
    latestAnalysis?.top_career ||
    "Not available";


  const latestCareerMatch =
    clampPercentage(
      latestAnalysis?.career_match
    );


  const latestReadiness =
    clampPercentage(
      latestAnalysis?.job_readiness
    );


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#EAF4F9]">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#9BCBE5] border-t-[#184E6C]" />

          <p className="mt-5 font-semibold text-[#184E6C]">
            Loading your dashboard...
          </p>

        </div>

      </main>
    );
  }


  /* =======================================================
     PAGE
  ======================================================= */

  return (

    <main className="min-h-screen bg-[#EAF4F9] text-[#184E6C]">


      {/* ===================================================
          NAVBAR
      =================================================== */}

      <nav className="sticky top-0 z-50 border-b border-[#9BCBE5]/30 bg-[#EAF4F9]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#184E6C] font-black text-white">
              CP
            </div>

            <div className="text-xl font-black">

              CarePlanix

              <span className="ml-1 text-[#5BA3C6]">
                AI
              </span>

            </div>

          </Link>


          {/* NAV ACTIONS */}

          <div className="flex items-center gap-3">

            <Link
              href="/resume"
              className="hidden rounded-xl bg-[#387EA2] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#184E6C] sm:block"
            >
              Analyze Resume
            </Link>


            <button
              type="button"
              onClick={
                handleLogout
              }
              className="rounded-xl border border-[#387EA2]/20 bg-white px-5 py-2.5 text-sm font-bold text-[#184E6C] transition hover:border-[#387EA2] hover:bg-[#F8FCFE]"
            >
              Logout
            </button>

          </div>

        </div>

      </nav>


      {/* ===================================================
          DASHBOARD
      =================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10 lg:py-14">


        {/* =================================================
            WELCOME AREA
        ================================================= */}

        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#184E6C] to-[#387EA2] p-7 text-white shadow-xl sm:p-9">

          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">

            <div>

              <p className="text-sm font-semibold text-[#DDECF6]">
                CAREPLANIX AI DASHBOARD
              </p>


              <h1 className="mt-3 text-3xl font-black sm:text-4xl">

                Welcome back
                {user?.name
                  ? `, ${user.name}`
                  : ""}
                👋

              </h1>


              <p className="mt-3 max-w-2xl leading-7 text-[#DDECF6]">

                Track your resume analyses,
                career recommendations,
                skill readiness and continue
                building your career plan.

              </p>

            </div>


            <Link
              href="/resume"
              className="w-fit rounded-2xl bg-white px-6 py-3.5 font-bold text-[#184E6C] shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              + Analyze New Resume
            </Link>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">

            ⚠️ {error}

          </div>

        )}


        {/* =================================================
            STATS
        ================================================= */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            icon="📄"
            title="Total Analyses"
            value={String(
              totalAnalyses
            )}
            description="Resume analyses saved"
          />


          <StatCard
            icon="🎯"
            title="Top Career"
            value={
              latestCareer
            }
            description="Latest career recommendation"
          />


          <StatCard
            icon="📈"
            title="Career Match"
            value={
              latestAnalysis
                ? `${latestCareerMatch}%`
                : "—"
            }
            description="Latest estimated match"
          />


          <StatCard
            icon="💼"
            title="Job Readiness"
            value={
              latestAnalysis
                ? `${latestReadiness}%`
                : "—"
            }
            description="Latest readiness estimate"
          />

        </div>


        {/* =================================================
            PROFILE + LATEST ANALYSIS
        ================================================= */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">


          {/* PROFILE */}

          <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDECF6] text-xl font-black text-[#184E6C]">

                {getInitials(
                  user?.name
                )}

              </div>


              <div>

                <p className="text-sm text-[#5B8298]">
                  Your Profile
                </p>

                <h2 className="text-xl font-black">
                  {user?.name ||
                    "CarePlanix User"}
                </h2>

              </div>

            </div>


            <div className="mt-6 space-y-4">

              <ProfileRow
                label="Name"
                value={
                  user?.name ||
                  "Not available"
                }
              />


              <ProfileRow
                label="Email"
                value={
                  user?.email ||
                  "Not available"
                }
              />


              <ProfileRow
                label="Saved Analyses"
                value={String(
                  totalAnalyses
                )}
              />

            </div>

          </div>


          {/* LATEST ANALYSIS */}

          <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm font-semibold text-[#387EA2]">
                  LATEST ANALYSIS
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Career Snapshot
                </h2>

              </div>


              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDECF6] text-2xl">
                ✨
              </div>

            </div>


            {latestAnalysis ? (

              <div className="mt-7">

                <div className="rounded-2xl bg-[#F4FAFD] p-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-[#5B8298]">
                    Resume
                  </p>

                  <p className="mt-2 font-bold">
                    {latestAnalysis.filename}
                  </p>

                </div>


                <div className="mt-5 grid gap-4 sm:grid-cols-3">

                  <MiniStat
                    label="Top Career"
                    value={
                      latestCareer
                    }
                  />

                  <MiniStat
                    label="Career Match"
                    value={
                      `${latestCareerMatch}%`
                    }
                  />

                  <MiniStat
                    label="Job Readiness"
                    value={
                      `${latestReadiness}%`
                    }
                  />

                </div>


                <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <p className="text-sm text-[#5B8298]">

                    Last analyzed:{" "}

                    <span className="font-semibold text-[#184E6C]">

                      {formatDate(
                        latestAnalysis.created_at
                      )}

                    </span>

                  </p>


                  <button
                    type="button"

                    onClick={() =>
                      openSavedAnalysis(
                        latestAnalysis.history_id
                      )
                    }

                    disabled={
                      openingHistoryId ===
                      latestAnalysis.history_id
                    }

                    className="rounded-xl bg-[#184E6C] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#387EA2] disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {openingHistoryId ===
                    latestAnalysis.history_id
                      ? "Opening..."
                      : "View Results →"
                    }

                  </button>

                </div>

              </div>

            ) : (

              <div className="mt-7 rounded-2xl border border-dashed border-[#9BCBE5] bg-[#F8FCFE] p-8 text-center">

                <div className="text-4xl">
                  📄
                </div>

                <h3 className="mt-4 text-lg font-black">
                  No resume analyses yet
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#5B8298]">
                  Upload your resume to receive
                  AI-powered career insights.
                </p>

                <Link
                  href="/resume"
                  className="mt-5 inline-block rounded-xl bg-[#184E6C] px-5 py-3 text-sm font-bold text-white"
                >
                  Analyze Resume
                </Link>

              </div>

            )}

          </div>

        </div>


        {/* =================================================
            HISTORY
        ================================================= */}

        <div className="mt-8 rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm sm:p-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <p className="text-sm font-semibold text-[#387EA2]">
                ANALYSIS HISTORY
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Previous Resume Analyses
              </h2>

            </div>


            <div className="rounded-xl bg-[#DDECF6] px-4 py-2 text-sm font-bold">

              {totalAnalyses} saved

            </div>

          </div>


          {history.length > 0 ? (

            <div className="mt-7 space-y-4">

              {history.map(
                (
                  item,
                  index
                ) => (

                  <HistoryCard
                    key={
                      item.history_id
                    }

                    item={
                      item
                    }

                    index={
                      index
                    }

                    loading={
                      openingHistoryId ===
                      item.history_id
                    }

                    onOpen={() =>
                      openSavedAnalysis(
                        item.history_id
                      )
                    }
                  />

                )
              )}

            </div>

          ) : (

            <div className="mt-7 rounded-2xl border border-dashed border-[#9BCBE5]/60 bg-[#F8FCFE] p-10 text-center">

              <div className="text-4xl">
                🗂️
              </div>

              <h3 className="mt-4 text-lg font-black">
                Your analysis history is empty
              </h3>

              <p className="mt-2 text-sm text-[#5B8298]">
                Your future resume analyses
                will appear here automatically.
              </p>

            </div>

          )}

        </div>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="mt-8">

          <h2 className="text-2xl font-black">
            Quick Actions
          </h2>


          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <QuickAction
              href="/resume"
              icon="📄"
              title="Analyze Resume"
              description="Upload a new resume and get complete AI analysis."
            />


            <QuickAction
              href="/career"
              icon="🗺️"
              title="Career Planner"
              description="Generate a personalized career development plan."
            />


            <QuickAction
              href="/"
              icon="🏠"
              title="Home"
              description="Return to the CarePlanix AI home page."
            />

          </div>

        </div>

      </section>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="mt-12 border-t border-[#9BCBE5]/30 bg-white/50">

        <div className="mx-auto max-w-7xl px-6 py-7 text-center text-sm text-[#5B8298]">

          CarePlanix AI — AI-assisted career guidance platform

        </div>

      </footer>

    </main>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: string;
  title: string;
  value: string;
  description: string;
}) {

  return (

    <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-6 shadow-sm">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDECF6] text-2xl">
        {icon}
      </div>


      <p className="mt-5 text-sm font-semibold text-[#5B8298]">
        {title}
      </p>


      <p className="mt-2 break-words text-2xl font-black text-[#184E6C]">
        {value}
      </p>


      <p className="mt-2 text-xs leading-5 text-[#7B9BAE]">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   PROFILE ROW
========================================================= */

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div className="rounded-2xl bg-[#F4FAFD] p-4">

      <p className="text-xs font-bold uppercase tracking-wider text-[#7B9BAE]">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-[#184E6C]">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div className="rounded-2xl border border-[#9BCBE5]/30 bg-white p-4">

      <p className="text-xs font-bold uppercase tracking-wider text-[#7B9BAE]">
        {label}
      </p>

      <p className="mt-2 break-words font-black text-[#184E6C]">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   HISTORY CARD
========================================================= */

function HistoryCard({
  item,
  index,
  loading,
  onOpen,
}: {
  item: HistoryItem;
  index: number;
  loading: boolean;
  onOpen: () => void;
}) {

  const careerMatch =
    clampPercentage(
      item.career_match
    );


  const readiness =
    clampPercentage(
      item.job_readiness
    );


  return (

    <div className="rounded-2xl border border-[#9BCBE5]/30 bg-[#F8FCFE] p-5 transition hover:border-[#5BA3C6] hover:shadow-md">

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

        {/* LEFT */}

        <div className="flex min-w-0 items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DDECF6] font-black text-[#184E6C]">

            {index + 1}

          </div>


          <div className="min-w-0">

            <p className="truncate font-black text-[#184E6C]">

              {item.filename ||
                "Resume"}

            </p>


            <p className="mt-1 text-sm text-[#5B8298]">

              {formatDate(
                item.created_at
              )}

            </p>


            <p className="mt-2 text-sm">

              <span className="text-[#5B8298]">
                Career:
              </span>{" "}

              <span className="font-bold text-[#184E6C]">

                {item.top_career ||
                  "Not available"}

              </span>

            </p>

          </div>

        </div>


        {/* RIGHT */}

        <div className="flex flex-wrap items-center gap-3">

          <Badge
            label="Match"
            value={`${careerMatch}%`}
          />


          <Badge
            label="Readiness"
            value={`${readiness}%`}
          />


          <button
            type="button"

            onClick={
              onOpen
            }

            disabled={
              loading
            }

            className="rounded-xl bg-[#184E6C] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#387EA2] disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading
              ? "Opening..."
              : "View Results →"
            }

          </button>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   BADGE
========================================================= */

function Badge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div className="rounded-xl border border-[#9BCBE5]/30 bg-white px-4 py-2">

      <p className="text-[10px] font-bold uppercase tracking-wider text-[#7B9BAE]">
        {label}
      </p>

      <p className="mt-0.5 font-black text-[#184E6C]">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {

  return (

    <Link
      href={href}
      className="group rounded-3xl border border-[#9BCBE5]/30 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#5BA3C6] hover:shadow-lg"
    >

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDECF6] text-2xl transition group-hover:scale-110">
        {icon}
      </div>


      <h3 className="mt-5 text-lg font-black text-[#184E6C]">
        {title}
      </h3>


      <p className="mt-2 text-sm leading-6 text-[#5B8298]">
        {description}
      </p>


      <p className="mt-5 text-sm font-bold text-[#387EA2]">
        Open →
      </p>

    </Link>
  );
}


/* =========================================================
   HELPERS
========================================================= */

function clampPercentage(
  value: unknown
): number {

  const numberValue =
    typeof value === "number"
      ? value
      : Number(value);


  if (
    Number.isNaN(
      numberValue
    )
  ) {

    return 0;
  }


  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        numberValue
      )
    )
  );
}


function formatDate(
  value: string | null
): string {

  if (!value) {

    return "Date unavailable";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return value;
  }


  return date.toLocaleString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


function getInitials(
  name?: string
): string {

  if (!name) {

    return "CP";
  }


  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);


  if (
    parts.length === 0
  ) {

    return "CP";
  }


  return parts
    .slice(0, 2)
    .map(
      (part) =>
        part
          .charAt(0)
          .toUpperCase()
    )
    .join("");
}