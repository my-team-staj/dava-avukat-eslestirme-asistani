using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dava_avukat_eslestirme_asistani.Migrations
{
    /// <inheritdoc />
    public partial class FixWorkingGroupSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 9, 20, 54, 46, 448, DateTimeKind.Utc).AddTicks(9733));

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 9, 20, 54, 46, 449, DateTimeKind.Utc).AddTicks(266));

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 9, 20, 54, 46, 449, DateTimeKind.Utc).AddTicks(270));

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 9, 20, 54, 46, 449, DateTimeKind.Utc).AddTicks(272));

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 9, 20, 54, 46, 449, DateTimeKind.Utc).AddTicks(277));

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 9, 20, 54, 46, 449, DateTimeKind.Utc).AddTicks(279));

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 9, 20, 54, 46, 449, DateTimeKind.Utc).AddTicks(282));
        }
    }
}
