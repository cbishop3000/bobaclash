/*
  Warnings:

  - The values [LIKE,LOVE,NEED] on the enum `SubscriptionTier` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionTier_new" AS ENUM ('CLASHAHOLIC', 'I_NEED_COFFEE', 'I_LOVE_COFFEE', 'I_LIKE_COFFEE');
ALTER TABLE "User" ALTER COLUMN "subscriptionTier" TYPE "SubscriptionTier_new" USING ("subscriptionTier"::text::"SubscriptionTier_new");
ALTER TYPE "SubscriptionTier" RENAME TO "SubscriptionTier_old";
ALTER TYPE "SubscriptionTier_new" RENAME TO "SubscriptionTier";
DROP TYPE "SubscriptionTier_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT;
