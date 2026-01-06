-- Fix Payment Status constraint to include "Đã hủy"

-- 1. Drop existing constraint
ALTER TABLE "Payment" DROP CONSTRAINT IF EXISTS "CK_Payment_Status";

-- 2. Add new constraint with "Đã hủy"
ALTER TABLE "Payment" ADD CONSTRAINT "CK_Payment_Status" 
CHECK ("Status" IN('Đã Thanh toán', 'Chưa Thanh toán', 'Thanh toán thất bại', 'Đã hủy'));

-- Verify constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'CK_Payment_Status';
