"use client";

import {
  ChangeEvent,
  DragEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";


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

type ResumeResult = {
  filename: string;

  text_preview: string;

  analysis:
    Record<string, unknown>;

  skill_analysis:
    Record<string, unknown>;

  career_analysis:
    Record<string, unknown>;

  skill_gap_analysis:
    Record<string, unknown>;

  roadmap:
    Record<string, unknown>;

  job_matches:
    Record<string, unknown>;

  company_matches:
    Record<string, unknown>;

  history_id?: string;

  history_saved?: boolean;

  created_at?: string;
};


type ApiResponse =
  Partial<ResumeResult> & {
    detail?: string;
  };


/* =========================================================
   RESUME PAGE
========================================================= */

export default function ResumePage() {

  const router =
    useRouter();


  const [
    file,
    setFile,
  ] = useState<File | null>(
    null
  );


  const [
    dragging,
    setDragging,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /* =======================================================
     FILE VALIDATION
  ======================================================= */

  const validateFile = (
    selectedFile: File
  ) => {

    setError("");


    const isPdf =

      selectedFile.type ===
        "application/pdf"

      ||

      selectedFile.name
        .toLowerCase()
        .endsWith(".pdf");


    if (!isPdf) {

      setError(
        "Please upload a PDF file."
      );

      setFile(null);

      return;
    }


    const maxFileSize =
      10 * 1024 * 1024;


    if (
      selectedFile.size >
      maxFileSize
    ) {

      setError(
        "PDF must be smaller than 10 MB."
      );

      setFile(null);

      return;
    }


    if (
      selectedFile.size === 0
    ) {

      setError(
        "The selected PDF is empty."
      );

      setFile(null);

      return;
    }


    setFile(
      selectedFile
    );

  };


  /* =======================================================
     FILE INPUT
  ======================================================= */

  const handleFileChange = (
    event:
      ChangeEvent<HTMLInputElement>
  ) => {

    const selectedFile =
      event.target.files?.[0];


    if (selectedFile) {

      validateFile(
        selectedFile
      );

    }

  };


  /* =======================================================
     DRAG & DROP
  ======================================================= */

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
      event
        .dataTransfer
        .files?.[0];


    if (selectedFile) {

      validateFile(
        selectedFile
      );

    }

  };


  /* =======================================================
     ANALYZE RESUME
  ======================================================= */

  const analyzeResume =
    async () => {

      /* ---------------------------------------------------
         CHECK FILE
      --------------------------------------------------- */

      if (!file) {

        setError(
          "Please select your resume first."
        );

        return;

      }


      /* ---------------------------------------------------
         CHECK LOGIN TOKEN
      --------------------------------------------------- */

      const token =
        localStorage.getItem(
          "careplanix_access_token"
        );


      if (!token) {

        setError(
          "Please login before analyzing your resume."
        );


        window.setTimeout(
          () => {

            router.push(
              "/login"
            );

          },
          1000
        );


        return;

      }


      /* ---------------------------------------------------
         START LOADING
      --------------------------------------------------- */

      setLoading(true);

      setError("");


      /*
       * Prevent endless spinner.
       *
       * 120 seconds is enough for:
       * - Render wake-up
       * - PDF extraction
       * - Gemini analysis
       * - MongoDB history save
       */

      const controller =
        new AbortController();


      const timeoutId =
        window.setTimeout(
          () => {

            controller.abort();

          },
          120000
        );


      try {

        /* -------------------------------------------------
           CREATE FORM DATA
        ------------------------------------------------- */

        const formData =
          new FormData();


        /*
         * Browser sends the File directly.
         *
         * No FileReader.
         * No Base64 conversion.
         *
         * Better for mobile memory.
         */

        formData.append(
          "file",
          file
        );


        /* -------------------------------------------------
           SEND REQUEST
        ------------------------------------------------- */

        const response =
          await fetch(

            `${API_BASE_URL}/resume/upload`,

            {

              method:
                "POST",

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

              body:
                formData,

              signal:
                controller.signal,

            }

          );


        /* -------------------------------------------------
           READ RESPONSE SAFELY
        ------------------------------------------------- */

        let data:
          ApiResponse = {};


        const responseText =
          await response.text();


        if (responseText) {

          try {

            data =
              JSON.parse(
                responseText
              ) as ApiResponse;

          }

          catch {

            throw new Error(
              "The CarePlanix AI server returned an invalid response."
            );

          }

        }


        /* -------------------------------------------------
           INVALID TOKEN
        ------------------------------------------------- */

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


          setError(
            "Your login session has expired. Please login again."
          );


          window.setTimeout(
            () => {

              router.push(
                "/login"
              );

            },
            1000
          );


          return;

        }


        /* -------------------------------------------------
           QUOTA ERROR
        ------------------------------------------------- */

        if (
          response.status === 429
        ) {

          throw new Error(
            data.detail ||
            "CarePlanix AI usage limit has been reached. Please try again later."
          );

        }


        /* -------------------------------------------------
           GEMINI TEMPORARY ERROR
        ------------------------------------------------- */

        if (
          response.status === 503
        ) {

          throw new Error(
            data.detail ||
            "CarePlanix AI is temporarily busy. Please try again shortly."
          );

        }


        /* -------------------------------------------------
           OTHER BACKEND ERRORS
        ------------------------------------------------- */

        if (!response.ok) {

          throw new Error(
            data.detail ||
            `Resume analysis failed (${response.status}).`
          );

        }


        /* -------------------------------------------------
           VALIDATE SUCCESS RESULT
        ------------------------------------------------- */

        if (
          !data.filename ||
          !data.analysis ||
          !data.skill_analysis ||
          !data.career_analysis ||
          !data.skill_gap_analysis ||
          !data.roadmap ||
          !data.job_matches ||
          !data.company_matches
        ) {

          throw new Error(
            "CarePlanix AI returned an incomplete analysis."
          );

        }


        const result =
          data as ResumeResult;


        /* -------------------------------------------------
           SAVE RESULT TEMPORARILY
        ------------------------------------------------- */

        sessionStorage.setItem(

          "careplanix_resume_result",

          JSON.stringify(
            result
          )

        );


        /* -------------------------------------------------
           DEBUG HISTORY
        ------------------------------------------------- */

        if (
          result.history_saved &&
          result.history_id
        ) {

          console.log(
            "Analysis history saved:",
            result.history_id
          );

        }


        /* -------------------------------------------------
           OPEN RESULTS
        ------------------------------------------------- */

        router.push(
          "/results"
        );


      }

      catch (err) {

        /* -------------------------------------------------
           REQUEST TIMEOUT
        ------------------------------------------------- */

        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {

          setError(
            "The AI analysis took too long. Please try again."
          );

          return;

        }


        /* -------------------------------------------------
           NETWORK / CORS ERROR
        ------------------------------------------------- */

        if (
          err instanceof TypeError
        ) {

          setError(
            "Cannot connect to the CarePlanix AI server. Please try again."
          );

          return;

        }


        /* -------------------------------------------------
           NORMAL ERROR
        ------------------------------------------------- */

        if (
          err instanceof Error
        ) {

          setError(
            err.message
          );

          return;

        }


        /* -------------------------------------------------
           UNKNOWN ERROR
        ------------------------------------------------- */

        setError(
          "Something went wrong while analyzing your resume."
        );

      }

      finally {

        window.clearTimeout(
          timeoutId
        );


        setLoading(false);

      }

    };


  /* =========================================================
     UI
  ========================================================= */

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

      {/* ===================================================
          BACKGROUND
      =================================================== */}

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


      {/* ===================================================
          NAVBAR
      =================================================== */}

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

          {/* LOGO */}

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


      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

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

        {/* =================================================
            HEADER
        ================================================= */}

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

            Let our AI analyze your resume
            and provide personalized career
            insights, skill gaps,
            recommendations and a learning
            roadmap.

          </p>

        </div>


        {/* =================================================
            CONTENT GRID
        ================================================= */}

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

          {/* ===============================================
              UPLOAD CARD
          =============================================== */}

          <div
            className="
              glass
              rounded-3xl
              p-6
              sm:p-8
            "
          >

            {/* DROP AREA */}

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
                Drag & drop your PDF here
              </h2>


              <p
                className="
                  mt-3
                  text-[#DDECF6]/70
                "
              >
                or click below to browse
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

                  accept=".pdf,application/pdf"

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

                PDF files only{" "}
                •{" "}
                Maximum 10 MB

              </p>

            </div>


            {/* ===============================================
                SELECTED FILE
            =============================================== */}

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

                  disabled={loading}

                  onClick={() => {

                    setFile(null);

                    setError("");

                  }}

                  className="
                    text-sm
                    text-[#DDECF6]/60
                    transition
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Remove
                </button>

              </div>

            )}


            {/* ===============================================
                ERROR
            =============================================== */}

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


            {/* ===============================================
                ANALYZE BUTTON
            =============================================== */}

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

              {
                loading
                  ? "Analyzing your resume..."
                  : "Analyze My Resume →"
              }

            </button>


            {/* ===============================================
                LOADING
            =============================================== */}

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
                  CarePlanix AI is analyzing
                  your resume...
                </p>


                <p
                  className="
                    mt-2
                    text-xs
                    text-[#9BCBE5]/70
                  "
                >
                  This normally takes only
                  a short time.
                </p>

              </div>

            )}

          </div>


          {/* ===============================================
              WHY UPLOAD
          =============================================== */}

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

                [
                  "🏢",
                  "Sri Lanka company recommendations",
                ],

                [
                  "💾",
                  "Save analysis to your account",
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