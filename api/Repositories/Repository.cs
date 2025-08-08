using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace dava_avukat_eslestirme_asistani.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();

        public async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);

        public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);

        public void Update(T entity) => _dbSet.Update(entity);

        public void Delete(T entity) => _dbSet.Remove(entity);

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
           => await _dbSet.Where(predicate).ToListAsync();
        public IQueryable<T> Query() => _dbSet.AsQueryable();

        /// <summary>
        /// Gelişmiş sayfalama, filtreleme, arama ve include desteği ile listeleme.
        /// </summary>
        /// <param name="filter">Filtre (arama) kriteri</param>
        /// <param name="orderBy">Sıralama</param>
        /// <param name="page">Sayfa numarası (1-based)</param>
        /// <param name="pageSize">Sayfa boyutu</param>
        /// <param name="includes">Include ile eklenmek istenen navigation property'ler</param>
        /// <returns>Data, Toplam Kayıt Sayısı</returns>
        public async Task<(IEnumerable<T> Data, int TotalCount)> GetPagedAsync(
            Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            int page = 1,
            int pageSize = 10,
            params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;

            if (filter != null)
                query = query.Where(filter);

            foreach (var include in includes)
                query = query.Include(include);

            int totalCount = await query.CountAsync();

            if (orderBy != null)
                query = orderBy(query);

            query = query.Skip((page - 1) * pageSize).Take(pageSize);

            var data = await query.ToListAsync();
            return (data, totalCount);
        }
    }
}
