using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDb2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusSeat_Seats_SeatId",
                table: "StatusSeat");

            migrationBuilder.DropForeignKey(
                name: "FK_StatusSeat_Showtimes_ShowtimeId",
                table: "StatusSeat");

            migrationBuilder.DropIndex(
                name: "IX_StatusSeat_SeatId",
                table: "StatusSeat");

            migrationBuilder.DropIndex(
                name: "IX_StatusSeat_ShowtimeId",
                table: "StatusSeat");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "StatusSeat",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldDefaultValue: "Trống");

            migrationBuilder.AlterColumn<int>(
                name: "ShowtimeId",
                table: "StatusSeat",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "SeatsId",
                table: "StatusSeat",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ShowtimesId",
                table: "StatusSeat",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Seats",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_StatusSeat_SeatsId",
                table: "StatusSeat",
                column: "SeatsId");

            migrationBuilder.CreateIndex(
                name: "IX_StatusSeat_ShowtimesId",
                table: "StatusSeat",
                column: "ShowtimesId");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusSeat_Seats_SeatsId",
                table: "StatusSeat",
                column: "SeatsId",
                principalTable: "Seats",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusSeat_Showtimes_ShowtimesId",
                table: "StatusSeat",
                column: "ShowtimesId",
                principalTable: "Showtimes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusSeat_Seats_SeatsId",
                table: "StatusSeat");

            migrationBuilder.DropForeignKey(
                name: "FK_StatusSeat_Showtimes_ShowtimesId",
                table: "StatusSeat");

            migrationBuilder.DropIndex(
                name: "IX_StatusSeat_SeatsId",
                table: "StatusSeat");

            migrationBuilder.DropIndex(
                name: "IX_StatusSeat_ShowtimesId",
                table: "StatusSeat");

            migrationBuilder.DropColumn(
                name: "SeatsId",
                table: "StatusSeat");

            migrationBuilder.DropColumn(
                name: "ShowtimesId",
                table: "StatusSeat");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Seats");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "StatusSeat",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Trống",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ShowtimeId",
                table: "StatusSeat",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StatusSeat_SeatId",
                table: "StatusSeat",
                column: "SeatId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StatusSeat_ShowtimeId",
                table: "StatusSeat",
                column: "ShowtimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusSeat_Seats_SeatId",
                table: "StatusSeat",
                column: "SeatId",
                principalTable: "Seats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StatusSeat_Showtimes_ShowtimeId",
                table: "StatusSeat",
                column: "ShowtimeId",
                principalTable: "Showtimes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
