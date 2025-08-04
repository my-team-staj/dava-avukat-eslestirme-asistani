using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dava_avukat_eslestirme_asistani.Migrations
{
    /// <inheritdoc />
    public partial class FixSeedDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "GroupDescription" },
                values: new object[] { new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ceza davaları için uzman ekip" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "GroupDescription" },
                values: new object[] { new DateTime(2025, 8, 4, 13, 1, 47, 103, DateTimeKind.Utc).AddTicks(5857), "Ceza davalar? için uzman ekip" });
        }
    }
}
