import { describe, expect, it } from 'vitest'
import {
  createVirtualModulePath,
  injectImports,
  parseCodeBlock,
  replaceSourceCode,
} from '../src/util.js'


describe('util.ts', () => {
  it('injectImports should inject imports correctly', () => {
    const content = `#title content`
    const modules = [
      { virtualPath: 'virtual:1.vue', componentName: 'Component1' },
      { virtualPath: 'virtual:2.vue', componentName: 'Component2' },
    ]
    const expectedContent = `#title content
<script setup>
import Component1 from 'virtual:1.vue'
import Component2 from 'virtual:2.vue'
</script>
`
    const actualContent = injectImports(content, modules)
    expect(actualContent).to.equal(expectedContent)
  })
  it('injectImports should inject imports correctly with init setup script', () => {
    const content = `#title content
<script setup>
import a from './a'
</script>`
    const modules = [
      { virtualPath: 'virtual:1.vue', componentName: 'Component1' },
      { virtualPath: 'virtual:2.vue', componentName: 'Component2' },
    ]
    const expectedContent = `#title content
<script setup>
import Component1 from 'virtual:1.vue'
import Component2 from 'virtual:2.vue'

import a from './a'

</script>`
    const actualContent = injectImports(content, modules)
    expect(actualContent).to.equal(expectedContent)
  })

  it('createVirtualModulePath should return correct virtual module path', () => {
    const id = 'my-component'
    const expectedPath = 'virtual:my-component.vue'
    const actualPath = createVirtualModulePath(id)
    expect(actualPath).to.equal(expectedPath)
  })

  it('replaceSourceCode should replace source code correctly', () => {
    const content = `#title
>>> virtual:Component1
`
    const modules = [
      { virtualPath: 'virtual:Component1', componentName: 'Component1' },
    ]
    const code = `<script setup>\nconsole.log("This is Component1")\n</script>`
    const virtualSFCModuleMap = new Map([['virtual:Component1', code]])
    const expectedContent = `#title

\`\`\`vue
${code}
\`\`\`
`
    const actualContent = replaceSourceCode(content, modules, virtualSFCModuleMap)
    expect(actualContent).to.equal(expectedContent)
  })
})

describe('parseCodeBlock', () => {
  it('normal state', () => {
    const md = '#title\n```vue {"component":true}\n<template><div>component</div></template>\n```'
    const { list, content } = parseCodeBlock(md, () => {})
    expect(list.length).to.equal(1)
    expect(content).to.equal(`#title\n\n<${list[0].componentName} />\n`)
  })
  it('normal state with close', () => {
    const md = '#title\n```vue {"component":false}\n<template><div>component</div></template>\n```'
    const { list, content } = parseCodeBlock(md, () => {})
    expect(list.length).to.equal(0)
    expect(content).to.equal(md)
  })
  it('normal state with component name', () => {
    const md = '#title\n```vue {"component":true, "name":"Demo"}\n<template><div>component</div></template>\n```'
    const { list, content } = parseCodeBlock(md, () => {})
    expect(list[0].componentName).to.equal('Demo')
    expect(content).to.equal(`#title\n\n<${list[0].componentName} />\n`)
  })
  it('normal state with lazy name', () => {
    const md = '#title\n```vue {"component":true, "name":"Demo", "lazy":true}\n<template><div>component</div></template>\n```'
    const { list, content } = parseCodeBlock(md, () => {})
    expect(list[0].componentName).to.equal('Demo')
    expect(content).to.equal(`#title\n`)
  })

  it('should not parse in raw code block', () => {
    const md = '#title \n ````\n```vue {"component":true}\n<template>code</template>```\n````'
    const { list, content } = parseCodeBlock(md, () => {})
    expect(list.length).to.equal(0)
    expect(content).to.equal(md)
  })
})


