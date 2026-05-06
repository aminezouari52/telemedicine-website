const catchAsync = require("../utils/catchAsync");
const { patientService, aiService } = require("../services");
const httpStatus = require("http-status");

const updatePatient = catchAsync(async (req, res) => {
  const patient = await patientService.updatePatient(req.params.id, req.body);
  res.status(httpStatus.OK).send(patient);
});

const askAi = catchAsync(async (req, res) => {
  const { input, pdfContent, context, conversationHistory } = req.body || {};

  if (!input || typeof input !== "string" || !input.trim()) {
    return res.status(httpStatus.BAD_REQUEST).send({
      error: "Input is required.",
    });
  }

  const text = await aiService.askPatientAi({
    input,
    pdfContent,
    context,
    conversationHistory,
  });

  res.status(httpStatus.OK).send({ text });
});

module.exports = {
  updatePatient,
  askAi,
};
