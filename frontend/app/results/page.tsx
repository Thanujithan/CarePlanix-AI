"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* =========================================================
   TYPES
========================================================= */

type PersonalInformation = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
};

type Education = {
  degree?: string;
  institution?: string;
  duration?: string;
};

type ResumeAnalysis = {
  personal_information?: PersonalInformation;
  education?: Education[];
  technical_skills?: string[];
  projects?: unknown[];
  experience?: unknown[];
  career_interests?: string[];
  weak_skills?: string[];
  recommended_skills?: string[];
  career_recommendations?: string[];
};

type SkillAnalysis = {
  strong_skills?: string[];
  intermediate_skills?: string[];
  weak_skills?: string[];
  programming_languages?: string[];
  frameworks?: string[];
  databases?: string[];
  ai_ml_skills?: string[];
  devops_cloud_skills?: string[];
  recommended_skills?: string[];
};

type Career = {
  title?: string;
  reason?: string;
  match_percentage?: number;
};

type CareerAnalysis = {
  top_career?: Career;
  alternative_careers?: Career[];
  skills_needed_for_top_career?: string[];
  next_steps?: string[];
};

type SkillGap = {
  skill?: string;
  current_level?: string;
  required_level?: string;
  priority?: string;
  reason?: string;
};

type SkillGapAnalysis = {
  target_career?: string;
  skill_gaps?: SkillGap[];
  soft_skill_gaps?: string[];
  learning_order?: string[];
  job_readiness_percentage?: number;
};

type RoadmapPhase = {
  phase?: string;
  duration?: string;
  skills?: string[];
  topics?: string[];
  projects?: string[];
  practice?: string[];
};

type RoadmapAnalysis = {
  target_career?: string;
  roadmap?: RoadmapPhase[];
  portfolio_projects?: string[];
  interview_preparation?: string[];
  job_preparation?: string[];
};

type JobRole = {
  job_title?: string;
  job_type?: string;
  match_percentage?: number;
  matching_skills?: string[];
  missing_skills?: string[];
  reason?: string;
};

type JobMatches = {
  recommended_roles?: JobRole[];
  top_role?: string;
  application_advice?: string[];
};

type Company = {
  company_name?: string;
  location?: string;
  industry?: string;
  suitable_role?: string;
  employment_level?: string;
  match_percentage?: number;
  matching_skills?: string[];
  skills_to_improve?: string[];
  reason?: string;
};

type CompanyMatches = {
  country?: string;
  recommended_companies?: Company[];
  recommended_job_types?: string[];
  search_advice?: string[];
};

type ResumeResult = {
  filename?: string;
  text_preview?: string;
  analysis?: ResumeAnalysis;
  skill_analysis?: SkillAnalysis;
  career_analysis?: CareerAnalysis;
  skill_gap_analysis?: SkillGapAnalysis;
  roadmap?: RoadmapAnalysis;
  job_matches?: JobMatches;
  company_matches?: CompanyMatches;
};

