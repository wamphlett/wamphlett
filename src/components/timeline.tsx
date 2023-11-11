import { Events } from '@/app/data';

import styles from './timeline.module.css';
import { Grids } from '@/app/types';
import { LocationIcon } from './svgs';
import Row from './imagegrids/row';
import Double from './imagegrids/double';
import TriWide from './imagegrids/triWide';
import TriSquare from './imagegrids/triSquare';
import Offset from './imagegrids/offset';

type TimelineProps = {
  events: Map<number, Events>;
};

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className={styles.container}>
      {Array.from(events.entries()).map((entry, index) => {
        let year = entry[0];
        let events = entry[1];
        return (
          <div className={styles.year} key={index}>
            <h2>{year}</h2>
            <span />
            <span />
            {events.map((event, index) => {
              return (
                <div key={index} className={styles.event}>
                  <div className={styles.details}>
                    {event.intro && (
                      <span className={styles.intro}>{event.intro}</span>
                    )}
                    <div className={styles.title}>
                      <h3>{event.title}</h3>
                      <LocationIcon />
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
                      switch (image.grid) {
                        case Grids.Row:
                          return (
                            <Row
                              key={index}
                              images={image.images}
                              aspectRatio={image.aspectRatio}
                            />
                          );
                        case Grids.Double:
                        case Grids.DoubleInverted:
                          return (
                            <Double
                              key={index}
                              inverted={image.grid == Grids.DoubleInverted}
                              images={image.images}
                            />
                          );
                        case Grids.TriWide:
                        case Grids.TriWideInverted:
                          return (
                            <TriWide
                              key={index}
                              inverted={image.grid == Grids.TriWideInverted}
                              images={image.images}
                            />
                          );
                        case Grids.TriSquare:
                        case Grids.TriSquareInverted:
                          return (
                            <TriSquare
                              key={index}
                              inverted={image.grid == Grids.TriSquareInverted}
                              images={image.images}
                            />
                          );
                        case Grids.Offset:
                        case Grids.OffsetInverted:
                          return (
                            <Offset
                              key={index}
                              inverted={image.grid == Grids.OffsetInverted}
                              images={image.images}
                            />
                          );
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
