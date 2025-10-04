-- CreateTable
CREATE TABLE "public"."UserModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "activationLink" TEXT NOT NULL,

    CONSTRAINT "UserModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TokenModel" (
    "id" SERIAL NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TokenModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PostModel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PostModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_email_key" ON "public"."UserModel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TokenModel_refreshToken_key" ON "public"."TokenModel"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "TokenModel_userId_key" ON "public"."TokenModel"("userId");

-- CreateIndex
CREATE INDEX "TokenModel_userId_idx" ON "public"."TokenModel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostModel_userId_key" ON "public"."PostModel"("userId");

-- CreateIndex
CREATE INDEX "PostModel_userId_idx" ON "public"."PostModel"("userId");

-- AddForeignKey
ALTER TABLE "public"."TokenModel" ADD CONSTRAINT "TokenModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."UserModel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."PostModel" ADD CONSTRAINT "PostModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."UserModel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
