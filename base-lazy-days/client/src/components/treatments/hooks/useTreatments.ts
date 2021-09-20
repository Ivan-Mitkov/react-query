import { useQuery, useQueryClient } from 'react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
// import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  // const toast = useCustomToast();
  const fallbackValue = [];
  const { data = fallbackValue } = useQuery(
    queryKeys.treatments,
    getTreatments,
    // {
    //   onError: (error) => {
    //     const title =
    //       error instanceof Error
    //         ? error.toString().replace(/^Error:\s*/, '')
    //         : 'error connecting to the server';
    //     toast({
    //       title,
    //       status: 'error',
    //     });
    //   },
    // },
  );

  return data;
}

// populate the cache
export function usePrefetchTreatment(): void {
  // get the client
  const client = useQueryClient();
  // which useQuery should look for this data in the cache
  client.prefetchQuery(queryKeys.treatments, getTreatments);
}
