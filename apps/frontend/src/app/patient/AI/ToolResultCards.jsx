import { Loader2 } from "lucide-react";
import { TOOL_DISPLAY } from "@/constants/patient";

/**
 * Renders the structured output of each clinical tool as a rich visual card.
 * While a tool is still running (no output yet) it falls back to a compact
 * "running" badge so the patient sees activity before the data lands.
 *
 * Empty "initiator" calls (the model calling a tool with no data yet to kick
 * off the structured flow) intentionally render nothing — the card only shows
 * once there is real data to display.
 */

/** Tone palette shared by triage levels and per-value severity flags. */
const TONE = {
  red: {
    bar: "border-l-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
    chip: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  orange: {
    bar: "border-l-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-700",
    chip: "bg-orange-100 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
  amber: {
    bar: "border-l-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    chip: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  green: {
    bar: "border-l-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    chip: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  blue: {
    bar: "border-l-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    chip: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  gray: {
    bar: "border-l-gray-400",
    bg: "bg-gray-50",
    text: "text-gray-600",
    chip: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
};

const TRIAGE_TONE = {
  emergency: TONE.red,
  urgent: TONE.orange,
  "non-urgent": TONE.amber,
  "self-care": TONE.green,
  information: TONE.blue,
};

const SEVERITY_TONE = {
  critical: TONE.red,
  critical_high: TONE.red,
  critical_low: TONE.red,
  high: TONE.orange,
  low: TONE.blue,
  moderate: TONE.amber,
  normal: TONE.green,
  mild: TONE.green,
};

const TRIAGE_LABEL = {
  emergency: "Emergency",
  urgent: "Urgent",
  "non-urgent": "Non-urgent",
  "self-care": "Self-care",
  information: "Information",
};

/**
 * Card shell: a tinted emoji badge (the tool's own icon) + title, with a left
 * accent bar in the tool's tone.
 */
function CardShell({ toolName, title, tone = TONE.blue, children }) {
  const emoji = TOOL_DISPLAY[toolName]?.emoji;
  return (
    <div
      className={`w-full rounded-lg border border-l-4 border-gray-200 ${tone.bar} ${tone.bg} p-3`}
    >
      <div
        className={`flex items-center gap-2 mb-2 font-semibold ${tone.text}`}
      >
        <span
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 text-sm shrink-0`}
        >
          {emoji}
        </span>
        <span className="text-sm">{title}</span>
      </div>
      {children}
    </div>
  );
}

function SymptomCheckerCard({ output }) {
  const level = output.triage_level ?? "information";
  const tone = TRIAGE_TONE[level] ?? TONE.blue;
  const dist = output.severity_distribution ?? {};

  // The model often calls this tool with no symptoms first to start the triage
  // flow; that "information" result carries no signal, so skip the card.
  if (level === "information" && !output.symptom_count) return null;

  return (
    <CardShell toolName="symptom_checker" title="Symptom Triage" tone={tone}>
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${tone.chip} mb-2`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
        {TRIAGE_LABEL[level] ?? level}
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {output.recommendation}
      </p>

      {output.red_flags?.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-semibold text-red-700 mb-1">
            Red flags detected
          </p>
          <div className="flex flex-wrap gap-1.5">
            {output.red_flags.map((flag) => (
              <span
                key={flag}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-700 border border-red-200"
              >
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}

      {output.affected_body_systems?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {output.affected_body_systems.map((sys) => (
            <span
              key={sys}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-white text-gray-600 border border-gray-200 capitalize"
            >
              {sys}
            </span>
          ))}
        </div>
      )}

      {output.symptom_count > 0 && (
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
          {dist.severe > 0 && <span>{dist.severe} severe</span>}
          {dist.moderate > 0 && <span>{dist.moderate} moderate</span>}
          {dist.mild > 0 && <span>{dist.mild} mild</span>}
        </div>
      )}
    </CardShell>
  );
}

function LabAnalyzerCard({ output }) {
  // Empty initiator call — nothing to tabulate yet.
  if (!output.tests || output.tests.length === 0) return null;

  const tone =
    output.critical_count > 0
      ? TONE.red
      : output.abnormal_count > 0
        ? TONE.orange
        : TONE.green;

  return (
    <CardShell toolName="lab_analyzer" title="Lab Results" tone={tone}>
      <p className="text-sm text-gray-700 mb-2">{output.summary}</p>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-200">
              <th className="py-1 pr-3 font-medium">Test</th>
              <th className="py-1 pr-3 font-medium">Value</th>
              <th className="py-1 pr-3 font-medium">Range</th>
              <th className="py-1 font-medium">Flag</th>
            </tr>
          </thead>
          <tbody>
            {output.tests.map((t, i) => {
              const ft = SEVERITY_TONE[t.flag] ?? TONE.gray;
              return (
                <tr key={`${t.name}-${i}`} className="border-b border-gray-100">
                  <td className="py-1.5 pr-3 font-medium text-gray-700">
                    {t.name}
                  </td>
                  <td className="py-1.5 pr-3 text-gray-700">{t.value}</td>
                  <td className="py-1.5 pr-3 text-gray-400">
                    {t.reference_range ?? "—"}
                  </td>
                  <td className="py-1.5">
                    {t.flag ? (
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold border ${ft.chip}`}
                      >
                        {t.flag.replace("_", " ")}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {output.recommendation && (
        <p className="text-xs text-gray-600 mt-2">{output.recommendation}</p>
      )}
    </CardShell>
  );
}

function MedicationInfoCard({ output }) {
  // Empty initiator call — no medications to list yet.
  if (!output.medications || output.medications.length === 0) return null;

  return (
    <CardShell
      toolName="medication_info"
      title="Medication Info"
      tone={TONE.blue}
    >
      <div className="flex flex-col gap-2">
        {output.medications.map((m, i) => (
          <div
            key={`${m.name}-${i}`}
            className="flex items-start justify-between gap-2 rounded-md bg-white border border-gray-200 px-2.5 py-1.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800">{m.name}</p>
              <p className="text-xs text-gray-500">
                {[m.dosage, m.frequency, m.route].filter(Boolean).join(" · ") ||
                  m.purpose ||
                  "—"}
              </p>
            </div>
            {m.category && (
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary-50 text-primary-700 border border-primary-200 capitalize">
                {m.category.replace("_", " ")}
              </span>
            )}
          </div>
        ))}
      </div>
      {output.potential_interactions && (
        <p className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-md px-2 py-1.5 mt-2">
          {output.potential_interactions}
        </p>
      )}
      {output.general_advice && (
        <p className="text-xs text-gray-500 mt-2">{output.general_advice}</p>
      )}
    </CardShell>
  );
}

const VITAL_LABEL = {
  blood_pressure: "Blood Pressure",
  heart_rate: "Heart Rate",
  temperature: "Temperature",
  respiratory_rate: "Respiratory Rate",
  oxygen_saturation: "Oxygen Saturation",
};

function VitalSignsCard({ output }) {
  // Empty initiator call — no readings to interpret yet.
  if (!output.flags || output.flags.length === 0) return null;

  const tone =
    output.critical_count > 0
      ? TONE.red
      : output.abnormal_count > 0
        ? TONE.orange
        : TONE.green;

  return (
    <CardShell toolName="vital_signs" title="Vital Signs" tone={tone}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {output.flags.map((f, i) => {
          const ft = SEVERITY_TONE[f.severity] ?? TONE.gray;
          return (
            <div
              key={`${f.vital}-${i}`}
              className={`rounded-md border ${ft.chip} px-2.5 py-1.5`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${ft.dot}`} />
                <span className="text-xs font-semibold">
                  {VITAL_LABEL[f.vital] ?? f.vital}
                </span>
              </div>
              <p className="text-xs mt-0.5 opacity-90">{f.message}</p>
            </div>
          );
        })}
      </div>
      {output.recommendation && (
        <p className="text-xs text-gray-600 mt-2">{output.recommendation}</p>
      )}
    </CardShell>
  );
}

const CARD_RENDERERS = {
  symptom_checker: SymptomCheckerCard,
  lab_analyzer: LabAnalyzerCard,
  medication_info: MedicationInfoCard,
  vital_signs: VitalSignsCard,
};

/** Compact badge shown while a tool call is still resolving. */
function RunningBadge({ toolName }) {
  const display = TOOL_DISPLAY[toolName];
  if (!display) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
      <Loader2 className="w-3 h-3 animate-spin" />
      {display.label}…
    </span>
  );
}

export default function ToolResultCards({ message }) {
  const toolParts =
    message.parts?.filter(
      (p) =>
        typeof p.type === "string" &&
        p.type.startsWith("tool-") &&
        p.type !== "tool-result",
    ) ?? [];

  if (toolParts.length === 0) return null;

  // De-dupe by tool name, keeping the most complete instance (one with output).
  const byName = new Map();
  for (const p of toolParts) {
    const name = p.type.replace("tool-", "");
    const existing = byName.get(name);
    if (!existing || (p.output != null && existing.output == null)) {
      byName.set(name, p);
    }
  }

  const running = [];
  const cards = [];
  for (const [name, part] of byName) {
    const Renderer = CARD_RENDERERS[name];
    if (Renderer && part.output != null) {
      cards.push(
        <Renderer key={part.toolCallId ?? name} output={part.output} />,
      );
    } else if (part.state !== "output-error" && part.output == null) {
      // Genuinely still in flight — show a spinner. A failed call (output-error)
      // renders nothing so it can't get stuck as a permanent loading badge.
      running.push(
        <RunningBadge key={part.toolCallId ?? name} toolName={name} />,
      );
    }
  }

  if (cards.length === 0 && running.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2 mt-2 mb-1">
      {running.length > 0 && (
        <div className="flex flex-wrap gap-2">{running}</div>
      )}
      {cards}
    </div>
  );
}
