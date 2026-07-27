import { models } from '../data/models';

interface ModelSelectorProps {
  displayedId: string;
  selectedId: string;
  onPreview: (id: string | null) => void;
  onSelect: (id: string) => void;
}

export default function ModelSelector({
  displayedId,
  selectedId,
  onPreview,
  onSelect,
}: ModelSelectorProps) {
  return (
    <div className="model-selector" onMouseLeave={() => onPreview(null)}>
      {models.map((model) => (
        <div
          key={model.id}
          className={[
            'model-box',
            model.id === displayedId ? 'previewing' : '',
            model.id === selectedId ? 'selected' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          role="button"
          tabIndex={0}
          onMouseEnter={() => onPreview(model.id)}
          onClick={() => onSelect(model.id)}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(model.id)}
        >
          <div className="model-icon">{model.icon}</div>
          <h3>
            {model.name}
            {model.status && <span className="model-status">{model.status}</span>}
          </h3>
          <p>{model.tagline}</p>
        </div>
      ))}
    </div>
  );
}
