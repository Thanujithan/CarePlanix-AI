"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

/* =========================================================
   TYPES
========================================================= */

type CareerPhase = {
  phase?: string;
  duration?: string;
  focus?: string;
  skills?: string[];
  topics?: string[];
  projects?: string[];
  actions?: string[];
};

type CareerPlan = {
  target_career?: string;
  career_summary?: string;
  current_strengths?: string[];
  skills_to_improve?: string[];
  skills_to_learn?: string[];
  career_plan?: CareerPhase[];
  recommended_projects?: string[];
  portfolio_advice?: string[];
  interview_preparation?: string[];
  job_search_steps?: string[];
  final_goal?: string;
};

type ApiResponse = {
  success?: boolean;
  career_plan?: CareerPlan;
};

/* =========================================================
   PAGE
========================================================= */

export default function CareerPage() {
  const [targetCareer, setTargetCareer] =
    useState("");

  const [currentSkills, setCurrentSkills] =
    useState("");

  const [careerPlan, setCareerPlan] =
    useState<CareerPlan | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================================================
     GENERATE CAREER PLAN
  ========================================================= */

  const generatePlan = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setCareerPlan(null);

    if (!targetCareer.trim()) {
      setError(
        "Please enter your target career."
      );
      return;
    }

    if (!currentSkills.trim()) {
      setError(
        "Please enter your current skills."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/career-plan/generate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            target_career:
              targetCareer.trim(),

            current_skills:
              currentSkills.trim(),
          }),
        }
      );

      const data: ApiResponse & {
        detail?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Career plan generation failed."
        );
      }

      if (!data.career_plan) {
        throw new Error(
          "Career plan was not returned by the server."
        );
      }

      setCareerPlan(
        data.career_plan
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Something went wrong while generating your career plan."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#EAF4F9] text-[#184E6C]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-50 border-b border-[#9BCBE5]/30 bg-[#DDECF6]/90 backdrop-blur-xl">

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
            href="/results"
            className="rounded-xl border border-[#387EA2]/20 bg-white/70 px-4 py-3 text-sm font-semibold transition hover:bg-white"
          >
            Results
          </Link>

        </div>

      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#184E6C] via-[#286B8E] to-[#387EA2] text-white">

        <div className="absolute -left-24 top-5 h-72 w-72 animate-pulse rounded-full bg-[#9BCBE5]/10 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-80 w-80 animate-pulse rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-xl">
              ✨ AI-Powered Career Planning
            </div>

            <h1 className="mt-6 text-4xl font-black sm:text-5xl lg:text-6xl">
              Build Your

              <span className="block text-[#9BCBE5]">
                Career Plan
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#DDECF6]">
              Tell CarePlanix AI where you
              want to go and what skills you
              already have. Get a personalized
              learning and career development
              plan.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">

          {/* =================================================
              FORM
          ================================================= */}

          <div>

            <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white/80 p-7 shadow-xl backdrop-blur-xl">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#184E6C] text-xl text-white">
                  🎯
                </div>

                <div>

                  <h2 className="text-2xl font-bold">
                    Career Planner
                  </h2>

                  <p className="mt-1 text-sm text-[#387EA2]">
                    Enter your career goal and skills
                  </p>

                </div>

              </div>

              <form
                onSubmit={generatePlan}
                className="mt-7 space-y-6"
              >

                {/* TARGET CAREER */}

                <div>

                  <label className="mb-2 block text-sm font-bold">
                    Target Career
                  </label>

                  <input
                    type="text"
                    value={targetCareer}
                    onChange={(event) =>
                      setTargetCareer(
                        event.target.value
                      )
                    }
                    placeholder="Example: AI Engineer"
                    className="w-full rounded-2xl border border-[#9BCBE5]/50 bg-[#EAF4F9]/70 px-5 py-4 text-[#184E6C] outline-none transition placeholder:text-[#7DA2B6] focus:border-[#387EA2] focus:ring-4 focus:ring-[#5BA3C6]/10"
                  />

                </div>

                {/* CURRENT SKILLS */}

                <div>

                  <label className="mb-2 block text-sm font-bold">
                    Current Skills
                  </label>

                  <textarea
                    value={currentSkills}
                    onChange={(event) =>
                      setCurrentSkills(
                        event.target.value
                      )
                    }
                    placeholder="Example: Python, HTML, CSS, JavaScript, SQL, basic machine learning"
                    rows={7}
                    className="w-full resize-none rounded-2xl border border-[#9BCBE5]/50 bg-[#EAF4F9]/70 px-5 py-4 text-[#184E6C] outline-none transition placeholder:text-[#7DA2B6] focus:border-[#387EA2] focus:ring-4 focus:ring-[#5BA3C6]/10"
                  />

                </div>

                {/* ERROR */}

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    ⚠️ {error}
                  </div>
                )}

                {/* GENERATE BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#184E6C] to-[#387EA2] px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Generating Career Plan..."
                    : "✨ Generate Career Plan"}
                </button>

              </form>

            </div>

            {/* BETTER RESULTS */}

            <div className="mt-6 rounded-3xl border border-[#9BCBE5]/30 bg-[#DDECF6]/60 p-6">

              <h3 className="font-bold">
                💡 Better results
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#387EA2]">
                Include programming languages,
                frameworks, databases, tools,
                technical knowledge and other skills
                you currently have.
              </p>

            </div>

          </div>

          {/* =================================================
              EMPTY / LOADING / RESULTS
          ================================================= */}

          <div>

            {!careerPlan && !loading && (
              <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-dashed border-[#5BA3C6]/40 bg-white/50 p-10 text-center">

                <div className="max-w-md">

                  <div className="text-7xl">
                    🗺️
                  </div>

                  <h2 className="mt-6 text-2xl font-bold">
                    Your Career Roadmap
                  </h2>

                  <p className="mt-3 leading-7 text-[#387EA2]">
                    Enter your target career and
                    current skills. Your personalized
                    CarePlanix AI career plan will
                    appear here.
                  </p>

                </div>

              </div>
            )}

            {loading && (
              <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-[#9BCBE5]/30 bg-white/70 p-10">

                <div className="text-center">

                  <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#9BCBE5]/30 border-t-[#184E6C]" />

                  <h2 className="mt-6 text-xl font-bold">
                    Building your career plan...
                  </h2>

                  <p className="mt-2 text-sm text-[#387EA2]">
                    CarePlanix AI is analyzing your
                    career goal and current skills.
                  </p>

                </div>

              </div>
            )}

            {careerPlan && !loading && (
              <CareerPlanResult
                plan={careerPlan}
              />
            )}

          </div>

        </div>

      </section>

    </main>
  );
}
/* =========================================================
   CAREER PLAN RESULT
========================================================= */

