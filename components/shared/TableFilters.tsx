import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface TableFiltersProps {
  search: string;
  filters?: {
    [key: string]: {
      value: string;
      options: FilterOption[];
      onChange: (value: string) => void;
      placeholder: string;
    };
  };
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

export function TableFilters({
  search,
  filters,
  onSearchChange,
  onSearchSubmit,
}: TableFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearchSubmit();
            }
          }}
          className="pl-9 pr-20"
        />
        <button
          type="button"
          onClick={onSearchSubmit}
          className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Search
        </button>
      </div>
      {filters && (
        <div className="flex gap-4">
          {Object.entries(filters).map(([key, filter]) => (
            <Select key={key} value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      )}
    </div>
  );
}
