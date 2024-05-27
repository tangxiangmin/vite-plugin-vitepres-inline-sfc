vite-plugin-vitepres-inline-sfc
===

## 说明

在vitepress中，支持在单独的markdown文件内编写vue组件块（SFC形式，包括`template`、`script`和`style`)，避免需要从外部文件引入Vue组件。


安装
```
// npm
npm i vite-plugin-vitepres-inline-sfc -D
// pnpm 
pnpm i vite-plugin-vitepres-inline-sfc -D
```

在`.vitepress/config.mts`中作为`vite`插件引入

```js
import { defineConfig } from 'vitepress'
import inlineSFC from 'vite-plugin-vitepres-inline-sfc'

export default defineConfig({
  ... other vitepress config
  vite: {
    plugins:[
      inlineSFC()
    ]
  }
})
```

该插件扩展了vitepress中markdown的语法，具体语法可以参考[使用文档](https://www.shymean.com/article/在VitePress中实现内联Vue组件)

## 演示

正常编写一个vue代码块，会使用下面的语法
````
'''vue
<template>
  <button>原始code</button>
</template>
'''
````

内联Vue组件，是在vue代码块的基础上，通过一个JSON字符串配置`component`字段为true来开启的

````
'''vue { "component": true } 
<script setup lang="ts">
import { add } from './util'
const onClick = ()=>{
    alert("click me")
}
</script>

<template>
  <button class="bg-red-100" @click="onClick">click me</button>
</template>

<style scoped>
button {
    color: red;
}
</style>
'''
````

上述的`{ "component": true }`会将vue代码块进行扩展，通过vite插件构建为一个在markdown里面运行的vue SFC组件，不需要引入任何的外部文件！！