function CareerPlanResult({
  plan,
}: {
  plan: CareerPlan;
}) {
  return (
    <div className="space-y-6">

      {/* TARGET CAREER */}

      <Card>

        <p className="text-xs font-bold uppercase tracking-wider text-[#387EA2]">
          🎯 Target Career
        </p>

        <h2 className="mt-2 text-3xl font-black text-[#184E6C]">
          {plan.target_career ||
            "Career Plan"}
        </h2>

        <p className="mt-4 leading-7 text-[#387EA2]">
          {plan.career_summary ||
            "Your personalized career plan is ready."}
        </p>

      </Card>


      {/* SKILLS SUMMARY */}

      <div className="grid gap-5 md:grid-cols-3">

        <SkillBox
          icon="💪"
          title="Strengths"
          items={plan.current_strengths}
        />

        <SkillBox
          icon="📈"
          title="Improve"
          items={plan.skills_to_improve}
        />

        <SkillBox
          icon="🚀"
          title="Learn Next"
          items={plan.skills_to_learn}
        />

      </div>


      {/* CAREER ROADMAP */}

      <div>

        <h2 className="mb-5 text-2xl font-bold text-[#184E6C]">
          🗺️ Career Roadmap
        </h2>

        {plan.career_plan &&
        plan.career_plan.length > 0 ? (

          <div className="space-y-5">

            {plan.career_plan.map(
              (phase, index) => (

                <Card
                  key={`${phase.phase}-${index}`}
                >

                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                    <div className="flex gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#184E6C] font-bold text-white">
                        {index + 1}
                      </div>

                      <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-[#387EA2]">
                          Phase {index + 1}
                        </p>

                        <h3 className="mt-1 text-xl font-bold text-[#184E6C]">
                          {phase.phase ||
                            `Career Phase ${
                              index + 1
                            }`}
                        </h3>

                      </div>

                    </div>

                    <span className="w-fit rounded-full bg-[#9BCBE5]/20 px-4 py-2 text-sm font-semibold text-[#286B8E]">
                      ⏱️{" "}
                      {phase.duration ||
                        "Flexible"}
                    </span>

                  </div>


                  {/* FOCUS */}

                  {phase.focus && (

                    <div className="mt-5 rounded-2xl bg-[#9BCBE5]/15 p-4">

                      <p className="text-xs font-bold uppercase text-[#387EA2]">
                        Focus
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#184E6C]">
                        {phase.focus}
                      </p>

                    </div>

                  )}


                  <PhaseSection
                    title="Skills"
                    items={phase.skills}
                  />

                  <PhaseSection
                    title="Topics"
                    items={phase.topics}
                  />

                  <PhaseSection
                    title="Projects"
                    items={phase.projects}
                  />

                  <PhaseSection
                    title="Actions"
                    items={phase.actions}
                  />

                </Card>

              )
            )}

          </div>

        ) : (

          <Card>

            <p className="text-sm text-[#387EA2]">
              No roadmap phases available.
            </p>

          </Card>

        )}

      </div>


      {/* ADDITIONAL CAREER GUIDANCE */}

      <div className="grid gap-5 md:grid-cols-2">

        <ListCard
          icon="🛠️"
          title="Recommended Projects"
          items={plan.recommended_projects}
        />

        <ListCard
          icon="📁"
          title="Portfolio Advice"
          items={plan.portfolio_advice}
        />

        <ListCard
          icon="🎤"
          title="Interview Preparation"
          items={plan.interview_preparation}
        />

        <ListCard
          icon="💼"
          title="Job Search Steps"
          items={plan.job_search_steps}
        />

      </div>


      {/* FINAL GOAL */}

      {plan.final_goal && (

        <div className="rounded-3xl bg-gradient-to-br from-[#184E6C] to-[#387EA2] p-7 text-white shadow-xl">

          <p className="text-sm font-semibold text-[#9BCBE5]">
            🏆 FINAL GOAL
          </p>

          <p className="mt-3 text-lg font-semibold leading-8">
            {plan.final_goal}
          </p>

        </div>

      )}

    </div>
  );
}


/* =========================================================
   REUSABLE CARD
========================================================= */

function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {children}
    </div>
  );
}


