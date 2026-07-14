// When true, unpublished (future-dated or undated) posts are included in
// listings so they can be previewed before going live. Hidden posts are
// always excluded, regardless of this setting.
export const isStagingMode = () => process.env.STAGING_MODE === 'true';

// Mirrors the server's Article.IsPublished(): a publish date must be set and
// in the past. A future-dated post has publishedAt !== 0 but isn't live yet.
export const isPublished = (item: { publishedAt: number }) =>
  item.publishedAt > 0 && item.publishedAt <= Date.now() / 1000;

export const isVisible = (item: { publishedAt: number; hidden: boolean }) => {
  if (item.hidden) {
    return false;
  }
  if (isStagingMode()) {
    return true;
  }
  return isPublished(item);
};
