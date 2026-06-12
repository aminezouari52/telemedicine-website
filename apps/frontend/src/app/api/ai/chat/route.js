import { stepCountIs, streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const tools = {
  symptom_checker: {
    description: `Analyze patient symptoms and return a structured triage assessment.
Call this tool IMMEDIATELY whenever a patient asks about symptoms, health assessment, or triage — even if no specific symptoms are mentioned yet.
Extract whatever symptom details are available from the conversation so far and pass them in. If the patient hasn't provided details yet, call the tool with an empty symptoms array to initiate the structured triage flow.`,
    parameters: z.object({
      symptoms: z
        .array(
          z.object({
            name: z
              .string()
              .describe(
                "Name of the symptom (e.g., headache, chest pain, fever)",
              ),
            location: z
              .string()
              .optional()
              .describe("Body location where symptom is felt"),
            duration: z
              .string()
              .optional()
              .describe("How long the symptom has been present"),
            severity: z
              .enum(["mild", "moderate", "severe"])
              .optional()
              .describe("Patient-reported severity"),
            quality: z
              .string()
              .optional()
              .describe(
                "Character/quality (e.g., sharp, dull, burning, throbbing)",
              ),
            aggravating_factors: z
              .string()
              .optional()
              .describe("What makes it worse"),
            relieving_factors: z
              .string()
              .optional()
              .describe("What makes it better"),
          }),
        )
        .optional()
        .default([])
        .describe(
          "List of reported symptoms — pass an empty array if no details given yet",
        ),
      patient_age: z.number().optional().describe("Patient age if mentioned"),
      patient_gender: z
        .string()
        .optional()
        .describe("Patient gender if mentioned"),
      chronic_conditions: z
        .array(z.string())
        .optional()
        .describe("Pre-existing medical conditions"),
      medications: z
        .array(z.string())
        .optional()
        .describe("Current medications"),
    }),
    execute: async ({
      symptoms = [],
      patient_age,
      patient_gender,
      chronic_conditions,
      medications,
    }) => {
      const EMERGENCY_KEYWORDS = [
        "chest pain",
        "chest pressure",
        "chest tightness",
        "difficulty breathing",
        "shortness of breath",
        "cannot breathe",
        "severe bleeding",
        "uncontrolled bleeding",
        "stroke",
        "facial drooping",
        "slurred speech",
        "arm weakness",
        "unconscious",
        "passed out",
        "fainted",
        "severe allergic reaction",
        "anaphylaxis",
        "swollen tongue",
        "throat closing",
        "head injury",
        "concussion",
        "poisoning",
        "overdose",
        "severe burn",
        "third degree burn",
        "seizure",
        "convulsion",
        "suicidal",
        "self-harm",
        "suicide",
        "severe abdominal pain",
        "blood in vomit",
        "blood in stool",
        "loss of vision",
        "sudden blindness",
        "testicular torsion",
        "ectopic pregnancy",
      ];

      const symptomNames = symptoms.map((s) => s.name.toLowerCase());
      const allText =
        symptomNames.join(" ") +
        " " +
        symptoms
          .map((s) => `${s.quality || ""} ${s.aggravating_factors || ""}`)
          .join(" ");

      const foundEmergencies = EMERGENCY_KEYWORDS.filter((ek) =>
        allText.includes(ek),
      );
      const hasSevere = symptoms.some((s) => s.severity === "severe");
      const hasModerate = symptoms.some((s) => s.severity === "moderate");
      const symptomCount = symptoms.length;

      let triageLevel;
      let recommendation;

      if (foundEmergencies.length > 0) {
        triageLevel = "emergency";
        recommendation =
          "IMMEDIATE EMERGENCY — Patient should call emergency services (911 or local equivalent) immediately. Do NOT wait for a doctor's appointment.";
      } else if (hasSevere) {
        triageLevel = "urgent";
        recommendation =
          "URGENT — Patient should seek medical attention within 24 hours. Consider urgent care center or emergency department.";
      } else if (hasModerate && symptomCount >= 2) {
        triageLevel = "non-urgent";
        recommendation =
          "NON-URGENT — Patient should schedule an appointment with their primary care physician within a few days.";
      } else if (symptomCount > 0) {
        triageLevel = "self-care";
        recommendation =
          "SELF-CARE — Provide home care advice and monitoring guidance. Advise patient to follow up if symptoms worsen or persist beyond 7 days.";
      } else {
        triageLevel = "information";
        recommendation =
          "INFORMATION — No specific symptoms detected. Provide general health information.";
      }

      const bodySystemMap = {
        head: ["headache", "dizziness", "migraine", "facial pain"],
        respiratory: [
          "cough",
          "shortness of breath",
          "wheezing",
          "sore throat",
          "congestion",
          "difficulty breathing",
        ],
        cardiovascular: [
          "chest pain",
          "palpitations",
          "rapid heart rate",
          "chest pressure",
        ],
        gastrointestinal: [
          "nausea",
          "vomiting",
          "diarrhea",
          "abdominal pain",
          "constipation",
          "bloating",
          "blood in stool",
        ],
        musculoskeletal: [
          "pain",
          "swelling",
          "muscle ache",
          "joint pain",
          "back pain",
          "neck pain",
        ],
        neurological: [
          "numbness",
          "tingling",
          "weakness",
          "seizure",
          "tremor",
          "confusion",
          "loss of vision",
        ],
        dermatological: [
          "rash",
          "itching",
          "swelling",
          "redness",
          "lesion",
          "hives",
        ],
        urinary: [
          "burning urination",
          "frequent urination",
          "blood in urine",
          "flank pain",
        ],
        psychological: [
          "anxiety",
          "depression",
          "insomnia",
          "panic",
          "suicidal",
        ],
        ent: [
          "ear pain",
          "hearing loss",
          "tinnitus",
          "runny nose",
          "sinus pain",
        ],
        endocrine: [
          "fatigue",
          "weight change",
          "temperature intolerance",
          "excessive thirst",
        ],
      };

      const affectedSystems = [];
      for (const [system, keywords] of Object.entries(bodySystemMap)) {
        if (keywords.some((kw) => allText.includes(kw))) {
          affectedSystems.push(system);
        }
      }

      return {
        triage_level: triageLevel,
        recommendation,
        emergency: foundEmergencies.length > 0,
        red_flags: foundEmergencies,
        symptom_count: symptomCount,
        severity_distribution: {
          severe: symptoms.filter((s) => s.severity === "severe").length,
          moderate: symptoms.filter((s) => s.severity === "moderate").length,
          mild: symptoms.filter((s) => s.severity === "mild").length,
          unspecified: symptoms.filter((s) => !s.severity).length,
        },
        affected_body_systems: affectedSystems,
        relevant_patient_factors: {
          age: patient_age || null,
          gender: patient_gender || null,
          chronic_conditions: chronic_conditions || [],
          medications: medications || [],
        },
      };
    },
  },
  lab_analyzer: {
    description: `Analyze laboratory test results and explain their clinical significance.
Use this when a patient provides lab results, blood work, urinalysis, or other diagnostic test values.
Extract test names and values from the conversation or uploaded PDF content.`,
    parameters: z.object({
      tests: z
        .array(
          z.object({
            name: z
              .string()
              .describe(
                "Name of the test (e.g., WBC, Hemoglobin, Glucose, TSH)",
              ),
            value: z
              .string()
              .describe("The test result value with units if available"),
            reference_range: z
              .string()
              .optional()
              .describe("Normal reference range"),
            flag: z
              .enum(["normal", "high", "low", "critical_high", "critical_low"])
              .optional()
              .describe("Whether the result deviates from normal range"),
          }),
        )
        .describe("List of laboratory tests with their results"),
      patient_context: z
        .object({
          age: z.number().optional(),
          gender: z.string().optional(),
          fasting: z
            .boolean()
            .optional()
            .describe("Whether the patient was fasting"),
          known_conditions: z.array(z.string()).optional(),
        })
        .optional(),
    }),
    execute: async ({ tests }) => {
      const abnormalTests = tests.filter((t) => t.flag && t.flag !== "normal");
      const criticalTests = tests.filter(
        (t) => t.flag === "critical_high" || t.flag === "critical_low",
      );

      return {
        summary: `${tests.length} test(s) analyzed. ${abnormalTests.length} abnormal, ${criticalTests.length} critical.`,
        tests,
        abnormal_count: abnormalTests.length,
        critical_count: criticalTests.length,
        recommendation:
          criticalTests.length > 0
            ? "URGENT — Critical values detected. Patient should contact their doctor or visit the ER immediately."
            : abnormalTests.length > 0
              ? "FOLLOW-UP — Abnormal results found. Patient should review these with their healthcare provider."
              : "All results appear within normal ranges. No immediate action needed.",
      };
    },
  },
  medication_info: {
    description: `Provide information about medications including usage, dosage, side effects, and drug interactions.
Use this when a patient asks about a specific medication, drug interactions, side effects, or how to take their medicine.
Also use when a patient provides a list of their current medications.`,
    parameters: z.object({
      medications: z
        .array(
          z.object({
            name: z.string().describe("Medication name (brand or generic)"),
            dosage: z
              .string()
              .optional()
              .describe("Prescribed dosage (e.g., 500mg, 10mg)"),
            frequency: z
              .string()
              .optional()
              .describe("How often taken (e.g., twice daily, once daily)"),
            route: z
              .string()
              .optional()
              .describe(
                "Administration route (e.g., oral, topical, injection)",
              ),
            purpose: z
              .string()
              .optional()
              .describe("Why the patient is taking this medication"),
          }),
        )
        .describe("List of medications to analyze"),
      query_type: z
        .enum([
          "general_info",
          "interaction_check",
          "side_effects",
          "usage_guidance",
        ])
        .optional()
        .describe("Type of medication information requested"),
    }),
    execute: async ({ medications }) => {
      const categories = {
        antibiotic: [
          "amoxicillin",
          "azithromycin",
          "cephalexin",
          "doxycycline",
          "ciprofloxacin",
        ],
        antihypertensive: [
          "lisinopril",
          "amlodipine",
          "metoprolol",
          "losartan",
          "hydrochlorothiazide",
        ],
        antidiabetic: [
          "metformin",
          "insulin",
          "glipizide",
          "sitagliptin",
          "empagliflozin",
        ],
        pain_reliever: [
          "ibuprofen",
          "acetaminophen",
          "naproxen",
          "tramadol",
          "morphine",
        ],
        anticoagulant: [
          "warfarin",
          "apixaban",
          "rivaroxaban",
          "heparin",
          "enoxaparin",
        ],
        antidepressant: [
          "sertraline",
          "fluoxetine",
          "escitalopram",
          "venlafaxine",
          "bupropion",
        ],
      };

      const categorized = medications.map((med) => {
        const name = med.name.toLowerCase();
        const cat = Object.entries(categories).find(([, drugs]) =>
          drugs.some((d) => name.includes(d)),
        );
        return { ...med, category: cat ? cat[0] : "other" };
      });

      return {
        medications: categorized,
        count: medications.length,
        potential_interactions:
          medications.length > 1
            ? "Multiple medications detected. Patient should consult their pharmacist or doctor for a full interaction review."
            : null,
        general_advice:
          "Always take medications as prescribed. Do not stop or change dosage without consulting your doctor. Report any unusual side effects immediately.",
      };
    },
  },
  vital_signs: {
    description: `Interpret vital sign measurements and assess their clinical significance.
Use this when a patient provides vital sign readings such as blood pressure, heart rate, temperature, respiratory rate, or oxygen saturation.
Compare values against standard ranges and flag abnormalities.`,
    parameters: z.object({
      blood_pressure: z
        .object({
          systolic: z
            .number()
            .optional()
            .describe("Systolic blood pressure in mmHg"),
          diastolic: z
            .number()
            .optional()
            .describe("Diastolic blood pressure in mmHg"),
        })
        .optional()
        .describe("Blood pressure reading"),
      heart_rate: z
        .number()
        .optional()
        .describe("Heart rate in beats per minute"),
      temperature: z
        .number()
        .optional()
        .describe("Body temperature in Celsius"),
      respiratory_rate: z
        .number()
        .optional()
        .describe("Respiratory rate in breaths per minute"),
      oxygen_saturation: z
        .number()
        .optional()
        .describe("Oxygen saturation as a percentage (0-100)"),
      weight: z.number().optional().describe("Weight in kg"),
      height: z.number().optional().describe("Height in cm"),
      patient_context: z
        .object({
          age: z.number().optional(),
          activity_level: z
            .string()
            .optional()
            .describe("e.g., sedentary, active, athlete"),
          known_conditions: z.array(z.string()).optional(),
        })
        .optional(),
    }),
    execute: async (params) => {
      const flags = [];

      if (params.blood_pressure) {
        const { systolic, diastolic } = params.blood_pressure;
        if (systolic >= 180 || diastolic >= 120) {
          flags.push({
            vital: "blood_pressure",
            severity: "critical",
            message: "Hypertensive crisis — seek emergency care.",
          });
        } else if (systolic >= 140 || diastolic >= 90) {
          flags.push({
            vital: "blood_pressure",
            severity: "high",
            message: "Elevated — consult doctor for management.",
          });
        } else if (systolic < 90 || diastolic < 60) {
          flags.push({
            vital: "blood_pressure",
            severity: "low",
            message: "Low — monitor for dizziness or fainting.",
          });
        } else {
          flags.push({
            vital: "blood_pressure",
            severity: "normal",
            message: "Within normal range.",
          });
        }
      }

      if (params.heart_rate != null) {
        const hr = params.heart_rate;
        if (hr > 100) {
          flags.push({
            vital: "heart_rate",
            severity: "high",
            message: "Tachycardia — elevated heart rate.",
          });
        } else if (hr < 60) {
          flags.push({
            vital: "heart_rate",
            severity: "low",
            message: "Bradycardia — low heart rate.",
          });
        } else {
          flags.push({
            vital: "heart_rate",
            severity: "normal",
            message: "Within normal range (60-100 bpm).",
          });
        }
      }

      if (params.temperature != null) {
        const temp = params.temperature;
        if (temp >= 39) {
          flags.push({
            vital: "temperature",
            severity: "critical",
            message: "High fever — seek medical attention.",
          });
        } else if (temp >= 38) {
          flags.push({
            vital: "temperature",
            severity: "high",
            message: "Fever — rest and hydrate.",
          });
        } else if (temp <= 35) {
          flags.push({
            vital: "temperature",
            severity: "low",
            message: "Hypothermia — seek warmth and medical attention.",
          });
        } else {
          flags.push({
            vital: "temperature",
            severity: "normal",
            message: "Within normal range (36.1-37.2°C).",
          });
        }
      }

      if (params.respiratory_rate != null) {
        const rr = params.respiratory_rate;
        if (rr > 24) {
          flags.push({
            vital: "respiratory_rate",
            severity: "high",
            message: "Tachypnea — elevated respiratory rate.",
          });
        } else if (rr < 12) {
          flags.push({
            vital: "respiratory_rate",
            severity: "low",
            message: "Bradypnea — low respiratory rate.",
          });
        } else {
          flags.push({
            vital: "respiratory_rate",
            severity: "normal",
            message: "Within normal range (12-24 breaths/min).",
          });
        }
      }

      if (params.oxygen_saturation != null) {
        const spo2 = params.oxygen_saturation;
        if (spo2 < 90) {
          flags.push({
            vital: "oxygen_saturation",
            severity: "critical",
            message: "Critical — seek emergency care immediately.",
          });
        } else if (spo2 < 95) {
          flags.push({
            vital: "oxygen_saturation",
            severity: "low",
            message: "Low — consult doctor if persistent.",
          });
        } else {
          flags.push({
            vital: "oxygen_saturation",
            severity: "normal",
            message: "Within normal range (95-100%).",
          });
        }
      }

      const criticalCount = flags.filter(
        (f) => f.severity === "critical",
      ).length;
      const abnormalCount = flags.filter((f) => f.severity !== "normal").length;

      return {
        flags,
        summary: `${flags.length} vital(s) checked. ${abnormalCount} abnormal, ${criticalCount} critical.`,
        critical_count: criticalCount,
        abnormal_count: abnormalCount,
        recommendation:
          criticalCount > 0
            ? "URGENT — Critical vital signs detected. Patient should seek immediate medical attention."
            : abnormalCount > 0
              ? "FOLLOW-UP — Some values are outside normal range. Patient should monitor and consult their doctor."
              : "All vital signs are within normal ranges.",
      };
    },
  },
};

export async function POST(req) {
  const { messages, systemContext } = await req.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Messages are required." }, { status: 400 });
  }

  const recentMessages = messages.slice(-10);

  // In AI SDK v5 a tool invocation is a single `tool-<name>` part holding both
  // input and output. ignoreIncompleteToolCalls drops any tool call without an
  // available output, avoiding AI_MissingToolResultsError on reloaded history.
  const processedMessages = await convertToModelMessages(recentMessages, {
    ignoreIncompleteToolCalls: true,
  });

  try {
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemContext,
      messages: processedMessages,
      tools,
      stopWhen: stepCountIs(5),
      providerOptions: {
        google: {
          thinkingConfig: { thinkingBudget: 8192, includeThoughts: true },
        },
      },
    });

    return result.toUIMessageStreamResponse({ sendReasoning: true });
  } catch (error) {
    console.error("[AI Chat] streamText error:", error);
    const message = error?.message || "AI streaming failed";
    const isQuota =
      message.toLowerCase().includes("quota") ||
      message.toLowerCase().includes("rate limit") ||
      message.toLowerCase().includes("429") ||
      message.toLowerCase().includes("insufficient") ||
      message.toLowerCase().includes("resource exhausted");
    return Response.json(
      { error: message, isQuota },
      { status: isQuota ? 429 : 500 },
    );
  }
}
