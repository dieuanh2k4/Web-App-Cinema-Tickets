using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StatusSeat_SeatId",
                table: "StatusSeat");

            migrationBuilder.CreateIndex(
                name: "IX_StatusSeat_SeatId",
                table: "StatusSeat",
                column: "SeatId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StatusSeat_SeatId",
                table: "StatusSeat");

            migrationBuilder.CreateIndex(
                name: "IX_StatusSeat_SeatId",
                table: "StatusSeat",
                column: "SeatId");
        }
    }
}
