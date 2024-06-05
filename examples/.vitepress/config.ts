import { defineConfig } from 'vitepress'

// import inlineSFC from '../../dist/index.js'
import inlineSFC from '../../src/index.js'

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
