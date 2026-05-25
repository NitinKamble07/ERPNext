namespace ERPNext.Core.Entities
{
    public enum WorkOrderStatus
    {
        Created,
        Scheduled,
        InProgress,
        Completed,
        Cancelled
    }

    public class WorkOrder : BaseEntity
    {
        public string Number { get; set; } = string.Empty;
        public Guid ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
        public WorkOrderStatus Status { get; set; } = WorkOrderStatus.Created;
        public DateTime? ScheduledAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}