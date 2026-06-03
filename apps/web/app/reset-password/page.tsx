"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"
import Link from "next/link"
import { AUTH_ENABLED, getSupabaseBrowserClient } from "@/lib/supabase"
import { useTranslations } from "@/hooks/use-translations"

export default function ResetPasswordPage() {
  const { t } = useTranslations("resetPassword")
  const { t: tc } = useTranslations("common")
  const supabase = getSupabaseBrowserClient()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!AUTH_ENABLED) return
    supabase.auth.getUser().then(({ data }) => {
      setReady(!!data.user)
    })
  }, [supabase])

  async function handleUpdate() {
    setError(null)
    setMsg(null)
    if (password.length < 8) {
      setError(t("passwordLengthError"))
      return
    }
    if (password !== confirm) {
      setError(t("passwordMismatchError"))
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMsg(t("success"))
    } catch (e: any) {
      setError(e.message ?? t("error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="border-border/80 shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold">{t("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {!AUTH_ENABLED ? (
                <p className="text-sm text-muted-foreground">{t("authDisabled")}</p>
              ) : !ready ? (
                <p className="text-sm text-muted-foreground">
                  {t("verifying")}
                </p>
              ) : null}

              {AUTH_ENABLED && ready && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">{t("newPassword")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder={t("newPasswordPlaceholder")}
                        className="pl-9"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder={t("confirmPasswordPlaceholder")}
                        className="pl-9"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}
                  {msg && <p className="text-sm text-green-600">{msg}</p>}

                  <Button disabled={loading} onClick={handleUpdate} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                    {loading ? t("updating") : t("resetButton")}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    <Link href="/signin" className="text-accent hover:underline font-medium">{t("backToSignIn")}</Link>
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

