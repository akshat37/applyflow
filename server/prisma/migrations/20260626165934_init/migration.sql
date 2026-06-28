-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "jobUrl" TEXT,
    "locationType" TEXT NOT NULL DEFAULT 'Remote',
    "locationName" TEXT,
    "jobType" TEXT NOT NULL DEFAULT 'Full-Time',
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "appliedDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
