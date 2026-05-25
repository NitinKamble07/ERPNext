using ERPNext.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace ERPNext.Infrastructure.Repositories
{
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        private readonly ApplicationDbContext _db;
        private readonly DbSet<T> _set;

        public Repository(ApplicationDbContext db)
        {
            _db = db;
            _set = db.Set<T>();
        }

        public async Task AddAsync(T entity)
        {
            await _set.AddAsync(entity);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var e = await _set.FindAsync(id);
            if (e is null) return;
            _set.Remove(e);
            await _db.SaveChangesAsync();
        }

        public async Task<T?> GetAsync(Guid id)
        {
            return await _set.FindAsync(id);
        }

        public async Task<IEnumerable<T>> ListAsync()
        {
            return await _set.ToListAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            _set.Update(entity);
            await _db.SaveChangesAsync();
        }
    }
}