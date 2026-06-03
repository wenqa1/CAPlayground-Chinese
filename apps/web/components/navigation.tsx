"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon, ArrowRight, User, LogOut, LayoutDashboard, Languages } from "lucide-react"
import { useTheme } from "next-themes"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useTranslations } from "@/hooks/use-translations"
import type { Locale } from "@/context/I18nContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { t: navT, locale, setLocale } = useTranslations("navigation")
  const { t } = useTranslations("common")

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1045) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setMounted(true)
    const supabase = getSupabaseBrowserClient()

    supabase.auth.getSession().then(({ data }) => {
      setIsSignedIn(!!data.session)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session)
    })

    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById("mobile-nav")
      const button = document.getElementById("mobile-menu-button")

      if (
        isMenuOpen &&
        nav &&
        button &&
        !nav.contains(event.target as Node) &&
        !button.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      sub.subscription.unsubscribe()
    }
  }, [isMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])


  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-300 ease-in-out`}
      style={{
        top: `calc(${scrolled ? "1rem" : "0px"} + var(--unofficial-banner-height, 0px))`
      }}
    >
      <div className={`w-full mx-auto transition-all duration-300 ease-in-out ${scrolled ? "max-w-[1385px] px-4 min-[1045px]:px-6" : "max-w-full px-0"
        }`}>
        <div
          className={`w-full bg-background/80 backdrop-blur-md transition-all duration-300 ease-in-out ${scrolled
            ? "rounded-2xl border border-border shadow-md"
            : "rounded-none border-b border-transparent shadow-none"
            }`}
        >
          <div className="grid [grid-template-columns:auto_1fr_auto] h-14 items-center px-4 min-[1045px]:px-6">
            {/* Logo and App Name */}
            <div className="flex items-center space-x-3 justify-self-start">
              {/* light icon */}
              <Image
                src="/icon-light.png"
                alt="CAPlayground icon"
                width={32}
                height={32}
                className="rounded-lg block dark:hidden"
                priority
              />
              {/* dark icon */}
              <Image
                src="/icon-dark.png"
                alt="CAPlayground icon"
                width={32}
                height={32}
                className="rounded-lg hidden dark:block"
              />
              <Link
                href="/"
                className="font-helvetica-neue text-xl font-bold text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                CAPlayground
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden min-[1045px]:flex items-center justify-center gap-6 justify-self-center">
              <Link href="/docs" className="text-foreground hover:text-accent transition-colors">
                {navT("docs")}
              </Link>
              <Link href="/contributors" className="text-foreground hover:text-accent transition-colors">
                {navT("contributors")}
              </Link>
              <Link href="/roadmap" className="text-foreground hover:text-accent transition-colors">
                {navT("roadmap")}
              </Link>
              <Link href="/wallpapers" className="text-foreground hover:text-accent transition-colors">
                {navT("wallpapers")}
              </Link>
            </div>

            {/* Right actions */}
            <div className="hidden min-[1045px]:flex items-center gap-4 justify-self-end">
              {isSignedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("account")}
                      className="rounded-full h-9 w-9 p-0"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => (window.location.href = "/dashboard")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" /> {navT("dashboard")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        const supabase = getSupabaseBrowserClient()
                        await fetch('/api/auth/signout', { method: 'POST' })
                        await supabase.auth.signOut()
                        window.location.href = "/"
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> {navT("signOut")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/signin">
                  <Button variant="outline" className="font-semibold">
                    {navT("signIn")}
                  </Button>
                </Link>
              )}
              <Link href="/projects">
                <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  {t("projects")} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Switch language"
                    className="rounded-full h-9 w-9 p-0"
                  >
                    <Languages className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={() => setLocale("en")} className={locale === "en" ? "bg-accent/10" : ""}>
                    English {locale === "en" ? "✓" : ""}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocale("zh-CN")} className={locale === "zh-CN" ? "bg-accent/10" : ""}>
                    中文 {locale === "zh-CN" ? "✓" : ""}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full h-9 w-9 p-0"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-button"
              className="min-[1045px]:hidden p-2 rounded-lg hover:bg-muted transition-colors justify-self-end"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div
            id="mobile-nav"
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-120 opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <div
              className={`rounded-b-2xl bg-background/95 backdrop-blur-sm transition-all ${scrolled
                ? "border border-t-0 border-border shadow-md"
                : "border border-t-0 border-transparent shadow-none"
                }`}
            >
              <div className="flex flex-col space-y-1 py-2">
                {/* top quick links */}
                <Link
                  href="/docs"
                  className="text-foreground hover:text-accent hover:bg-muted/50 transition-all duration-200 py-3 px-6 rounded-lg mx-2 text-4xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {navT("docs")}
                </Link>
                <Link
                  href="/roadmap"
                  className="text-foreground hover:text-accent hover:bg-muted/50 transition-all duration-200 py-3 px-6 rounded-lg mx-2 text-4xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {navT("roadmap")}
                </Link>
                <Link
                  href="/wallpapers"
                  className="text-foreground hover:text-accent hover:bg-muted/50 transition-all duration-200 py-3 px-6 rounded-lg mx-2 text-4xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {navT("wallpapers")}
                </Link>
                <Link
                  href="/contributors"
                  className="text-foreground hover:text-accent hover:bg-muted/50 transition-all duration-200 py-3 px-6 rounded-lg mx-2 text-4xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {navT("contributors")}
                </Link>
                {/* bottom primary actions */}
                <div className="px-2 pt-2 pb-3 my-2">
                  <div className="flex gap-3">
                    {isSignedIn ? (
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full text-lg h-10"
                          aria-label={t("account")}
                        >
                          {t("account")}
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/signin" onClick={() => setIsMenuOpen(false)} className="flex-1">
                        <Button variant="outline" className="w-full text-lg h-10">
                          {navT("signIn")}
                        </Button>
                      </Link>
                    )}
                    <Link href="/projects" onClick={() => setIsMenuOpen(false)} className="flex-1">
                      <Button
                        variant="default"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold w-full text-lg h-10"
                      >
                        {t("projects")} <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="px-1 pb-3">
                  <Button
                    variant="ghost"
                    className="w-full text-base h-9"
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark")
                      setIsMenuOpen(false)
                    }}
                  >
                    {mounted && theme === "dark" ? (
                      <>
                        <Sun className="h-5 w-5 mr-2" /> {t("lightMode")}
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 mr-2" /> {t("darkMode")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
