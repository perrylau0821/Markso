import moment from 'moment';
import type { TIME_FILTERS } from '@/providers/TimeProvider';
import type { MonthData, Project, ProjectsUtils } from '@/types/projects';

// Just two demo projects - one fixed and one scrolling
const demoProjects: Project[] = [
  {
    id: '1',
    name: 'Global Platform Migration',
    startDate: '2025-01-01',
    endDate: '2025-05-31',
    isFixed: true, // This project will stay fixed
  },
  {
    id: '2',
    name: 'Monthly Updates',
    startDate: '2025-03-01',
    endDate: '2025-03-31',
    isFixed: false, // This project will scroll with the page
  },
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