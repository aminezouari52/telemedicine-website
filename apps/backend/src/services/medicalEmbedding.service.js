const mongoose = require("mongoose");
const { MedicalEmbedding, Patient, Consultation } = require("../models");
const { embedText } = require("./embedding.service");
const logger = require("../config/logger");

const VECTOR_INDEX = "medical_embedding_index";

// --- Serialization: structured records -> natural-language snippets ---------
// Embeddings are trained on prose, so we turn fields into readable sentences
// (omitting empty values) rather than embedding raw JSON.

const serializePatient = (patient) => {
  const name = [patient.firstName, patient.lastName].filter(Boolean).join(" ");
  const parts = [`Patient health profile${name ? ` for ${name}` : ""}.`];

  if (patient.age) parts.push(`Age: ${patient.age}.`);
  if (patient.gender) parts.push(`Gender: ${patient.gender}.`);
  if (patient.bloodType) parts.push(`Blood type: ${patient.bloodType}.`);
  if (patient.weight) parts.push(`Weight: ${patient.weight}.`);
  if (patient.height) parts.push(`Height: ${patient.height}.`);
  if (patient.allergies?.length)
    parts.push(`Allergies: ${patient.allergies.join(", ")}.`);
  if (patient.chronicConditions?.length)
    parts.push(`Chronic conditions: ${patient.chronicConditions.join(", ")}.`);
  if (patient.currentMedications?.length)
    parts.push(
      `Current medications: ${patient.currentMedications.join(", ")}.`,
    );

  return parts.join(" ");
};

const serializeConsultation = (consultation) => {
  const doctor = consultation.doctor || {};
  const doctorName = [doctor.firstName, doctor.lastName]
    .filter(Boolean)
    .join(" ");
  const date = consultation.date
    ? new Date(consultation.date).toISOString().slice(0, 10)
    : "an unknown date";

  let text = `Consultation on ${date}`;
  if (doctorName) text += ` with Dr. ${doctorName}`;
  if (doctor.specialty) text += `, ${doctor.specialty}`;
  if (doctor.hospital) text += ` at ${doctor.hospital}`;
  text += `. Status: ${consultation.status || "unknown"}.`;

  return text;
};

// --- Sync: upsert one embedding row for a profile / consultation ------------

const upsert = async ({ patient, source, sourceId, text }) => {
  const embedding = await embedText(text);
  await MedicalEmbedding.findOneAndUpdate(
    { source, sourceId },
    { patient, source, sourceId, text, embedding },
    { upsert: true, new: true },
  ).exec();
};

const syncPatientEmbedding = async (patientId) => {
  const patient = await Patient.findById(patientId).exec();
  if (!patient) return;

  await upsert({
    patient: patient._id,
    source: "profile",
    sourceId: patient._id,
    text: serializePatient(patient),
  });
};

const syncConsultationEmbedding = async (consultationId) => {
  const consultation = await Consultation.findById(consultationId)
    .populate("doctor")
    .exec();
  if (!consultation) return;

  await upsert({
    patient: consultation.patient,
    source: "consultation",
    sourceId: consultation._id,
    text: serializeConsultation(consultation),
  });
};

// --- Search: embed query, run Atlas $vectorSearch scoped to the patient -----

const searchMedicalContext = async (patientId, query, k = 5) => {
  if (!query || typeof query !== "string" || !query.trim()) {
    return [];
  }

  try {
    const queryVector = await embedText(query.trim());

    return await MedicalEmbedding.aggregate([
      {
        $vectorSearch: {
          index: VECTOR_INDEX,
          path: "embedding",
          queryVector,
          // HARD per-patient scope: runs inside the search so another
          // patient's vectors are never even candidates.
          filter: {
            patient: { $eq: new mongoose.Types.ObjectId(patientId) },
          },
          numCandidates: 100,
          limit: k,
        },
      },
      {
        $project: {
          _id: 0,
          text: 1,
          source: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);
  } catch (err) {
    // Degrade gracefully — e.g. the Atlas index not yet created/active. The AI
    // can still answer without retrieved context.
    logger.error(`Medical context search failed: ${err.message}`);
    return [];
  }
};

module.exports = {
  serializePatient,
  serializeConsultation,
  syncPatientEmbedding,
  syncConsultationEmbedding,
  searchMedicalContext,
};
