import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '生理心理学全息终端',
  description: 'Bio-Psychology Quantum Visualizer 功能介绍与使用文档',
  base: '/biopsychology/docs/',
  outDir: '../dist/docs',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: '/biopsychology/favicon.svg' }]
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '功能介绍', link: '/features/brain-3d' },
      {
        text: '在线体验',
        link: 'https://chivalry1314.github.io/biopsychology/'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '项目简介', link: '/guide/introduction' }
          ]
        }
      ],
      '/features/': [
        {
          text: '功能模块',
          items: [
            { text: '🧠 3D 大脑与功能定位', link: '/features/brain-3d' },
            { text: '⚡ 突触递质传递模拟', link: '/features/synapse-simulator' },
            { text: '🧪 递质情绪协同分析', link: '/features/hormone-analyzer' },
            { text: '📊 生理化学递质调控面板', link: '/features/neurotransmitter-dashboard' },
            { text: '💓 自主神经系统平衡仪', link: '/features/ans-balance' },
            { text: '🌊 脑电节律模拟器', link: '/features/eeg-rhythm' },
            { text: '🏔️ HPA 轴压力反应', link: '/features/hpa-axis' },
            { text: '🎁 奖励通路与多巴胺奖赏', link: '/features/reward-pathway' },
            { text: '🏥 临床案例模拟', link: '/features/clinical-cases' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/chivalry1314/biopsychology' }
    ],
    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2026 Bio-Psychology Quantum Visualizer'
    },
    search: {
      provider: 'local'
    },
    outline: {
      label: '本页目录'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  }
})
