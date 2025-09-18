using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dava_avukat_eslestirme_asistani.Migrations
{
    /// <inheritdoc />
    public partial class Fix_WorkingGroup_Relations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cases_WorkingGroups_WorkingGroupId",
                table: "Cases");

            migrationBuilder.DropForeignKey(
                name: "FK_Lawyers_WorkingGroups_WorkingGroupId",
                table: "Lawyers");

            migrationBuilder.AddColumn<string>(
                name: "AuthorList",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClientReferenceNo",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ContactClientId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactCounter",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ContactCounterId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactCourt",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ContactCourtHouseId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactCourtLocation",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ContactIntermadiaryCompanyId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ContactLocationCourtId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CourtAuthorityReferenceNo",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreateBy",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateDate",
                table: "Cases",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FileCaseId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileCaseReferenceNo",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FileCaseViewId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FileCloseDate",
                table: "Cases",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileNo",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FileOpenDate",
                table: "Cases",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileStatus",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FileStatusId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FileSubjectId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileType",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FileTypeId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileTypeValue",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FinanceContactAccountId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GlobalSystemCustomerId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HardCopyLocation",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HardCopyLocationDesc",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HardCopyLocationId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Cases",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDemoRecord",
                table: "Cases",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsOfficeFile",
                table: "Cases",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsPrivateFile",
                table: "Cases",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProposalFile",
                table: "Cases",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModifiedDate",
                table: "Cases",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastModifiedGlobalUser",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LastModifiedGlobalUserId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OACasePartner",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OrganizationEmployeeId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrmNatureOfAssignmentId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrmPriority",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrmPriorityId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrmStatus",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrmStatusId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrmStatusTypeValue",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReaderList",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Cases",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Supervisor",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TariffType",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TariffTypeId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Cases_WorkingGroups_WorkingGroupId",
                table: "Cases",
                column: "WorkingGroupId",
                principalTable: "WorkingGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Lawyers_WorkingGroups_WorkingGroupId",
                table: "Lawyers",
                column: "WorkingGroupId",
                principalTable: "WorkingGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cases_WorkingGroups_WorkingGroupId",
                table: "Cases");

            migrationBuilder.DropForeignKey(
                name: "FK_Lawyers_WorkingGroups_WorkingGroupId",
                table: "Lawyers");

            migrationBuilder.DropColumn(
                name: "AuthorList",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ClientReferenceNo",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ContactClientId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ContactCounter",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ContactCounterId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ContactCourt",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ContactCourtHouseId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ContactCourtLocation",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ContactIntermadiaryCompanyId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ContactLocationCourtId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "CourtAuthorityReferenceNo",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "CreateBy",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "CreateDate",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FileCaseId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FileCaseReferenceNo",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FileCaseViewId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FileCloseDate",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FileNo",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FileOpenDate",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FileStatus",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FileStatusId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FileSubjectId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FileType",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FileTypeId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FileTypeValue",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FinanceContactAccountId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "GlobalSystemCustomerId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "HardCopyLocation",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "HardCopyLocationDesc",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "HardCopyLocationId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "IsDemoRecord",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "IsOfficeFile",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "IsPrivateFile",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "IsProposalFile",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "LastModifiedDate",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "LastModifiedGlobalUser",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "LastModifiedGlobalUserId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "OACasePartner",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "OrganizationEmployeeId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "PrmNatureOfAssignmentId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "PrmPriority",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "PrmPriorityId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "PrmStatus",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "PrmStatusId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "PrmStatusTypeValue",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ReaderList",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "Supervisor",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "TariffType",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "TariffTypeId",
                table: "Cases");

            migrationBuilder.AddForeignKey(
                name: "FK_Cases_WorkingGroups_WorkingGroupId",
                table: "Cases",
                column: "WorkingGroupId",
                principalTable: "WorkingGroups",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Lawyers_WorkingGroups_WorkingGroupId",
                table: "Lawyers",
                column: "WorkingGroupId",
                principalTable: "WorkingGroups",
                principalColumn: "Id");
        }
    }
}
