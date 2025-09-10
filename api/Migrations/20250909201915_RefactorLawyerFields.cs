using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dava_avukat_eslestirme_asistani.Migrations
{
    /// <inheritdoc />
    public partial class RefactorLawyerFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailableForProBono",
                table: "Lawyers");

            migrationBuilder.DropColumn(
                name: "ExperienceYears",
                table: "Lawyers");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Lawyers");

            migrationBuilder.DropColumn(
                name: "TotalCasesHandled",
                table: "Lawyers");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Lawyers",
                newName: "WorkGroup");

            migrationBuilder.RenameColumn(
                name: "LanguagesSpoken",
                table: "Lawyers",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "BaroNumber",
                table: "Lawyers",
                newName: "PrmEmployeeRecordType");

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Lawyers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Languages",
                table: "Lawyers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Lawyers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "Lawyers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "FullName", "Languages", "PrmEmployeeRecordType", "StartDate", "Title", "WorkGroup" },
                values: new object[] { "Av. Berat Çalık", "Türkçe, İngilizce", "FullTime", new DateTime(2020, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kıdemli Avukat", "TİCARİ DAVA" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Lawyers");

            migrationBuilder.DropColumn(
                name: "Languages",
                table: "Lawyers");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Lawyers");

            migrationBuilder.RenameColumn(
                name: "WorkGroup",
                table: "Lawyers",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Lawyers",
                newName: "LanguagesSpoken");

            migrationBuilder.RenameColumn(
                name: "PrmEmployeeRecordType",
                table: "Lawyers",
                newName: "BaroNumber");

            migrationBuilder.AddColumn<bool>(
                name: "AvailableForProBono",
                table: "Lawyers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ExperienceYears",
                table: "Lawyers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "Rating",
                table: "Lawyers",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "TotalCasesHandled",
                table: "Lawyers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Lawyers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "AvailableForProBono", "BaroNumber", "ExperienceYears", "LanguagesSpoken", "Name", "Rating", "TotalCasesHandled" },
                values: new object[] { true, "123456", 5, "Türkçe", "Av. Berat", 4.7999999999999998, 80 });
        }
    }
}
