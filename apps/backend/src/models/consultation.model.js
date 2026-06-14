const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const consultationSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "in-progress", "canceled"],
      default: "pending",
    },
    doctor: { type: Schema.Types.ObjectId, ref: "doctor", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "patient", required: true },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Keep the RAG vector store in sync whenever a consultation is created
// (post "save" covers every Consultation.create site) or updated
// (post "findOneAndUpdate" covers updateConsultation). Fire-and-forget: an
// embedding/Gemini failure must never break the originating request. The
// service is required lazily to avoid a models <-> services require cycle.
const syncConsultationEmbedding = (doc) => {
  if (!doc?._id) return;
  require("../services/medicalEmbedding.service")
    .syncConsultationEmbedding(doc._id)
    .catch((err) => {
      require("../config/logger").error(
        `Consultation embedding sync failed: ${err.message}`,
      );
    });
};

consultationSchema.post("save", syncConsultationEmbedding);
consultationSchema.post("findOneAndUpdate", syncConsultationEmbedding);

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
