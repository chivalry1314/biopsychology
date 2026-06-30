export const brainRegions = [
  {
    name: '额叶',
    en: 'Frontal lobe',
    fullEn: 'Prefrontal Cortex',
    category: 'cortex',
    color: 0x6366f1,
    pos: [0, 1.6, 1.4],
    desc: '执行功能、运动计划、抑制控制与表达性语言。',
    teachingNote: '课堂上最常与人格变化和非流利性语言障碍一起讨论的区域。建议从执行控制、工作记忆、决策、抑制和运动计划几个关键词切入。'
  },
  {
    name: '顶叶',
    en: 'Parietal lobe',
    fullEn: 'Parietal Cortex',
    category: 'cortex',
    color: 0xf59e0b,
    pos: [-1.2, 1.1, 1.3],
    desc: '处理触觉、温度、痛觉等躯体感觉信息，参与空间注意与身体图式。',
    teachingNote: '可与体感 homunculus 和 neglect 综合征结合，帮助学生理解“身体在脑中的映射”。'
  },
  {
    name: '颞叶',
    en: 'Temporal lobe',
    fullEn: 'Temporal Cortex',
    category: 'cortex',
    color: 0x10b981,
    pos: [1.1, 0.8, 1.2],
    desc: '听觉加工、语言理解（Wernicke 区）与长时记忆巩固。',
    teachingNote: '结合 Wernicke 失语和面孔识别（梭状回面孔区）讲解，可联系颞叶癫痫的先兆体验。'
  },
  {
    name: '枕叶',
    en: 'Occipital lobe',
    fullEn: 'Occipital Cortex',
    category: 'cortex',
    color: 0x06b6d4,
    pos: [0, 0.5, -1.6],
    desc: '初级与高级视觉加工，包括形状、颜色、运动信息处理。',
    teachingNote: '从 V1 到 what/where 两条通路讲解，可举例枕叶损伤导致的视觉失认或盲视。'
  },
  {
    name: '海马体',
    en: 'Hippocampus',
    fullEn: 'Hippocampus',
    category: 'limbic',
    color: 0x8b5cf6,
    pos: [1.1, 0.2, 0.5],
    desc: '陈述性记忆形成与空间导航。阿尔茨海默病早期常受损。',
    teachingNote: '强调海马体不是“记忆仓库”，而是记忆巩固与索引系统。可联系 H.M. 病例。'
  },
  {
    name: '杏仁核',
    en: 'Amygdala',
    fullEn: 'Amygdala',
    category: 'limbic',
    color: 0xf43f5e,
    pos: [1.0, 0.0, 0.9],
    desc: '情绪加工，尤其是恐惧、威胁检测与情绪记忆增强。',
    teachingNote: '可联系恐惧条件反射与创伤后应激，注意杏仁核也参与奖赏与面孔情绪识别。'
  },
  {
    name: '丘脑',
    en: 'Thalamus',
    fullEn: 'Thalamus',
    category: 'subcortical',
    color: 0xec4899,
    pos: [0, 0.3, 0.3],
    desc: '感觉信息的中继站，将大部分感觉信号传递到大脑皮层。',
    teachingNote: '不仅是“中继站”，也是意识、觉醒与注意调节的关键节点。可联系失语与丘脑性忽视。'
  },
  {
    name: '下丘脑',
    en: 'Hypothalamus',
    fullEn: 'Hypothalamus',
    category: 'subcortical',
    color: 0xff006e,
    pos: [0, -0.4, 0.5],
    desc: '内稳态调节、奖赏、动机、内分泌与自主神经控制。',
    teachingNote: '联系 HPA 轴、昼夜节律、摄食与体温调节，是神经系统与内分泌系统交互的枢纽。'
  },
  {
    name: '基底节',
    en: 'Basal ganglia',
    fullEn: 'Basal Ganglia',
    category: 'subcortical',
    color: 0xffaa00,
    pos: [1.0, -0.5, 0.6],
    desc: '运动程序选择、习惯学习与奖赏预测。',
    teachingNote: '从帕金森病（运动过少）与亨廷顿病（运动过多）对比讲解运动通路的抑制与促进平衡。'
  },
  {
    name: '小脑',
    en: 'Cerebellum',
    fullEn: 'Cerebellum',
    category: 'subcortical',
    color: 0x00c2a8,
    pos: [0, -1.2, -1.0],
    desc: '协调运动、平衡、运动学习与部分认知功能。',
    teachingNote: '损伤导致共济失调。可强调小脑在 timing 与运动学习中的作用，不仅限于“协调”。'
  },
  {
    name: '脑干',
    en: 'Brain stem',
    fullEn: 'Brain Stem',
    category: 'subcortical',
    color: 0x94a3b8,
    pos: [0, -1.8, -0.3],
    desc: '控制呼吸、心跳、觉醒与基本生命功能。',
    teachingNote: '网状结构维持觉醒，损伤可致昏迷。是理解脑干反射与意识水平评估的基础。'
  }
]

export const categories = [
  {
    key: 'cortex',
    label: '大脑皮层',
    en: 'Cortex',
    desc: '高级认知功能的神经基础',
    color: 'from-indigo-500/20 to-blue-500/20',
    accent: '#6366f1'
  },
  {
    key: 'limbic',
    label: '边缘系统',
    en: 'Limbic system',
    desc: '情绪、记忆与动机加工',
    color: 'from-purple-500/20 to-pink-500/20',
    accent: '#a855f7'
  },
  {
    key: 'subcortical',
    label: '皮层下结构',
    en: 'Subcortical',
    desc: '感觉中继、运动协调与内稳态',
    color: 'from-amber-500/20 to-rose-500/20',
    accent: '#f59e0b'
  }
]
