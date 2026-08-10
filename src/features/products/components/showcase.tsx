"use client";

import { AnimatePresence, motion, type Transition } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Fingerprint,
  Radio,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionCorners } from "@/shared/components/ui/section-corners";

const MORPH_TRANSITION: Transition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
};

type ShowcaseCard = {
  id: string;
  i18nKey: string;
  title: string;
  Icon: LucideIcon;
  body: string;
  url: string;
  image: { vertical: string; horizontal: string };
};

const CARDS: ReadonlyArray<ShowcaseCard> = [
  {
    id: "peridot",
    i18nKey: "peridot",
    title: "Peridot",
    Icon: Gamepad2,
    body: "",
    url: "https://peridotvault.com",
    image: {
      vertical: "/products/peridot-vertical.png",
      horizontal: "/products/peridot-horizontal.png",
    },
  },
  {
    id: "peridot-id",
    i18nKey: "peridotId",
    title: "Peridot ID",
    Icon: Fingerprint,
    body: "",
    url: "https://peridot-id.peridotvault.com",
    image: {
      vertical: "/products/peridotid-vertical.png",
      horizontal: "/products/peridotid-horizontal.png",
    },
  },
  {
    id: "live2dev",
    i18nKey: "live2dev",
    title: "Live2dev",
    Icon: Radio,
    body: "",
    url: "https://live2dev.com",
    image: {
      vertical: "/products/live2dev-vertical.png",
      horizontal: "/products/live2dev-horizontal.png",
    },
  },
];

