import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from 'drizzle-orm';
import type { Exact } from 'type-fest';

import type * as schema from '../schema';

export const timestamps: { createdAt: true; updatedAt: true } = {
  createdAt: true,
  updatedAt: true,
};

type TSchema = ExtractTablesWithRelations<typeof schema>;

type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
  'one' | 'many',
  boolean,
  TSchema,
  TSchema[TableName]
>;

export type InferQueryModel<
  TableName extends keyof TSchema,
  // biome-ignore lint/complexity/noBannedTypes: @link https://github.com/drizzle-team/drizzle-orm/issues/695#issuecomment-2126704308
  QBConfig extends Exact<QueryConfig<TableName>, QBConfig> = {}, // <-- notice Exact here
> = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;
