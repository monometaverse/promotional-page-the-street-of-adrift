# <center>彷徨之街宣传页</center>
<center>游戏《彷徨之街》在 Mono 上的宣传页面，用于介绍将在 Mono 上发售的《彷徨之街》游戏相关 NFT 和游戏设定。</center>

## 使用的技术
- 主体框架：[Vue 3](https://vuejs.org/)
- 组件库：[Element Plus](https://element-plus.org/)
- 语言：[TypeScript 4.5.4](https://www.typescriptlang.org/)
- 构建工具： [Vite 2](https://vitejs.dev/)
- 包管理器： [Yarn](https://yarnpkg.com/)
- 本地化： [vue-i18n](https://vue-i18n.intlify.dev/)
- 代码格式化： [ESLint](https://eslint.org/) 
- 样式文件格式化： [StyleLint](https://stylelint.io/)
- CSS 预处理器： [Less](https://lesscss.org/)
- CSS 工具库： [WindiCSS](https://windicss.org/)
- 基于文件的路由： [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)
- 路由库： [vue-router](https://router.vuejs.org/)
- 状态管理： [pinia](https://pinia.vuejs.org/)
- 3D 模型显示： [Three.js](https://threejs.org/) 
- 缓动效果库： [GSAP](https://www.npmjs.com/package/gsap)
- 静态网站部署： [Azure Static Web Apps](https://azure.microsoft.com/en-us/services/app-service/static/#overview)
- 自动构建系统： [GitHub Actions](https://github.com/features/actions)

*构建网站时使用的技术已经基本确定，但只是基本确定*  
*由于柠喵跟不上技术的更新，目前还在使用经典的 yarn 1*
## 建议安装的插件
### WebStorm
- Vue
### VSCode
- Volar
- i18n Ally
- ESLint
- StyleLint 使用主版本号低于 1 的版本
## 开始开发
### 安装项目依赖
```bash
$ yarn
```
### 启动开发服务器
运行以下命令启动开发服务器，然后在浏览器地址栏输入 http://localhost:3000 访问页面
```
$ yarn dev
```
如果要在局域网内的其它终端访问，可以换成
```
$ yarn dev --host 0.0.0.0
```
## 构建项目
目前无需分离运行环境，直接运行以下命令即可
```bash
$ yarn build:prod
```
然后在 `dist` 目录就可以看到构建好的文件