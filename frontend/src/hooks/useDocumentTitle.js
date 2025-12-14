import { useEffect } from "react";

/**
 * Updates the document title with a consistent suffix.
 */
export default function useDocumentTitle(title, options = {}) {
  const suffix = options.suffix ?? "FreelanceHub";
  const finalTitle = title ? `${title} | ${suffix}` : suffix;

  useEffect(() => {
    const previous = document.title;
    document.title = finalTitle;
    return () => {
      document.title = previous;
    };
  }, [finalTitle]);
}

