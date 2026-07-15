'use client'
import React, { useState, useRef, useEffect, useCallback } from "react";

import styles from './filter.module.css';
import Pill from "./pill";

enum DisplayType {
  FullWidth,
  Split,
  Thirds,
}

interface FilterPros {
  onUpdate?: (activeTags: string[]) => void;
}

type Tag = {
  name: string;
  values: string[];
};

const tags: Tag[] = [
  { name: "people", values: ["people"] },
  { name: "street", values: ["street"] },
  { name: "architectural", values: ["architectural"] },
  { name: "landscapes", values: ["landscape"] },
  { name: "my favourites", values: ["favourite"] },
];

type activeTags = {
  [key: string]: string[];
};

export default function Filter({ onUpdate }: FilterPros) {
  const [activeTags, setActiveTags] = useState<activeTags>({});

  return (
    <div className={styles.container}>
      {tags.map((tag, i) => {
        return <Pill key={i} name={tag.name} tags={tag.values} active={tag.name in activeTags} onClick={() => {
          let newActiveTags
          if (tag.name in activeTags) {
            const { [tag.name]: _, ...rest } = activeTags;
            newActiveTags = rest;
          } else {
            newActiveTags = { ...activeTags, [tag.name]: tag.values }
          }

          setActiveTags(newActiveTags);

          if (onUpdate) {
            const activeTagsArray = Object.values(newActiveTags).reduce((acc, val) => {
              return [...acc, ...val];
            }, [])
            onUpdate(activeTagsArray)
          }

        }}/>;
      })}
    </div>
  );
}
