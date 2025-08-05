using dava_avukat_eslestirme_asistani.DTOs;

namespace dava_avukat_eslestirme_asistani.Services
{
    public interface ILawyerService
    {
        Task<LawyerDto> AddLawyerAsync(LawyerCreateDto lawyerCreateDto);
        Task<IEnumerable<LawyerDto>> GetAllLawyersAsync();
        Task<LawyerDto?> GetLawyerByIdAsync(int id);
    }
}
