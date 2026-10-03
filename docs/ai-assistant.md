# AI assistant

Patients can chat with an AI doctor assistant at **AI Consultation** (`/patient/AI`). It runs on Gemini (`gemini-2.5-flash`) through the Vercel AI SDK, in `apps/frontend/src/app/api/ai/chat/route.js`.

It can:

- Stream answers and show the model's reasoning.
- Call tools on its own, and several in one answer: `symptom_checker`, `lab_analyzer`, `medication_info`, `vital_signs`, and `search_medical_history`.
- Read attached PDFs (such as lab reports) and images.
- Suggest follow-up questions (`apps/frontend/src/app/api/ai/suggestions/route.js`).
- Keep the conversation history and show metadata for each message (model, tokens, time).
- Answer questions about the signed-in patient's own health profile and past consultations, using retrieval over their records (RAG).

> The assistant gives general information, not a diagnosis. It is not a substitute for a doctor.

## Setup

1. Set `GEMINI_API_KEY` in **both** `apps/frontend/.env` (chat) and `apps/backend/.env` (embeddings).
2. For the medical-history search, create an Atlas Vector Search index on the `medicalembeddings` collection. Name it `medical_embedding_index` and give it this definition:

   ```json
   {
     "fields": [
       {
         "type": "vector",
         "path": "embedding",
         "numDimensions": 3072,
         "similarity": "cosine"
       },
       { "type": "filter", "path": "patient" }
     ]
   }
   ```

3. Embeddings update automatically when a patient edits their profile or a consultation is booked or changed. Seeded data isn't embedded automatically. To backfill it, run:

   ```bash
   pnpm -F=backend seed:embeddings
   ```

If you skip step 2, the assistant still works, but it can't look up the patient's history.

## Access and limits

Both AI routes need a signed-in user. The system prompt is built on the server (`apps/frontend/src/lib/aiSystemPrompt.js`), so a client can't replace it.

Before every model call, the routes ask the backend to count the request (`POST /v1/patient/ai-usage`). Each user may send 30 chat messages per clock hour by default. To change that, set `AI_MESSAGES_PER_HOUR` in `apps/backend/.env`. Follow-up suggestions have their own counter with the same limit, so they never use up chat messages. If the backend can't be reached, the chat refuses the message instead of calling Gemini without a limit.

## Prompts to try

| Feature         | Prompt                                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Symptoms        | I've had a throbbing headache for 3 days and feel nauseous. Should I be worried?                                                          |
| Medication      | Tell me about metformin 500mg. Can I take it with ibuprofen?                                                                              |
| Lab value       | My TSH came back at 6.2 mIU/L (ref 0.4–4.0). What does that mean?                                                                         |
| Urgent vitals   | My blood pressure is 185/125 and I feel dizzy.                                                                                            |
| Several tools   | My BP is 130/85, HR 72. I take lisinopril 10mg and metformin 500mg. Review my vitals and tell me about these meds.                        |
| Several labs    | Here are my blood test results: Hemoglobin 9.1 g/dL (ref 13–17), Glucose 210 mg/dL (ref 70–99), WBC 6.5 x10^9/L (ref 4–11)                |
| Full check      | I took my vitals: BP 148/96, HR 92, temp 37.8°C, RR 20, SpO2 94%. I'm 45, 88 kg, 178 cm, sedentary, type 2 diabetic. Anything concerning? |
| PDF             | _(Attach a lab report PDF)_ Go through these results and explain anything abnormal.                                                       |
| Image           | _(Attach a photo of a skin rash)_ What could this be? Should I see a doctor?                                                              |
| Patient history | What do you know about me? / What did my last consultation involve?                                                                       |
