import { useEffect, useState } from "react";
import { ReactGoogleReviews } from "react-google-reviews";
import "react-google-reviews/dist/index.css";

type Props = {
  featurableId: string;
  layout: "badge" | "carousel";
};

function useCarouselItems() {
  const [maxItems, setMaxItems] = useState(1);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1100) {
        setMaxItems(3);
      } else if (width >= 768) {
        setMaxItems(2);
      } else {
        setMaxItems(1);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return maxItems;
}

export default function GoogleReviewsWidget({ featurableId, layout }: Props) {
  const maxItems = useCarouselItems();

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
      key={maxItems}
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
      maxItems={maxItems}
      hideEmptyReviews
      logoVariant="icon"
    />
  );
}
