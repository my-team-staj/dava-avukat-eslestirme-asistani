using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace dava_avukat_eslestirme_asistani.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task SaveAsync();

        /// <summary>
        /// Gelişmiş sayfalama, filtreleme, arama ve include desteği ile listeleme.
        /// </summary>
        Task<(IEnumerable<T> Data, int TotalCount)> GetPagedAsync(
            Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            int page = 1,
            int pageSize = 10,
            params Expression<Func<T, object>>[] includes);
    }
}
