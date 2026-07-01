export const brainRegions = {
  frontal: {
    id: 'frontal',
    title: '前额叶皮层 (Prefrontal Cortex)',
    tag: 'FRONTAL',
    shortName: '额叶 (Frontal)',
    physio: '前额叶大脑皮层（PFC）是人类演化最先进的部分。它负责调控最高级、最复杂的执行控制功能，涉及理性决策、逻辑思考、工作记忆、复杂行为策略的拟定和有意识的注意力分配。',
    psycho: '在心理层面上，前额叶承载着自我克制（抗拒即时满足）、目标导向行为、个性的展现以及符合道德规范的社会性。它是理性本我的物理容器。',
    clinical: '前额叶病变或血流量低下（如ADHD患者或慢性抑郁症患者）将导致注意力缺失、决策无力、情感淡漠及反社会人格冲动。',
    interaction: '点击脑区按钮或 3D 模型上的区域高亮对应脑区；拖拽旋转模型，滚轮缩放；观察右侧生理、心理及病理解读变化。',
    dopamine: 85, serotonin: 55, norepinephrine: 70, endorphin: 40,
    color: 0x3b82f6,
    center: [0, 1.5, 2],
    size: [2.5, 1.8, 1.8]
  },
  temporal: {
    id: 'temporal',
    title: '颞叶与边缘系统 (Temporal & Limbic System)',
    tag: 'TEMPORAL',
    shortName: '颞叶 (Temporal)',
    physio: '颞叶包括了内侧的海马体（Hippocampus）以及杏仁核（Amygdala）。负责处理听觉信息、高级言语理解（Wernicke区），以及将短期记忆转化为长期记忆的固化过程。',
    psycho: '边缘系统则是人类的“情绪大脑”，杏仁核主导恐惧与愤怒等快速原始情绪的加工，而海马体则控制场景性、情感相关的记忆，这构成了人类复杂爱恨与创伤的本源。',
    clinical: '海马体受损会导致顺行性遗忘症（无法建立新记忆）。杏仁核功能异常在创伤后应激障碍(PTSD)和惊恐发作中发挥关键作用。',
    interaction: '点击脑区按钮切换至颞叶/边缘系统；观察高亮区域与递质水平的联动；结合临床案例理解情绪与记忆障碍。',
    dopamine: 60, serotonin: 40, norepinephrine: 85, endorphin: 55,
    color: 0x10b981,
    center: [0, -0.5, 0.5],
    size: [2.8, 1.6, 1.4]
  },
  parietal: {
    id: 'parietal',
    title: '顶叶与感觉皮层 (Parietal & Somatosensory)',
    tag: 'PARIETAL',
    shortName: '顶叶 (Parietal)',
    physio: '顶叶包含中央后回（第一躯体感觉皮层），主要处理多感官通道的整合，包含来自皮肤、关节的温度、触觉、压力和本体感觉，并负责空间认知和计算。',
    psycho: '心理层面上，顶叶协助我们建立“身体图式（Body Schema）”——对身体边界的无意识认知。它帮助我们在三维空间中定位自我，是“自我与外部世界分离”的脑解剖基础。',
    clinical: '左顶叶损伤会导致失算、左右失认、失写、手指失认（Gerstmann综合征）；右顶叶损伤会导致单侧空间忽略症（Neglect）。',
    interaction: '选择顶叶高亮显示；旋转模型观察其在脑部的空间位置；理解多感官整合与空间自我定位的神经基础。',
    dopamine: 50, serotonin: 65, norepinephrine: 40, endorphin: 60,
    color: 0x8b5cf6,
    center: [0, 2.5, -1],
    size: [2.4, 1.8, 2]
  },
  occipital: {
    id: 'occipital',
    title: '枕叶与视觉皮层 (Occipital & Visual Cortex)',
    tag: 'OCCIPITAL',
    shortName: '枕叶 (Occipital)',
    physio: '枕叶完全致力于视觉信息的感知和深度加工。主要包含初级视觉皮层（V1）到高级视觉整合区。将视网膜电信号解码成物体的形状、颜色、运动、深度。',
    psycho: '人类大脑有三分之一的区域参与视觉。视觉心理学中的格式塔组织原则（邻近、连续性）在此处通过复杂的反馈环路机制体现，也用于生成意象和梦境。',
    clinical: '一侧枕叶受损导致对侧视野的同向性偏盲。高级视觉加工区受损可引发物体失认症（能看见但认不出是什么）或面孔失认症。',
    interaction: '切换至枕叶观察视觉皮层位置；调节点大小与亮度查看高亮效果；理解视觉信息从视网膜到高级皮层的加工路径。',
    dopamine: 40, serotonin: 50, norepinephrine: 30, endorphin: 30,
    color: 0xf43f5e,
    center: [0, 0.5, -3.5],
    size: [1.8, 1.5, 1.5]
  },
  cerebellum: {
    id: 'cerebellum',
    title: '小脑 (Cerebellum)',
    tag: 'CEREBELLUM',
    shortName: '小脑 (Cerebellum)',
    physio: '小脑拥有全脑半数以上的神经元。主管精细动作技能控制、肌肉张力维持、动作平衡协调，以及极其精巧的时间信息感算（Timing）。',
    psycho: '近年认知科学发现小脑也深度参与语言流畅度、情绪调节和部分程序性学习。它是我们将行为“自动化”（如学自行车、习惯动作反射）的关键。',
    clinical: '小脑受损会导致共济失调、意向性震颤、平衡障碍以及语言吞吐困难。',
    interaction: '高亮小脑区域并旋转模型观察其位于后颅窝的位置；理解精细运动协调、平衡及程序性学习的脑结构基础。',
    dopamine: 55, serotonin: 70, norepinephrine: 35, endorphin: 65,
    color: 0xf59e0b,
    center: [0, -2, -2.5],
    size: [1.8, 1.3, 1.8]
  },
  brainstem: {
    id: 'brainstem',
    title: '脑干与网状结构 (Brainstem & Reticular)',
    tag: 'BRAINSTEM',
    shortName: '脑干 (Brainstem)',
    physio: '由中脑、脑桥、延髓组成，是生命中枢。控制心跳、呼吸、血压，并包含上升网状激活系统（ARAS），是大脑的电源总开关，提供全局神经递质的源动力。',
    psycho: '主导意识的觉醒、注意力的基底唤醒度。脑干通过去甲肾上腺素、5-羟色胺和多巴胺的轴突投射，控制大半个大脑处于“睡眼惺忪”还是“极度警惕”的阈值变化。',
    clinical: '脑干微小病变都可能是致命的。网状激活系统严重损伤可导致不可逆的深度昏迷、植物人状态或脑死亡。',
    interaction: '点击脑干按钮高亮生命中枢区域；观察其与网状激活系统相关的觉醒度说明；理解基本生命体征调控的解剖基础。',
    dopamine: 70, serotonin: 50, norepinephrine: 90, endorphin: 45,
    color: 0x06b6d4,
    center: [0, -3.5, -0.5],
    size: [0.8, 2.2, 0.8]
  }
}

export const regionList = Object.values(brainRegions)

export const categories = [
  {
    key: 'cortex',
    label: '大脑皮层',
    en: 'Cortex',
    desc: '高级认知功能的神经基础',
    regions: ['frontal', 'parietal', 'occipital']
  },
  {
    key: 'limbic',
    label: '边缘系统',
    en: 'Limbic system',
    desc: '情绪、记忆与动机加工',
    regions: ['temporal']
  },
  {
    key: 'subcortical',
    label: '皮层下结构',
    en: 'Subcortical',
    desc: '感觉中继、运动协调与内稳态',
    regions: ['cerebellum', 'brainstem']
  }
]
