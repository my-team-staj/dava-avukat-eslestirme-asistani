using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace dava_avukat_eslestirme_asistani.Migrations
{
    /// <inheritdoc />
    public partial class Init_20250909_Clean : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CaseLawyerMatches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CaseId = table.Column<int>(type: "int", nullable: false),
                    LawyerId = table.Column<int>(type: "int", nullable: false),
                    ChosenAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ChosenBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CaseLawyerMatches", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WorkingGroups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GroupName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GroupDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkingGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Cases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactClient = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileSubject = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CaseResponsible = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrmNatureOfAssignment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrmCasePlaceofUseSubject = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubjectMatterDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsToBeInvoiced = table.Column<bool>(type: "bit", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    County = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Attorney1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Attorney2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Attorney3 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WorkingGroupId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cases_WorkingGroups_WorkingGroupId",
                        column: x => x.WorkingGroupId,
                        principalTable: "WorkingGroups",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Lawyers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExperienceYears = table.Column<int>(type: "int", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BaroNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LanguagesSpoken = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AvailableForProBono = table.Column<bool>(type: "bit", nullable: false),
                    Rating = table.Column<double>(type: "float", nullable: false),
                    TotalCasesHandled = table.Column<int>(type: "int", nullable: false),
                    Education = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    WorkingGroupId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lawyers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lawyers_WorkingGroups_WorkingGroupId",
                        column: x => x.WorkingGroupId,
                        principalTable: "WorkingGroups",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "WorkingGroups",
                columns: new[] { "Id", "CreatedAt", "GroupDescription", "GroupName" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ceza davaları için uzman ekip", "Ceza Grubu" },
                    { 2, new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Boşanma, velayet ve nafaka gibi konularda uzmanlık", "Aile Hukuku Grubu" },
                    { 3, new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Şirketler ve ticari uyuşmazlıklar", "Ticaret Hukuku Grubu" },
                    { 4, new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "İşçi-işveren ilişkileri, tazminat davaları", "İş Hukuku Grubu" },
                    { 5, new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tapu, kat mülkiyeti ve kira sözleşmeleri", "Gayrimenkul ve Kira Grubu" },
                    { 6, new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tüketici uyuşmazlıkları, ayıplı mal davaları", "Tüketici Hakları Grubu" },
                    { 7, new DateTime(2025, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Borç tahsilatı, icra ve konkordato işlemleri", "İcra ve İflas Grubu" }
                });

            migrationBuilder.InsertData(
                table: "Lawyers",
                columns: new[] { "Id", "AvailableForProBono", "BaroNumber", "City", "DeletedAt", "DeletedBy", "Education", "Email", "ExperienceYears", "IsActive", "IsDeleted", "LanguagesSpoken", "Name", "Phone", "Rating", "TotalCasesHandled", "WorkingGroupId" },
                values: new object[] { 1, true, "123456", "Ankara", null, null, "Ankara Üniversitesi Hukuk Fakültesi", "berat.calik@gun.av.tr", 5, true, false, "Türkçe", "Av. Berat", "05367750225", 4.7999999999999998, 80, 1 });

            migrationBuilder.CreateIndex(
                name: "IX_Cases_WorkingGroupId",
                table: "Cases",
                column: "WorkingGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Lawyers_WorkingGroupId",
                table: "Lawyers",
                column: "WorkingGroupId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CaseLawyerMatches");

            migrationBuilder.DropTable(
                name: "Cases");

            migrationBuilder.DropTable(
                name: "Lawyers");

            migrationBuilder.DropTable(
                name: "WorkingGroups");
        }
    }
}
