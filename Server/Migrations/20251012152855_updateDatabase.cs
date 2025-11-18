using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class updateDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Seats_Price",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Seats");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Rooms",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TicketPrice",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Price = table.Column<int>(type: "integer", nullable: false),
                    RoomId = table.Column<int>(type: "integer", nullable: false),
                    SeatId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketPrice", x => x.Id);
                    table.CheckConstraint("CK_Seats_Price", "\"Price\" > 0");
                    table.ForeignKey(
                        name: "FK_TicketPrice_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketPrice_Seats_SeatId",
                        column: x => x.SeatId,
                        principalTable: "Seats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TicketPrice");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Rooms");

            migrationBuilder.AddColumn<int>(
                name: "Price",
                table: "Seats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddCheckConstraint(
                name: "CK_Seats_Price",
                table: "Seats",
                sql: "\"Price\" > 0");
        }
    }
}
