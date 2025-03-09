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
    label: 'Y', 
    months: 12,
    getStartDate: (date) => date.clone().startOf('year'),
    formatLabel: (date) => date.format('YYYY'),
  },
  { 
    id: 'half-year', 
    label: '6M', 
    months: 6,
    getStartDate: (date) => {
      const month = date.month();
      return date.clone().month(Math.floor(month / 6) * 6).startOf('month');
    },
    formatLabel: (date) => {
      const halfYear = Math.floor(date.month() / 6) + 1;
      return `H${halfYear}, ${date.format('YYYY')} (${date.format('MMM')} - ${date.clone().add(5, 'months').format('MMM')})`;
    },
  },
  { 
    id: 'quarter', 
    label: 'Q', 
    months: 3,
    getStartDate: (date) => {
      const month = date.month();
      return date.clone().month(Math.floor(month / 3) * 3).startOf('month');
    },
    formatLabel: (date) => {
      const quarter = Math.floor(date.month() / 3) + 1;
      return `Q${quarter}, ${date.format('YYYY')} (${date.format('MMM')} - ${date.clone().add(2, 'months').format('MMM')})`;
    },
  },
  { 
    id: '2-months', 
    label: '2M', 
    months: 2,
    getStartDate: (date) => {
      const month = date.month();
      return date.clone().month(Math.floor(month / 2) * 2).startOf('month');
    },
    formatLabel: (date) => `${date.format('MMM')} - ${date.clone().add(1, 'month').format('MMM')} ${date.format('YYYY')}`,
  },
  { 
    id: 'month', 
    label: 'M', 
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
  const [referenceDate, setReferenceDateInternal] = useState(moment());
  const [selectedFilter, setSelectedFilterInternal] = useState<TimeFilter>('month');

  const currentFilter = TIME_FILTERS.find(f => f.id === selectedFilter)!;

  // Helper function to align a date to the start of the current filter period
  const alignDateToFilter = (date: Moment, filter: TimeFilterOption) => {
    return filter.getStartDate(date);
  };

  // Wrapper for setReferenceDate that ensures the date is aligned to the current filter
  const setReferenceDate = (date: Moment) => {
    const alignedDate = alignDateToFilter(date, currentFilter);
    setReferenceDateInternal(alignedDate);
  };

  // Wrapper for setSelectedFilter that ensures the reference date is properly aligned
  // when changing filter types
  const setSelectedFilter = (newFilter: TimeFilter) => {
    const newFilterOption = TIME_FILTERS.find(f => f.id === newFilter)!;
    const alignedDate = alignDateToFilter(referenceDate, newFilterOption);
    setSelectedFilterInternal(newFilter);
    setReferenceDateInternal(alignedDate);
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