using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dava_avukat_eslestirme_asistani.Migrations
{
    /// <inheritdoc />
    public partial class RenameAndReshape_Lawyer_20250910 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailableForProBono",
                table: "Lawyers");

            migrationBuilder.DropColumn(
                name: "BaroNumber",
                table: "Lawyers");

            migrationBuilder.DropColumn(
                name: "ExperienceYears",
                table: "Lawyers");

            migrationBuilder.DropColumn(
                name: "LanguagesSpoken",
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
                newName: "FullName");

            migrationBuilder.AlterColumn<string>(
                name: "Education",
                table: "Lawyers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Languages",
                table: "Lawyers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrmEmployeeRecordType",
                table: "Lawyers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Lawyers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Lawyers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Lawyers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "FullName", "Languages", "PrmEmployeeRecordType", "StartDate", "Title" },
                values: new object[] { "Av. Berat Çalık", "Türkçe, İngilizce", "Associate", new DateTime(2020, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Avukat" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Patent işleri", "PATENT" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Araştırma ve inceleme işleri", "ARAŞTIRMA" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Taklit ürünlere karşı mücadele", "FM TAKLİTLE MÜCADELE" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Marka, telif ve tasarım hukuku", "MARKA, TELİF, TASARIM" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Şirketler hukuku ve sözleşmeler", "ŞİRKETLER ve SÖZLEŞMELER" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tescil işlemleri", "TESCİL" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ticari davalar", "TİCARİ DAVA" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Languages",
                table: "Lawyers");

            migrationBuilder.DropColumn(
                name: "PrmEmployeeRecordType",
                table: "Lawyers");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Lawyers");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Lawyers");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "Lawyers",
                newName: "Name");

            migrationBuilder.AlterColumn<string>(
                name: "Education",
                table: "Lawyers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AvailableForProBono",
                table: "Lawyers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "BaroNumber",
                table: "Lawyers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ExperienceYears",
                table: "Lawyers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "LanguagesSpoken",
                table: "Lawyers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ceza davaları için uzman ekip", "Ceza Grubu" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Boşanma, velayet ve nafaka gibi konularda uzmanlık", "Aile Hukuku Grubu" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Şirketler ve ticari uyuşmazlıklar", "Ticaret Hukuku Grubu" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "İşçi-işveren ilişkileri, tazminat davaları", "İş Hukuku Grubu" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tapu, kat mülkiyeti ve kira sözleşmeleri", "Gayrimenkul ve Kira Grubu" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tüketici uyuşmazlıkları, ayıplı mal davaları", "Tüketici Hakları Grubu" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Borç tahsilatı, icra ve konkordato işlemleri", "İcra ve İflas Grubu" });
        }
    }
}
