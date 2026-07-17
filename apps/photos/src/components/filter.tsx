'use client';
import React, { useState } from 'react';

import styles from './filter.module.css';
import Pill from './pill';

interface FilterPros {
  onUpdate?: (activeTags: string[]) => void;
}

type Tag = {
  name: string;
  values: string[];
};

const tags: Tag[] = [
  { name: 'people', values: ['people'] },
  { name: 'street', values: ['street'] },
  { name: 'architectural', values: ['architectural'] },
  { name: 'landscapes', values: ['landscape'] },
  { name: 'my favourites', values: ['favourite'] },
];

type activeTags = {
  [key: string]: string[];
};

export default function Filter({ onUpdate }: FilterPros) {
  const [activeTags, setActiveTags] = useState<activeTags>({});

  return (
    <div className={styles.container}>
      {tags.map((tag, i) => {
        return (
          <Pill
            active={tag.name in activeTags}
            key={i}
            name={tag.name}
            onClick={() => {
              let newActiveTags;
              if (tag.name in activeTags) {
                newActiveTags = { ...activeTags };
                delete newActiveTags[tag.name];
              } else {
                newActiveTags = { ...activeTags, [tag.name]: tag.values };
              }

              setActiveTags(newActiveTags);

              if (onUpdate) {
                const activeTagsArray = Object.values(newActiveTags).reduce(
                  (acc, val) => {
                    return [...acc, ...val];
                  },
                  [],
                );
                onUpdate(activeTagsArray);
              }
            }}
            tags={tag.values}
          />
        );
      })}
    </div>
  );
}
