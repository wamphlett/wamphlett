'use client';
import { useEffect } from 'react';
import 'highlight.js/styles/base16/solarized-dark.css';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import go from 'highlight.js/lib/languages/go';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('go', go);

import styles from './article.module.css';
import './article.css';

type ArticleProps = {
  html: string;
};

export default function Article({ html }: ArticleProps) {
  useEffect(() => {
    hljs.initHighlighting();
  }, []);
  return (
    <article
      className={styles.container}
      dangerouslySetInnerHTML={{ __html: html }}
    ></article>
  );
}