export function Showcase(): ReactNode {
  const t = useTranslations("products");
  const [activeId, setActiveId] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const headingId = useId();

  const recompute = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector<HTMLElement>("[data-card]");
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0");
    const step = cardWidth + gap;
    if (step <= 0) {
      setPage(0);
      setPageCount(1);
      return;
    }
    const totalScrollable = track.scrollWidth - track.clientWidth;
    const pages = Math.max(1, Math.round(totalScrollable / step) + 1);
    const current = Math.round(track.scrollLeft / step);
    setPageCount(pages);
    setPage(Math.min(pages - 1, Math.max(0, current)));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = (): void => recompute();
    track.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => recompute());
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [recompute]);

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activeId]);

  const scrollByCards = useCallback((direction: 1 | -1): void => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector<HTMLElement>("[data-card]");
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0");
    track.scrollBy({ left: direction * (cardWidth + gap), behavior: "smooth" });
  }, []);

  const activeCard = activeId
    ? (CARDS.find((c) => c.id === activeId) ?? null)
    : null;

  return (
    <section
      id="products"
      aria-labelledby={headingId}
      className="relative border-b border-border"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 lg:border-r lg:border-border lg:px-14 lg:py-24">
          <h2
            id={headingId}
            className="text-4xl font-medium leading-[1.05] tracking-tighter text-foreground sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]"
          >
            {t("heading")}
            <br />
            <span className="text-muted-foreground">{t("subheading")}</span>
          </h2>
        </div>

        <div className="relative flex flex-col overflow-hidden">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-smooth px-6 py-16 sm:gap-6 sm:px-10 sm:py-20 lg:px-14 lg:py-24 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {CARDS.map((card) => (
              <Card
                key={card.id}
                card={card}
                hidden={activeId === card.id}
                onClick={() => setActiveId(card.id)}
              />
            ))}
            <div
              aria-hidden="true"
              className="shrink-0 basis-6 sm:basis-10 lg:basis-14"
            />
          </div>

          <div className="flex items-center justify-center gap-2 px-6 pb-10 sm:px-10 sm:pb-12 lg:px-14 lg:pb-14">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              disabled={page === 0}
              aria-label="Previous card"
              className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div
              role="tablist"
              aria-label="Card progress"
              className="flex h-8 items-center gap-2 rounded-full bg-muted px-4"
            >
              {Array.from({ length: pageCount }).map((_, i) => (
                <span
                  key={i}
                  role="tab"
                  aria-selected={i === page}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === page
                      ? "w-6 bg-foreground"
                      : "w-1.5 bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              disabled={page >= pageCount - 1}
              aria-label="Next card"
              className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeCard ? (
          <ExpandedCard
            key="expanded"
            card={activeCard}
            onClose={() => setActiveId(null)}
          />
        ) : null}
      </AnimatePresence>
      <SectionCorners />
    </section>
  );
}

function Card({
  card,
  hidden,
  onClick,
}: {
  card: ShowcaseCard;
  hidden: boolean;
  onClick: () => void;
}): ReactNode {
  const t = useTranslations("products");
  const { Icon } = card;
  const title = t(`${card.i18nKey}.title`);
  return (
    <motion.div
      data-card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      layoutId={`card-${card.id}`}
      transition={MORPH_TRANSITION}
      style={{ visibility: hidden ? "hidden" : "visible" }}
      className="focus-ring group relative flex aspect-[3/4] w-[280px] shrink-0 cursor-pointer snap-center flex-col justify-between overflow-hidden rounded-2xl bg-muted p-6 text-left sm:w-[320px] sm:p-7 lg:w-[360px] lg:p-8"
    >
      <Image
        src={card.image.vertical}
        alt=""
        fill
        sizes="(max-width: 640px) 280px, 360px"
        className="absolute inset-0 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
      />
      <motion.div
        layoutId={`card-icon-${card.id}`}
        transition={MORPH_TRANSITION}
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
      >
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </motion.div>
      <div className="relative space-y-5">
        <motion.h3
          layoutId={`card-title-${card.id}`}
          transition={MORPH_TRANSITION}
          className="whitespace-pre-line text-xl font-medium leading-tight tracking-tight text-white sm:text-2xl"
        >
          {title}
        </motion.h3>
        <motion.a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("visit", { title })}
          onClick={(e) => e.stopPropagation()}
          className="focus-ring inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium tracking-tight text-white transition-colors hover:bg-white/20"
        >
          {card.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
        </motion.a>
      </div>
    </motion.div>
  );
}

function ExpandedCard({
  card,
  onClose,
}: {
  card: ShowcaseCard;
  onClose: () => void;
}): ReactNode {
  const t = useTranslations("products");
  const { Icon } = card;
  const title = t(`${card.i18nKey}.title`);
  const body = t(`${card.i18nKey}.body`);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 cursor-default bg-background/60 backdrop-blur-xl"
      />

      <motion.div
        layoutId={`card-${card.id}`}
        transition={MORPH_TRANSITION}
        className="relative z-10 flex aspect-[3/4] w-full max-w-[420px] flex-col justify-between overflow-hidden rounded-2xl bg-muted p-8 sm:aspect-auto sm:max-w-2xl sm:p-10 lg:p-12"
      >
        <Image
          src={card.image.vertical}
          alt=""
          fill
          sizes="(max-width: 640px) 420px, 672px"
          className="absolute inset-0 object-cover sm:hidden"
        />
        <Image
          src={card.image.horizontal}
          alt=""
          fill
          sizes="(max-width: 1024px) 672px, 896px"
          className="absolute inset-0 hidden object-cover sm:block"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        />
        <motion.div
          layoutId={`card-icon-${card.id}`}
          transition={MORPH_TRANSITION}
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
        >
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        </motion.div>

        <div className="relative mt-8 space-y-6 sm:mt-12">
          <motion.h3
            layoutId={`card-title-${card.id}`}
            transition={MORPH_TRANSITION}
            className="whitespace-pre-line text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl"
          >
            {title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{
              duration: 0.35,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-prose text-sm leading-relaxed text-white/80 sm:text-base"
          >
            {body}
          </motion.p>
          <motion.a
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("visit", { title })}
            className="focus-ring inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium tracking-tight text-white transition-colors hover:bg-white/20"
          >
            {card.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}
