/*
  Warnings:

  - You are about to drop the column `fullname` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "fullname",
ADD COLUMN     "fullName" TEXT;
