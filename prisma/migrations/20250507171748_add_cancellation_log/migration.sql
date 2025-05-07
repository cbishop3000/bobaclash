-- CreateTable
CREATE TABLE "CancellationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cancellationStatus" TEXT NOT NULL,
    "cancellationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "errorMessage" TEXT,

    CONSTRAINT "CancellationLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CancellationLog" ADD CONSTRAINT "CancellationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