type Tab =
  | "overview"
  | "skills"
  | "careers"
  | "gaps"
  | "roadmap"
  | "jobs";

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ResultsPage() {
  const [result, setResult] =
    useState<ResumeResult | null>(null);

  const [loaded, setLoaded] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState<Tab>("overview");

  /* =======================================================
     LOAD SAVED RESULT
  ======================================================= */

  useEffect(() => {
    // CarePlanix is Light Mode only.
    // Remove any old dark-mode class saved by previous version.
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("careplanix-theme");

    const savedResult =
      sessionStorage.getItem(
        "careplanix_resume_result"
      );

    if (savedResult) {
      try {
        const parsed: ResumeResult =
          JSON.parse(savedResult);

        setResult(parsed);
      } catch (error) {
        console.error(
          "Failed to load CarePlanix result:",
          error
        );
      }
    }

    setLoaded(true);
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#184E6C]">
        <div className="text-center text-white">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />

          <p className="mt-5">
            Loading CarePlanix AI results...
          </p>

        </div>
      </main>
    );
  }

  /* =======================================================
     NO RESULT
  ======================================================= */

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#DDECF6] px-6">

        <div className="max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">

          <div className="text-5xl">
            📄
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            No Analysis Found
          </h1>

          <p className="mt-4 text-[#387EA2]">
            Upload your resume first to generate
            your CarePlanix AI career analysis.
          </p>

          <Link
            href="/resume"
            className="mt-7 inline-block rounded-xl bg-[#184E6C] px-6 py-3 font-semibold text-white"
          >
            Analyze Resume
          </Link>

        </div>
      </main>
    );
  }

  /* =======================================================
     SAFE DATA
  ======================================================= */

  const analysis =
    result.analysis ?? {};

  const skills =
    result.skill_analysis ?? {};

  const careers =
    result.career_analysis ?? {};

  const gaps =
    result.skill_gap_analysis ?? {};

  const roadmap =
    result.roadmap ?? {};

  const jobs =
    result.job_matches ?? {};

  const companies =
    result.company_matches ?? {};

  const personal =
    analysis.personal_information ?? {};

  const topCareer =
    careers.top_career ?? {};

  const careerMatch =
    clampPercentage(
      topCareer.match_percentage
    );

  const readiness =
    clampPercentage(
      gaps.job_readiness_percentage
    );

  const tabs: {
    id: Tab;
    label: string;
    icon: string;
  }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: "📊",
    },
    {
      id: "skills",
      label: "Skills",
      icon: "🧠",
    },
    {
      id: "careers",
      label: "Careers",
      icon: "🎯",
    },
    {
      id: "gaps",
      label: "Skill Gaps",
      icon: "📈",
    },
    {
      id: "roadmap",
      label: "Roadmap",
      icon: "🗺️",
    },
    {
      id: "jobs",
      label: "Jobs",
      icon: "💼",
    },
  ];

  return (
    <main className="min-h-screen bg-[#EAF4F9] text-[#184E6C]">

      {/* ===================================================
          NAVBAR
      =================================================== */}

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

          <div className="flex items-center gap-3">

            <Link
              href="/resume"
              className="rounded-xl bg-[#184E6C] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#387EA2]"
            >
              New Analysis
            </Link>

          </div>

        </div>

      </nav>

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#184E6C] via-[#286B8E] to-[#387EA2] text-white">

        <div className="absolute -left-20 top-10 h-64 w-64 animate-pulse rounded-full bg-[#9BCBE5]/10 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-72 w-72 animate-pulse rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-14">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-[#9BCBE5]" />
                Analysis Complete
              </div>

              <h1 className="mt-5 text-4xl font-bold sm:text-5xl">

                {personal.name
                  ? `${personal.name}'s`
                  : "Your"}

                <span className="ml-3 text-[#9BCBE5]">
                  Career Insights
                </span>

              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-[#DDECF6]">
                Your AI-powered career analysis,
                skill insights, career recommendations
                and personalized learning roadmap.
              </p>

            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-xl">

              <p className="text-xs text-[#9BCBE5]">
                📄 Analyzed Resume
              </p>

              <p className="mt-1 max-w-[260px] truncate font-semibold">
                {result.filename ||
                  "Resume.pdf"}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* TABS */}

        <div className="overflow-x-auto rounded-2xl border border-[#9BCBE5]/30 bg-white/70 p-2 shadow-sm backdrop-blur-xl">

          <div className="flex min-w-max gap-2">

            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#184E6C] text-white shadow-md"
                    : "text-[#387EA2] hover:bg-[#9BCBE5]/20"
                }`}
              >
                <span className="mr-2">
                  {tab.icon}
                </span>

                {tab.label}
              </button>
            ))}

          </div>

        </div>
                {/* ===================================================
            OVERVIEW TAB
        =================================================== */}

        {activeTab === "overview" && (
          <div className="mt-8 space-y-6">

            {/* TOP SUMMARY CARDS */}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <StatCard
                icon="🎯"
                label="Top Career"
                value={
                  topCareer.title ||
                  "Not Available"
                }
              />

              <StatCard
                icon="📊"
                label="Career Match"
                value={`${careerMatch}%`}
              />

              <StatCard
                icon="🚀"
                label="Job Readiness"
                value={`${readiness}%`}
              />

              <StatCard
                icon="💼"
                label="Top Job Role"
                value={
                  jobs.top_role ||
                  "Not Available"
                }
              />

            </div>

            {/* PROFILE */}

            <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDECF6] text-2xl">
                  👤
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#184E6C]">
                    Resume Overview
                  </h2>

                  <p className="mt-1 text-sm text-[#5B8298]">
                    AI summary of your professional profile
                  </p>
                </div>

              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <InfoBox
                  label="Name"
                  value={personal.name}
                />

                <InfoBox
                  label="Email"
                  value={personal.email}
                />

                <InfoBox
                  label="Phone"
                  value={personal.phone}
                />

                <InfoBox
                  label="Location"
                  value={personal.location}
                />

              </div>

            </div>

            {/* EDUCATION + TECHNICAL SKILLS */}

            <div className="grid gap-6 lg:grid-cols-2">

              <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm">

                <SectionTitle
                  icon="🎓"
                  title="Education"
                  subtitle="Academic background"
                />

                <div className="mt-6 space-y-4">

                  {analysis.education &&
                  analysis.education.length > 0 ? (

                    analysis.education.map(
                      (education, index) => (

                        <div
                          key={index}
                          className="rounded-2xl border border-[#9BCBE5]/30 bg-[#F6FBFE] p-5"
                        >

                          <h3 className="font-bold text-[#184E6C]">
                            {education.degree ||
                              "Qualification"}
                          </h3>

                          {education.institution && (
                            <p className="mt-2 text-sm text-[#387EA2]">
                              🏫{" "}
                              {education.institution}
                            </p>
                          )}

                          {education.duration && (
                            <p className="mt-2 text-sm text-[#6A8EA3]">
                              🗓️{" "}
                              {education.duration}
                            </p>
                          )}

                        </div>

                      )
                    )

                  ) : (

                    <EmptyState
                      text="No education information found."
                    />

                  )}

                </div>

              </div>

              {/* TECHNICAL SKILLS */}

              <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm">

                <SectionTitle
                  icon="💻"
                  title="Technical Skills"
                  subtitle="Skills detected from your resume"
                />

                <div className="mt-6 flex flex-wrap gap-3">

                  {analysis.technical_skills &&
                  analysis.technical_skills.length > 0 ? (

                    analysis.technical_skills.map(
                      (skill, index) => (

                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full border border-[#9BCBE5]/40 bg-[#EAF4F9] px-4 py-2 text-sm font-semibold text-[#286B8E]"
                        >
                          {stringifyValue(skill)}
                        </span>

                      )
                    )

                  ) : (

                    <EmptyState
                      text="No technical skills found."
                    />

                  )}

                </div>

              </div>

            </div>

            {/* PROJECTS + EXPERIENCE */}

            <div className="grid gap-6 lg:grid-cols-2">

              <GenericListCard
                icon="🧩"
                title="Projects"
                subtitle="Projects identified in your resume"
                items={analysis.projects}
              />

              <GenericListCard
                icon="💼"
                title="Experience"
                subtitle="Professional experience"
                items={analysis.experience}
              />

            </div>

            {/* CAREER INTERESTS */}

            <div className="grid gap-6 lg:grid-cols-2">

              <StringListCard
                icon="🧭"
                title="Career Interests"
                subtitle="Areas that align with your profile"
                items={
                  analysis.career_interests
                }
              />

              <StringListCard
                icon="✨"
                title="Recommended Skills"
                subtitle="Skills worth developing"
                items={
                  analysis.recommended_skills
                }
              />

            </div>

          </div>
        )}


        {/* ===================================================
            SKILLS TAB
        =================================================== */}

        {activeTab === "skills" && (
          <div className="mt-8 space-y-6">

            {/* SKILLS HERO */}

            <div className="rounded-3xl bg-gradient-to-r from-[#184E6C] to-[#387EA2] p-8 text-white shadow-lg">

              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

                <div>

                  <div className="text-4xl">
                    🧠
                  </div>

                  <h2 className="mt-4 text-3xl font-bold">
                    Skill Analysis
                  </h2>

                  <p className="mt-3 max-w-2xl text-[#DDECF6]">
                    Understand your strongest abilities,
                    intermediate skills and areas that
                    need improvement.
                  </p>

                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-5 text-center backdrop-blur-xl">

                  <p className="text-sm text-[#DDECF6]">
                    Strong Skills
                  </p>

                  <p className="mt-2 text-4xl font-black">
                    {skills.strong_skills?.length ??
                      0}
                  </p>

                </div>

              </div>

            </div>

            {/* STRONG / INTERMEDIATE / WEAK */}

            <div className="grid gap-6 lg:grid-cols-3">

              <SkillCard
                icon="💪"
                title="Strong Skills"
                description="Your strongest detected skills"
                items={skills.strong_skills}
                variant="strong"
              />

              <SkillCard
                icon="📘"
                title="Intermediate Skills"
                description="Skills with developing proficiency"
                items={
                  skills.intermediate_skills
                }
                variant="medium"
              />

              <SkillCard
                icon="📈"
                title="Skills to Improve"
                description="Areas that need more practice"
                items={skills.weak_skills}
                variant="weak"
              />

            </div>

            {/* SKILL CATEGORIES */}

            <div className="grid gap-6 md:grid-cols-2">

              <StringListCard
                icon="⌨️"
                title="Programming Languages"
                subtitle="Programming technologies detected"
                items={
                  skills.programming_languages
                }
              />

              <StringListCard
                icon="🧱"
                title="Frameworks"
                subtitle="Frameworks and libraries"
                items={skills.frameworks}
              />

              <StringListCard
                icon="🗄️"
                title="Databases"
                subtitle="Database technologies"
                items={skills.databases}
              />

              <StringListCard
                icon="🤖"
                title="AI / ML Skills"
                subtitle="Artificial intelligence and machine learning"
                items={skills.ai_ml_skills}
              />

              <StringListCard
                icon="☁️"
                title="DevOps / Cloud"
                subtitle="Cloud and deployment technologies"
                items={
                  skills.devops_cloud_skills
                }
              />

              <StringListCard
                icon="🚀"
                title="Recommended Skills"
                subtitle="Skills to strengthen your career profile"
                items={
                  skills.recommended_skills
                }
              />

            </div>

          </div>
        )}


        {/* ===================================================
            CAREERS TAB
        =================================================== */}

        {activeTab === "careers" && (
          <div className="mt-8 space-y-6">

            {/* TOP CAREER */}

            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#184E6C] via-[#286B8E] to-[#5BA3C6] text-white shadow-xl">

              <div className="p-8 sm:p-10">

                <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

                  <div className="max-w-3xl">

                    <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                      🏆 Top Career Recommendation
                    </div>

                    <h2 className="mt-5 text-4xl font-black sm:text-5xl">
                      {topCareer.title ||
                        "Career Recommendation"}
                    </h2>

                    <p className="mt-5 leading-8 text-[#EAF4F9]">
                      {topCareer.reason ||
                        "Your recommended career will appear here after resume analysis."}
                    </p>

                  </div>

                  <div className="flex min-w-[180px] flex-col items-center rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-xl">

                    <CircularProgress
                      value={careerMatch}
                    />

                    <p className="mt-4 text-sm font-semibold text-[#DDECF6]">
                      AI Career Match
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* DISCLAIMER */}

            <div className="rounded-2xl border border-[#9BCBE5]/40 bg-[#F6FBFE] p-5">

              <div className="flex gap-3">

                <div className="text-xl">
                  ℹ️
                </div>

                <div>

                  <h3 className="font-bold text-[#184E6C]">
                    About career matches
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[#5B8298]">
                    Match percentages are AI-generated
                    guidance based on your resume and are
                    not a formal professional assessment.
                  </p>

                </div>

              </div>

            </div>

            {/* ALTERNATIVE CAREERS */}

            <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm">

              <SectionTitle
                icon="🧭"
                title="Alternative Careers"
                subtitle="Other career directions that may suit your profile"
              />

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                {careers.alternative_careers &&
                careers.alternative_careers
                  .length > 0 ? (

                  careers.alternative_careers.map(
                    (career, index) => {

                      const percentage =
                        clampPercentage(
                          career.match_percentage
                        );

                      return (
                        <div
                          key={index}
                          className="rounded-2xl border border-[#9BCBE5]/30 bg-[#F8FCFE] p-6 transition hover:-translate-y-1 hover:shadow-md"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <p className="text-xs font-bold uppercase tracking-wider text-[#5BA3C6]">
                                Career Option{" "}
                                {index + 1}
                              </p>

                              <h3 className="mt-2 text-xl font-bold text-[#184E6C]">
                                {career.title ||
                                  "Career"}
                              </h3>

                            </div>

                            <div className="rounded-xl bg-[#DDECF6] px-3 py-2 text-sm font-bold text-[#184E6C]">
                              {percentage}%
                            </div>

                          </div>

                          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#DDECF6]">

                            <div
                              className="h-full rounded-full bg-[#387EA2]"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                          <p className="mt-5 text-sm leading-7 text-[#5B8298]">
                            {career.reason ||
                              "No explanation available."}
                          </p>

                        </div>
                      );
                    }
                  )

                ) : (

                  <div className="md:col-span-2">
                    <EmptyState
                      text="No alternative career recommendations available."
                    />
                  </div>

                )}

              </div>

            </div>

            {/* CAREER SKILLS + NEXT STEPS */}

            <div className="grid gap-6 lg:grid-cols-2">

              <StringListCard
                icon="🛠️"
                title="Skills Needed"
                subtitle={
                  topCareer.title
                    ? `Important skills for ${topCareer.title}`
                    : "Important skills for your recommended career"
                }
                items={
                  careers.skills_needed_for_top_career
                }
              />

              <NumberedListCard
                icon="➡️"
                title="Next Steps"
                subtitle="Recommended actions for your career journey"
                items={careers.next_steps}
              />

            </div>

          </div>
        )}
                {/* ===================================================
            SKILL GAPS TAB
        =================================================== */}

        {activeTab === "gaps" && (
          <div className="mt-8 space-y-6">

            {/* READINESS HERO */}

            <div className="rounded-3xl bg-gradient-to-r from-[#184E6C] to-[#387EA2] p-8 text-white shadow-lg">

              <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

                <div className="max-w-2xl">

                  <div className="text-4xl">
                    📈
                  </div>

                  <h2 className="mt-4 text-3xl font-bold">
                    Skill Gap Analysis
                  </h2>

                  <p className="mt-3 leading-7 text-[#DDECF6]">
                    See which skills you should improve
                    to become better prepared for your
                    target career.
                  </p>

                  {gaps.target_career && (
                    <div className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                      🎯 Target Career:{" "}
                      {gaps.target_career}
                    </div>
                  )}

                </div>

                <div className="rounded-3xl border border-white/15 bg-white/10 p-7 text-center backdrop-blur-xl">

                  <CircularProgress
                    value={readiness}
                  />

                  <p className="mt-4 text-sm font-semibold text-[#DDECF6]">
                    AI Job Readiness
                  </p>

                </div>

              </div>

            </div>

            {/* DISCLAIMER */}

            <div className="rounded-2xl border border-[#9BCBE5]/40 bg-[#F6FBFE] p-5">

              <div className="flex gap-3">

                <span className="text-xl">
                  ℹ️
                </span>

                <p className="text-sm leading-6 text-[#5B8298]">
                  Job readiness is an AI-generated
                  estimate based on your resume and
                  recommended career direction. It is
                  not a formal professional assessment.
                </p>

              </div>

            </div>

            {/* SKILL GAPS */}

            <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm">

              <SectionTitle
                icon="🛠️"
                title="Skills to Improve"
                subtitle="Skills identified as important for your target career"
              />

              <div className="mt-7 space-y-4">

                {gaps.skill_gaps &&
                gaps.skill_gaps.length > 0 ? (

                  gaps.skill_gaps.map(
                    (gap, index) => (

                      <div
                        key={index}
                        className="rounded-2xl border border-[#9BCBE5]/30 bg-[#F8FCFE] p-6"
                      >

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                          <div>

                            <h3 className="text-lg font-bold text-[#184E6C]">
                              {gap.skill ||
                                "Skill"}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#5B8298]">
                              {gap.reason ||
                                "No explanation available."}
                            </p>

                          </div>

                          <PriorityBadge
                            priority={
                              gap.priority
                            }
                          />

                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">

                          <div className="rounded-xl bg-[#EAF4F9] p-4">

                            <p className="text-xs font-semibold uppercase tracking-wider text-[#6A8EA3]">
                              Current Level
                            </p>

                            <p className="mt-2 font-bold text-[#184E6C]">
                              {gap.current_level ||
                                "Not specified"}
                            </p>

                          </div>

                          <div className="rounded-xl bg-[#DDECF6] p-4">

                            <p className="text-xs font-semibold uppercase tracking-wider text-[#6A8EA3]">
                              Required Level
                            </p>

                            <p className="mt-2 font-bold text-[#184E6C]">
                              {gap.required_level ||
                                "Not specified"}
                            </p>

                          </div>

                        </div>

                      </div>

                    )
                  )

                ) : (

                  <EmptyState
                    text="No skill gaps identified."
                  />

                )}

              </div>

            </div>

            {/* SOFT SKILLS + LEARNING ORDER */}

            <div className="grid gap-6 lg:grid-cols-2">

              <StringListCard
                icon="🤝"
                title="Soft Skill Gaps"
                subtitle="Professional skills worth strengthening"
                items={
                  gaps.soft_skill_gaps
                }
              />

              <NumberedListCard
                icon="📚"
                title="Learning Order"
                subtitle="Suggested order for improving your skills"
                items={
                  gaps.learning_order
                }
              />

            </div>

          </div>
        )}


        {/* ===================================================
            ROADMAP TAB
        =================================================== */}

        {activeTab === "roadmap" && (
          <div className="mt-8 space-y-6">

            {/* ROADMAP HEADER */}

            <div className="rounded-3xl bg-gradient-to-br from-[#184E6C] via-[#286B8E] to-[#5BA3C6] p-8 text-white shadow-lg">

              <div className="text-4xl">
                🗺️
              </div>

              <h2 className="mt-4 text-3xl font-bold">
                Personalized Learning Roadmap
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-[#DDECF6]">
                Follow this AI-generated roadmap to
                strengthen your skills, build practical
                projects and prepare for your target
                career.
              </p>

              {roadmap.target_career && (
                <div className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                  🎯 {roadmap.target_career}
                </div>
              )}

            </div>

            {/* ROADMAP PHASES */}

            <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm">

              <SectionTitle
                icon="🚀"
                title="Learning Phases"
                subtitle="Your step-by-step career development plan"
              />

              <div className="relative mt-8">

                {roadmap.roadmap &&
                roadmap.roadmap.length > 0 ? (

                  <div className="space-y-6">

                    {roadmap.roadmap.map(
                      (phase, index) => (

                        <div
                          key={index}
                          className="relative rounded-3xl border border-[#9BCBE5]/30 bg-[#F8FCFE] p-6"
                        >

                          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#184E6C] text-lg font-black text-white">
                              {index + 1}
                            </div>

                            <div className="flex-1">

                              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

                                <div>

                                  <p className="text-xs font-bold uppercase tracking-wider text-[#5BA3C6]">
                                    Phase{" "}
                                    {index + 1}
                                  </p>

                                  <h3 className="mt-1 text-xl font-bold text-[#184E6C]">
                                    {phase.phase ||
                                      `Learning Phase ${index + 1}`}
                                  </h3>

                                </div>

                                {phase.duration && (
                                  <span className="w-fit rounded-full bg-[#DDECF6] px-4 py-2 text-xs font-bold text-[#286B8E]">
                                    ⏱️{" "}
                                    {phase.duration}
                                  </span>
                                )}

                              </div>

                              <div className="mt-6 grid gap-5 md:grid-cols-2">

                                <RoadmapBlock
                                  title="Skills"
                                  icon="🧠"
                                  items={
                                    phase.skills
                                  }
                                />

                                <RoadmapBlock
                                  title="Topics"
                                  icon="📘"
                                  items={
                                    phase.topics
                                  }
                                />

                                <RoadmapBlock
                                  title="Projects"
                                  icon="💻"
                                  items={
                                    phase.projects
                                  }
                                />

                                <RoadmapBlock
                                  title="Practice"
                                  icon="🏋️"
                                  items={
                                    phase.practice
                                  }
                                />

                              </div>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <EmptyState
                    text="No roadmap phases available."
                  />

                )}

              </div>

            </div>

            {/* ROADMAP PREPARATION */}

            <div className="grid gap-6 lg:grid-cols-3">

              <StringListCard
                icon="🧩"
                title="Portfolio Projects"
                subtitle="Projects that can strengthen your portfolio"
                items={
                  roadmap.portfolio_projects
                }
              />

              <StringListCard
                icon="🎤"
                title="Interview Preparation"
                subtitle="Topics to prepare before interviews"
                items={
                  roadmap.interview_preparation
                }
              />

              <StringListCard
                icon="📨"
                title="Job Preparation"
                subtitle="Steps before applying for opportunities"
                items={
                  roadmap.job_preparation
                }
              />

            </div>

          </div>
        )}


        {/* ===================================================
            JOBS TAB
        =================================================== */}

        {activeTab === "jobs" && (
          <div className="mt-8 space-y-6">

            {/* JOB HERO */}

            <div className="rounded-3xl bg-gradient-to-r from-[#184E6C] to-[#387EA2] p-8 text-white shadow-lg">

              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

                <div>

                  <div className="text-4xl">
                    💼
                  </div>

                  <h2 className="mt-4 text-3xl font-bold">
                    Job Recommendations
                  </h2>

                  <p className="mt-3 max-w-2xl leading-7 text-[#DDECF6]">
                    Explore job and internship roles
                    that align with your current skills
                    and career direction.
                  </p>

                </div>

                {jobs.top_role && (
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">

                    <p className="text-xs uppercase tracking-wider text-[#9BCBE5]">
                      Top Recommended Role
                    </p>

                    <p className="mt-2 text-lg font-bold">
                      {jobs.top_role}
                    </p>

                  </div>
                )}

              </div>

            </div>

            {/* RECOMMENDED ROLES */}

            <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm">

              <SectionTitle
                icon="🎯"
                title="Recommended Roles"
                subtitle="Roles that may suit your current profile"
              />

              <div className="mt-7 grid gap-5 lg:grid-cols-2">

                {jobs.recommended_roles &&
                jobs.recommended_roles.length >
                  0 ? (

                  jobs.recommended_roles.map(
                    (job, index) => {

                      const percentage =
                        clampPercentage(
                          job.match_percentage
                        );

                      return (
                        <div
                          key={index}
                          className="rounded-2xl border border-[#9BCBE5]/30 bg-[#F8FCFE] p-6 transition hover:-translate-y-1 hover:shadow-lg"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <p className="text-xs font-bold uppercase tracking-wider text-[#5BA3C6]">
                                {job.job_type ||
                                  "Opportunity"}
                              </p>

                              <h3 className="mt-2 text-xl font-bold text-[#184E6C]">
                                {job.job_title ||
                                  "Recommended Role"}
                              </h3>

                            </div>

                            <div className="rounded-xl bg-[#DDECF6] px-3 py-2 text-sm font-black text-[#184E6C]">
                              {percentage}%
                            </div>

                          </div>

                          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#DDECF6]">

                            <div
                              className="h-full rounded-full bg-[#387EA2]"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                          <p className="mt-5 text-sm leading-7 text-[#5B8298]">
                            {job.reason ||
                              "No explanation available."}
                          </p>

                          <div className="mt-5">

                            <p className="text-sm font-bold text-[#184E6C]">
                              Matching Skills
                            </p>

                            <TagList
                              items={
                                job.matching_skills
                              }
                            />

                          </div>

                          <div className="mt-5">

                            <p className="text-sm font-bold text-[#184E6C]">
                              Skills to Improve
                            </p>

                            <TagList
                              items={
                                job.missing_skills
                              }
                            />

                          </div>

                        </div>
                      );
                    }
                  )

                ) : (

                  <div className="lg:col-span-2">

                    <EmptyState
                      text="No job recommendations available."
                    />

                  </div>

                )}

              </div>

            </div>

            {/* APPLICATION ADVICE */}

            <NumberedListCard
              icon="📨"
              title="Application Advice"
              subtitle="Suggestions before applying"
              items={
                jobs.application_advice
              }
            />


            {/* =================================================
                SRI LANKA COMPANY RECOMMENDATIONS
            ================================================= */}

            <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <SectionTitle
                  icon="🇱🇰"
                  title="Sri Lanka Company Recommendations"
                  subtitle="Companies you may consider researching for suitable opportunities"
                />

                <div className="w-fit rounded-full bg-[#DDECF6] px-4 py-2 text-xs font-bold text-[#286B8E]">
                  📍{" "}
                  {companies.country ||
                    "Sri Lanka"}
                </div>

              </div>

              <div className="mt-7 grid gap-5 lg:grid-cols-2">

                {companies.recommended_companies &&
                companies.recommended_companies
                  .length > 0 ? (

                  companies.recommended_companies.map(
                    (company, index) => {

                      const percentage =
                        clampPercentage(
                          company.match_percentage
                        );

                      return (
                        <div
                          key={index}
                          className="rounded-3xl border border-[#9BCBE5]/30 bg-[#F8FCFE] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >

                          {/* COMPANY HEADER */}

                          <div className="flex items-start justify-between gap-4">

                            <div className="flex items-start gap-4">

                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#184E6C] font-black text-white">
                                {getInitials(
                                  company.company_name
                                )}
                              </div>

                              <div>

                                <h3 className="text-xl font-bold text-[#184E6C]">
                                  {company.company_name ||
                                    "Company"}
                                </h3>

                                {company.industry && (
                                  <p className="mt-1 text-sm text-[#5B8298]">
                                    {company.industry}
                                  </p>
                                )}

                              </div>

                            </div>

                            <div className="rounded-xl bg-[#DDECF6] px-3 py-2 text-sm font-black text-[#184E6C]">
                              {percentage}%
                            </div>

                          </div>

                          {/* MATCH BAR */}

                          <div className="mt-5">

                            <div className="mb-2 flex justify-between text-xs font-semibold text-[#6A8EA3]">

                              <span>
                                AI Match
                              </span>

                              <span>
                                {percentage}%
                              </span>

                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-[#DDECF6]">

                              <div
                                className="h-full rounded-full bg-[#387EA2]"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />

                            </div>

                          </div>

                          {/* COMPANY DETAILS */}

                          <div className="mt-5 grid gap-3 sm:grid-cols-2">

                            <CompanyInfo
                              icon="📍"
                              label="Location"
                              value={
                                company.location
                              }
                            />

                            <CompanyInfo
                              icon="💼"
                              label="Suitable Role"
                              value={
                                company.suitable_role
                              }
                            />

                            <CompanyInfo
                              icon="👤"
                              label="Level"
                              value={
                                company.employment_level
                              }
                            />

                            <CompanyInfo
                              icon="🏢"
                              label="Industry"
                              value={
                                company.industry
                              }
                            />

                          </div>

                          {/* REASON */}

                          {company.reason && (
                            <div className="mt-5 rounded-2xl bg-[#EAF4F9] p-4">

                              <p className="text-xs font-bold uppercase tracking-wider text-[#5BA3C6]">
                                Why it may suit you
                              </p>

                              <p className="mt-2 text-sm leading-6 text-[#5B8298]">
                                {company.reason}
                              </p>

                            </div>
                          )}

                          {/* MATCHING SKILLS */}

                          <div className="mt-5">

                            <p className="text-sm font-bold text-[#184E6C]">
                              Matching Skills
                            </p>

                            <TagList
                              items={
                                company.matching_skills
                              }
                            />

                          </div>

                          {/* IMPROVE SKILLS */}

                          <div className="mt-5">

                            <p className="text-sm font-bold text-[#184E6C]">
                              Skills to Improve
                            </p>

                            <TagList
                              items={
                                company.skills_to_improve
                              }
                            />

                          </div>

                        </div>
                      );
                    }
                  )

                ) : (

                  <div className="lg:col-span-2">

                    <EmptyState
                      text="No Sri Lanka company recommendations available. Run a new resume analysis to generate company matches."
                    />

                  </div>

                )}

              </div>

            </div>


            {/* COMPANY DISCLAIMER */}

            <div className="rounded-2xl border border-[#9BCBE5]/40 bg-[#F6FBFE] p-5">

              <div className="flex items-start gap-3">

                <span className="text-xl">
                  ℹ️
                </span>

                <div>

                  <h3 className="font-bold text-[#184E6C]">
                    About these recommendations
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#5B8298]">
                    Company and match suggestions are
                    AI-generated guidance. They do not
                    mean that a company currently has an
                    open vacancy or has evaluated your CV.
                    Check the company&apos;s official careers
                    information before applying.
                  </p>

                </div>

              </div>

            </div>


            {/* JOB TYPES + SEARCH ADVICE */}

            <div className="grid gap-6 lg:grid-cols-2">

              <StringListCard
                icon="🧑‍💻"
                title="Recommended Job Types"
                subtitle="Opportunity types worth searching for"
                items={
                  companies.recommended_job_types
                }
              />

              <NumberedListCard
                icon="🔎"
                title="Job Search Advice"
                subtitle="Tips for researching suitable opportunities"
                items={
                  companies.search_advice
                }
              />

            </div>

          </div>
        )}

      </section>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="mt-10 border-t border-[#9BCBE5]/30 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-7 text-sm text-[#5B8298] sm:flex-row sm:items-center">

          <p>
            © CarePlanix AI — AI-Powered Career Guidance
          </p>

          <Link
            href="/resume"
            className="font-semibold text-[#184E6C] transition hover:text-[#387EA2]"
          >
            Analyze another resume →
          </Link>

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
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#9BCBE5]/30 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDECF6] text-xl">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-xs font-semibold uppercase tracking-wider text-[#6A8EA3]">
            {label}
          </p>

          <p className="mt-2 break-words text-lg font-bold text-[#184E6C]">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#9BCBE5]/30 bg-[#F8FCFE] p-4">

      <p className="text-xs font-bold uppercase tracking-wider text-[#6A8EA3]">
        {label}
      </p>

      <p className="mt-2 break-words font-semibold text-[#184E6C]">
        {value || "Not available"}
      </p>

    </div>
  );
}


/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DDECF6] text-xl">
        {icon}
      </div>

      <div>

        <h2 className="text-xl font-bold text-[#184E6C]">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm leading-6 text-[#6A8EA3]">
            {subtitle}
          </p>
        )}

      </div>

    </div>
  );
}


/* =========================================================
   GENERIC LIST CARD

   Used for projects / experience because Gemini can return
   either strings or objects.
========================================================= */

function GenericListCard({
  icon,
  title,
  subtitle,
  items,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  items?: unknown[];
}) {
  return (
    <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm">

      <SectionTitle
        icon={icon}
        title={title}
        subtitle={subtitle}
      />

      <div className="mt-6 space-y-3">

        {items && items.length > 0 ? (

          items.map((item, index) => (

            <div
              key={index}
              className="rounded-2xl border border-[#9BCBE5]/30 bg-[#F8FCFE] p-4"
            >

              <p className="whitespace-pre-line text-sm leading-7 text-[#387EA2]">
                {stringifyValue(item)}
              </p>

            </div>

          ))

        ) : (

          <EmptyState
            text={`No ${title.toLowerCase()} information found.`}
          />

        )}

      </div>

    </div>
  );
}


/* =========================================================
   STRING LIST CARD
========================================================= */

function StringListCard({
  icon,
  title,
  subtitle,
  items,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  items?: string[];
}) {
  return (
    <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm">

      <SectionTitle
        icon={icon}
        title={title}
        subtitle={subtitle}
      />

      <div className="mt-6 space-y-3">

        {items && items.length > 0 ? (

          items.map((item, index) => (

            <div
              key={`${item}-${index}`}
              className="flex items-start gap-3 rounded-2xl border border-[#9BCBE5]/25 bg-[#F8FCFE] p-4"
            >

              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DDECF6] text-xs font-black text-[#184E6C]">
                ✓
              </div>

              <p className="break-words text-sm leading-6 text-[#387EA2]">
                {stringifyValue(item)}
              </p>

            </div>

          ))

        ) : (

          <EmptyState
            text={`No ${title.toLowerCase()} available.`}
          />

        )}

      </div>

    </div>
  );
}


/* =========================================================
   NUMBERED LIST CARD
========================================================= */

function NumberedListCard({
  icon,
  title,
  subtitle,
  items,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  items?: string[];
}) {
  return (
    <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-7 shadow-sm">

      <SectionTitle
        icon={icon}
        title={title}
        subtitle={subtitle}
      />

      <div className="mt-6 space-y-3">

        {items && items.length > 0 ? (

          items.map((item, index) => (

            <div
              key={index}
              className="flex items-start gap-4 rounded-2xl border border-[#9BCBE5]/25 bg-[#F8FCFE] p-4"
            >

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#184E6C] text-xs font-black text-white">
                {index + 1}
              </div>

              <p className="pt-1 text-sm leading-6 text-[#387EA2]">
                {stringifyValue(item)}
              </p>

            </div>

          ))

        ) : (

          <EmptyState
            text={`No ${title.toLowerCase()} available.`}
          />

        )}

      </div>

    </div>
  );
}


/* =========================================================
   SKILL CARD
========================================================= */

function SkillCard({
  icon,
  title,
  description,
  items,
  variant,
}: {
  icon: string;
  title: string;
  description: string;
  items?: string[];
  variant: "strong" | "medium" | "weak";
}) {
  const styles = {
    strong: {
      badge:
        "bg-emerald-50 text-emerald-700 border-emerald-100",
      dot:
        "bg-emerald-500",
    },

    medium: {
      badge:
        "bg-[#EAF4F9] text-[#286B8E] border-[#9BCBE5]/30",
      dot:
        "bg-[#5BA3C6]",
    },

    weak: {
      badge:
        "bg-amber-50 text-amber-700 border-amber-100",
      dot:
        "bg-amber-500",
    },
  };

  const selected =
    styles[variant];

  return (
    <div className="rounded-3xl border border-[#9BCBE5]/30 bg-white p-6 shadow-sm">

      <div className="text-3xl">
        {icon}
      </div>

      <h3 className="mt-4 text-xl font-bold text-[#184E6C]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#6A8EA3]">
        {description}
      </p>

      <div className="mt-5 space-y-3">

        {items && items.length > 0 ? (

          items.map((item, index) => (

            <div
              key={`${item}-${index}`}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${selected.badge}`}
            >

              <span
                className={`h-2 w-2 shrink-0 rounded-full ${selected.dot}`}
              />

              <span className="break-words">
                {stringifyValue(item)}
              </span>

            </div>

          ))

        ) : (

          <p className="rounded-xl bg-[#F8FCFE] p-4 text-sm text-[#6A8EA3]">
            No skills available.
          </p>

        )}

      </div>

    </div>
  );
}


