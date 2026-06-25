import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
        <p className="text-muted-foreground">Loading admin panel...</p>
      </div>
    </div>
  );
}