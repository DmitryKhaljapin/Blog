-- CreateTable
CREATE TABLE "public"."CommentModel" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "CommentModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommentModel_userId_idx" ON "public"."CommentModel"("userId");

-- CreateIndex
CREATE INDEX "CommentModel_postId_idx" ON "public"."CommentModel"("postId");

-- AddForeignKey
ALTER TABLE "public"."CommentModel" ADD CONSTRAINT "CommentModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."UserModel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."CommentModel" ADD CONSTRAINT "CommentModel_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."PostModel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
