import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-secondary mb-2">Unable to Load Articles</h2>
        <p className="text-neutral mb-6">
          We're having trouble connecting to our news sources. Please try again later.
        </p>
        <Button onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
