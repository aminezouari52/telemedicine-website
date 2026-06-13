import { getText } from "@/lib/aiDataParts";
import MessageAttachments from "./MessageAttachments";
import MessageMeta from "./MessageMeta";

export default function UserMessage({ message }) {
  return (
    <div className="flex flex-col items-end gap-2">
      <MessageAttachments message={message} align="end" />
      <div className="bg-primary-100 px-3 py-2 rounded-md max-w-prose">
        <p className="font-medium text-primary-700 break-words">
          {getText(message)}
        </p>
      </div>
      <MessageMeta message={message} align="end" />
    </div>
  );
}
