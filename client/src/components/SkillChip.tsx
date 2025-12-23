import { XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { getCategoryByName } from '../data/skillPresets';

interface SkillChipProps {
  name: string;
  category?: string;
  level?: string;
  isCustom?: boolean;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLevel?: boolean;
  className?: string;
}

export default function SkillChip({
  name,
  category,
  level,
  isCustom = false,
  onRemove,
  size = 'md',
  showLevel = true,
  className = ''
}: SkillChipProps) {
  const categoryInfo = category ? getCategoryByName(category) : null;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };
  
  const levelColors: Record<string, string> = {
    'Beginner': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    'Intermediate': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'Advanced': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        bg-white dark:bg-charcoal-800 
        border border-gray-200 dark:border-charcoal-700
        shadow-sm hover:shadow-md transition-all duration-200
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Custom skill indicator */}
      {isCustom && (
        <StarIcon className="w-3.5 h-3.5 text-amber-500" />
      )}
      
      {/* Category color dot */}
      {categoryInfo && (
        <span className={`w-2 h-2 rounded-full ${categoryInfo.color.replace('text-', 'bg-')}`} />
      )}
      
      {/* Skill name */}
      <span className="text-charcoal-800 dark:text-white">{name}</span>
      
      {/* Level badge */}
      {showLevel && level && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${levelColors[level] || levelColors['Beginner']}`}>
          {level}
        </span>
      )}
      
      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          aria-label={`Remove ${name}`}
        >
          <XMarkIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
