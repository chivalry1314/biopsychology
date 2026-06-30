# 生理心理学可视化

基于 **Vue 3 + Vite + Three.js** 的生理心理学（Physiological Psychology）交互式可视化网站。构建后生成纯静态文件，可部署到 GitHub Pages、Netlify、Vercel、Cloudflare Pages 等免费平台。

## 在线预览

本地运行 `npm run dev` 即可查看，或构建 `dist/` 目录后部署。

## 功能模块

### 🧠 3D 交互脑模型
- 使用 Three.js 构建可旋转、可缩放的 3D 大脑模型
- 点击彩色标记查看 11 个关键脑区：额叶、顶叶、颞叶、枕叶、海马体、杏仁核、丘脑、下丘脑、基底节、小脑、脑干
- 每个脑区包含功能描述与课堂教学建议（Teaching Note）
- 自动旋转，悬停高亮

### ⚡ 动作电位传导
- Canvas 动画演示神经元轴突上的动作电位波形
- 可切换「有髓鞘/无髓鞘」模式，观察跳跃传导差异
- 展示静息电位、去极化、复极化过程

### 🧪 神经递质速查
- 8 种关键神经递质卡片：多巴胺、血清素、GABA、谷氨酸、乙酰胆碱、去甲肾上腺素、内啡肽、催产素
- 包含功能与相关心理/疾病信息

### 😴 睡眠周期
- Canvas 绘制的整夜睡眠分期图
- 展示清醒 → N1 → N2 → N3 → REM 的周期性变化

## 技术栈

- [Vue 3](https://vuejs.org/)（组合式 API）
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)（CDN）
- [Three.js](https://threejs.org/)

## 项目结构

```
psychology/
├── dist/                         # 构建产物（部署此目录）
├── public/                       # 静态资源
├── src/
│   ├── components/
│   │   ├── Brain3D.vue           # 3D 脑模型组件
│   │   ├── ActionPotential.vue   # 动作电位动画组件
│   │   ├── Neurotransmitters.vue # 神经递质卡片组件
│   │   └── SleepChart.vue        # 睡眠周期图表组件
│   ├── data/
│   │   ├── brainRegions.js       # 脑区数据
│   │   ├── neurotransmitters.js  # 神经递质数据
│   │   └── sleepStages.js        # 睡眠分期数据
│   ├── App.vue                   # 主页面
│   └── main.js                   # 入口
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建产物位于 `dist/` 目录。

### 本地预览构建产物

```bash
npm run preview
```

访问 http://localhost:4173

## 免费部署

### 部署到 GitHub Pages

1. 修改 `vite.config.js` 中的 `base` 为仓库名：
   ```js
   base: '/psychology/',
   ```
2. 推送到 GitHub 仓库
3. 进入仓库 **Settings → Pages**
4. Source 选择 **Deploy from a branch**，分支选择 `gh-pages` 或 `main`，目录选择 `/ (root)`
5. 等待几分钟后，访问 `https://你的用户名.github.io/仓库名`

> 更推荐的方式：使用 GitHub Actions 自动构建并部署到 `gh-pages` 分支。

#### GitHub Actions 自动部署（推荐）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 部署到 Netlify

1. 执行 `npm run build`
2. 打开 [Netlify](https://app.netlify.com/)
3. 选择 **Add new site → Deploy manually**
4. 将 `dist/` 文件夹拖拽上传
5. 获得免费二级域名，如 `https://xxx.netlify.app`

### 部署到 Vercel

```bash
npm i -g vercel
npm run build
vercel --prod
```

或连接 GitHub 仓库自动部署。

### 部署到 Cloudflare Pages

1. 执行 `npm run build`
2. 打开 [Cloudflare Pages](https://pages.cloudflare.com/)
3. 创建项目，上传 `dist/` 文件夹
4. 框架预设选择 **None**，构建命令留空，输出目录留空
5. 部署完成后获得 `*.pages.dev` 域名

## 自定义扩展

- 修改 `src/data/brainRegions.js` 可新增/编辑脑区、分类与 Teaching Note
- 修改 `src/data/neurotransmitters.js` 可新增神经递质
- 修改 `src/data/sleepStages.js` 可调整睡眠分期展示
- 动作电位参数（速度、波形）可在 `src/components/ActionPotential.vue` 中调整
- 新增可视化模块只需在 `src/components/` 创建组件并在 `App.vue` 中引用

## 许可

MIT License — 可自由使用、修改和分发。
