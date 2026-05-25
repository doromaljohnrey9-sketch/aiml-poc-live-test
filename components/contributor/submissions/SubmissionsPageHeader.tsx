import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface SubmissionsPageHeaderProps {
  onCreateNew?: () => void;
}

export function SubmissionsPageHeader({ onCreateNew }: SubmissionsPageHeaderProps) {
  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Submissions</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track your content source submissions.
        </p>
      </div>
      <Button onClick={handleCreateNew}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Submit New Content
      </Button>
    </div>
  );
}
