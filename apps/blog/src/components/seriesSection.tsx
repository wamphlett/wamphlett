import styles from './seriesSection.module.css';
import { Series } from '@/util/API';
import SeriesSteps from './seriesSteps';

type SeriesSectionProps = {
  series: Series;
  currentSlug: string;
};

export default function SeriesSection({
  series,
  currentSlug,
}: SeriesSectionProps) {
  const publishedCount = series.articles.filter(a => a.published).length;

  return (
    <div className={styles.container}>
      <span className={styles.label}>This post is part of a series</span>
      <div className={styles.headerRow}>
        <span className={styles.name}>{series.name}</span>
        <span className={styles.progress}>
          {publishedCount} of {series.articles.length} published
        </span>
      </div>

      <span className={styles.subheading}>Read related articles</span>

      <SeriesSteps series={series} currentSlug={currentSlug} />
    </div>
  );
}
