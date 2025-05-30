import { Search, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">NewsFlow</h1>
            <span className="ml-2 text-sm text-neutral">Stay Informed</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5 text-neutral" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bookmark className="h-5 w-5 text-neutral" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
