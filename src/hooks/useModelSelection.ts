import { useState } from 'react';
import { models } from '../data/models';

/**
 * 模型选择逻辑：点击固定选中，悬停临时预览，移开后回退到选中的模型。
 */
export function useModelSelection() {
  const [selectedId, setSelectedId] = useState(models[0].id);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const displayedId = previewId ?? selectedId;
  const displayed = models.find((m) => m.id === displayedId) ?? models[0];

  return {
    displayed,
    displayedId,
    selectedId,
    preview: setPreviewId,
    select: setSelectedId,
  };
}
