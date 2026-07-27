export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  description: string;
  thumbnail: string;
  links: { label: string; url: string }[];
}

export interface ExperienceItem {
  period: string;
  title: string;
  org: string;
  description: string;
}

export interface MemberLink {
  label: string;
  url: string;
}

export interface Member {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  skills: string[];
  tagline: string;
  hobbies: string[];
  about: string[];
  publications: Publication[];
  experience: ExperienceItem[];
  links: MemberLink[];
}

export const members: Member[] = [
  {
    name: '张三',
    role: '算法负责人',
    avatar: '👨‍💻',
    bio: '专注于计算机视觉与生成式图像检测研究，负责检测模型的整体架构设计与优化。（占位介绍，后续补充）',
    skills: ['深度学习', 'Vision Transformer', '模型压缩'],
    tagline: '让 AI 生成的图像无所遁形。（占位一句话介绍）',
    hobbies: ['📷 摄影', '🏃 跑步', '🎮 独立游戏', '📖 科幻小说'],
    about: [
      '你好，我是张三，目前负责生成式图像检测项目的算法工作。我的研究兴趣集中在计算机视觉与深度学习，尤其是生成式图像的取证与检测方向。（占位内容，后续补充）',
      '在工作之余，我喜欢用相机记录生活，也关注生成式模型在艺术创作中的应用。我相信技术的发展应当伴随着对真实性的守护。（占位内容，后续补充）',
    ],
    publications: [
      {
        title: '基于纹理对比的生成式图像检测方法（占位标题）',
        authors: '张三, 李四, 王五',
        venue: '某会议 / 期刊',
        year: '2024',
        description: '提出了一种基于丰富与稀疏纹理对比的检测方法，在多个公开数据集上取得了有竞争力的结果。（占位描述，后续补充）',
        thumbnail: '🖼️',
        links: [
          { label: '论文', url: '#' },
          { label: '代码', url: '#' },
        ],
      },
      {
        title: '面向泛化性的 AI 生成图像检测基准研究（占位标题）',
        authors: '张三, 赵六',
        venue: '某会议 / 期刊',
        year: '2023',
        description: '构建了一个覆盖多种生成模型的检测基准，系统评估了现有检测方法在统一训练条件下的泛化能力。（占位描述，后续补充）',
        thumbnail: '📊',
        links: [
          { label: '论文', url: '#' },
          { label: '项目主页', url: '#' },
        ],
      },
    ],
    experience: [
      {
        period: '2023 - 至今',
        title: '算法负责人',
        org: 'AI Detector 团队',
        description: '负责检测模型的架构设计、训练与迭代优化。（占位，后续补充）',
      },
      {
        period: '2020 - 2023',
        title: '硕士研究生 · 计算机科学与技术',
        org: '某某大学',
        description: '研究方向为计算机视觉与深度学习。（占位，后续补充）',
      },
      {
        period: '2016 - 2020',
        title: '本科 · 软件工程',
        org: '某某大学',
        description: '（占位，后续补充）',
      },
    ],
    links: [
      { label: '📧 Email', url: 'mailto:zhangsan@example.com' },
      { label: '🐙 GitHub', url: '#' },
      { label: '📝 博客', url: '#' },
    ],
  },
  {
    name: '李四',
    role: '前端开发',
    avatar: '👩‍💻',
    bio: '负责检测系统前端界面的设计与实现，关注用户体验与性能优化。（占位介绍，后续补充）',
    skills: ['React', 'TypeScript', 'Vite'],
    tagline: '用心打磨每一个像素。（占位一句话介绍）',
    hobbies: ['🎨 插画', '🎵 音乐', '🧗 攀岩'],
    about: [
      '你好，我是李四，负责本项目的前端开发工作。我关注用户体验与界面设计，喜欢把复杂的功能做得简单易用。（占位内容，后续补充）',
    ],
    publications: [
      {
        title: '生成式图像检测系统的前端设计与实现（占位标题）',
        authors: '李四',
        venue: '内部技术分享',
        year: '2024',
        description: '介绍了检测系统前端的架构设计与性能优化实践。（占位描述，后续补充）',
        thumbnail: '💻',
        links: [{ label: '文章', url: '#' }],
      },
    ],
    experience: [
      {
        period: '2023 - 至今',
        title: '前端开发',
        org: 'AI Detector 团队',
        description: '负责前端界面设计、组件开发与构建部署。（占位，后续补充）',
      },
      {
        period: '2019 - 2023',
        title: '本科 · 数字媒体技术',
        org: '某某大学',
        description: '（占位，后续补充）',
      },
    ],
    links: [
      { label: '📧 Email', url: 'mailto:lisi@example.com' },
      { label: '🐙 GitHub', url: '#' },
    ],
  },
  {
    name: '王五',
    role: '后端开发',
    avatar: '👨‍🔧',
    bio: '负责检测服务的后端架构与接口开发，保障高并发下的推理服务稳定性。（占位介绍，后续补充）',
    skills: ['FastAPI', 'Docker', '分布式部署'],
    tagline: '稳定压倒一切。（占位一句话介绍）',
    hobbies: ['☕ 咖啡', '🚴 骑行', '♟️ 象棋'],
    about: [
      '你好，我是王五，负责本项目的后端服务开发。我关注高并发场景下的服务稳定性与推理性能优化。（占位内容，后续补充）',
    ],
    publications: [
      {
        title: '高并发场景下的模型推理服务架构实践（占位标题）',
        authors: '王五',
        venue: '内部技术分享',
        year: '2024',
        description: '介绍了推理服务的容器化部署与弹性扩容方案。（占位描述，后续补充）',
        thumbnail: '⚙️',
        links: [{ label: '文章', url: '#' }],
      },
    ],
    experience: [
      {
        period: '2023 - 至今',
        title: '后端开发',
        org: 'AI Detector 团队',
        description: '负责后端接口开发与推理服务的部署运维。（占位，后续补充）',
      },
      {
        period: '2019 - 2023',
        title: '本科 · 计算机科学与技术',
        org: '某某大学',
        description: '（占位，后续补充）',
      },
    ],
    links: [
      { label: '📧 Email', url: 'mailto:wangwu@example.com' },
      { label: '🐙 GitHub', url: '#' },
    ],
  },
  {
    name: '赵六',
    role: '数据标注',
    avatar: '👩‍🔬',
    bio: '负责训练数据集的构建、清洗与标注规范制定，为模型提供高质量数据支持。（占位介绍，后续补充）',
    skills: ['数据清洗', '标注规范', '数据增强'],
    tagline: '高质量数据是好模型的起点。（占位一句话介绍）',
    hobbies: ['🌱 园艺', '🎬 纪录片', '🧩 拼图'],
    about: [
      '你好，我是赵六，负责本项目的数据集构建与标注工作。我相信数据质量决定了模型能力的上限。（占位内容，后续补充）',
    ],
    publications: [
      {
        title: '生成式图像检测数据集的构建与标注规范（占位标题）',
        authors: '赵六, 张三',
        venue: '内部技术报告',
        year: '2024',
        description: '制定了覆盖多种生成模型的数据采集与标注规范。（占位描述，后续补充）',
        thumbnail: '🗂️',
        links: [{ label: '报告', url: '#' }],
      },
    ],
    experience: [
      {
        period: '2023 - 至今',
        title: '数据标注',
        org: 'AI Detector 团队',
        description: '负责数据集构建、清洗与标注规范制定。（占位，后续补充）',
      },
      {
        period: '2019 - 2023',
        title: '本科 · 数据科学与大数据技术',
        org: '某某大学',
        description: '（占位，后续补充）',
      },
    ],
    links: [
      { label: '📧 Email', url: 'mailto:zhaoliu@example.com' },
      { label: '🐙 GitHub', url: '#' },
    ],
  },
];
