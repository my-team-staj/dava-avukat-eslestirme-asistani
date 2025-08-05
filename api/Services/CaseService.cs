using AutoMapper;
using dava_avukat_eslestirme_asistani.DTOs;
using dava_avukat_eslestirme_asistani.Entities;
using dava_avukat_eslestirme_asistani.Repositories;

namespace dava_avukat_eslestirme_asistani.Services
{
    public class CaseService : ICaseService
    {
        private readonly IRepository<Case> _caseRepository;
        private readonly IMapper _mapper;

        public CaseService(IRepository<Case> caseRepository, IMapper mapper)
        {
            _caseRepository = caseRepository;
            _mapper = mapper;
        }

        public async Task<Case> CreateCaseAsync(CaseCreateDto caseDto)
        {
            var entity = _mapper.Map<Case>(caseDto);
            await _caseRepository.AddAsync(entity);
            await _caseRepository.SaveAsync();
            return entity;
        }

        public async Task<Case?> GetCaseByIdAsync(int id)
        {
            return await _caseRepository.GetByIdAsync(id);
        }
    }
}
