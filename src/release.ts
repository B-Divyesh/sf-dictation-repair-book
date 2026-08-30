const releaseTag = import.meta.env.VITE_RELEASE_TAG || 'v0.1.6';
const releaseCommit = import.meta.env.VITE_RELEASE_COMMIT;

/** Identifies a packaged desktop build without exposing any user data. */
export const buildIdentity = releaseCommit
  ? `${releaseTag} · ${releaseCommit.slice(0, 12)}`
  : `${releaseTag} · local preview`;
