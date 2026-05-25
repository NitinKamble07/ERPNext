using System;

namespace ERPNext.Core.Entities
{
    public class ItemMaster : BaseEntity
    {

        // optional branch id (could be a GUID string referencing a Branch table)
        public Guid? BranchId { get; set; }

        public string ItemName { get; set; } = string.Empty;

        // simple brand name as string (could be a FK later)
        public string BrandName { get; set; } = string.Empty;

        // references to AspNetUsers.Id (string)
        public Guid? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Guid? DeletedBy { get; set; }
        public DateTime? DeletedAt { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
