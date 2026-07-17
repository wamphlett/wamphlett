import type { Events } from '@/app/data';

import styles from './timeline.module.css';
import { ContentType, EventType, Grids } from '@/app/types';
import { CareerIcon, LocationIcon } from './svgs';
import Row from './imagegrids/row';
import Double from './imagegrids/double';
import TriWide from './imagegrids/triWide';
import TriSquare from './imagegrids/triSquare';
import Offset from './imagegrids/offset';
import LazyImage from './lazyimage';
import AspectRatioBox from './aspectRatioBox';

type TimelineProps = {
  events: Map<number, Events>;
};

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className={styles.container}>
      {Array.from(events.entries()).map((entry, index) => {
        const year = entry[0];
        const events = entry[1];
        return (
          <div className={styles.year} key={index}>
            <h2>{year}</h2>
            <span />
            <span />
            {events.map((event, index) => {
              return (
                <div className={styles.event} key={index}>
                  <div className={styles.details}>
                    {event.icon && (
                      <div className={styles.icon}>
                        <AspectRatioBox aspectRatio={1}>
                          <LazyImage sizes="140px" url={event.icon} />
                        </AspectRatioBox>
                      </div>
                    )}
                    {event.intro && (
                      <span className={styles.intro}>{event.intro}</span>
                    )}
                    <div className={styles.title}>
                      <h3>{event.title}</h3>
                      {event.type == EventType.Travel ? (
                        <LocationIcon />
                      ) : (
                        <CareerIcon />
                      )}
                    </div>
                    {event.tagline && (
                      <span className={styles.tagline}>{event.tagline}</span>
                    )}
                  </div>
                  <div
                    className={styles.images}
                    style={{ maxWidth: event.small ? 800 : undefined }}
                  >
                    {event.images.map((image, index) => {
                      if (image.kind == ContentType.ImageGrid) {
                        switch (image.grid) {
                          case Grids.Row:
                            return (
                              <Row
                                aspectRatio={image.aspectRatio}
                                images={image.images}
                                key={index}
                              />
                            );
                          case Grids.Double:
                          case Grids.DoubleInverted:
                            return (
                              <Double
                                images={image.images}
                                inverted={image.grid == Grids.DoubleInverted}
                                key={index}
                              />
                            );
                          case Grids.TriWide:
                          case Grids.TriWideInverted:
                            return (
                              <TriWide
                                images={image.images}
                                inverted={image.grid == Grids.TriWideInverted}
                                key={index}
                              />
                            );
                          case Grids.TriSquare:
                          case Grids.TriSquareInverted:
                            return (
                              <TriSquare
                                images={image.images}
                                inverted={image.grid == Grids.TriSquareInverted}
                                key={index}
                              />
                            );
                          case Grids.Offset:
                          case Grids.OffsetInverted:
                            return (
                              <Offset
                                images={image.images}
                                inverted={image.grid == Grids.OffsetInverted}
                                key={index}
                              />
                            );
                        }
                      }
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <div className={styles.tail}>
        <span />
        <span />
        <span />
        <span />
      </div>
      <span className={styles.note}>other less important life things</span>
    </div>
  );
}
