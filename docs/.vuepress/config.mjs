import { viteBundler } from '@vuepress/bundler-vite';
import { markdownImagePlugin } from '@vuepress/plugin-markdown-image';
import { markdownTabPlugin } from '@vuepress/plugin-markdown-tab';
import { searchPlugin } from '@vuepress/plugin-search';
import { defaultTheme } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance';
import { en as enThemeConfig } from './config/theme/en.config.mjs';
import { vi as viThemeConfig } from './config/theme/vi.config.mjs';

export default defineUserConfig({
  lang: 'en-US',
  title: 'Pricepally Partners API',
  description: 'Pricepally Partners API with best practices',
  base: '/pricepally-partners/',
  bundler: viteBundler(),
  markdown: {
    toc: {
      level: [2, 3, 4, 5],
    },
  },
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Pricepally Partners API 🎉',
    },
    '/vi/': {
      lang: 'vi-VN',
      title: 'Pricepally Partners API 🎉',
    },
  },
  theme: defaultTheme({
    repo: 'pricepally-partners-backend',
    docsBranch: 'main',
    docsDir: 'docs',
    locales: {
      '/': enThemeConfig,
      '/vi/': viThemeConfig,
    },
  }),
  plugins: [
    searchPlugin({
      maxSuggestions: 15,
      hotKeys: ['s', '/'],
      locales: {
        '/': {
          placeholder: 'Search',
        },
        '/vi/': {
          placeholder: 'Tìm kiếm',
        },
      },
    }),
    // guides: https://plugin-md-enhance.vuejs.press/guide/
    mdEnhancePlugin({
      tasklist: true,
      align: true,
    }),
    markdownImagePlugin({
      figure: true,
      lazyload: true,
      mark: true,
      size: true,
    }),
    markdownTabPlugin({
      codeTabs: true,
      tabs: true,
    }),
  ],
});
