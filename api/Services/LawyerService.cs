using AutoMapper;
using dava_avukat_eslestirme_asistani.DTOs;
using dava_avukat_eslestirme_asistani.Entities;
using dava_avukat_eslestirme_asistani.Repositories;
using System.Collections.Generic;
using System.Linq;
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

        /// <summary>
        /// Arama, filtreleme ve sayfalama ile avukat listesi döner.
        /// </summary>
        public async Task<(IEnumerable<LawyerDto> Data, int TotalCount)> GetLawyersAsync(
            string? search = null,
            string? city = null,
            bool? isActive = null,
            int page = 1,
            int pageSize = 10)
        {
            // Predicate ile filtreleme/arama
            System.Linq.Expressions.Expression<System.Func<Lawyer, bool>> predicate = l =>
                (string.IsNullOrEmpty(search) || l.Name.Contains(search) || l.City.Contains(search) || l.LanguagesSpoken.Contains(search))
                && (string.IsNullOrEmpty(city) || l.City == city)
                && (isActive == null || l.IsActive == isActive);

            var (entities, totalCount) = await _lawyerRepository.GetPagedAsync(
                filter: predicate,
                orderBy: q => q.OrderByDescending(l => l.Rating),
                page: page,
                pageSize: pageSize
            );

            var dtos = _mapper.Map<IEnumerable<LawyerDto>>(entities);

            return (dtos, totalCount);
        }
    }
}
