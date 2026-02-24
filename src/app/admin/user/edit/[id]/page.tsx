"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/* -------------------- Schema -------------------- */

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone_number: z.string().regex(
    /^(\+?\d{1,3}[-.\s]?)?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})$/,
    "Invalid phone number"
  ),
  role: z.enum(["user", "admin"]),
  age: z.coerce.number().min(18, "Must be at least 18").max(100),
});

type FormValues = z.infer<typeof formSchema>;

/* -------------------- Component -------------------- */

export default function EditUserPage() {
  useEffect(() => {
    document.title = "User Edit";
  }, []);

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const token = useAppSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      age: 18,
      role: "user",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  /* -------------------- Fetch User -------------------- */

  useEffect(() => {
    if (!token || !id) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
          {
            method:"GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load user");
        }

        const data = await response.json();

        form.reset({
          name: data.name,
          email: data.email,
          phone_number: data.phone_number,
          age: data.age,
          role: data.role,
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token, id, form]);

  /* -------------------- Submit -------------------- */

  const onSubmit = async (values: FormValues) => {
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      toast.success("User updated successfully");
      router.push("/admin/user");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  /* -------------------- Loading -------------------- */

  if (isLoading) {
    return <p className="text-center mt-10">Loading user...</p>;
  }

  /* -------------------- UI -------------------- */

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Edit User</CardTitle>
      </CardHeader>

      <CardContent>
        <form id="edit-user-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input {...field} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input {...field} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="phone_number"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Phone Number</FieldLabel>
                  <Input {...field} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="age"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Age</FieldLabel>
                  <Input {...field} type="number" />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Role</FieldLabel>

                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    onOpenChange={() => field.onBlur()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Role</SelectLabel>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>

        <Button
          type="submit"
          form="edit-user-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update User"}
        </Button>
      </CardFooter>
    </Card>
  );
}
