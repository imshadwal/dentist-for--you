import { ReactGoogleReviews } from "react-google-reviews";
import "react-google-reviews/dist/index.css";

type Props = {
  featurableId: string;
  layout: "badge" | "carousel";
};

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
      layout="carousel"
      featurableId={featurableId}
      widgetVersion="v2"
      theme="light"
      nameDisplay="fullNames"
      dateDisplay="relative"
      reviewVariant="card"
      maxCharacters={220}
      carouselAutoplay
      carouselSpeed={4500}
      maxItems={3}
      hideEmptyReviews
      logoVariant="icon"
    />
  );
}
