---
layout: doc
---

下面是一个内联的SFC组件
````
```vue { "component": true, "name": "Demo" } 
<script setup lang="ts">
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
    padding: 4px 8px;
    background: antiquewhite;
    border-radius: 5px;
  }
</style>
```
````
在markdown中，上面的代码会被渲染成一个组件

```vue { "component": true, "name": "Demo" } 
<script setup lang="ts">
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
    padding: 4px 8px;
    background: antiquewhite;
    border-radius: 5px;
  }
</style>
```

内联组件跟单独创建的SFC文件完全相同，可以访问当前开发环境，比如`ts`、`unocss`、其他组件或工具模块等。

### name组件名

还支持另外一个`name`的字段，指定之后，sfc代码块会编译成对应名称的组件，然后你可以使用该组件名，在本页面的其他地方进行`复用`。

当然，你需要保证该组件名在当前文档下`唯一`。

````
``` vue { "component": true, "name": "Demo" }
here your sfc code
```

一些内容之后，通过组件名复用

<Demo />
````

通过`<componentName />`的形式调用，就像是引入了一个外部组件

下面演示了复用在上一个章节定义的内联组件，你应该会看见一个与上面完全一样的组件渲染节点。

<Demo />

### lazy

在默认情况下，开启了`component:true`的代码块，会直接在该代码块的位置渲染出对应的组件。

这是sfc代码块最常见的场景，即不需要从外部引入模块文件，就可以为当前模块编写组件。

如果在某种情况下，你希望先编写代码，但是不希望立即渲染，可以手动打开`lazy:true`配置项。

```
'''vue { "component": true, "name": "Demo2", "lazy": false }
here your sfc code
'''

一些内容之后，通过组件名手动渲染

<Demo2 />
```
开启后，你需要手动通过`name`来编写组件标签进行渲染。

源文件中，这里有一段代码，但没有立即渲染。

(这里有一大段内联组件代码)

```vue { "component": true, "name": "Demo2", "lazy": true }
<script setup lang="ts">
import { add }from'./util'
const onClick = ()=>{
    alert("click me")
}
</script>

<template>
  <button class="bg-red-100" @click="onClick">click me demo2</button>
</template>

<style scoped>
button {
    color: red;
}
</style>
```

你需要手动编写`<Demo2 />`标签，之后该组件才会渲染

<Demo2 />  

## 导入代码片段

同时展示交互组件和对应源码是比较常见的需求，vitepress提供了[导入代码片段](https://vitepress.dev/zh/guide/markdown#import-code-snippets)的功能

```
<<< @/filepath
```

由于上述sfc组件并不存在对应的组件，为了兼容该语法，定制了一个特殊的`>>>`语法

```
>>> virtual:xxComponentName
```

比如展示上面的Demo2组件源码，路径修改为`virtual:Demo2`，就会展示如下源码

>>> virtual:Demo2
