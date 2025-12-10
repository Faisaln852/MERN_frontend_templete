"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { 
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation 
} from "@/store/slices/apiSlice";

import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Field, FieldError, FieldGroup, FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea
} from "@/components/ui/input-group";

const formSchema = z.object({
  name: z.string().nullable(),
  description: z.string().min(5).max(100),
  email: z.string().email(),
  phone_number: z
    .string()
    .regex(/^(\+?\d{1,3}[-.\s]?)?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})$/, 
      "Invalid phone number"),
  age: z.coerce.number().min(18).max(100)
});

export default function EditUserPage() {

  // 1. GET ID FROM URL
  const { id } = useParams<{ id: string }>();

  // 2. FETCH USER DETAILS
  const { data, isLoading, error } = useGetUserDetailsQuery(id);

  // 3. FORM SETUP
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      email: "",
      phone_number: "",
      age: 18
    }
  });

  // 4. UPDATE MUTATION
  const [updateUser, { isLoading: isUpdating }] =
    useUpdateUserDetailsMutation();

  // 5. POPULATE FORM WHEN DATA ARRIVES
  React.useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        description: data.description || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        age: data.age || 18
      });
    }
  }, [data, form]);

  // 6. SUBMIT UPDATE
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateUser({ id, data: values }).unwrap();
      toast.success("User updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  if (isLoading) return <p>Loading user...</p>;
  if (error) return <p>Error loading user data</p>;

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
                  <Input {...field} placeholder="John Doe" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input {...field} placeholder="email@example.com" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="phone_number"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Phone Number</FieldLabel>
                  <Input {...field} placeholder="+1234567890" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="age"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Age</FieldLabel>
                  <Input {...field} type="number" placeholder="18" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>

                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      rows={4}
                      placeholder="Write user details..."
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText>
                        {field.value.length}/100
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}>
            Reset
          </Button>

          <Button 
            type="submit" 
            form="edit-user-form"
            disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update User"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
