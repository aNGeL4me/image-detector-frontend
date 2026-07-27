export interface ModelFeature {
  title: string;
  description: string;
  icon: string;
}

export interface ModelMetric {
  name: string;
  value: string;
  dataset: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  icon: string;
  status?: string;
  tagline: string;
  description: string;
  features: ModelFeature[];
  metrics: ModelMetric[];
}

export const models: ModelInfo[] = [
  {
    id: 'texdet',
    name: 'TexDet-B',
    icon: '🧩',
    tagline: '基于纹理对比的 CNN 检测模型',
    description:
      'TexDet-B 通过对比图像中丰富纹理与稀疏纹理区域的差异来识别生成痕迹，对扩散模型生成的图像具有良好的检测效果。（占位介绍，后续补充）',
    features: [
      {
        title: '高准确率',
        description: '在多个公开数据集上达到 95%+ 的检测准确率',
        icon: '🎯',
      },
      {
        title: '快速推理',
        description: '单张图片检测耗时低于 100ms，支持批量处理',
        icon: '⚡',
      },
      {
        title: '轻量部署',
        description: '基于 CNN 骨干网络，模型体积小，易于部署',
        icon: '📦',
      },
    ],
    metrics: [
      { name: '准确率', value: '96.2%', dataset: 'GenImage' },
      { name: '精确率', value: '95.8%', dataset: 'GenImage' },
      { name: '召回率', value: '96.5%', dataset: 'GenImage' },
      { name: 'F1 分数', value: '96.1%', dataset: 'GenImage' },
      { name: '推理速度', value: '87ms', dataset: '单张图片' },
    ],
  },
  {
    id: 'vit-guard',
    name: 'ViT-Guard',
    icon: '🛡️',
    tagline: '基于 Vision Transformer 的检测模型',
    description:
      'ViT-Guard 基于 Vision Transformer 架构，利用全局注意力捕捉生成图像在长距离依赖上的异常模式，泛化能力更强。（占位介绍，后续补充）',
    features: [
      {
        title: '强泛化性',
        description: '对未参与训练的新生代生成模型仍保持较高检出率',
        icon: '🌐',
      },
      {
        title: '全局建模',
        description: '利用自注意力机制捕捉全图范围的生成痕迹',
        icon: '🔭',
      },
      {
        title: '可解释性',
        description: '支持输出注意力热图，辅助定位可疑区域',
        icon: '🔍',
      },
    ],
    metrics: [
      { name: '准确率', value: '97.1%', dataset: 'GenImage' },
      { name: '精确率', value: '96.9%', dataset: 'GenImage' },
      { name: '召回率', value: '97.3%', dataset: 'GenImage' },
      { name: 'F1 分数', value: '97.1%', dataset: 'GenImage' },
      { name: '推理速度', value: '132ms', dataset: '单张图片' },
    ],
  },
  {
    id: 'meta-forensics',
    name: 'MetaForensics',
    icon: '📷',
    status: '规划中',
    tagline: '基于相机元数据的自监督检测模型',
    description:
      'MetaForensics 从相机元数据的角度出发，通过自监督学习建模真实照片的成像过程，从而识别缺少真实成像链路的生成图像。（占位介绍，后续补充）',
    features: [
      {
        title: '自监督训练',
        description: '无需大量标注数据，降低数据构建成本',
        icon: '🧠',
      },
      {
        title: '物理先验',
        description: '利用相机成像过程的物理约束作为检测依据',
        icon: '🔬',
      },
      {
        title: '多模态融合',
        description: '联合图像内容与元数据特征进行综合判定',
        icon: '🔗',
      },
    ],
    metrics: [
      { name: '准确率', value: '待定', dataset: 'GenImage' },
      { name: '精确率', value: '待定', dataset: 'GenImage' },
      { name: '召回率', value: '待定', dataset: 'GenImage' },
      { name: 'F1 分数', value: '待定', dataset: 'GenImage' },
      { name: '推理速度', value: '待定', dataset: '单张图片' },
    ],
  },
];
