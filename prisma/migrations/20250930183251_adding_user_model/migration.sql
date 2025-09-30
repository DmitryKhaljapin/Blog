/*
  Warnings:

  - Added the required column `name` to the `UserModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."UserModel" ADD COLUMN     "name" TEXT NOT NULL;
