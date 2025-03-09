import type { Moment } from 'moment';
import type { TIME_FILTERS } from '@/providers/TimeProvider';

export interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isFixed: boolean; // New property to determine if project stays fixed
}

export interface MonthData {
  id: string;
  month: number;
  year: number;
  label: string;
  date: Date;
  projects: Project[];
}

export interface ProjectsUtils {
  generateMonthData: (date: Moment, filter: typeof TIME_FILTERS[number]) => MonthData;
  generateInitialMonths: (filter: typeof TIME_FILTERS[number], date: Moment) => MonthData[];
}