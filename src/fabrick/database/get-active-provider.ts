import { databaseRecommendation } from "./database-comparison";
import type { DatabaseProviderId } from "./providers";

export function getActiveDatabaseProvider(): DatabaseProviderId {
  // Using recommendation from database-comparison as active
  return databaseRecommendation.primary;
}
