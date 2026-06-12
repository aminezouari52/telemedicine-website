import { X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImagePreviewCard({ name, size, onRemove }) {
  return (
    <div className="flex items-center gap-2 border border-primary-300 rounded-xl h-[60px] px-3 py-2 bg-primary-50">
      <div className="flex items-center justify-center w-[25px] h-[25px] shrink-0 rounded bg-primary-100">
        <Image className="w-4 h-4 text-primary-600" />
      </div>
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
