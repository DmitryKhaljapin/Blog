/*
  Warnings:

  - You are about to drop the column `name` on the `UserModel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `TokenModel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."UserModel" DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "TokenModel_userId_key" ON "public"."TokenModel"("userId");
