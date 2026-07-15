'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Albums, AlbumData } from '@/app/types';
import { getAll } from '@/app/data';

import styles from './sidebar.module.css';

type SidebarProps = {
  open?: boolean;
};

type Page = {
  url: string;
  title: string;
};

type SidebarData = {
  year: string;
  pages: Page[];
};

let sidebarData: SidebarData[];

function transformEntries(entries: Albums): SidebarData[] {
  if (sidebarData) {
    return sidebarData;
  }
  // Grouping the entries by year
  const yearGroups: { [year: number]: AlbumData[] } = {};
  for (const url in entries) {
    const entry = entries[url];
    if (!yearGroups[entry.year]) {
      yearGroups[entry.year] = [];
    }
    yearGroups[entry.year].push(entry);
  }

  // Transforming each group into the desired format
  const result: SidebarData[] = Object.keys(yearGroups)
    .map(year => {
      return {
        year: year,
        pages: yearGroups[parseInt(year)]
          .sort((a, b) => b.month - a.month) // Sorting by month
          .map(album => ({ url: album.url, title: album.title })),
      };
    })
    .sort((a, b) => parseInt(b.year) - parseInt(a.year)); // Sorting by year

  sidebarData = result;
  return result;
}

const data = transformEntries(getAll());

export default function Sidebar({ open = false }: SidebarProps) {
  const currentPath = usePathname();

  return (
    <div
      className={`${styles.sidebar} ${open ? styles.open : ''}`}
      style={{
        top: 0,
        zIndex: 90,
        paddingTop: 130,
      }}
    >
      <div className={styles.list}>
        {data.map((year, index) => (
          <div key={index} className={styles.year}>
            <span>{year.year}</span>
            {year.pages.map((page, index) => {
              if (page.url == currentPath) {
                return (
                  <span key={index} className={styles.active}>
                    {page.title}
                  </span>
                );
              } else {
                return (
                  <Link href={page.url} key={index}>
                    {page.title}
                  </Link>
                );
              }
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
