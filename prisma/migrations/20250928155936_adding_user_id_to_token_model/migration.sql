/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `TokenModel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `TokenModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TokenModel" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TokenModel_userId_key" ON "public"."TokenModel"("userId");
