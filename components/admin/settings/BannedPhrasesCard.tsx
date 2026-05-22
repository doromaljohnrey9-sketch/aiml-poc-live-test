"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2Icon, PlusIcon, ShieldAlertIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import type { AdminBannedPhrase } from "@/types/admin.types";
import type { UseMutationResult } from "@tanstack/react-query";

interface BannedPhrasesCardProps {
  phrases: AdminBannedPhrase[];
  addBannedPhrase: UseMutationResult<AdminBannedPhrase, Error, string, unknown>;
  deleteBannedPhrase: UseMutationResult<boolean, Error, string, unknown>;
  isLoading?: boolean;
}

export function BannedPhrasesCard({
  phrases,
  addBannedPhrase,
  deleteBannedPhrase,
  isLoading,
}: BannedPhrasesCardProps) {
  const [newPhrase, setNewPhrase] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newPhrase.trim()) return;

    addBannedPhrase.mutate(newPhrase.trim(), {
      onSuccess: () => {
        toast.success("Banned phrase added successfully");
        setNewPhrase("");
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Failed to add banned phrase");
      },
    });
  };

  const handleDelete = (id: string) => {
    setIsDeleting(id);
    deleteBannedPhrase.mutate(id, {
      onSuccess: () => {
        toast.success("Banned phrase deleted successfully");
        setIsDeleting(null);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Failed to delete banned phrase");
        setIsDeleting(null);
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldAlertIcon className="h-5 w-5" />
          <CardTitle>Banned Phrases</CardTitle>
        </div>
        <CardDescription>
          Phrases that will be filtered from all AI-generated content to ensure NDA compliance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="new-phrase" className="sr-only">
              New phrase
            </Label>
            <Input
              id="new-phrase"
              placeholder="Enter phrase to ban..."
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || addBannedPhrase.isPending}
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={!newPhrase.trim() || isLoading || addBannedPhrase.isPending}
          >
            {addBannedPhrase.isPending ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <PlusIcon className="h-4 w-4" />
            )}
            Add
          </Button>
        </div>

        {phrases.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No banned phrases configured yet.
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {phrases.map((phrase) => (
              <div
                key={phrase.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
              >
                <span className="text-sm flex-1">{phrase.phrase}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(phrase.id)}
                  disabled={isDeleting === phrase.id || isLoading || deleteBannedPhrase.isPending}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  {isDeleting === phrase.id ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2Icon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
