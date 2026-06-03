import { useLocale } from "@/context/I18nContext"

/**
 * Hook for component-level translations.
 * Can be used in both client and server components.
 * In server context, returns the last segment of the key as fallback.
 *
 * Usage:
 *   const { t } = useTranslations("navigation")
 *   t("docs") // returns translated "Docs" / "文档"
 */
export function useTranslations(namespace: string) {
  let localeVal: string
  let setLocaleFn: (locale: any) => void
  let rawT: (key: string, params?: Record<string, string | number>) => string

  try {
    const ctx = useLocale()
    localeVal = ctx.locale
    setLocaleFn = ctx.setLocale
    rawT = ctx.t
  } catch {
    // Server-side fallback
    localeVal = "en"
    setLocaleFn = () => {}
    rawT = (key: string) => {
      const parts = key.split(".")
      return parts[parts.length - 1]
    }
  }

  function t(key: string, params?: Record<string, string | number>): string {
    return rawT(`${namespace}.${key}`, params)
  }

  return { t, locale: localeVal as "en" | "zh-CN", setLocale: setLocaleFn }
}
