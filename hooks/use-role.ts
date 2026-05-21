"use client";

import { useAuth } from "@/hooks/use-auth";
import { ROLES, type RoleName } from "@/drizzle/constants/roles-permissions.constant";

export const useRole = () => {
  const { profile, isLoading } = useAuth();
  
  const role = profile?.role as RoleName | undefined;

  const isAdmin = role === ROLES.ADMIN;
  const isOperator = role === ROLES.OPERATOR;
  const isContributor = role === ROLES.CONTRIBUTOR;

  const hasRole = (roles: RoleName[]) => role && roles.includes(role);

  return {
    role,
    isAdmin,
    isOperator,
    isContributor,
    hasRole,
    isLoading,
  };
};
