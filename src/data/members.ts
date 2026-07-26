export interface Member {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  skills: string[];
}

export const members: Member[] = [
  {
    name: '张三',
    role: '算法负责人',
    avatar: '👨‍💻',
    bio: '专注于计算机视觉与生成式图像检测研究，负责检测模型的整体架构设计与优化。（占位介绍，后续补充）',
    skills: ['深度学习', 'Vision Transformer', '模型压缩'],
  },
  {
    name: '李四',
    role: '前端开发',
    avatar: '👩‍💻',
    bio: '负责检测系统前端界面的设计与实现，关注用户体验与性能优化。（占位介绍，后续补充）',
    skills: ['React', 'TypeScript', 'Vite'],
  },
  {
    name: '王五',
    role: '后端开发',
    avatar: '👨‍🔧',
    bio: '负责检测服务的后端架构与接口开发，保障高并发下的推理服务稳定性。（占位介绍，后续补充）',
    skills: ['FastAPI', 'Docker', '分布式部署'],
  },
  {
    name: '赵六',
    role: '数据标注',
    avatar: '👩‍🔬',
    bio: '负责训练数据集的构建、清洗与标注规范制定，为模型提供高质量数据支持。（占位介绍，后续补充）',
    skills: ['数据清洗', '标注规范', '数据增强'],
  },
];
