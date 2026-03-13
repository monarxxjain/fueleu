// DI container — wires API adapters into use-cases
// Follows the hexagonal principle: core never imports adapters; adapters implement ports

import { RouteApiAdapter } from './RouteApiAdapter';
import { ComplianceApiAdapter } from './ComplianceApiAdapter';
import { BankingApiAdapter } from './BankingApiAdapter';
import { PoolApiAdapter } from './PoolApiAdapter';

import { FetchRoutesUseCase, SetBaselineUseCase } from '../../core/application/usecases/RouteUseCases';
import { FetchComparisonUseCase } from '../../core/application/usecases/ComparisonUseCase';
import { FetchCBUseCase, FetchAdjustedCBUseCase } from '../../core/application/usecases/ComplianceUseCases';
import { FetchBankRecordsUseCase, BankSurplusUseCase, ApplyBankedUseCase } from '../../core/application/usecases/BankingUseCases';
import { CreatePoolUseCase, FetchPoolsByYearUseCase } from '../../core/application/usecases/PoolUseCases';

// Adapters (singleton instances)
const routeAdapter = new RouteApiAdapter();
const complianceAdapter = new ComplianceApiAdapter();
const bankingAdapter = new BankingApiAdapter();
const poolAdapter = new PoolApiAdapter();

// Use-case factories — new instance per call keeps hooks predictable
export const makeFetchRoutesUseCase = () => new FetchRoutesUseCase(routeAdapter);
export const makeSetBaselineUseCase = () => new SetBaselineUseCase(routeAdapter);
export const makeFetchComparisonUseCase = () => new FetchComparisonUseCase(routeAdapter);

export const makeFetchCBUseCase = () => new FetchCBUseCase(complianceAdapter);
export const makeFetchAdjustedCBUseCase = () => new FetchAdjustedCBUseCase(complianceAdapter);

export const makeFetchBankRecordsUseCase = () => new FetchBankRecordsUseCase(bankingAdapter);
export const makeBankSurplusUseCase = () => new BankSurplusUseCase(bankingAdapter);
export const makeApplyBankedUseCase = () => new ApplyBankedUseCase(bankingAdapter);

export const makeFetchPoolsByYearUseCase = () => new FetchPoolsByYearUseCase(poolAdapter);
export const makeCreatePoolUseCase = () => new CreatePoolUseCase(poolAdapter);
