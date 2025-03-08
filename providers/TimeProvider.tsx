import { createContext, useContext, useState } from 'react';
import moment from 'moment';
import type { Moment } from 'moment';

export type TimeFilter = 'year' | 'half-year' | 'quarter' | '2-months' | 'month';

export interface TimeFilterOption {
  id: TimeFilter;
  label: string;
  months: number;
  getStartDate: (date: Moment) => Moment;
  formatLabel: (date: Moment) => string;
}

export const TIME_FILTERS: TimeFilterOption[] = [
  { 
    id: 'year', 
    label: 'Year', 
    months: 12,
    getStartDate: (date) => date.clone().startOf('year'),
    formatLabel: (date) => date.format('YYYY'),
  },
  { 
    id: 'half-year', 
    label: '6 Months', 
    months: 6,
    getStartDate: (date) => date.clone().startOf('month'),
    formatLabel: (date) => `${date.format('MMM')} - ${date.clone().add(5, 'months').format('MMM')} ${date.format('YYYY')}`,
  },
  { 
    id: 'quarter', 
    label: 'Quarter', 
    months: 3,
    getStartDate: (date) => date.clone().startOf('month'),
    formatLabel: (date) => `${date.format('MMM')} - ${date.clone().add(2, 'months').format('MMM')} ${date.format('YYYY')}`,
  },
  { 
    id: '2-months', 
    label: '2 Months', 
    months: 2,
    getStartDate: (date) => date.clone().startOf('month'),
    formatLabel: (date) => `${date.format('MMM')} - ${date.clone().add(1, 'month').format('MMM')} ${date.format('YYYY')}`,
  },
  { 
    id: 'month', 
    label: 'Month', 
    months: 1,
    getStartDate: (date) => date.clone().startOf('month'),
    formatLabel: (date) => date.format('MMMM YYYY'),
  },
];

interface TimeContextType {
  referenceDate: Moment;
  setReferenceDate: (date: Moment) => void;
  selectedFilter: TimeFilter;
  setSelectedFilter: (filter: TimeFilter) => void;
  currentFilter: TimeFilterOption;
  alignDateToFilter: (date: Moment, filter: TimeFilterOption) => Moment;
}

const TimeContext = createContext<TimeContextType>({} as TimeContextType);

export function TimeProvider({ children }: { children: React.ReactNode }) {
  const [referenceDate, setReferenceDate] = useState(moment());
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('month');

  const currentFilter = TIME_FILTERS.find(f => f.id === selectedFilter)!;

  // Helper function to align a date to the start of the current filter period
  const alignDateToFilter = (date: Moment, filter: TimeFilterOption) => {
    const startDate = filter.getStartDate(date);
    return startDate;
  };

  return (
    <TimeContext.Provider 
      value={{
        referenceDate,
        setReferenceDate,
        selectedFilter,
        setSelectedFilter,
        currentFilter,
        alignDateToFilter,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}

export const useTime = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};