import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PdfPreviewCard({ name, size, onRemove }) {
  return (
    <div className="flex items-center gap-2 border border-primary-300 rounded-xl h-[60px] px-3 py-2 bg-primary-50">
      <Image
        src="/assets/pdf.svg"
        alt="PDF icon"
        width={25}
        height={25}
        className="h-[25px] shrink-0"
      />
      <div className="ms-2 min-w-0">
        <p className="text-md text-primary-800 font-medium truncate max-w-[160px]">
          {name}
        </p>
        <p className="text-gray-500 text-sm">
          {(size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-2 w-6 h-6 rounded-full text-black shrink-0"
          onClick={onRemove}
          title="Remove file"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
