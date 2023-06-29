import { randomUUID } from "crypto";
import slugify from "slugify";

export function generateUsername(name: string): string {
  return slugify(name) + randomUUID();
}
