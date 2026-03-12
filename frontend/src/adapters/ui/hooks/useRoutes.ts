import { useState, useEffect, useCallback } from 'react';
import type { Route } from '../../../core/domain/entities';
import { makeFetchRoutesUseCase, makeSetBaselineUseCase } from '../../infrastructure/container';

interface RoutesState {
  routes: Route[];
  loading: boolean;
  error: string | null;
}

export function useRoutes() {
  const [state, setState] = useState<RoutesState>({
    routes: [],
    loading: true,
    error: null,
  });

  const fetchRoutes = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await makeFetchRoutesUseCase().execute();
      setState({ routes: data, loading: false, error: null });
    } catch (e) {
      setState({ routes: [], loading: false, error: (e as Error).message });
    }
  }, []);

  useEffect(() => { void fetchRoutes(); }, [fetchRoutes]);

  const setBaseline = useCallback(
    async (id: string): Promise<void> => {
      await makeSetBaselineUseCase().execute(id);
      await fetchRoutes(); // refresh to show updated baseline flag
    },
    [fetchRoutes]
  );

  return { ...state, refetch: fetchRoutes, setBaseline };
}
