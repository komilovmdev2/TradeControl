"use client";

import { useApp } from "@/lib/store";
import type { Locale } from "./types";

export type { Locale } from "./types";
export { LOCALES, LANGUAGE_LABELS } from "./types";

export function useLocale(): Locale {
  const { settings } = useApp();
  return settings.language ?? "en";
}

const LOCALE_CODES: Record<Locale, string> = { en: "en-US", uz: "uz-UZ", ru: "ru-RU" };

/** BCP-47 code for the active locale, e.g. for toLocaleDateString/toLocaleString calls. */
export function useLocaleCode(): string {
  return LOCALE_CODES[useLocale()];
}

/** Given a `{ en, uz, ru }` dictionary, returns the entry for the active locale. */
export function useTranslation<T extends Record<Locale, Record<string, string>>>(dict: T): T["en"] {
  const locale = useLocale();
  return dict[locale] ?? dict.en;
}

/** Interpolates `{placeholder}` tokens in a translated string, e.g. tf(t.greeting, { name }). */
export function tf(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}
