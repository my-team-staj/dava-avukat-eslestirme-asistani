using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dava_avukat_eslestirme_asistani.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWorkingGroupNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "WorkGroup",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Lawyers",
                keyColumn: "Id",
                keyValue: 1,
                column: "WorkingGroupId",
                value: null);

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 9, 20, 54, 46, 448, DateTimeKind.Utc).AddTicks(9733), "Patent Hukuku", "PATENT" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 9, 20, 54, 46, 449, DateTimeKind.Utc).AddTicks(266), "Araştırma ve Geliştirme", "ARAŞTIRMA" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 9, 20, 54, 46, 449, DateTimeKind.Utc).AddTicks(270), "Fikri Mülkiyet Taklit Mücadele", "FM TAKLİTLE MÜCADELE" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 9, 20, 54, 46, 449, DateTimeKind.Utc).AddTicks(272), "Marka, Telif ve Tasarım Hukuku", "MARKA, TELİF, TASARIM" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 9, 20, 54, 46, 449, DateTimeKind.Utc).AddTicks(277), "Şirketler ve Sözleşmeler Hukuku", "ŞİRKETLER ve SÖZLEŞMELER" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 9, 20, 54, 46, 449, DateTimeKind.Utc).AddTicks(279), "Tescil İşlemleri", "TESCİL" });

            migrationBuilder.UpdateData(
                table: "WorkingGroups",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[] { new DateTime(2025, 9, 9, 20, 54, 46, 449, DateTimeKind.Utc).AddTicks(282), "Ticari Dava Hukuku", "TİCARİ DAVA" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WorkGroup",
                table: "Cases");

            migrationBuilder.UpdateData(
                table: "Lawyers",
                keyColumn: "Id",
                keyValue: 1,
                column: "WorkingGroupId",
                value: 1);

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
