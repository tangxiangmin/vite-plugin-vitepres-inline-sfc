import crypto, { type Encoding } from 'node:crypto'
import MarkdownIt from 'markdown-it'
import { sfcPlugin } from '@mdit-vue/plugin-sfc'

export interface VirtualModule { virtualPath: string, componentName: string }

export interface SFCBlockConfig {
  component: boolean
  lazy?: boolean
  name?: string
}

type VirtualSFCModuleMap = Map<string, string>

export function getHash(content: string, type = 'md5', encoding = 'utf8') {
  return crypto.createHash(type).update(content, encoding as Encoding).digest('hex')
}

export function injectImports(content: string, modules: VirtualModule[]) {
  const md = MarkdownIt({ html: true }).use(sfcPlugin, {})
  const env: any = {}
  md.render(content, env)

  const improts = modules.map(({ componentName, virtualPath }) => {
    return `import ${componentName} from '${virtualPath}'`
  }).join('\n')

  const re = /^<script.*?setup.*?>$/
  // @ts-expect-error
  const setupScript = env.sfcBlocks.scripts.find(row => re.test(row.tagOpen))
  if (!setupScript) {
    // 原md文档不存在setup script
    content += `\n<script setup>\n${improts}\n</script>\n`
  } else {
    // 存在setup script
    content = content.replace(setupScript.content, () => {
      return [setupScript.tagOpen, improts, setupScript.contentStripped, setupScript.tagClose].join('\n')
    })
  }
  return content
}

export function createVirtualModulePath(id: string) {
  return `virtual:${id}.vue`
}

export function replaceSourceCode(content: string, modules: VirtualModule[], virtualSFCModuleMap: VirtualSFCModuleMap) {
  for (const { virtualPath, componentName } of modules) {
    const code = virtualSFCModuleMap.get(virtualPath) ?? ''
    const ans = code ? `\n\`\`\`vue\n${code}\n\`\`\`\n` : ''

    const regex = new RegExp(`>>> virtual:${componentName}\n`, 'g')
    content = content.replace(regex, ans)
  }

  return content
}

export function parseCodeBlock(source: string, handler: (virtualPath: string, code: string) => void) {
  const re = /(?<!````\n)```vue (.*)\n([\s\S]*?)```(?!\n```)/gi
  const list: { virtualPath: string, componentName: string }[] = []

  const content = source.replace(re, (_, $1, $2) => {
    const id = getHash($2)
    let config: SFCBlockConfig = { component: true, lazy: false }
    try {
      config = JSON.parse($1)
      if (!config.component) {
        return _
      }
    } catch (e) {
      console.log('md-vue-sfc-plugin SFCBlockConfig parse error', e)
      return _
    }

    const virtualPath = createVirtualModulePath(id)
    handler(virtualPath, $2)

    const componentName = config.name || `Comp${id}`
    list.push({
      virtualPath,
      componentName,
    })

    return config.lazy ? '' : `\n<${componentName} />\n`
  })

  return {
    list,
    content,
  }
}
export function createPlugin() {
  const virtualSFCModuleMap: VirtualSFCModuleMap = new Map<string, string>()

  function parseFile(source: string) {
    let { content, list } = parseCodeBlock(source, (virtualPath: string, code: string) => {
      virtualSFCModuleMap.set(virtualPath, code)
    })

    content = injectImports(content, list)
    content = replaceSourceCode(content, list, virtualSFCModuleMap)
    return content
  }

  return {
    virtualSFCModuleMap,
    parseFile,
  }
}
