/**
 * Custom Document for Next.js
 * - Configures HTML structure, favicon, manifest, and dark mode
 * - Applies global icon styles using react-icons
 */
import * as React from 'react'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import { IconContext } from '@react-icons/all-files'

export default class MyDocument extends Document {
  render() {
    return (
      <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
        <Html lang="en">
          <Head>
            {/* Favicon */}
            <link rel="shortcut icon" href="/favicon.png?v=3" type="image/png" />
            {/* Manifest for PWA */}
            <link rel="manifest" href="/manifest.json" />
            {/* Theme color for light mode */}
            <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
            {/* Theme color for dark mode */}
            <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
            {/* Meta tags for SEO and responsiveness */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="description" content="A Next.js app with Notion integration" />
          </Head>
          <body>
            <script
              dangerouslySetInnerHTML={{
                __html: `
/** Inlined version of noflash.js from use-dark-mode */
/** Consider moving this script to a separate file (e.g., lib/noflash.ts) for better maintainability */
;(function () {
  var storageKey = 'darkMode'
  var classNameDark = 'dark-mode'
  var classNameLight = 'light-mode'
  function setClassOnDocumentBody(darkMode) {
    document.body.classList.add(darkMode ? classNameDark : classNameLight)
    document.body.classList.remove(darkMode ? classNameLight : classNameDark)
  }
  var preferDarkQuery = '(prefers-color-scheme: dark)'
  var mql = window.matchMedia(preferDarkQuery)
  var supportsColorSchemeQuery = mql.media === preferDarkQuery
  var localStorageTheme = null
  try {
    localStorageTheme = localStorage.getItem(storageKey)
  } catch (err) {}
  var localStorageExists = localStorageTheme !== null
  if (localStorageExists) {
    localStorageTheme = JSON.parse(localStorageTheme)
  }
  // Determine the source of truth
  if (localStorageExists) {
    // source of truth from localStorage
    setClassOnDocumentBody(localStorageTheme)
  } else if (supportsColorSchemeQuery) {
    // source of truth from system
    setClassOnDocumentBody(mql.matches)
    localStorage.setItem(storageKey, mql.matches)
  } else {
    // source of truth from document.body
    var isDarkMode = document.body.classList.contains(classNameDark)
    localStorage.setItem(storageKey, JSON.stringify(isDarkMode))
  }
})();
`
              }}
            />
            <Main />
            <NextScript />
          </body>
        </Html>
      </IconContext.Provider>
    )
  }
}
