using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class updateDatabase2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketPrice_Rooms_RoomId",
                table: "TicketPrice");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketPrice_Seats_SeatId",
                table: "TicketPrice");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TicketPrice",
                table: "TicketPrice");

            migrationBuilder.DropIndex(
                name: "IX_TicketPrice_RoomId",
                table: "TicketPrice");

            migrationBuilder.DropIndex(
                name: "IX_TicketPrice_SeatId",
                table: "TicketPrice");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "TicketPrice");

            migrationBuilder.DropColumn(
                name: "SeatId",
                table: "TicketPrice");

            migrationBuilder.RenameTable(
                name: "TicketPrice",
                newName: "TicketPrices");

            migrationBuilder.AddColumn<int>(
                name: "TicketpriceId",
                table: "Rooms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "RoomType",
                table: "TicketPrices",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SeatType",
                table: "TicketPrices",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SeatsId",
                table: "TicketPrices",
                type: "integer",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TicketPrices",
                table: "TicketPrices",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_TicketpriceId",
                table: "Rooms",
                column: "TicketpriceId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketPrices_SeatsId",
                table: "TicketPrices",
                column: "SeatsId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_TicketPrices_TicketpriceId",
                table: "Rooms");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketPrices_Seats_SeatsId",
                table: "TicketPrices");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_TicketpriceId",
                table: "Rooms");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TicketPrices",
                table: "TicketPrices");

            migrationBuilder.DropIndex(
                name: "IX_TicketPrices_SeatsId",
                table: "TicketPrices");

            migrationBuilder.DropColumn(
                name: "TicketpriceId",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "RoomType",
                table: "TicketPrices");

            migrationBuilder.DropColumn(
                name: "SeatType",
                table: "TicketPrices");

            migrationBuilder.DropColumn(
                name: "SeatsId",
                table: "TicketPrices");

            migrationBuilder.RenameTable(
                name: "TicketPrices",
                newName: "TicketPrice");

            migrationBuilder.AddColumn<int>(
                name: "RoomId",
                table: "TicketPrice",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SeatId",
                table: "TicketPrice",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TicketPrice",
                table: "TicketPrice",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_TicketPrice_RoomId",
                table: "TicketPrice",
                column: "RoomId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketPrice_SeatId",
                table: "TicketPrice",
                column: "SeatId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketPrice_Rooms_RoomId",
                table: "TicketPrice",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketPrice_Seats_SeatId",
                table: "TicketPrice",
                column: "SeatId",
                principalTable: "Seats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
