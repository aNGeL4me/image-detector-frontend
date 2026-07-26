export interface NewsItem {
  date: string;
  tag: string;
  content: string;
  link?: string;
}

export const news: NewsItem[] = [
  {
    date: '2024-07-20',
    tag: '🌟',
    content: '检测系统前端页面完成路由化改造，各功能模块拆分为独立页面。',
  },
  {
    date: '2024-07-19',
    tag: '📋',
    content: '在线检测功能上线，支持上传图片并获得真实 / AI 生成的判定结果。',
  },
  {
    date: '2024-07-18',
    tag: '📃',
    content: '项目初始化，搭建基于 React + TypeScript + Vite 的前端工程。',
  },
];
