using dava_avukat_eslestirme_asistani.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace dava_avukat_eslestirme_asistani.Services
{
    public interface ILawyerService
    {
        Task<LawyerDto> AddLawyerAsync(LawyerCreateDto lawyerCreateDto);
        Task<IEnumerable<LawyerDto>> GetAllLawyersAsync();
        Task<LawyerDto?> GetLawyerByIdAsync(int id);

        /// <summary>
        /// Arama, filtreleme, sayfalama ile avukat listesi döner.
        /// </summary>
        Task<(IEnumerable<LawyerDto> Data, int TotalCount)> GetLawyersAsync(
            string? search = null,
            string? city = null,
            bool? isActive = null,
            int page = 1,
            int pageSize = 10);
    }
}
