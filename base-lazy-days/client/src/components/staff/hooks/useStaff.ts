import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useQuery } from 'react-query';

import type { Staff } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { filterByTreatment } from '../utils';

// for when we need a query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}

interface UseStaff {
  staff: Staff[];
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

export function useStaff(): UseStaff {
  // for filtering staff by treatment
  const [filter, setFilter] = useState('all');

  const filterStuff = useCallback(
    (staff) => {
      if (filter === 'all') {
        return staff;
      }
      return filterByTreatment(staff, filter);
    },
    [filter],
  );
  const fallbackValue = [];
  const { data: staff = fallbackValue } = useQuery(queryKeys.staff, getStaff, {
    select: (staffToFliter) => filterStuff(staffToFliter),
  });

  return { staff, filter, setFilter };
}
