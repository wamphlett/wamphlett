// When true, unpublished (future-dated or undated) posts are included in
// listings so they can be previewed before going live. Hidden posts are
// always excluded, regardless of this setting.
export const isStagingMode = () => process.env.STAGING_MODE === 'true';

export const isVisible = (item: { publishedAt: number; hidden: boolean }) => {
  if (item.hidden) {
    return false;
  }
  if (isStagingMode()) {
    return true;
  }
  return item.publishedAt !== 0;
};
