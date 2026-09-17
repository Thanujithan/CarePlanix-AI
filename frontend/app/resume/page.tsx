"use client";

import {
  ChangeEvent,
  DragEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";


type ResumeResult = {
  filename: string;
  text_preview: string;

  analysis: string;
  skill_analysis: string;
  career_analysis: string;
  skill_gap_analysis: string;
  roadmap: string;
  job_matches: string;
};


export default function ResumePage() {

  const router = useRouter();

  const [file, setFile] =
    useState<File | null>(null);

  const [dragging, setDragging] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");



  /* =========================
     FILE VALIDATION
  ========================= */

  const validateFile = (
    selectedFile: File
  ) => {

    setError("");

    if (
      selectedFile.type !==
        "application/pdf" &&
      !selectedFile.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {

      setError(
        "Please upload a PDF file."
      );

      setFile(null);

      return;
    }


    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {

      setError(
        "PDF must be smaller than 10 MB."
      );

      setFile(null);

      return;
    }


    setFile(selectedFile);
  };



  /* =========================
     FILE INPUT
  ========================= */

  const handleFileChange = (
    event:
      ChangeEvent<HTMLInputElement>
  ) => {

    const selectedFile =
      event.target.files?.[0];

    if (selectedFile) {
      validateFile(selectedFile);
    }
  };



  /* =========================
     DRAG & DROP
  ========================= */

  const handleDragOver = (
    event:
      DragEvent<HTMLDivElement>
  ) => {

    event.preventDefault();

    setDragging(true);
  };


  const handleDragLeave = () => {
    setDragging(false);
  };


  const handleDrop = (
    event:
      DragEvent<HTMLDivElement>
  ) => {

    event.preventDefault();

    setDragging(false);

    const selectedFile =
      event.dataTransfer
        .files?.[0];

    if (selectedFile) {
      validateFile(selectedFile);
    }
  };



  /* =========================
     ANALYZE RESUME
  ========================= */

  const analyzeResume =
    async () => {

      if (!file) {

        setError(
          "Please select your resume first."
        );

        return;
      }


      setLoading(true);
      setError("");


      try {

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );


        const response =
          await fetch(
            "http://127.0.0.1:8000/resume/upload",
            {
              method: "POST",
              body: formData,
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.detail ||
            "Resume analysis failed."
          );
        }


        const result:
          ResumeResult = data;


        /*
          Save result temporarily.

          Results page will read
          this data.
        */

        sessionStorage.setItem(
          "careplanix_resume_result",
          JSON.stringify(result)
        );


        /*
          Open Results Dashboard
        */

        router.push(
          "/results"
        );


      } catch (err) {

        if (
          err instanceof TypeError
        ) {

          setError(
            "Cannot connect to the CarePlanix AI backend. Make sure FastAPI is running."
          );

        } else if (
          err instanceof Error
        ) {

          setError(
            err.message
          );

        } else {

          setError(
            "Something went wrong while analyzing your resume."
          );
        }

      } finally {

        setLoading(false);
      }
    };



  return (

    <main
      className="
        mountain-bg
        relative
        min-h-screen
        overflow-hidden
        text-white
      "
    >

      {/* =====================
          BACKGROUND
      ===================== */}

      <div
        className="
          glow
          glow-one
        "
      />

      <div
        className="
          glow
          glow-two
        "
      />


      <span
        className="
          particle
          particle-1
        "
      />

      <span
        className="
          particle
          particle-2
        "
      />

      <span
        className="
          particle
          particle-3
        "
      />



      {/* =====================
          NAVBAR
      ===================== */}

      <nav
        className="
          relative
          z-30
          border-b
          border-white/10
          bg-[#184E6C]/20
          backdrop-blur-xl
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-6
            py-5
          "
        >

          {/* Logo */}

          <Link
            href="/"
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                relative
                h-11
                w-12
              "
            >

              <span
                className="
                  absolute
                  left-0
                  top-0
                  text-3xl
                  font-black
                  text-[#5BA3C6]
                "
              >
                C
              </span>


              <span
                className="
                  absolute
                  bottom-0
                  right-0
                  text-2xl
                  font-black
                  text-[#9BCBE5]
                "
              >
                P
              </span>


              <span
                className="
                  absolute
                  right-0
                  top-0
                  text-[9px]
                  text-[#DDECF6]
                "
              >
                ✦
              </span>

            </div>


            <span
              className="
                text-xl
                font-bold
              "
            >

              CarePlanix

              <span
                className="
                  ml-1
                  text-[#9BCBE5]
                "
              >
                AI
              </span>

            </span>

          </Link>



          <Link
            href="/"
            className="
              rounded-xl
              border
              border-white/20
              bg-white/10
              px-5
              py-2.5
              text-sm
              font-semibold
              backdrop-blur-xl
              transition
              hover:bg-white/20
            "
          >

            ← Back Home

          </Link>

        </div>

      </nav>



      {/* =====================
          MAIN CONTENT
      ===================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-6
          py-16
          lg:py-20
        "
      >


        {/* Header */}

        <div
          className="
            mx-auto
            max-w-3xl
            text-center
          "
        >

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#9BCBE5]/30
              bg-[#387EA2]/30
              px-4
              py-2
              text-sm
              text-[#DDECF6]
              backdrop-blur-xl
            "
          >

            <span
              className="
                h-2
                w-2
                animate-pulse
                rounded-full
                bg-[#9BCBE5]
              "
            />

            Resume Analysis

          </div>



          <h1
            className="
              mt-6
              text-4xl
              font-bold
              tracking-tight
              sm:text-5xl
              lg:text-6xl
            "
          >

            Upload Your

            <span
              className="
                ml-3
                text-[#9BCBE5]
              "
            >
              Resume
            </span>

          </h1>



          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-lg
              leading-8
              text-[#DDECF6]/80
            "
          >

            Let our AI analyze your
            resume and provide
            personalized career
            insights, skill gaps,
            recommendations and a
            learning roadmap.

          </p>

        </div>



        {/* =====================
            CONTENT GRID
        ===================== */}

        <div
          className="
            mx-auto
            mt-12
            grid
            max-w-5xl
            gap-6
            lg:grid-cols-[1.5fr_0.7fr]
          "
        >


          {/* =================
              UPLOAD CARD
          ================= */}

          <div
            className="
              glass
              rounded-3xl
              p-6
              sm:p-8
            "
          >


            {/* Drop Area */}

            <div
              onDragOver={
                handleDragOver
              }

              onDragLeave={
                handleDragLeave
              }

              onDrop={
                handleDrop
              }

              className={`
                rounded-3xl
                border-2
                border-dashed
                p-10
                text-center
                transition
                duration-300
                sm:p-14

                ${
                  dragging
                    ? `
                      scale-[1.02]
                      border-[#DDECF6]
                      bg-[#9BCBE5]/20
                    `
                    : `
                      border-[#9BCBE5]/40
                      bg-[#184E6C]/20
                    `
                }
              `}
            >


              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-3xl
                  bg-[#9BCBE5]/20
                  text-4xl
                "
              >

                📄

              </div>



              <h2
                className="
                  mt-6
                  text-2xl
                  font-bold
                "
              >

                Drag & drop
                your PDF here

              </h2>



              <p
                className="
                  mt-3
                  text-[#DDECF6]/70
                "
              >

                or click below
                to browse

              </p>



              <label
                className="
                  primary-button
                  mt-7
                  inline-block
                  cursor-pointer
                  rounded-2xl
                  px-7
                  py-3
                  font-bold
                "
              >

                Browse Resume


                <input
                  type="file"
                  accept="
                    .pdf,
                    application/pdf
                  "
                  onChange={
                    handleFileChange
                  }
                  className="hidden"
                />

              </label>



              <p
                className="
                  mt-4
                  text-xs
                  text-[#DDECF6]/50
                "
              >

                PDF files only
                • Maximum 10 MB

              </p>

            </div>



            {/* =================
                SELECTED FILE
            ================= */}

            {file && (

              <div
                className="
                  mt-6
                  flex
                  flex-col
                  gap-4
                  rounded-2xl
                  border
                  border-[#9BCBE5]/20
                  bg-[#184E6C]/30
                  p-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >


                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#9BCBE5]/20
                      text-xl
                    "
                  >

                    📄

                  </div>


                  <div>

                    <p
                      className="
                        max-w-[260px]
                        truncate
                        font-semibold
                        sm:max-w-md
                      "
                    >

                      {file.name}

                    </p>


                    <p
                      className="
                        mt-1
                        text-xs
                        text-[#9BCBE5]
                      "
                    >

                      {(
                        file.size /
                        1024 /
                        1024
                      ).toFixed(2)}

                      {" MB"}

                    </p>

                  </div>

                </div>



                <button
                  type="button"

                  onClick={() => {

                    setFile(null);

                    setError("");

                  }}

                  className="
                    text-sm
                    text-[#DDECF6]/60
                    transition
                    hover:text-white
                  "
                >

                  Remove

                </button>

              </div>

            )}



            {/* =================
                ERROR
            ================= */}

            {error && (

              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-red-300/20
                  bg-red-500/10
                  p-4
                  text-sm
                  text-red-100
                "
              >

                ⚠️ {error}

              </div>

            )}



            {/* =================
                ANALYZE BUTTON
            ================= */}

            <button
              type="button"

              onClick={
                analyzeResume
              }

              disabled={
                !file ||
                loading
              }

              className="
                primary-button
                mt-7
                w-full
                rounded-2xl
                px-8
                py-4
                text-lg
                font-bold
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >

              {loading
                ? "CarePlanix AI is analyzing..."
                : "Analyze My Resume →"
              }

            </button>



            {/* Loading */}

            {loading && (

              <div
                className="
                  mt-6
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    h-8
                    w-8
                    animate-spin
                    rounded-full
                    border-4
                    border-[#9BCBE5]/30
                    border-t-[#9BCBE5]
                  "
                />


                <p
                  className="
                    mt-4
                    text-sm
                    text-[#DDECF6]/70
                  "
                >

                  Our AI agents are
                  analyzing your
                  resume...

                </p>


                <p
                  className="
                    mt-2
                    text-xs
                    text-[#9BCBE5]/70
                  "
                >

                  This may take a
                  little time.

                </p>

              </div>

            )}

          </div>



          {/* =================
              WHY UPLOAD
          ================= */}

          <div
            className="
              glass-card
              h-fit
              rounded-3xl
              p-7
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-[#9BCBE5]/20
                text-2xl
              "
            >

              ✦

            </div>


            <h3
              className="
                mt-5
                text-xl
                font-bold
              "
            >

              Why Upload?

            </h3>


            <div
              className="
                mt-6
                space-y-5
              "
            >


              {[
                [
                  "📄",
                  "Detailed resume analysis",
                ],

                [
                  "🧠",
                  "Discover your skills",
                ],

                [
                  "📊",
                  "Identify skill gaps",
                ],

                [
                  "🎯",
                  "Career recommendations",
                ],

                [
                  "🗺️",
                  "Personalized roadmap",
                ],

                [
                  "💼",
                  "Job matches",
                ],

              ].map(
                ([icon, text]) => (

                  <div
                    key={text}
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#9BCBE5]/15
                      "
                    >

                      {icon}

                    </div>


                    <p
                      className="
                        text-sm
                        text-[#DDECF6]/80
                      "
                    >

                      {text}

                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </section>

    </main>

  );
}