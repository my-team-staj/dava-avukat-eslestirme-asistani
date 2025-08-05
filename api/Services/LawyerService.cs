using AutoMapper;
using dava_avukat_eslestirme_asistani.DTOs;
using dava_avukat_eslestirme_asistani.Entities;
using dava_avukat_eslestirme_asistani.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace dava_avukat_eslestirme_asistani.Services
{
    public class LawyerService : ILawyerService
    {
        private readonly IRepository<Lawyer> _lawyerRepository;
        private readonly IMapper _mapper;

        public LawyerService(IRepository<Lawyer> lawyerRepository, IMapper mapper)
        {
            _lawyerRepository = lawyerRepository;
            _mapper = mapper;
        }

        public async Task<LawyerDto> AddLawyerAsync(LawyerCreateDto dto)
        {
            var entity = _mapper.Map<Lawyer>(dto);
            await _lawyerRepository.AddAsync(entity);
            await _lawyerRepository.SaveAsync();
            return _mapper.Map<LawyerDto>(entity);
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
