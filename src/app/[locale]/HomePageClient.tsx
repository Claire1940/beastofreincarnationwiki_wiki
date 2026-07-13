"use client";

import { Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Hammer,
  Lightbulb,
  Map,
  MapPin,
  ShoppingBag,
  Skull,
  Sparkles,
  Swords,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
// import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Shared module header (eyebrow + icon + title + subtitle + intro).
// Presentational helper only — each module still renders its own independent <section>.
function ModuleHeader({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  intro,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
        <Icon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">{title}</h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {subtitle}
      </p>
      <p className="text-sm md:text-base text-muted-foreground/70 max-w-3xl mx-auto mt-3 leading-relaxed">
        {intro}
      </p>
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.beastofreincarnationwiki.wiki";
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Beast of Reincarnation Wiki",
        description:
          "Complete Beast of Reincarnation Wiki covering release date, platforms, combat, parries, builds, bosses, Nushi, characters, story, maps, editions, and updates.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Beast of Reincarnation - One-Person, One-Dog Action RPG",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Beast of Reincarnation Wiki",
        alternateName: "Beast of Reincarnation",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Beast of Reincarnation Wiki - One-Person, One-Dog Action RPG",
        },
        sameAs: [
          "https://store.steampowered.com/app/2001760/Beast_of_Reincarnation/",
          "https://www.playstation.com/en-us/games/beast-of-reincarnation/",
          "https://www.xbox.com/en-US/games/beast-of-reincarnation",
          "https://fictions.com/games/beast-of-reincarnation",
          "https://discord.gg/fictionsinc",
          "https://x.com/fictionsinc",
          "https://www.youtube.com/@fictionsinc",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Beast of Reincarnation",
        gamePlatform: ["PC", "PlayStation 5", "Xbox Series X|S"],
        applicationCategory: "Game",
        genre: ["Action RPG", "Action-Adventure"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/PreOrder",
          url: "https://store.steampowered.com/app/2001760/Beast_of_Reincarnation/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Beast of Reincarnation - Release Date Announce Trailer",
        description:
          "Official Beast of Reincarnation Release Date Announce Trailer from PlayStation, featuring Emma and Koo's one-person, one-dog action RPG set in post-apocalyptic Japan.",
        uploadDate: "2026-02-12",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/zqxdVtJ24ms",
        url: "https://www.youtube.com/watch?v=zqxdVtJ24ms",
      },
    ],
  };

  // Tools Grid navigation targets (8 cards <-> 8 module sections)
  const toolSectionIds = [
    "release-date-and-platforms",
    "editions-and-pre-order",
    "beginner-guide",
    "combat-and-parry",
    "builds-and-gear",
    "nushi-and-bosses",
    "characters-and-story",
    "world-and-exploration",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/2001760/Beast_of_Reincarnation/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域，作为新游戏主题的宣传视频展示 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="zqxdVtJ24ms"
              title="Beast of Reincarnation - Release Date Announce Trailer"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Tools Grid - 8 Navigation Cards */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => (
              <button
                key={index}
                onClick={() => scrollToSection(toolSectionIds[index])}
                className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                           bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                           transition-all duration-300 cursor-pointer text-left
                           hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                >
                  <DynamicIcon
                    name={card.icon}
                    className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                  />
                </div>
                <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                  {card.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {card.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Release Date and Platforms */}
      <section id="release-date-and-platforms" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Calendar}
            eyebrow={t.modules.releaseDateAndPlatforms.eyebrow}
            title={t.modules.releaseDateAndPlatforms.title}
            subtitle={t.modules.releaseDateAndPlatforms.subtitle}
            intro={t.modules.releaseDateAndPlatforms.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.releaseDateAndPlatforms.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-3">
                    {item.label}
                  </span>
                  <p className="text-lg md:text-xl font-bold text-[hsl(var(--nav-theme-light))] mb-2">
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.details}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Editions and Pre-Order */}
      <section
        id="editions-and-pre-order"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={ShoppingBag}
            eyebrow={t.modules.editionsAndPreOrder.eyebrow}
            title={t.modules.editionsAndPreOrder.title}
            subtitle={t.modules.editionsAndPreOrder.subtitle}
            intro={t.modules.editionsAndPreOrder.intro}
          />
          {/* Desktop comparison table */}
          <div className="scroll-reveal hidden md:block overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-left p-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                    Standard
                  </th>
                  <th className="text-left p-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                    Digital Deluxe
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.editionsAndPreOrder.items.map(
                  (item: any, index: number) => (
                    <tr key={index} className="border-t border-border">
                      <td className="p-4 font-medium">{item.feature}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {item.standard}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {item.digitalDeluxe}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile stacked cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.editionsAndPreOrder.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 border border-border rounded-xl"
                >
                  <p className="font-semibold mb-3">{item.feature}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        Standard
                      </p>
                      <p className="text-sm">{item.standard}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1">
                        Deluxe
                      </p>
                      <p className="text-sm">{item.digitalDeluxe}</p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={BookOpen}
            eyebrow={t.modules.beginnerGuide.eyebrow}
            title={t.modules.beginnerGuide.title}
            subtitle={t.modules.beginnerGuide.subtitle}
            intro={t.modules.beginnerGuide.intro}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.beginnerGuide.items.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {step.step}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                    <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {step.tip}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 中段阅读停顿 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 4: Combat and Parry */}
      <section
        id="combat-and-parry"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Swords}
            eyebrow={t.modules.combatAndParryGuide.eyebrow}
            title={t.modules.combatAndParryGuide.title}
            subtitle={t.modules.combatAndParryGuide.subtitle}
            intro={t.modules.combatAndParryGuide.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.combatAndParryGuide.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.5)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-base md:text-lg">{item.action}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold text-[hsl(var(--nav-theme-light))]">
                      Result:{" "}
                    </span>
                    <span className="text-muted-foreground">{item.result}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-[hsl(var(--nav-theme-light))]">
                      Focus:{" "}
                    </span>
                    <span className="text-muted-foreground">{item.playerFocus}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Builds and Gear */}
      <section id="builds-and-gear" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Hammer}
            eyebrow={t.modules.buildsAndGearGuide.eyebrow}
            title={t.modules.buildsAndGearGuide.title}
            subtitle={t.modules.buildsAndGearGuide.subtitle}
            intro={t.modules.buildsAndGearGuide.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.buildsAndGearGuide.items.map((build: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))] mb-1">
                  {build.name}
                </h3>
                <p className="text-sm font-medium mb-3">{build.playstyle}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {build.coreTools.map((tool: string, ti: number) => (
                    <span
                      key={ti}
                      className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{build.howItWorks}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 6: Nushi and Bosses */}
      <section
        id="nushi-and-bosses"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Skull}
            eyebrow={t.modules.nushiAndBossesGuide.eyebrow}
            title={t.modules.nushiAndBossesGuide.title}
            subtitle={t.modules.nushiAndBossesGuide.subtitle}
            intro={t.modules.nushiAndBossesGuide.intro}
          />
          <div className="scroll-reveal space-y-4">
            {t.modules.nushiAndBossesGuide.items.map((boss: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg md:text-xl text-[hsl(var(--nav-theme-light))]">
                    {boss.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]">
                    {boss.type}
                  </span>
                </div>
                <p className="flex items-start gap-1.5 text-xs text-muted-foreground mb-3">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  {boss.location}
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Flow: </span>
                    <span className="text-muted-foreground">{boss.encounterFlow}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Combat: </span>
                    <span className="text-muted-foreground">{boss.combatFocus}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-[hsl(var(--nav-theme-light))]">
                      Reward:{" "}
                    </span>
                    <span className="text-muted-foreground">{boss.reward}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Characters and Story */}
      <section id="characters-and-story" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Users}
            eyebrow={t.modules.charactersAndStory.eyebrow}
            title={t.modules.charactersAndStory.title}
            subtitle={t.modules.charactersAndStory.subtitle}
            intro={t.modules.charactersAndStory.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.charactersAndStory.items.map((char: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                    {char.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {char.role}
                  </span>
                </div>
                <p className="text-sm font-medium italic mb-3 text-muted-foreground">
                  {char.identity}
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Abilities: </span>
                    <span className="text-muted-foreground">{char.abilities}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Story: </span>
                    <span className="text-muted-foreground">{char.story}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 7: 中后段阅读停顿 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 8: World and Exploration */}
      <section
        id="world-and-exploration"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Map}
            eyebrow={t.modules.worldAndExplorationGuide.eyebrow}
            title={t.modules.worldAndExplorationGuide.title}
            subtitle={t.modules.worldAndExplorationGuide.subtitle}
            intro={t.modules.worldAndExplorationGuide.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.worldAndExplorationGuide.items.map(
              (region: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{region.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {region.regionType}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {region.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {region.explorationFeatures.map((f: string, fi: number) => (
                      <span
                        key={fi}
                        className="text-xs px-2 py-1 rounded-md bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)] text-muted-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm">
                    <span className="font-semibold text-[hsl(var(--nav-theme-light))]">
                      Dangers &amp; Rewards:{" "}
                    </span>
                    <span className="text-muted-foreground">
                      {region.dangersAndRewards}
                    </span>
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/fictionsinc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/fictionsinc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@fictionsinc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/2001760/Beast_of_Reincarnation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
