using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePaymentStatusConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop existing constraint
            migrationBuilder.Sql(@"ALTER TABLE ""Payment"" DROP CONSTRAINT IF EXISTS ""CK_Payment_Status"";");
            
            // Add new constraint with "Đã hủy"
            migrationBuilder.Sql(@"ALTER TABLE ""Payment"" ADD CONSTRAINT ""CK_Payment_Status"" CHECK (""Status"" IN('Đã Thanh toán', 'Chưa Thanh toán', 'Thanh toán thất bại', 'Đã hủy'));");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop new constraint
            migrationBuilder.Sql(@"ALTER TABLE ""Payment"" DROP CONSTRAINT IF EXISTS ""CK_Payment_Status"";");
            
            // Add back old constraint
            migrationBuilder.Sql(@"ALTER TABLE ""Payment"" ADD CONSTRAINT ""CK_Payment_Status"" CHECK (""Status"" IN('Đã Thanh toán', 'Chưa Thanh toán', 'Thanh toán thất bại'));");
        }
    }
}
