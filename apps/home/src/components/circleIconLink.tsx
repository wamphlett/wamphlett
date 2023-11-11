import styles from './circleIconLink.module.css';

import Link from 'next/link';

type CircleIconLinkProps = {
  icon: React.ReactNode;
  href: string;
  size?: number;
};

export default function CircleIconLink({
  icon,
  href,
  size = 32,
}: CircleIconLinkProps) {
  return (
    <div className={styles.container} style={{ height: size, width: size }}>
      <Link href={href} target="_blank">
        {icon}
        <div className={styles.bubble} />
      </Link>
    </div>
  );
}
