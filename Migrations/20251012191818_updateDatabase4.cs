using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class updateDatabase4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_TicketPrices_TicketpriceId",
                table: "Rooms");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketPrices_Seats_SeatsId",
                table: "TicketPrices");

            migrationBuilder.DropIndex(
                name: "IX_TicketPrices_SeatsId",
                table: "TicketPrices");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_TicketpriceId",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "SeatsId",
                table: "TicketPrices");

            migrationBuilder.DropColumn(
                name: "TicketpriceId",
                table: "Rooms");

            migrationBuilder.AddColumn<int>(
                name: "Price",
                table: "Seats",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Seats");

            migrationBuilder.AddColumn<int>(
                name: "SeatsId",
                table: "TicketPrices",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TicketpriceId",
                table: "Rooms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TicketPrices_SeatsId",
                table: "TicketPrices",
                column: "SeatsId");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_TicketpriceId",
                table: "Rooms",
                column: "TicketpriceId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_TicketPrices_TicketpriceId",
                table: "Rooms",
                column: "TicketpriceId",
                principalTable: "TicketPrices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketPrices_Seats_SeatsId",
                table: "TicketPrices",
                column: "SeatsId",
                principalTable: "Seats",
                principalColumn: "Id");
        }
    }
}
