using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace dava_avukat_eslestirme_asistani.Migrations
{
    /// <inheritdoc />
    public partial class SeedMoreWorkingGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Specialization",
                table: "Lawyers");

            migrationBuilder.InsertData(
                table: "WorkingGroups",
                columns: new[] { "Id", "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[,]
                {
                    { 2, new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Boşanma, velayet ve nafaka gibi konularda uzmanlık", "Aile Hukuku Grubu" },
                    { 3, new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Şirketler ve ticari uyuşmazlıklar", "Ticaret Hukuku Grubu" },
                    { 4, new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "İşçi-işveren ilişkileri, tazminat davaları", "İş Hukuku Grubu" },
                    { 5, new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tapu, kat mülkiyeti ve kira sözleşmeleri", "Gayrimenkul ve Kira Grubu" },
                    { 6, new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tüketici uyuşmazlıkları, ayıplı mal davaları", "Tüketici Hakları Grubu" },
                    { 7, new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Borç tahsilatı, icra ve konkordato işlemleri", "İcra ve İflas Grubu" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.AddColumn<string>(
                name: "Specialization",
                table: "Lawyers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Lawyers",
                keyColumn: "Id",
                keyValue: 1,
                column: "Specialization",
                value: "Ceza");
        }
    }
}
