import { createPlugin } from './util.js'

export default function inlineSFCPlugin() {
  const { virtualSFCModuleMap, parseFile } = createPlugin()

  return {
    name: 'vitepres-inline-sfc',
    enforce: 'pre' as const,
    resolveId(id: string) {
      if (virtualSFCModuleMap.has(id)) {
        return id
      }
    },
    load(id: string) {
      if (virtualSFCModuleMap.has(id)) {
        return {
          code: virtualSFCModuleMap.get(id) as string,
        }
      }
    },
    transform(source: string, id: string) {
      if (!/\.md$/.test(id)) {
        return
      }

      return parseFile(source)
    },
  }
}
