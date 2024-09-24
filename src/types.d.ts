import type { BaseClientOptions, SchemaInference } from "@xata.io/client";
declare const tables: readonly [];
export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;
export type DatabaseSchema = {};
declare const DatabaseClient: any;
export declare class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions);
}
export declare const getXataClient: () => XataClient;
export {};
