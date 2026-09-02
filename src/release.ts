export const releaseTag = import.meta.env.VITE_RELEASE_TAG || 'v0.1.14';
export const releaseCommit = import.meta.env.VITE_RELEASE_COMMIT || 'local-preview';

/** Identifies a packaged desktop build without exposing any user data. */
export const buildIdentity = releaseCommit !== 'local-preview'
  ? `${releaseTag} · ${releaseCommit.slice(0, 12)}`
  : `${releaseTag} · local preview`;
