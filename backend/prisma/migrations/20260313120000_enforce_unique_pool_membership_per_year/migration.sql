-- Add year to pool members and enforce one pool membership per ship per year
ALTER TABLE "pool_members" ADD COLUMN "year" INTEGER;

-- Backfill year from parent pool record for existing rows
UPDATE "pool_members" pm
SET "year" = p."year"
FROM "pools" p
WHERE pm."pool_id" = p."id";

ALTER TABLE "pool_members" ALTER COLUMN "year" SET NOT NULL;

CREATE UNIQUE INDEX "pool_members_ship_id_year_key" ON "pool_members"("ship_id", "year");
