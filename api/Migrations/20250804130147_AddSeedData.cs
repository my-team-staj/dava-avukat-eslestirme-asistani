using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dava_avukat_eslestirme_asistani.Migrations
{
    /// <inheritdoc />
    public partial class AddSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "WorkingGroups",
                columns: new[] { "Id", "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { 1, new DateTime(2025, 8, 4, 13, 1, 47, 103, DateTimeKind.Utc).AddTicks(5857), "Ceza davalar? için uzman ekip", "Ceza Grubu" });

            migrationBuilder.InsertData(
                table: "Lawyers",
                columns: new[] { "Id", "AvailableForProBono", "BaroNumber", "City", "Education", "Email", "ExperienceYears", "IsActive", "LanguagesSpoken", "Name", "Phone", "Rating", "Specialization", "TotalCasesHandled", "WorkingGroupId" },
                values: new object[] { 1, true, "123456", "Ankara", "Ankara Üniversitesi Hukuk Fakültesi", "berat.calik@gun.av.tr", 5, true, "Türkçe", "Av. Berat", "05367750225", 4.7999999999999998, "Ceza", 80, 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Lawyers",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
