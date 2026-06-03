"use client"

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

export type Locale = "en" | "zh-CN"

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

// Cache for loaded messages
const messagesCache = new Map<Locale, Record<string, any>>()

async function loadMessages(locale: Locale): Promise<Record<string, any>> {
  if (messagesCache.has(locale)) {
    return messagesCache.get(locale)!
  }
  try {
    const messages = await import(`../messages/${locale}.json`)
    messagesCache.set(locale, messages.default)
    return messages.default
  } catch {
    // Fallback to English
    const fallback = await import(`../messages/en.json`)
    messagesCache.set(locale, fallback.default)
    return fallback.default
  }
}

function resolveKey(messages: Record<string, any>, key: string): string | undefined {
  const parts = key.split(".")
  let current: any = messages
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined
    current = current[part]
  }
  return typeof current === "string" ? current : undefined
}

function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    const val = params[key]
    return val != null ? String(val) : `{${key}}`
  })
}

/**
 * Pre-loads English messages for use as fallback in the t() function.
 */
let englishMessages: Record<string, any> | null = null

async function ensureEnglishFallback(): Promise<Record<string, any>> {
  if (englishMessages) return englishMessages
  try {
    const mod = await import(`../messages/en.json`)
    englishMessages = mod.default
  } catch {
    englishMessages = {}
  }
  return englishMessages!
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")
  const [messages, setMessages] = useState<Record<string, any>>({})
  const englishRef = useRef<Record<string, any>>({})

  useEffect(() => {
    // Ensure English fallback is loaded
    ensureEnglishFallback().then((en) => {
      englishRef.current = en
    })
    // Read stored preference
    const stored = localStorage.getItem("caplay_locale") as Locale | null
    if (stored === "en" || stored === "zh-CN") {
      setLocale(stored)
    }
  }, [])

  useEffect(() => {
    loadMessages(locale).then(setMessages)
    localStorage.setItem("caplay_locale", locale)
  }, [locale])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      // Try current locale first
      let text = resolveKey(messages, key)
      if (text != null) return interpolate(text, params)

      // Try English fallback
      text = resolveKey(englishRef.current, key)
      if (text != null) return interpolate(text, params)

      // Return the last part of the key as last resort
      const parts = key.split(".")
      return parts[parts.length - 1]
    },
    [messages],
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useLocale(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    // Fallback for when provider is not used - return identity function
    return {
      locale: "en",
      setLocale: () => {},
      t: (key: string) => {
        const parts = key.split(".")
        return parts[parts.length - 1]
      },
    }
  }
  return ctx
}
