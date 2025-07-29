import * as React from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cs from 'classnames';
import { PageBlock } from 'notion-types';
import { formatDate, getBlockTitle, getPageProperty } from 'notion-utils';
import BodyClassName from 'react-body-classname';
import { NotionRenderer } from 'react-notion-x';
import TweetEmbed from 'react-tweet-embed';
import { useSearchParam } from 'react-use';

import * as config from '@/lib/config';
import * as types from '@/lib/types';
import { mapImageUrl } from '@/lib/map-image-url';
import { getCanonicalPageUrl, mapPageUrl } from '@/lib/map-page-url';
import { searchNotion } from '@/lib/search-notion';
import { useDarkMode } from '@/lib/use-dark-mode';
import { Footer } from './Footer';
import { Loading } from './Loading';
import { NotionPageHeader } from './NotionPageHeader';
import { Page404 } from './Page404';
import { PageAside } from './PageAside';
import { PageHead } from './PageHead';
import styles from './styles.module.css';

// Dynamic imports with optimized PrismJS syntaxes
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(async (m) => {
    await Promise.allSettled([
      import('prismjs/components/prism-javascript.js'),
      import('prismjs/components/prism-python.js'),
      import('prismjs/components/prism-css.js'),
      import('prismjs/components/prism-markup.js'),
    ]);
    return m.Code;
  })
);

const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection)
);
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
);
const Pdf = dynamic(() => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf), {
  ssr: false,
});
const Modal = dynamic(
  () =>
    import('react-notion-x/build/third-party/modal').then((m) => {
      m.Modal.setAppElement('.notion-viewport');
      return m.Modal;
    }),
  { ssr: false }
);

const Tweet = ({ id }: { id: string }) => {
  return (
    <Suspense fallback={<div>Loading tweet...</div>}>
      <div aria-label={`Tweet with ID ${id}`}>
        <TweetEmbed tweetId={id} />
      </div>
    </Suspense>
  );
};

// Error Boundary for NotionRenderer
class NotionRendererErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Failed to render Notion content. Please try again later.</div>;
    }
    return this.props.children;
  }
}

const propertyLastEditedTimeValue = (
  { block, pageHeader }: { block: any; pageHeader: boolean },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && block?.last_edited_time) {
    return `Last updated ${formatDate(block?.last_edited_time, { month: 'long' })}`;
  }
  return defaultFn();
};

const propertyDateValue = (
  { data, schema, pageHeader }: { data: any; schema: any; pageHeader: boolean },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'published') {
    const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date;
    if (publishDate) {
      return `${formatDate(publishDate, { month: 'long' })}`;
    }
  }
  return defaultFn();
};

const propertyTextValue = (
  { schema, pageHeader }: { schema: any; pageHeader: boolean },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'author') {
    return <b>{defaultFn()}</b>;
  }
  return defaultFn();
};

export const NotionPage: React.FC<types.PageProps> = ({
  site,
  recordMap,
  error,
  pageId,
}) => {
  const router = useRouter();
  const lite = useSearchParam('lite');
  const { isDarkMode } = useDarkMode();

  const components = React.useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
      Tweet,
      Header: NotionPageHeader,
      propertyLastEditedTimeValue,
      propertyTextValue,
      propertyDateValue,
    }),
    []
  );

  const isLiteMode = lite === 'true';

  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {};
    if (lite) params.lite = lite;
    const searchParams = new URLSearchParams(params);
    return mapPageUrl(site, recordMap, searchParams);
  }, [site, recordMap, lite]);

  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]]?.value;

  const isBlogPost = block?.type === 'page' && block?.parent_table === 'collection';
  const showTableOfContents = !!isBlogPost;
  const minTableOfContentsItems = 3;

  const pageAside = React.useMemo(
    () => <PageAside block={block} recordMap={recordMap} isBlogPost={isBlogPost} />,
    [block, recordMap, isBlogPost]
  );

  const footer = React.useMemo(() => <Footer />, []);

  if (router.isFallback) {
    return <Loading />;
  }

  if (error || !site || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />;
  }

  const title = getBlockTitle(block, recordMap) || site.name;

  const canonicalPageUrl = !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId);

  const socialImage = mapImageUrl(
    getPageProperty<string>('Social Image', block, recordMap) ||
      (block as PageBlock).format?.page_cover ||
      config.defaultPageCover ||
      '/default-fallback-image.png',
    block
  );

  const socialDescription =
    getPageProperty<string>('Description', block, recordMap) || config.description;

  return (
    <>
      <PageHead
        pageId={pageId}
        site={site}
        title={title}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
      />

      {isLiteMode && <BodyClassName className="notion-lite" />}
      {isDarkMode && <BodyClassName className="dark-mode" />}

      <NotionRendererErrorBoundary>
        <NotionRenderer
          bodyClassName={cs(
            styles.notion,
            pageId === site.rootNotionPageId && 'index-page'
          )}
          darkMode={isDarkMode}
          components={components}
          recordMap={recordMap}
          rootPageId={site.rootNotionPageId}
          rootDomain={site.domain}
          fullPage={!isLiteMode}
          previewImages={!!recordMap.preview_images}
          showCollectionViewDropdown={false}
          showTableOfContents={showTableOfContents}
          minTableOfContentsItems={minTableOfContentsItems}
          defaultPageIcon={config.defaultPageIcon}
          defaultPageCover={config.defaultPageCover}
          defaultPageCoverPosition={config.defaultPageCoverPosition}
          mapPageUrl={siteMapPageUrl}
          mapImageUrl={mapImageUrl}
          searchNotion={config.isSearchEnabled ? searchNotion : null}
          pageAside={pageAside}
          footer={footer}
        />
      </NotionRendererErrorBoundary>
    </>
  );
};
