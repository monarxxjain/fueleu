import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Route: "Route";
    readonly ShipCompliance: "ShipCompliance";
    readonly BankEntry: "BankEntry";
    readonly Pool: "Pool";
    readonly PoolMember: "PoolMember";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const RouteScalarFieldEnum: {
    readonly id: "id";
    readonly routeId: "routeId";
    readonly vesselType: "vesselType";
    readonly fuelType: "fuelType";
    readonly year: "year";
    readonly ghgIntensity: "ghgIntensity";
    readonly fuelConsumption: "fuelConsumption";
    readonly distance: "distance";
    readonly totalEmissions: "totalEmissions";
    readonly isBaseline: "isBaseline";
};
export type RouteScalarFieldEnum = (typeof RouteScalarFieldEnum)[keyof typeof RouteScalarFieldEnum];
export declare const ShipComplianceScalarFieldEnum: {
    readonly id: "id";
    readonly shipId: "shipId";
    readonly year: "year";
    readonly cbGco2eq: "cbGco2eq";
    readonly computedAt: "computedAt";
};
export type ShipComplianceScalarFieldEnum = (typeof ShipComplianceScalarFieldEnum)[keyof typeof ShipComplianceScalarFieldEnum];
export declare const BankEntryScalarFieldEnum: {
    readonly id: "id";
    readonly shipId: "shipId";
    readonly year: "year";
    readonly amountGco2eq: "amountGco2eq";
    readonly createdAt: "createdAt";
};
export type BankEntryScalarFieldEnum = (typeof BankEntryScalarFieldEnum)[keyof typeof BankEntryScalarFieldEnum];
export declare const PoolScalarFieldEnum: {
    readonly id: "id";
    readonly year: "year";
    readonly createdAt: "createdAt";
};
export type PoolScalarFieldEnum = (typeof PoolScalarFieldEnum)[keyof typeof PoolScalarFieldEnum];
export declare const PoolMemberScalarFieldEnum: {
    readonly id: "id";
    readonly poolId: "poolId";
    readonly shipId: "shipId";
    readonly year: "year";
    readonly cbBefore: "cbBefore";
    readonly cbAfter: "cbAfter";
};
export type PoolMemberScalarFieldEnum = (typeof PoolMemberScalarFieldEnum)[keyof typeof PoolMemberScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map