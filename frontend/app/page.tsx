"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  /* =========================
     THEME
  ========================= */

  useEffect(() => {
    const savedTheme = localStorage.getItem("careplanix-theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }

    setThemeLoaded(true);
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    if (nextMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("careplanix-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("careplanix-theme", "light");
    }
  };

  /* =========================
     HERO FEATURE CARDS
  ========================= */

  const heroFeatures = [
    {
      icon: "📄",
      title: "Resume Analysis",
      description:
        "Extract insights from your resume and understand your strengths.",
    },
    {
      icon: "🧠",
      title: "Skill Gap Detection",
      description:
        "Discover the skills you need to improve for your target career.",
    },
    {
      icon: "🎯",
      title: "Career Suggestions",
      description:
        "Get AI-recommended career paths based on your profile.",
    },
    {
      icon: "🗺️",
      title: "Personalized Roadmap",
      description:
        "Follow a step-by-step learning and career growth plan.",
    },
  ];

  /* =========================
     MAIN FEATURES
  ========================= */

  const features = [
    {
      icon: "📄",
      title: "Resume Analysis",
      description:
        "AI analyzes your education, experience, projects and skills.",
    },
    {
      icon: "🎯",
      title: "Career Recommendations",
      description:
        "Discover career paths that match your skills and interests.",
    },
    {
      icon: "📊",
      title: "Skill Gap Analysis",
      description:
        "Identify missing skills and understand what to learn next.",
    },
    {
      icon: "🗺️",
      title: "Learning Roadmap",
      description:
        "Receive a personalized step-by-step learning roadmap.",
    },
    {
      icon: "💼",
      title: "Job Matching",
      description:
        "Find jobs and internships aligned with your career profile.",
    },
    {
      icon: "🤖",
      title: "AI Agent Workflow",
      description:
        "Specialized AI agents work together to guide your career journey.",
    },
  ];

  /* =========================
     HOW IT WORKS
  ========================= */

  const steps = [
    {
      number: "01",
      title: "Upload Resume",
      description: "Upload your CV or resume as a PDF.",
    },
    {
      number: "02",
      title: "AI Analysis",
      description:
        "Specialized AI agents analyze your career profile.",
    },
    {
      number: "03",
      title: "Get Your Roadmap",
      description:
        "Receive a personalized career and learning roadmap.",
    },
    {
      number: "04",
      title: "Find Opportunities",
      description:
        "Discover suitable jobs and internship opportunities.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#184E6C] text-white">
      {/* ==================================================
          HERO + MOUNTAIN BACKGROUND
      ================================================== */}

      <section
        id="home"
        className="mountain-bg relative min-h-screen overflow-hidden"
      >
        {/* Animated background glows */}

        <div className="glow glow-one" />
        <div className="glow glow-two" />

        {/* Particles */}

        <span className="particle particle-1" />
        <span className="particle particle-2" />
        <span className="particle particle-3" />
        <span className="particle particle-4" />
        <span className="particle particle-5" />

        {/* ==================================================
            NAVBAR
        ================================================== */}

        <nav className="relative z-30 border-b border-white/10 bg-[#184E6C]/20 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 sm:py-5">
            {/* Logo */}

            <Link href="#home" className="flex items-center gap-2 sm:gap-3">
              {/* CP Logo */}

              <div className="relative h-11 w-12 sm:h-12 sm:w-14">
                <span className="absolute left-0 top-0 text-3xl font-black leading-none text-[#5BA3C6] sm:text-4xl">
                  C
                </span>

                <span className="absolute bottom-0 right-0 text-2xl font-black leading-none text-[#9BCBE5] sm:text-3xl">
                  P
                </span>

                <span className="absolute right-0 top-0 text-xs text-[#DDECF6]">
                  ✦
                </span>
              </div>

              <div className="text-lg font-bold tracking-tight sm:text-2xl">
                CarePlanix
                <span className="ml-1 text-[#9BCBE5]">AI</span>
              </div>
            </Link>

            {/* Desktop Navigation */}

            <div className="hidden items-center gap-8 lg:flex">
              <a
                href="#home"
                className="text-sm font-medium text-white transition hover:text-[#9BCBE5]"
              >
                Home
              </a>

              <a
                href="#features"
                className="text-sm text-white/75 transition hover:text-[#9BCBE5]"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                className="text-sm text-white/75 transition hover:text-[#9BCBE5]"
              >
                How It Works
              </a>

              <a
                href="#about"
                className="text-sm text-white/75 transition hover:text-[#9BCBE5]"
              >
                About
              </a>

              <a
                href="#contact"
                className="text-sm text-white/75 transition hover:text-[#9BCBE5]"
              >
                Contact
              </a>
            </div>

            {/* Right side */}

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Dark Mode */}

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  darkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                title={
                  darkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                className="theme-toggle flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white/20"
              >
                {themeLoaded ? (darkMode ? "☀️" : "🌙") : "◐"}
              </button>

              {/* Get Started */}

              <Link
                href="/resume"
                className="primary-button hidden rounded-2xl px-6 py-3 text-sm font-bold sm:block"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </nav>

        {/* ==================================================
            HERO CONTENT
        ================================================== */}

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-85px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}

          <div>
            {/* Badge */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9BCBE5]/30 bg-[#387EA2]/30 px-4 py-2 text-sm text-[#DDECF6] backdrop-blur-xl">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#9BCBE5]" />

              AI-Powered Career Guidance
            </div>

            {/* Heading */}

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Your Career
              <br />

              Journey,{" "}

              <span className="text-[#9BCBE5]">Smarter</span>

              <br />

              with AI
            </h1>

            {/* Description */}

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#DDECF6]/90">
              Get personalized career insights, resume analysis, skill gap
              detection and a roadmap to your dream career.
            </p>

            {/* Buttons */}

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/resume"
                className="primary-button rounded-2xl px-8 py-4 text-center font-bold"
              >
                Analyze My Resume →
              </Link>

              <a
                href="#features"
                className="rounded-2xl border border-[#DDECF6]/50 bg-white/5 px-8 py-4 text-center font-semibold backdrop-blur-lg transition hover:-translate-y-1 hover:bg-white/10"
              >
                Learn More
              </a>
            </div>

            {/* Stats */}

            <div className="mt-14 flex flex-wrap gap-7 sm:gap-12">
              <div>
                <p className="text-3xl font-bold text-[#DDECF6]">6</p>

                <p className="mt-1 text-sm text-[#9BCBE5]">
                  AI Agents
                </p>
              </div>

              <div className="border-l border-white/20 pl-7 sm:pl-8">
                <p className="text-3xl font-bold text-[#DDECF6]">
                  360°
                </p>

                <p className="mt-1 text-sm text-[#9BCBE5]">
                  Career Analysis
                </p>
              </div>

              <div className="border-l border-white/20 pl-7 sm:pl-8">
                <p className="text-3xl font-bold text-[#DDECF6]">
                  AI
                </p>

                <p className="mt-1 text-sm text-[#9BCBE5]">
                  Personalized
                </p>
              </div>
            </div>

            <p className="mt-12 text-sm tracking-wide text-[#DDECF6]/80">
              Plan &nbsp; • &nbsp; Learn &nbsp; • &nbsp; Grow
              &nbsp; • &nbsp; Succeed
            </p>
          </div>

          {/* ==================================================
              RIGHT FEATURE CARDS
          ================================================== */}

          <div className="mx-auto w-full max-w-lg">
            <div className="space-y-4">
              {heroFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="glass-card float-card flex items-center gap-5 rounded-2xl p-5"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#9BCBE5]/20 text-2xl">
                    {feature.icon}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white sm:text-lg">
                      {feature.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#DDECF6]/80">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass mt-6 rounded-2xl p-5 text-center text-sm text-[#DDECF6]">
              ✦ A better career begins with a clearer direction.
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          FEATURES
      ================================================== */}

      <section
        id="features"
        className="light-section relative overflow-hidden"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="section-badge inline-flex rounded-full bg-[#9BCBE5]/45 px-5 py-2 text-sm font-semibold text-[#184E6C]">
              Our Features
            </div>

            <h2 className="section-title mt-5 text-3xl font-bold text-[#184E6C] sm:text-5xl">
              Everything You Need for a Brighter Future
            </h2>

            <p className="section-description mx-auto mt-5 max-w-2xl leading-7 text-[#387EA2]">
              Comprehensive AI-powered tools designed to guide you at
              every stage of your career journey.
            </p>
          </div>

          {/* Feature Grid */}

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="feature-light-card group rounded-3xl border border-[#9BCBE5]/60 bg-white/65 p-7 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5BA3C6] to-[#387EA2] text-2xl shadow-lg">
                  {feature.icon}
                </div>

                <h3 className="feature-title mt-6 text-xl font-bold text-[#184E6C]">
                  {feature.title}
                </h3>

                <p className="feature-description mt-3 leading-7 text-[#387EA2]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          HOW IT WORKS
      ================================================== */}

      <section
        id="how-it-works"
        className="relative overflow-hidden bg-gradient-to-b from-[#184E6C] to-[#0E3A57]"
      >
        <div className="glow glow-two" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9BCBE5]">
              Simple Process
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
              How CarePlanix AI Works
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-[#DDECF6]/75">
              From your resume to your next career opportunity,
              CarePlanix AI guides you step by step.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="glass-card rounded-3xl p-7 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#9BCBE5]/20 text-xl font-bold text-[#DDECF6]">
                  {step.number}
                </div>

                <h3 className="mt-6 text-lg font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#DDECF6]/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          ABOUT
      ================================================== */}

      <section id="about" className="light-section">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
          {/* Left */}

          <div>
            <p className="section-label text-sm font-bold uppercase tracking-[0.2em] text-[#387EA2]">
              About CarePlanix AI
            </p>

            <h2 className="section-title mt-4 text-4xl font-bold leading-tight text-[#184E6C] sm:text-5xl">
              Empowering Careers
              <br />
              with Artificial Intelligence
            </h2>

            <p className="section-description mt-6 max-w-xl leading-8 text-[#387EA2]">
              CarePlanix AI helps users understand their skills,
              discover suitable career paths and create personalized
              learning roadmaps using intelligent AI agents.
            </p>
          </div>

          {/* Right */}

          <div className="about-card rounded-3xl bg-gradient-to-br from-[#184E6C] to-[#387EA2] p-8 text-white shadow-2xl">
            <p className="text-2xl font-semibold leading-relaxed">
              “A better career begins with a clearer direction.”
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold text-[#9BCBE5]">
                  6
                </p>

                <p className="mt-1 text-xs text-[#DDECF6]">
                  AI Agents
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-[#9BCBE5]">
                  1
                </p>

                <p className="mt-1 text-xs text-[#DDECF6]">
                  Career Platform
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-[#9BCBE5]">
                  360°
                </p>

                <p className="mt-1 text-xs text-[#DDECF6]">
                  Guidance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          CONTACT / CTA
      ================================================== */}

      <section
        id="contact"
        className="relative overflow-hidden bg-[#184E6C]"
      >
        <div className="glow glow-one" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#9BCBE5]/20 text-3xl">
            🚀
          </div>

          <h2 className="mt-7 text-3xl font-bold sm:text-5xl">
            Ready to Discover Your Career Path?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#DDECF6]/80">
            Let CarePlanix AI analyze your profile and create a
            personalized roadmap for your future.
          </p>

          <Link
            href="/resume"
            className="primary-button mt-9 inline-block rounded-2xl px-9 py-4 font-bold"
          >
            Start Your Journey →
          </Link>
        </div>
      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="border-t border-white/10 bg-[#0A334D]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 px-6 py-10 md:flex-row">
          {/* Logo */}

          <div>
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-12">
                <span className="absolute left-0 text-3xl font-black text-[#5BA3C6]">
                  C
                </span>

                <span className="absolute bottom-0 right-0 text-2xl font-black text-[#9BCBE5]">
                  P
                </span>

                <span className="absolute right-0 top-0 text-[9px] text-[#DDECF6]">
                  ✦
                </span>
              </div>

              <span className="text-lg font-bold">
                CarePlanix
                <span className="ml-1 text-[#9BCBE5]">AI</span>
              </span>
            </div>

            <p className="mt-3 text-sm text-[#9BCBE5]">
              Plan • Learn • Grow • Succeed
            </p>
          </div>

          {/* Footer links */}

          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#DDECF6]/70">
            <a
              href="#home"
              className="transition hover:text-white"
            >
              Home
            </a>

            <a
              href="#features"
              className="transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-white"
            >
              How It Works
            </a>

            <a
              href="#about"
              className="transition hover:text-white"
            >
              About
            </a>

            <a
              href="#contact"
              className="transition hover:text-white"
            >
              Contact
            </a>
          </div>

          <p className="text-sm text-[#9BCBE5]/70">
            © 2026 CarePlanix AI
          </p>
        </div>
      </footer>
    </main>
  );
}