/* =========================================================
   CIRCULAR PROGRESS
========================================================= */

function CircularProgress({
  value,
}: {
  value: number;
}) {
  const safeValue =
    clampPercentage(value);

  const degrees =
    safeValue * 3.6;

  return (
    <div
      className="relative flex h-32 w-32 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(
          #ffffff ${degrees}deg,
          rgba(255,255,255,0.18) ${degrees}deg
        )`,
      }}
    >

      <div className="flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full bg-[#286B8E]">

        <span className="text-3xl font-black text-white">
          {safeValue}%
        </span>

        <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#DDECF6]">
          Match
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   PRIORITY BADGE
========================================================= */

function PriorityBadge({
  priority,
}: {
  priority?: string;
}) {
  const normalized =
    priority?.toLowerCase() || "";

  let style =
    "border-[#9BCBE5]/30 bg-[#EAF4F9] text-[#286B8E]";

  if (normalized === "high") {
    style =
      "border-red-100 bg-red-50 text-red-600";
  }

  if (normalized === "medium") {
    style =
      "border-amber-100 bg-amber-50 text-amber-700";
  }

  if (normalized === "low") {
    style =
      "border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  return (
    <span
      className={`w-fit rounded-full border px-4 py-2 text-xs font-bold ${style}`}
    >
      {priority
        ? `${priority} Priority`
        : "Priority"}
    </span>
  );
}


/* =========================================================
   ROADMAP BLOCK
========================================================= */

function RoadmapBlock({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items?: string[];
}) {
  return (
    <div className="rounded-2xl border border-[#9BCBE5]/25 bg-white p-5">

      <h4 className="font-bold text-[#184E6C]">
        <span className="mr-2">
          {icon}
        </span>

        {title}
      </h4>

      <div className="mt-4 space-y-2">

        {items && items.length > 0 ? (

          items.map((item, index) => (

            <div
              key={index}
              className="flex items-start gap-2"
            >

              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#5BA3C6]" />

              <p className="text-sm leading-6 text-[#5B8298]">
                {stringifyValue(item)}
              </p>

            </div>

          ))

        ) : (

          <p className="text-sm text-[#8AA7B7]">
            No items available.
          </p>

        )}

      </div>

    </div>
  );
}


/* =========================================================
   COMPANY INFO
========================================================= */

function CompanyInfo({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-xl border border-[#9BCBE5]/25 bg-white p-4">

      <p className="text-xs font-bold uppercase tracking-wider text-[#6A8EA3]">
        {icon} {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-[#184E6C]">
        {value || "Not specified"}
      </p>

    </div>
  );
}


/* =========================================================
   TAG LIST
========================================================= */

function TagList({
  items,
}: {
  items?: string[];
}) {
  if (!items || items.length === 0) {
    return (
      <p className="mt-2 text-sm text-[#8AA7B7]">
        No information available.
      </p>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">

      {items.map((item, index) => (

        <span
          key={`${item}-${index}`}
          className="rounded-full border border-[#9BCBE5]/30 bg-[#EAF4F9] px-3 py-1.5 text-xs font-semibold text-[#286B8E]"
        >
          {stringifyValue(item)}
        </span>

      ))}

    </div>
  );
}


/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#9BCBE5]/50 bg-[#F8FCFE] p-6 text-center">

      <div className="text-2xl">
        📭
      </div>

      <p className="mt-3 text-sm text-[#6A8EA3]">
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   SAFE VALUE FORMATTER

   IMPORTANT:
   This prevents:
   "Objects are not valid as a React child"

   Example:
   {
      degree: "...",
      institution: "...",
      duration: "..."
   }

   will be converted safely instead of rendering
   the object directly.
========================================================= */

function stringifyValue(
  value: unknown
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        stringifyValue(item)
      )
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    const objectValue =
      value as Record<string, unknown>;

    return Object.entries(objectValue)
      .filter(
        ([, item]) =>
          item !== null &&
          item !== undefined &&
          item !== ""
      )
      .map(([key, item]) => {
        const readableKey = key
          .replace(/_/g, " ")
          .replace(
            /\b\w/g,
            (letter) =>
              letter.toUpperCase()
          );

        return `${readableKey}: ${stringifyValue(
          item
        )}`;
      })
      .join("\n");
  }

  return String(value);
}


/* =========================================================
   PERCENTAGE SAFETY
========================================================= */

function clampPercentage(
  value?: number
): number {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(Number(value))
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(Number(value))
    )
  );
}


/* =========================================================
   COMPANY INITIALS
========================================================= */

function getInitials(
  companyName?: string
): string {
  if (!companyName) {
    return "CO";
  }

  const words =
    companyName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (words.length === 0) {
    return "CO";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase();
}