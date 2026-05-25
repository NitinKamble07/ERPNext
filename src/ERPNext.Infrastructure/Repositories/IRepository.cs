using ERPNext.Core.Entities;

namespace ERPNext.Infrastructure.Repositories
{
    public interface IRepository<T> where T : BaseEntity
    {
        Task<T?> GetAsync(Guid id);
        Task<IEnumerable<T>> ListAsync();
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(Guid id);
    }
}