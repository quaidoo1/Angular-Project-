using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShoesStore.Migrations
{
    /// <inheritdoc />
    public partial class AddStockAndShoeFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Shoes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Shoes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Shoes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsBestSeller",
                table: "Shoes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Shoes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Category", "Description", "ImageUrl", "IsBestSeller" },
                values: new object[] { "", "", "", false });

            migrationBuilder.UpdateData(
                table: "Shoes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Category", "Description", "ImageUrl", "IsBestSeller" },
                values: new object[] { "", "", "", false });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Shoes");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Shoes");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Shoes");

            migrationBuilder.DropColumn(
                name: "IsBestSeller",
                table: "Shoes");

            migrationBuilder.DropColumn(
                name: "StockQuantity",
                table: "Shoes");
        }
    }
}
