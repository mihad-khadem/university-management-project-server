import { z } from "zod";

const zodUserValidation = z.object({
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: " Password must be a string",
    })
    .min(5, "Minimum 5 character required")
    .max(20, "Maximum 20 character required")
    .optional(),
});

export default zodUserValidation;
