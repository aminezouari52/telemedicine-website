/**
 * Renders the file parts (images + PDFs) of a chat message.
 * Shared by both user and assistant messages so the rendering
 * logic lives in exactly one place.
 */
export default function MessageAttachments({ message, align = "start" }) {
  const fileParts = message.parts?.filter((p) => p.type === "file") ?? [];
  if (fileParts.length === 0) return null;

  return (
    <div
      className={`flex flex-col gap-2 ${align === "end" ? "items-end" : ""}`}
    >
      {fileParts.map((part, i) => {
        const key = `${message.id}-file-${i}`;
        const label = part.filename ?? `attachment-${i}`;

        if (part.mediaType?.startsWith("image/")) {
          return (
            <img
              key={key}
              className="rounded-lg max-w-xs max-h-80 object-contain border border-gray-200"
              src={part.url}
              alt={label}
            />
          );
        }

        if (part.mediaType?.startsWith("application/pdf")) {
          return (
            <iframe
              key={key}
              className="rounded-lg border border-gray-200 w-full max-w-md h-[480px]"
              src={part.url}
              title={label}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
