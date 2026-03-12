import { useState, useEffect, useCallback } from 'react';
import type { ComparisonResult } from '../../../core/domain/entities';
import { makeFetchComparisonUseCase } from '../../infrastructure/container';

interface ComparisonState {
  data: ComparisonResult | null;
  loading: boolean;
  error: string | null;
}

export function useComparison() {
  const [state, setState] = useState<ComparisonState>({
    data: null,
    loading: true,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await makeFetchComparisonUseCase().execute();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState({ data: null, loading: false, error: (e as Error).message });
    }
  }, []);

  useEffect(() => { void fetch(); }, [fetch]);

  return { ...state, refetch: fetch };
}
