using AutoMapper;
using dava_avukat_eslestirme_asistani.DTOs;
using dava_avukat_eslestirme_asistani.Entities;
using dava_avukat_eslestirme_asistani.Repositories;

namespace dava_avukat_eslestirme_asistani.Services
{
    public class LawyerService : ILawyerService
    {
        public LawyerService(ILawyerRepository lawyerRepository, IMapper mapper)
        {
            _lawyerRepository = lawyerRepository;
            _mapper = mapper;
        }

        private readonly ILawyerRepository _lawyerRepository;
        private readonly IMapper _mapper;

        public async Task<LawyerDto> AddLawyerAsync(LawyerCreateDto lawyerCreateDto)
        {
            var lawyer = _mapper.Map<Lawyer>(lawyerCreateDto);
            await _lawyerRepository.AddAsync(lawyer);
            await _lawyerRepository.SaveAsync();
            return _mapper.Map<LawyerDto>(lawyer);
        }

        public async Task<IEnumerable<LawyerDto>> GetAllLawyersAsync()
        {
            var lawyers = await _lawyerRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<LawyerDto>>(lawyers);
        }

        public async Task<LawyerDto?> GetLawyerByIdAsync(int id)
        {
            var lawyer = await _lawyerRepository.GetByIdAsync(id);
            return lawyer == null ? null : _mapper.Map<LawyerDto>(lawyer);
        }
    }
}
