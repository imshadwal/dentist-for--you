import { useEffect, useState } from "react";
import { ReactGoogleReviews } from "react-google-reviews";
import type { ReactGoogleReview } from "react-google-reviews";
import "react-google-reviews/dist/index.css";

type Props = {
  featurableId: string;
  layout: "badge" | "carousel";
};

type ReviewCard = {
  id: string;
  name: string;
  photo: string;
  rating: number;
  text: string;
  date: string;
};

function relativeTime(value: string) {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return "";

  const days = Math.max(0, Math.round((Date.now() - timestamp) / 86_400_000));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;

  const months = Math.round(days / 30);
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;

  const years = Math.round(days / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

function normalizeReview(review: ReactGoogleReview | Record<string, unknown>): ReviewCard | null {
  const record = review as Record<string, unknown>;
  const reviewer = record.reviewer as
    | { displayName?: string; profilePhotoUrl?: string }
    | undefined;
  const author = record.author as
    | { name?: string; avatarUrl?: string; photoUrl?: string }
    | undefined;
  const ratingValue =
    typeof record.starRating === "number"
      ? record.starRating
      : Number((record.rating as { value?: number } | undefined)?.value ?? 0);
  const text =
    (typeof record.comment === "string" && record.comment) ||
    (typeof record.text === "string" && record.text) ||
    "";
  const name = reviewer?.displayName || author?.name || "Google user";
  const id = String(record.reviewId || record.id || name);

  if (!ratingValue) return null;

  return {
    id,
    name,
    photo: reviewer?.profilePhotoUrl || author?.avatarUrl || author?.photoUrl || "",
    rating: ratingValue,
    text,
    date: String(record.createTime || record.publishedAt || ""),
  };
}

function GoogleGLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function ReviewsCarousel({ reviews }: { reviews: ReviewCard[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1100) setVisible(3);
      else if (width >= 768) setVisible(2);
      else setVisible(1);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    setIndex((current) => {
      if (reviews.length === 0) return 0;
      return Math.min(current, Math.max(0, reviews.length - 1));
    });
  }, [reviews.length, visible]);

  const step = Math.min(visible, reviews.length || 1);
  const go = (direction: -1 | 1) => {
    setIndex((current) => (current + direction + reviews.length) % reviews.length);
  };

  useEffect(() => {
    if (paused || reviews.length <= step) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % reviews.length);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [paused, reviews.length, step]);

  if (reviews.length === 0) {
    return null;
  }

  const cards = Array.from({ length: step }, (_, offset) => reviews[(index + offset) % reviews.length]);

  return (
    <div
      className="google-reviews-pager"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className={`grid gap-4 ${step === 3 ? "grid-cols-3" : step === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {cards.map((review) => (
          <article
            key={`${review.id}-${index}`}
            className="flex min-h-[240px] min-w-0 flex-col gap-3 rounded-[28px] border border-[#d6e6fb] bg-white p-5 shadow-[0_18px_40px_rgba(31,63,117,0.08)]"
          >
            <header className="flex items-center gap-3">
              {review.photo ? (
                <img
                  src={review.photo}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f1fb] text-base font-extrabold text-[#2b5d9e]">
                  {review.name.slice(0, 1).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="m-0 truncate font-extrabold text-[#294073]">{review.name}</p>
                <p className="m-0 text-sm text-[#3d5278]">{relativeTime(review.date)}</p>
              </div>
            </header>
            <p className="m-0 line-clamp-6 min-w-0 text-base leading-relaxed break-words text-[#294073]">
              {review.text || "Rated on Google."}
            </p>
            <div className="mt-auto flex items-center justify-between pt-1">
              <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= review.rating ? "text-[#f5b400]" : "text-[#d6e6fb]"}>
                    ★
                  </span>
                ))}
              </div>
              <GoogleGLogo />
            </div>
          </article>
        ))}
      </div>

      {reviews.length > step ? (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#2b5d9e] text-lg font-bold text-white"
            aria-label="Previous reviews"
            onClick={() => go(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#2b5d9e] text-lg font-bold text-white"
            aria-label="Next reviews"
            onClick={() => go(1)}
          >
            ›
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function GoogleReviewsWidget({ featurableId, layout }: Props) {
  if (layout === "badge") {
    return (
      <ReactGoogleReviews
        layout="badge"
        featurableId={featurableId}
        widgetVersion="v2"
        theme="light"
        structuredData
        brandName="Dentist For You"
        productName="Dentist For You"
        badgeLabel="Google rating"
      />
    );
  }

  return (
    <ReactGoogleReviews
      layout="custom"
      featurableId={featurableId}
      widgetVersion="v2"
      hideEmptyReviews
      renderer={(reviews) => {
        const cards = reviews.map(normalizeReview).filter((review): review is ReviewCard => review !== null);
        return <ReviewsCarousel reviews={cards} />;
      }}
    />
  );
}
