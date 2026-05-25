namespace ERPNext.Core.Entities
{
    public class Product : BaseEntity
    {
        public string Sku { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public string UnitOfMeasure { get; set; } = "pcs";
    }
}