import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { Badge } from '../ui/Badge';
import type { Feature } from '../../types';

interface FeatureCheckboxProps {
  feature: Feature;
  checked: boolean;
  onChange: (featureId: string, checked: boolean) => void;
  disabled?: boolean;
}

export function FeatureCheckbox({
  feature,
  checked,
  onChange,
  disabled = false,
}: FeatureCheckboxProps) {
  return (
    <Card hover className="cursor-pointer">
      <div
        className="flex items-start gap-4"
        onClick={() => !disabled && onChange(feature.id, !checked)}
      >
        <Checkbox
          checked={checked}
          onChange={(e) => onChange(feature.id, e.target.checked)}
          disabled={disabled}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {feature.title}
            </h3>
            <Badge variant="primary">{feature.voteCount} votes</Badge>
          </div>
          <p className="text-gray-600 text-sm">{feature.description}</p>
        </div>
      </div>
    </Card>
  );
}
