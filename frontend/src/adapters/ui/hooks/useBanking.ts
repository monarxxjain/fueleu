import { useState, useCallback } from 'react';
import type { CBResult, AdjustedCBResult } from '../../../core/domain/entities';
import type { BankRecord } from '../../../core/domain/entities';
import {
  makeFetchCBUseCase,
  makeFetchAdjustedCBUseCase,
  makeFetchBankRecordsUseCase,
  makeBankSurplusUseCase,
  makeApplyBankedUseCase,
} from '../../infrastructure/container';

interface BankingState {
  cb: CBResult | null;
  adjustedCB: AdjustedCBResult | null;
  records: BankRecord[];
  loading: boolean;
  error: string | null;
}

export function useBanking() {
  const [state, setState] = useState<BankingState>({
    cb: null,
    adjustedCB: null,
    records: [],
    loading: false,
    error: null,
  });

  const computeCB = useCallback(async (shipId: string, year: number) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const cb = await makeFetchCBUseCase().execute(shipId, year);
      const adjustedCB = await makeFetchAdjustedCBUseCase().execute(shipId, year);
      const records = await makeFetchBankRecordsUseCase().execute(shipId, year);
      setState({ cb, adjustedCB, records, loading: false, error: null });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: (e as Error).message }));
    }
  }, []);

  const bank = useCallback(
    async (shipId: string, year: number, amount: number) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        await makeBankSurplusUseCase().execute({ shipId, year, amount });
        await computeCB(shipId, year);
      } catch (e) {
        setState((s) => ({ ...s, loading: false, error: (e as Error).message }));
      }
    },
    [computeCB]
  );

  const applyBanked = useCallback(
    async (shipId: string, year: number, amount: number) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        await makeApplyBankedUseCase().execute({ shipId, year, amount });
        await computeCB(shipId, year);
      } catch (e) {
        setState((s) => ({ ...s, loading: false, error: (e as Error).message }));
      }
    },
    [computeCB]
  );

  return { ...state, computeCB, bank, applyBanked };
}
