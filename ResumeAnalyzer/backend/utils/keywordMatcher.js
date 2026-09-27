const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^\w\s+#./-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Keywords with their common variations.
// All variations map to one canonical keyword.
const keywordGroups = {
  javascript: ["javascript", "js"],
  typescript: ["typescript", "ts"],

  react: ["react", "react.js", "reactjs"],
  angular: ["angular"],
  vue: ["vue", "vue.js"],
  nextjs: ["next.js", "nextjs"],

  nodejs: ["node.js", "nodejs"],
  express: ["express", "express.js", "expressjs"],

  python: ["python"],
  java: ["java"],
  cpp: ["c++"],
  csharp: ["c#", "c sharp"],
  php: ["php"],

  html: ["html"],
  css: ["css"],
  tailwind: ["tailwind", "tailwindcss"],
  bootstrap: ["bootstrap"],
  redux: ["redux"],

  mongodb: ["mongodb", "mongo db"],
  mysql: ["mysql"],
  postgresql: ["postgresql", "postgres"],
  sql: ["sql"],
  redis: ["redis"],
  firebase: ["firebase"],

  restapi: ["rest api", "restful api", "restful", "rest"],
  graphql: ["graphql"],
  websocket: ["websocket", "web sockets"],

  aws: ["aws", "amazon web services"],
  azure: ["azure"],
  gcp: ["gcp", "google cloud"],
  docker: ["docker"],
  kubernetes: ["kubernetes"],
  jenkins: ["jenkins"],
  githubactions: ["github actions"],

  git: ["git"],
  github: ["github"],
  gitlab: ["gitlab"],
  npm: ["npm"],
  vite: ["vite"],
  postman: ["postman"],
  thunderclient: ["thunder client", "thunderclient"],

  jwt: ["jwt", "json web token"],
  authentication: ["authentication"],
  authorization: ["authorization"],
  responsiveDesign: ["responsive design"],

  datastructures: [
    "data structures",
    "data structure",
  ],

  algorithms: [
    "algorithms",
    "algorithm",
  ],

  oop: [
    "oop",
    "object oriented programming",
    "object-oriented programming",
  ],

  testing: ["testing", "unit testing"],
  debugging: ["debugging"],

  machinelearning: [
    "machine learning",
  ],

  artificialintelligence: [
    "artificial intelligence",
    "ai",
  ],

  tensorflow: ["tensorflow"],
  pytorch: ["pytorch"],
  gemini: ["gemini"],
  openai: ["openai"],
};


// Check whether a keyword/phrase exists as a
// complete word or phrase.
const containsKeyword = (text, keyword) => {
  const escapedKeyword = keyword
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, "\\s+");

  const regex = new RegExp(
    `(^|\\s)${escapedKeyword}(?=\\s|$)`,
    "i"
  );

  return regex.test(text);
};


const matchKeywords = (
  resumeText,
  jobDescription = ""
) => {
  // No job description
  if (!jobDescription.trim()) {
    return {
      matched: [],
      missing: [],
      recommended: [],
      keywordOptimization: 0,
    };
  }

  const resume = normalizeText(resumeText);
  const jobDescriptionText =
    normalizeText(jobDescription);

  const matched = [];
  const missing = [];

  // Check every canonical keyword
  Object.entries(keywordGroups).forEach(
    ([canonicalKeyword, variations]) => {
      // Does this keyword appear in JD?
      const appearsInJobDescription =
        variations.some((variation) =>
          containsKeyword(
            jobDescriptionText,
            normalizeText(variation)
          )
        );

      if (!appearsInJobDescription) {
        return;
      }

      // Does this keyword appear in resume?
      const appearsInResume =
        variations.some((variation) =>
          containsKeyword(
            resume,
            normalizeText(variation)
          )
        );

      if (appearsInResume) {
        matched.push(canonicalKeyword);
      } else {
        missing.push(canonicalKeyword);
      }
    }
  );

  const totalKeywords =
    matched.length + missing.length;

  const keywordOptimization =
    totalKeywords > 0
      ? Math.round(
          (matched.length / totalKeywords) * 100
        )
      : 0;

  // Recommend the first 10 missing keywords
  const recommended = missing.slice(0, 10);

  return {
    matched,
    missing,
    recommended,
    keywordOptimization,
  };
};

export default matchKeywords;