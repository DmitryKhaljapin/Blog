-- CreateTable
CREATE TABLE "public"."TokenModel" (
    "id" SERIAL NOT NULL,
    "refreshToken" TEXT NOT NULL,

    CONSTRAINT "TokenModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenModel_refreshToken_key" ON "public"."TokenModel"("refreshToken");
