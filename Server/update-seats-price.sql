-- Update seat prices for all existing seats
-- Hàng A, B, C là VIP (150.000đ)
-- Hàng D trở đi là Standard (100.000đ)

-- Update VIP seats (A, B, C rows)
UPDATE "Seats" 
SET "Type" = 'VIP', "Price" = 150000
WHERE SUBSTRING("Name", 1, 1) IN ('A', 'B', 'C');

-- Update Standard seats (D and after rows)
UPDATE "Seats" 
SET "Type" = 'Standard', "Price" = 100000
WHERE SUBSTRING("Name", 1, 1) NOT IN ('A', 'B', 'C');

-- Verify the changes
SELECT "Type", "Price", COUNT(*) as "Count"
FROM "Seats"
GROUP BY "Type", "Price"
ORDER BY "Type", "Price";

SELECT SUBSTRING("Name", 1, 1) as "Row", "Type", "Price", COUNT(*) as "Count"
FROM "Seats"
GROUP BY SUBSTRING("Name", 1, 1), "Type", "Price"
ORDER BY SUBSTRING("Name", 1, 1);
