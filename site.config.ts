import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '23fda7f357228047921eee52858a7d60',
  // https://outrageous-pastry-838.notion.site/Moora-Sleep-Mist-23fda7f357228047921eee52858a7d60
  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null, 

  // basic site info (required)
  name: 'Nguyen Ngoc Yen Nguyen',
  domain: 'MooraSleepMist.com',
  author: 'Nguyen Ngoc Yen Nguyen',

  // open graph metadata (optional)
  description: 'MooraSleepMist',

  // social usernames (optional)
  // twitter: '',
  // github: '',
  // linkedin: 'chúc-phạm-long-801372289',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.7,
// 0.7
  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  //navigationStyle: 'default'
  // navigationStyle: 'custom',
  // navigationLinks: [
  //   {
  //     title: 'About',
  //     pageId: '175da7f3572280fab1a0c62ff19b7f01?pvs=74'
  //   },
  //   {
  //     title: 'Contact',
  //     pageId: '1c0da7f357228055a129d90a84efc393'
  //   },
  //   {
  //     title: 'Resume',
  //     pageId: '1d5da7f3572280d8a011e34588003379'
  //   }
  ]
})
