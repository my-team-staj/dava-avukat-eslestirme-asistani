using dava_avukat_eslestirme_asistani.DTOs;
using dava_avukat_eslestirme_asistani.Entities;

namespace dava_avukat_eslestirme_asistani.Services
{
    public interface ICaseService
    {
        Task<Case> CreateCaseAsync(CaseCreateDto caseDto);
        Task<Case?> GetCaseByIdAsync(int id);
        Task<PaginatedResponse<CaseDto>> GetCasesAsync(CaseQueryParameters parameters);


    }
}
