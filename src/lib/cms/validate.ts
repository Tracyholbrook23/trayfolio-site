import type { FieldDef } from "./content.schema";

export interface ValidationResult {
  valid: boolean;
  value: string;
  error?: string;
}

/**
 * Server-side validation for one field's submitted value, driven entirely
 * by its FieldDef from content.schema.ts. This is what actually protects a
 * client from breaking their site, the dashboard's own input constraints
 * (maxLength attributes, input types) are just UX, never trusted alone,
 * see the architecture doc's security section.
 *
 * "image" and "list" fields aren't validated here yet (no field uses
 * either type today); they get real handling (upload safety, per-item
 * rules) when a field of that type is actually added to a schema.
 */
export function validateField(field: FieldDef, rawValue: string): ValidationResult {
  const value = rawValue.trim();

  if (field.required && value.length === 0) {
    return { valid: false, value, error: `${field.label} is required.` };
  }

  if (value.length === 0) {
    return { valid: true, value };
  }

  if (field.minLength !== undefined && value.length < field.minLength) {
    return {
      valid: false,
      value,
      error: `${field.label} must be at least ${field.minLength} characters.`,
    };
  }

  if (field.maxLength !== undefined && value.length > field.maxLength) {
    return {
      valid: false,
      value,
      error: `${field.label} must be ${field.maxLength} characters or fewer.`,
    };
  }

  switch (field.type) {
    case "email": {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return { valid: false, value, error: `${field.label} must be a valid email address.` };
      }
      break;
    }
    case "phone": {
      if (!/^[0-9+()\-.\s]{7,20}$/.test(value)) {
        return { valid: false, value, error: `${field.label} must be a valid phone number.` };
      }
      break;
    }
    case "url": {
      try {
        const parsed = new URL(value);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          throw new Error("not http(s)");
        }
      } catch {
        return {
          valid: false,
          value,
          error: `${field.label} must be a valid URL (starting with http:// or https://).`,
        };
      }
      break;
    }
    case "price": {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        return { valid: false, value, error: `${field.label} must be a price like 49.99.` };
      }
      break;
    }
    case "number": {
      if (!/^-?\d+(\.\d+)?$/.test(value)) {
        return { valid: false, value, error: `${field.label} must be a number.` };
      }
      break;
    }
    default:
      break;
  }

  return { valid: true, value };
}
