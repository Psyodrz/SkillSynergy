import React, { useMemo, useState } from 'react';
import { Monitor, Palette, Megaphone, Briefcase, PenTool, CircleDollarSign, Sparkles } from 'lucide-react';
import type { Skill } from '../types';

interface SkillCardProps {
  skill: Skill;
  onConnect?: (skill: Skill) => void;
  className?: string;
}

const getCategoryDetails = (category: string) => {
  const c = category?.toLowerCase() || '';
  if (c.includes('tech') || c.includes('code') || c.includes('develop')) return { color: '#14b8a6', Icon: Monitor };
  if (c.includes('design') || c.includes('art')) return { color: '#10b981', Icon: Palette };
  if (c.includes('market')) return { color: '#06b6d4', Icon: Megaphone };
  if (c.includes('business') || c.includes('manage')) return { color: '#0d9488', Icon: Briefcase };
  if (c.includes('writ')) return { color: '#059669', Icon: PenTool };
  if (c.includes('financ')) return { color: '#2dd4bf', Icon: CircleDollarSign };
  return { color: '#94a3b8', Icon: Sparkles };
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const SkillCard: React.FC<SkillCardProps> = ({ skill, onConnect, className = '' }) => {
  const { color, Icon } = useMemo(() => getCategoryDetails(skill.category), [skill.category]);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onConnect && onConnect(skill)}
      className={`relative flex flex-col justify-between cursor-pointer transition-all duration-300 ${isHovered ? '-translate-y-[2px]' : ''} ${className}`}
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: `linear-gradient(135deg, ${color}1A, transparent), ${isHovered ? 'rgba(255, 255, 255, 0.13)' : 'rgba(255, 255, 255, 0.07)'}`,
        border: `0.5px solid ${isHovered ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.12)'}`,
        borderRadius: '14px',
        padding: '14px 12px',
        boxShadow: 'none',
        height: '100%',
        minHeight: '140px'
      }}
    >
      <div>
        <div className="mb-3" style={{ color: color }}>
          <Icon size={24} strokeWidth={2} />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-1 line-clamp-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {skill.name}
        </h3>
        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 line-clamp-1 uppercase tracking-wider">
          {skill.category}
        </p>
      </div>
      
      <div className="flex items-end justify-between mt-4">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getLevelColor(skill.level)}`}>
          {skill.level}
        </span>
        {onConnect && (
          <span className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-300 transition-colors">
            + Connect
          </span>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
