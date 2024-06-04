import { defineConfig } from 'vitepress'
// eslint-disable-next-line antfu/no-import-dist
import inlineSFC from '../../dist/index.js'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'demo',
  description: 'inline sfc demo',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    socialLinks: [
      { icon: 'github', link: 'https://github.com/tangxiangmin/vite-plugin-vitepres-inline-sfc' },
    ],
  },
  vite: {
    plugins: [
      inlineSFC(),
    ],
  },
})
