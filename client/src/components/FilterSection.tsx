import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoryFilter, DateFilter } from "@shared/schema";

interface FilterSectionProps {
  activeCategory: CategoryFilter;
  activeDateRange: DateFilter;
  customDate: string;
  onCategoryChange: (category: CategoryFilter) => void;
  onDateRangeChange: (dateRange: DateFilter) => void;
  onCustomDateChange: (date: string) => void;
}

const categories: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All News' },
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'sports', label: 'Sports' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health' },
];

const dateRanges: { value: DateFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export default function FilterSection({
  activeCategory,
  activeDateRange,
  customDate,
  onCategoryChange,
  onDateRangeChange,
  onCustomDateChange,
}: FilterSectionProps) {
  return (
    <section className="bg-surface py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-secondary mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                variant={activeCategory === category.value ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Date Filters */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-secondary mb-3">Time Period</h2>
          <div className="flex flex-wrap gap-2 items-center">
            {dateRanges.map((dateRange) => (
              <Button
                key={dateRange.value}
                onClick={() => onDateRangeChange(dateRange.value)}
                variant={activeDateRange === dateRange.value ? "default" : "outline"}
                size="sm"
                className="rounded-lg"
              >
                {dateRange.label}
              </Button>
            ))}
            
            <div className="flex items-center ml-4 space-x-2">
              <Label htmlFor="custom-date" className="text-sm text-neutral">
                Custom:
              </Label>
              <Input
                id="custom-date"
                type="date"
                value={customDate}
                onChange={(e) => onCustomDateChange(e.target.value)}
                className="w-auto text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
