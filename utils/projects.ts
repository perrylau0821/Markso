import moment from 'moment';
import type { TIME_FILTERS } from '@/providers/TimeProvider';
import type { MonthData, Project, ProjectsUtils } from '@/types/projects';

// Demo projects with varied time spans
const demoProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    startDate: '2025-02-15',
    endDate: '2025-04-30',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    startDate: '2025-01-01',
    endDate: '2025-06-30',
  },
  {
    id: '3',
    name: 'Q1 Marketing Campaign',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
  },
  {
    id: '4',
    name: 'System Maintenance',
    startDate: '2025-03-15',
    endDate: '2025-03-20',
  },
  {
    id: '5',
    name: 'Annual Strategy Planning',
    startDate: '2025-03-01',
    endDate: '2025-12-31',
  },
  {
    id: '6',
    name: 'Team Training Program',
    startDate: '2025-03-25',
    endDate: '2025-05-15',
  }
];

const getProjectsForMonth = (date: moment.Moment): Project[] => {
  const monthStart = date.clone().startOf('month');
  const monthEnd = date.clone().endOf('month');
  
  return demoProjects.filter(project => {
    const projectStart = moment(project.startDate);
    const projectEnd = moment(project.endDate);
    
    return projectStart.isSameOrBefore(monthEnd) && projectEnd.isSameOrAfter(monthStart);
  });
};

export const generateMonthData = (date: moment.Moment, filter: typeof TIME_FILTERS[number]): MonthData => {
  const alignedDate = filter.getStartDate(date.clone());
  return {
    id: alignedDate.format('YYYY-MM'),
    month: alignedDate.month(),
    year: alignedDate.year(),
    label: filter.formatLabel(alignedDate),
    date: alignedDate.toDate(),
    projects: getProjectsForMonth(alignedDate),
  };
};

export const generateInitialMonths = (filter: typeof TIME_FILTERS[number], date: moment.Moment): MonthData[] => {
  const months: MonthData[] = [];
  const alignedDate = filter.getStartDate(date.clone());
  
  // Generate current month
  const monthDate = alignedDate.clone();
  months.push(generateMonthData(monthDate, filter));
  
  return months;
};

export const projectsUtils: ProjectsUtils = {
  generateMonthData,
  generateInitialMonths,
};