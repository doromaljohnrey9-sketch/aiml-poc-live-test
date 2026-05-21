"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/shared/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getSupabaseClient } from "@/lib/supabase/client";

import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";

import { AUTH_ROUTES } from "@/constants/routes.constant";
import { ROLES } from "@/drizzle/constants/roles-permissions.constant";

export const PageClient = () => {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: ROLES.CONTRIBUTOR,
    },
  });

  const onFormSubmit = (values: RegisterFormValues) => {
    startTransition(async () => {
      try {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              name: values.name,
              role: values.role,
            },
          },
        });

        if (error) {
          toast.error("Registration failed", {
            description: error.message,
          });
          return;
        }

        toast.success("Registration successful", {
          description: "You can now login with your credentials.",
        });

        form.reset();
        router.push(AUTH_ROUTES.LOGIN);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong", {
          description: "Please try again.",
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Register with your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <PasswordInput
                      {...field}
                      id="password"
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="role">Role</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <SelectTrigger id="role" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                        <SelectItem value={ROLES.OPERATOR}>Operator</SelectItem>
                        <SelectItem value={ROLES.CONTRIBUTOR}>Contributor</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" className="w-full" disabled={isPending}>
                  Submit
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href={AUTH_ROUTES.LOGIN}>Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
};
