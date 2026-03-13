import { useState, useCallback } from 'react';
import type { AdjustedCBResult, PoolResult } from '../../../core/domain/entities';
import {
  makeFetchAdjustedCBUseCase,
  makeFetchPoolsByYearUseCase,
  makeCreatePoolUseCase,
} from '../../infrastructure/container';

function memberKey(shipId: string, year: number): string {
  return `${shipId}:${year}`;
}

interface PoolingState {
  memberCBs: Record<string, AdjustedCBResult>;
  memberErrors: Record<string, string>;
  memberLoading: Record<string, boolean>;
  existingPools: PoolResult[];
  poolResult: PoolResult | null;
  loading: boolean;
  error: string | null;
}

export function usePooling() {
  const [state, setState] = useState<PoolingState>({
    memberCBs: {},
    memberErrors: {},
    memberLoading: {},
    existingPools: [],
    poolResult: null,
    loading: false,
    error: null,
  });

  const fetchExistingPools = useCallback(async (year: number) => {
    try {
      const pools = await makeFetchPoolsByYearUseCase().execute(year);
      setState((s) => ({ ...s, existingPools: pools }));
    } catch (e) {
      setState((s) => ({ ...s, error: (e as Error).message }));
    }
  }, []);

  const fetchMemberCB = useCallback(
    async (shipId: string, year: number) => {
      const key = memberKey(shipId, year);
      setState((s) => ({
        ...s,
        memberLoading: { ...s.memberLoading, [key]: true },
        memberErrors: { ...s.memberErrors, [key]: '' },
      }));

      try {
        const result = await makeFetchAdjustedCBUseCase().execute(shipId, year);
        setState((s) => ({
          ...s,
          memberCBs: { ...s.memberCBs, [key]: result },
          memberLoading: { ...s.memberLoading, [key]: false },
          memberErrors: { ...s.memberErrors, [key]: '' },
        }));
      } catch (e) {
        setState((s) => ({
          ...s,
          memberLoading: { ...s.memberLoading, [key]: false },
          memberErrors: { ...s.memberErrors, [key]: (e as Error).message },
        }));
      }
    },
    []
  );

  const createPool = useCallback(
    async (year: number, members: Array<{ shipId: string; year: number }>) => {
      setState((s) => ({ ...s, loading: true, error: null, poolResult: null }));
      try {
        const result = await makeCreatePoolUseCase().execute(year, members);
        const pools = await makeFetchPoolsByYearUseCase().execute(year);
        setState((s) => ({ ...s, loading: false, poolResult: result, existingPools: pools }));
      } catch (e) {
        setState((s) => ({ ...s, loading: false, error: (e as Error).message }));
      }
    },
    []
  );

  return { ...state, fetchMemberCB, fetchExistingPools, createPool, memberKey };
}
