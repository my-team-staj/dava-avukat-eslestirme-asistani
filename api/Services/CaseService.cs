using AutoMapper;
using dava_avukat_eslestirme_asistani.DTOs;
using dava_avukat_eslestirme_asistani.Entities;
using dava_avukat_eslestirme_asistani.Repositories;
using Microsoft.EntityFrameworkCore;

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

        public async Task<PaginatedResponse<CaseDto>> GetCasesAsync(CaseQueryParameters parameters)
        {
            var query = _caseRepository.Query();

            // Filtreleme
            if (!string.IsNullOrWhiteSpace(parameters.City))
                query = query.Where(c => c.City.Contains(parameters.City));

            if (!string.IsNullOrWhiteSpace(parameters.Language))
                query = query.Where(c => c.Language == parameters.Language);

            if (!string.IsNullOrWhiteSpace(parameters.UrgencyLevel))
                query = query.Where(c => c.UrgencyLevel == parameters.UrgencyLevel);

            if (parameters.IsActive.HasValue)
                query = query.Where(c => c.IsActive == parameters.IsActive.Value);

            if (parameters.RequiresProBono.HasValue)
                query = query.Where(c => c.RequiresProBono == parameters.RequiresProBono.Value);

            // Arama
            if (!string.IsNullOrWhiteSpace(parameters.SearchTerm))
            {
                var searchTerm = parameters.SearchTerm.ToLower();
                query = query.Where(c => c.Title.ToLower().Contains(searchTerm) || 
                                       c.Description.ToLower().Contains(searchTerm));
            }

            // Sıralama
            switch (parameters.SortBy?.ToLower())
            {
                case "title":
                    query = parameters.SortOrder == "asc" ? query.OrderBy(c => c.Title) : query.OrderByDescending(c => c.Title);
                    break;
                case "city":
                    query = parameters.SortOrder == "asc" ? query.OrderBy(c => c.City) : query.OrderByDescending(c => c.City);
                    break;
                default:
                    query = parameters.SortOrder == "asc" ? query.OrderBy(c => c.FiledDate) : query.OrderByDescending(c => c.FiledDate);
                    break;
            }

            // Toplam kayıt sayısı
            var totalItems = await query.CountAsync();

            // Sayfalama
            var skip = (parameters.Page - 1) * parameters.PageSize;
            var cases = await query
                .Skip(skip)
                .Take(parameters.PageSize)
                .Include(c => c.WorkingGroup)
                .ToListAsync();

            var caseDtos = _mapper.Map<List<CaseDto>>(cases);

            return new PaginatedResponse<CaseDto>
            {
                Page = parameters.Page,
                PageSize = parameters.PageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)parameters.PageSize),
                Items = caseDtos
            };
        }

        // NULLABLE dönüş (controller NotFound dönebilsin)
        public async Task<Case?> UpdateCaseAsync(int id, CaseUpdateDto dto)
        {
            var entity = await _caseRepository.GetByIdAsync(id);
            if (entity is null) return null;

            // PUT mantığı: tüm alanları güncelle
            _mapper.Map(dto, entity);

            await _caseRepository.SaveAsync();
            return entity;
        }

        // SOFT DELETE
        public async Task<bool> DeleteCaseAsync(int id)
        {
            var entity = await _caseRepository.GetByIdAsync(id);
            if (entity is null) return false;

            if (!entity.IsActive)
                return true; // zaten silik kabul edelim

            entity.IsActive = false;
            await _caseRepository.SaveAsync();
            return true;
        }
    }
}
