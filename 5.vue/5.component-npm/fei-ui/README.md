### 打包成类库
- scripts命令 vue-cli-service build --target lib --name fei-ui ./src/packages/index.js
- 形成本地库 npm-link

### 发布到npm上
- nrm use npm
- .npmignore 文件为忽略那些文件不发布到npm上
- 需要将package.json文件得private改为false
- npm publish

### 如何让自己得组件库可以按需引入
- https://cloud.tencent.com/developer/article/1613301