/* =========================================================
   SKILL BOX
========================================================= */

function SkillBox({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items?: string[];
}) {
  return (
    <Card>

      <div className="text-2xl">
        {icon}
      </div>

      <h3 className="mt-3 font-bold text-[#184E6C]">
        {title}
      </h3>

      <div className="mt-4 flex flex-wrap gap-2">

        {items && items.length > 0 ? (

          items.map((item, index) => (

            <span
              key={`${item}-${index}`}
              className="rounded-full bg-[#9BCBE5]/20 px-3 py-2 text-xs font-semibold text-[#286B8E]"
            >
              {item}
            </span>

          ))

        ) : (

          <p className="text-sm text-[#387EA2]">
            No information available.
          </p>

        )}

      </div>

    </Card>
  );
}


/* =========================================================
   PHASE SECTION
========================================================= */

function PhaseSection({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mt-5">

      <h4 className="font-bold text-[#184E6C]">
        {title}
      </h4>

      <div className="mt-3 flex flex-wrap gap-2">

        {items.map((item, index) => (

          <span
            key={`${item}-${index}`}
            className="rounded-xl border border-[#5BA3C6]/20 bg-[#9BCBE5]/15 px-3 py-2 text-sm text-[#286B8E]"
          >
            {item}
          </span>

        ))}

      </div>

    </div>
  );
}


/* =========================================================
   LIST CARD
========================================================= */

function ListCard({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items?: string[];
}) {
  return (
    <Card>

      <h3 className="text-lg font-bold text-[#184E6C]">
        {icon} {title}
      </h3>

      {items && items.length > 0 ? (

        <div className="mt-4 space-y-3">

          {items.map((item, index) => (

            <div
              key={`${item}-${index}`}
              className="flex gap-3 rounded-xl bg-[#9BCBE5]/15 p-4"
            >

              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#184E6C] text-xs font-bold text-white">
                {index + 1}
              </span>

              <p className="text-sm leading-6 text-[#286B8E]">
                {item}
              </p>

            </div>

          ))}

        </div>

      ) : (

        <p className="mt-4 text-sm text-[#387EA2]">
          No information available.
        </p>

      )}

    </Card>
  );
}