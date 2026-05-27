/**
 * Predefined rejection reasons for content review
 * Per PRD A-8: Rejection reason is a predefined dropdown list in V1
 */
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ShieldAlert,
  MessageSquareWarning,
  FileWarning,
  Layout,
  FileText,
  MoreHorizontal,
} from "lucide-react";

export const REJECTION_REASONS = [
  {
    value: "inaccurate",
    label: "Inaccurate Information",
    description: "Content contains factual errors or incorrect information",
    icon: AlertTriangle,
  },
  {
    value: "nda_violation",
    label: "NDA Violation",
    description: "Content discloses confidential or proprietary information",
    icon: ShieldAlert,
  },
  {
    value: "inappropriate_tone",
    label: "Inappropriate Tone",
    description: "Tone or messaging does not align with brand standards",
    icon: MessageSquareWarning,
  },
  {
    value: "poor_quality",
    label: "Poor Quality",
    description: "Content is poorly written, unclear, or lacks coherence",
    icon: FileWarning,
  },
  {
    value: "off_brand",
    label: "Off-Brand Messaging",
    description: "Content does not match brand voice or positioning",
    icon: Layout,
  },
  {
    value: "missing_context",
    label: "Missing Context",
    description: "Content lacks necessary context or background information",
    icon: FileText,
  },
  {
    value: "other",
    label: "Other",
    description: "Other reason not covered by the above options",
    icon: MoreHorizontal,
  },
] as const;

export type RejectionReason = (typeof REJECTION_REASONS)[number]["value"];
