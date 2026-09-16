from typing import TypedDict, Any
from langgraph.graph import StateGraph, END

from agents.master_agent import analyze_complete_career_profile


# =========================================================
# CAREPLANIX AI STATE
# =========================================================

class ResumeState(TypedDict, total=False):
    resume_text: str

    analysis: dict[str, Any]
    skill_analysis: dict[str, Any]
    career_analysis: dict[str, Any]
    skill_gap_analysis: dict[str, Any]
    roadmap: dict[str, Any]
    job_matches: dict[str, Any]
    company_matches: dict[str, Any]


# =========================================================
# MASTER AI NODE
# =========================================================

def master_analysis_node(state: ResumeState):

    resume_text = state.get(
        "resume_text",
        ""
    )

    if not resume_text.strip():
        raise ValueError(
            "Resume text is empty"
        )

    print(
        "CarePlanix AI: "
        "Starting complete career analysis..."
    )

    # -----------------------------------------------------
    # ONE GEMINI REQUEST
    # -----------------------------------------------------

    result = analyze_complete_career_profile(
        resume_text
    )

    if not isinstance(result, dict):
        raise ValueError(
            "Master AI returned an invalid response"
        )

    # -----------------------------------------------------
    # EXTRACT AI SECTIONS
    # -----------------------------------------------------

    analysis = result.get(
        "analysis",
        {}
    )

    skill_analysis = result.get(
        "skill_analysis",
        {}
    )

    career_analysis = result.get(
        "career_analysis",
        {}
    )

    skill_gap_analysis = result.get(
        "skill_gap_analysis",
        {}
    )

    roadmap = result.get(
        "roadmap",
        {}
    )

    job_matches = result.get(
        "job_matches",
        {}
    )

    company_matches = result.get(
        "company_matches",
        {}
    )

    # -----------------------------------------------------
    # VALIDATION
    # -----------------------------------------------------

    if not isinstance(
        analysis,
        dict
    ):
        analysis = {}

    if not isinstance(
        skill_analysis,
        dict
    ):
        skill_analysis = {}

    if not isinstance(
        career_analysis,
        dict
    ):
        career_analysis = {}

    if not isinstance(
        skill_gap_analysis,
        dict
    ):
        skill_gap_analysis = {}

    if not isinstance(
        roadmap,
        dict
    ):
        roadmap = {}

    if not isinstance(
        job_matches,
        dict
    ):
        job_matches = {}

    if not isinstance(
        company_matches,
        dict
    ):
        company_matches = {}

    print(
        "CarePlanix AI: "
        "Complete career analysis finished."
    )

    # -----------------------------------------------------
    # UPDATE LANGGRAPH STATE
    # -----------------------------------------------------

    return {
        "analysis":
            analysis,

        "skill_analysis":
            skill_analysis,

        "career_analysis":
            career_analysis,

        "skill_gap_analysis":
            skill_gap_analysis,

        "roadmap":
            roadmap,

        "job_matches":
            job_matches,

        "company_matches":
            company_matches,
    }


# =========================================================
# CREATE LANGGRAPH
# =========================================================

graph = StateGraph(
    ResumeState
)


# =========================================================
# ADD MASTER NODE
# =========================================================

graph.add_node(
    "master_analysis",
    master_analysis_node
)


# =========================================================
# ENTRY POINT
# =========================================================

graph.set_entry_point(
    "master_analysis"
)


# =========================================================
# MASTER NODE -> END
# =========================================================

graph.add_edge(
    "master_analysis",
    END
)


# =========================================================
# COMPILE GRAPH
# =========================================================

resume_graph = graph.compile()