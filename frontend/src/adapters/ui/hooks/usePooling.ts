import { useState, useCallback } from 'react';
import type { AdjustedCBResult, PoolResult } from '../../../core/domain/entities';
import {
  makeFetchAdjustedCBUseCase,
  makeCreatePoolUseCase,
} from '../../infrastructure/container';

interface PoolingState {
  memberCBs: Record<string, AdjustedCBResult>;
  poolResult: PoolResult | null;
  loading: boolean;
  error: string | null;
}

export function usePooling() {
  const [state, setState] = useState<PoolingState>({
    memberCBs: {},
    poolResult: null,
    loading: false,
    error: null,
  });

  const fetchMemberCB = useCallback(
    async (shipId: string, year: number) => {
      try {
        const result = await makeFetchAdjustedCBUseCase().execute(shipId, year);
        setState((s) => ({
          ...s,
          memberCBs: { ...s.memberCBs, [shipId]: result },
        }));
      } catch (e) {
        setState((s) => ({ ...s, error: (e as Error).message }));
      }
    },
    []
  );

  const createPool = useCallback(
    async (year: number, members: Array<{ shipId: string; year: number }>) => {
      setState((s) => ({ ...s, loading: true, error: null, poolResult: null }));
      try {
        const result = await makeCreatePoolUseCase().execute(year, members);
        setState((s) => ({ ...s, loading: false, poolResult: result }));
      } catch (e) {
        setState((s) => ({ ...s, loading: false, error: (e as Error).message }));
      }
    },
    []
  );

  return { ...state, fetchMemberCB, createPool };
}
