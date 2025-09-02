using dava_avukat_eslestirme_asistani.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace dava_avukat_eslestirme_asistani.Services
{
    public interface ILawyerService
    {
        Task<LawyerDto> AddLawyerAsync(LawyerCreateDto lawyerCreateDto);
        Task<List<LawyerDto>> GetAllLawyersAsync();
        Task<LawyerDto?> GetLawyerByIdAsync(int id);

        /// <summary>
        /// Arama, filtreleme, sıralama ve sayfalama ile avukat listesi döner.
        /// </summary>
        Task<(List<LawyerDto> Items, int TotalItems, int TotalPages)> GetLawyersAsync(LawyerQueryParameters query);

        Task<LawyerDto> UpdateLawyerAsync(int id, LawyerUpdateDto lawyerDto);

        /// <summary>
        /// Soft delete: avukatı IsActive=false yapar. Kaydı silmez.
        /// </summary>
        Task<bool> SoftDeleteLawyerAsync(int id);
    }
}
