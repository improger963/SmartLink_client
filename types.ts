
import type React from 'react';

export interface Task {
  id: number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  iconColorClass: string;
  iconBgColorClass: string;
  title: string;
  meta: string;
  buttonText: string;
}
