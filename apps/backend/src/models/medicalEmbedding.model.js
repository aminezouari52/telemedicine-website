const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// One row per indexed unit of a patient's data (their profile, or a single
// consultation). `text` is the natural-language snippet that was embedded and
// is kept so it can be injected into the AI prompt after retrieval. `embedding`
// is the 3072-dim vector produced by Gemini's gemini-embedding-001 model.
//
// The actual semantic search runs through a MongoDB Atlas Vector Search index
// (`medical_embedding_index`) created manually in the Atlas UI — see
// medicalEmbedding.service.js `searchMedicalContext`.
const medicalEmbeddingSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: ["profile", "consultation"],
      required: true,
    },
    // patient _id for a profile row, consultation _id for a consultation row.
    sourceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    // 3072-dim vector from Gemini's gemini-embedding-001 model.
    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true },
);

// One embedding row per source document — upsert target for the sync helpers.
medicalEmbeddingSchema.index({ source: 1, sourceId: 1 }, { unique: true });

const MedicalEmbedding = mongoose.model(
  "MedicalEmbedding",
  medicalEmbeddingSchema,
);

module.exports = MedicalEmbedding;
