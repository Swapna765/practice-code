const clampScore = (value) => {
  const score = Number(value);

  if (Number.isNaN(score)) {
    return 0;
  }

  return Math.min(100, Math.max(0, score));
};

const calculateATSScore = (metrics) => {
  const atsCompatibility = clampScore(
    metrics.atsCompatibility
  );

  const keywordOptimization = clampScore(
    metrics.keywordOptimization
  );

  const contentQuality = clampScore(
    metrics.contentQuality
  );

  const formatting = clampScore(
    metrics.formatting
  );

  /*
    ATS Score weighting:

    ATS Compatibility      → 35%
    Keyword Optimization   → 25%
    Content Quality        → 25%
    Formatting             → 15%
  */

  const score =
    atsCompatibility * 0.35 +
    keywordOptimization * 0.25 +
    contentQuality * 0.25 +
    formatting * 0.15;

  return Math.round(
    Math.min(100, Math.max(0, score))
  );
};

export default calculateATSScore;