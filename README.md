# Bio-Psychology Quantum Visualizer

基于 **Vue 3 + Vite + Three.js** 的生理心理学全息智能交互诊断分析终端。设计参考量子可视化仪表盘风格，包含 3D 点云大脑、突触递质传递模拟、多递质协同心理模型分析等模块。

构建后生成纯静态文件，可部署到 GitHub Pages、Netlify、Vercel、Cloudflare Pages 等免费静态托管平台。

## 在线预览

- 主应用：https://chivalry1314.github.io/biopsychology/
- 功能文档：https://chivalry1314.github.io/biopsychology/docs/

## 功能模块

### 🧠 3D 大脑与功能定位
- Three.js 点云粒子大脑模型，6 个主要脑区：额叶、颞叶、顶叶、枕叶、小脑、脑干
- 程序化生成的大脑外形 + 神经通路连线
- 拖拽旋转、点击高亮、自动旋转
- 右侧生理解剖学与心理效应解码面板

### ⚡ 突触递质传递模拟
- Canvas 动画模拟突触前膜、突触间隙、突触后膜
- 可释放多巴胺、血清素、去甲肾上腺素
- 实时显示动作电位、囊泡释放速率、受体结合率

### 🧪 递质情绪协同分析
- 自定义雷达图展示多维心理状态空间
- 植物性神经系统平衡指数（交感/副交感）
- 临床案例模拟：重度抑郁、ADHD、精神分裂症、成瘾行为

### 📊 生理化学递质调控面板
- 多巴胺 / 5-羟色胺 / 去甲肾上腺素 / 内啡肽 实时进度条
- 情绪状态分析
- 激悦 / 镇静 / 战斗或逃跑 三种预设模式

## 技术栈

- [Vue 3](https://vuejs.org/)（组合式 API）
- [Vite](https://vitejs.dev/)
- [Three.js](https://threejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)（CDN）
- [FontAwesome](https://fontawesome.com/)（CDN）

## 项目结构

```
psychology/
├── dist/                          # 构建产物（部署此目录）
├── docs/                          # VitePress 功能文档
│   ├── .vitepress/
│   │   └── config.js              # VitePress 配置
│   ├── features/                  # 功能模块文档
│   ├── guide/                     # 指南文档
│   └── index.md                   # 文档首页
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AppHeader.vue          # 顶部终端状态栏
│   │   ├── AppFooter.vue          # 底部数据栏
│   │   ├── Brain3D.vue            # 3D 点云大脑
│   │   ├── ClinicalCases.vue      # 临床案例模拟
│   │   ├── HormoneAnalyzer.vue    # 多递质协同分析仪
│   │   ├── NeurotransmitterDashboard.vue  # 神经递质仪表盘
│   │   ├── RegionDetail.vue       # 脑区详情面板
│   │   └── SynapseSimulator.vue   # 突触传递模拟
│   ├── data/
│   │   ├── brainRegions.js        # 脑区数据
│   │   └── neurotransmitters.js   # 神经递质数据
│   ├── App.vue                    # 主布局
│   └── main.js                    # 入口
├── index.html
├── package.json
├── vite.config.js
├── .github/workflows/deploy.yml   # GitHub Actions 自动部署
└── README.md
```

## 本地开发

```bash
npm install
npm run dev
```

由于 `vite.config.js` 中设置了 `base: '/biopsychology/'`，本地访问地址为 `http://127.0.0.1:8081/biopsychology/`（如果 8080 被占用，端口可能为 8081）。

## 文档开发

功能文档使用 [VitePress](https://vitepress.dev/) 构建，源文件位于 `docs/` 目录。

```bash
# 本地预览文档
npm run docs:dev

# 构建文档（输出到 dist/docs/）
npm run docs:build
```

## 构建

```bash
npm run build
```

构建产物位于 `dist/` 目录。

## 部署

已配置 GitHub Actions 自动部署。推送到 `main` 分支后，GitHub Pages 会自动构建并部署到 `https://chivalry1314.github.io/biopsychology/`。

## 许可

MIT License
