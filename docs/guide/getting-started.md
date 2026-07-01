# 快速开始

本页面将帮助你在本地运行项目，并了解如何访问在线文档与在线演示。

## 在线访问

- **主应用**：https://chivalry1314.github.io/biopsychology/
- **功能文档**：https://chivalry1314.github.io/biopsychology/docs/

## 本地开发

### 环境要求

- Node.js 18 或更高版本
- npm 9 或更高版本

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

默认监听 `http://127.0.0.1:8080/biopsychology/`。

### 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

## 本地预览文档

```bash
npm run docs:dev
```

文档开发服务器默认监听 `http://127.0.0.1:5173/biopsychology/docs/`。

## 构建文档

```bash
npm run docs:build
```

文档构建产物输出到 `dist/docs/` 目录，与主应用共用同一部署流程。

## 自动化部署

项目已配置 GitHub Actions。每次推送代码到 `main` 分支时，工作流会自动：

1. 安装依赖
2. 构建主应用
3. 构建文档站点
4. 将 `dist/` 目录部署到 GitHub Pages

推送后约 1-2 分钟即可在线访问最新版本。
