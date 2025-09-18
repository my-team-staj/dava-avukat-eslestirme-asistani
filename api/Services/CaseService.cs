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
            // Controller tarafında [ApiController] + DataAnnotations çalışsa da,
            // servis katmanında minimum koruma:
            if (string.IsNullOrWhiteSpace(caseDto.ContactClient) ||
                string.IsNullOrWhiteSpace(caseDto.FileSubject) ||
                string.IsNullOrWhiteSpace(caseDto.CaseResponsible) ||
                string.IsNullOrWhiteSpace(caseDto.PrmNatureOfAssignment) ||
                string.IsNullOrWhiteSpace(caseDto.PrmCasePlaceofUseSubject) ||
                string.IsNullOrWhiteSpace(caseDto.SubjectMatterDescription) ||
                string.IsNullOrWhiteSpace(caseDto.City) ||
                string.IsNullOrWhiteSpace(caseDto.Description))
            {
                throw new ArgumentException("Zorunlu alanlar boş olamaz.");
            }

            var entity = _mapper.Map<Case>(caseDto);

            await _caseRepository.AddAsync(entity);
            await _caseRepository.SaveAsync();
            return entity;
        }

        public async Task<Case?> GetCaseByIdAsync(int id)
        {
            var entity = await _caseRepository.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted) return null;
            return entity;
        }

        public async Task<PaginatedResponse<CaseDto>> GetCasesAsync(CaseQueryParameters parameters)
        {
            var query = _caseRepository.Query()
                                       .Where(c => !c.IsDeleted);

            // === Filtreleme ===
            if (!string.IsNullOrWhiteSpace(parameters.City))
                query = query.Where(c => (c.City ?? "").Contains(parameters.City));

            if (!string.IsNullOrWhiteSpace(parameters.FileSubject))
                query = query.Where(c => (c.FileSubject ?? "").Contains(parameters.FileSubject));

            if (!string.IsNullOrWhiteSpace(parameters.CaseResponsible))
                query = query.Where(c => (c.CaseResponsible ?? "").Contains(parameters.CaseResponsible));

            if (!string.IsNullOrWhiteSpace(parameters.ContactClient))
                query = query.Where(c => (c.ContactClient ?? "").Contains(parameters.ContactClient));

            if (parameters.IsToBeInvoiced.HasValue)
                query = query.Where(c => c.IsToBeInvoiced == parameters.IsToBeInvoiced.Value);

            // === Arama ===
            if (!string.IsNullOrWhiteSpace(parameters.SearchTerm))
            {
                var term = parameters.SearchTerm.ToLower();
                query = query.Where(c =>
                    (c.FileSubject ?? "").ToLower().Contains(term) ||
                    (c.SubjectMatterDescription ?? "").ToLower().Contains(term) ||
                    (c.Description ?? "").ToLower().Contains(term) ||
                    (c.ContactClient ?? "").ToLower().Contains(term) ||
                    (c.CaseResponsible ?? "").ToLower().Contains(term) ||
                    (c.City ?? "").ToLower().Contains(term));
            }

            // === Sıralama ===
            var sortByRaw = parameters.SortBy ?? string.Empty;
            var sortBy = new string(sortByRaw.ToLower().Where(ch => !char.IsWhiteSpace(ch)).ToArray()); // boşlukları at
            var asc = string.Equals(parameters.SortOrder, "asc", StringComparison.OrdinalIgnoreCase);

            query = sortBy switch
            {
                "contactclient" => asc ? query.OrderBy(c => c.ContactClient) : query.OrderByDescending(c => c.ContactClient),
                "filesubject" => asc ? query.OrderBy(c => c.FileSubject) : query.OrderByDescending(c => c.FileSubject),
                "caseresponsible" => asc ? query.OrderBy(c => c.CaseResponsible) : query.OrderByDescending(c => c.CaseResponsible),
                "city" => asc ? query.OrderBy(c => c.City) : query.OrderByDescending(c => c.City),
                "istobeinvoiced" => asc ? query.OrderBy(c => c.IsToBeInvoiced) : query.OrderByDescending(c => c.IsToBeInvoiced),
                _ => asc ? query.OrderBy(c => c.FileSubject) : query.OrderByDescending(c => c.FileSubject)
            };

            // === Toplam kayıt ===
            var totalItems = await query.CountAsync();

            // === Sayfalama ===
            var page = parameters.Page <= 0 ? 1 : parameters.Page;
            var pageSize = parameters.PageSize <= 0 ? 10 : parameters.PageSize;
            var skip = (page - 1) * pageSize;

            var cases = await query
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            var caseDtos = _mapper.Map<List<CaseDto>>(cases);

            return new PaginatedResponse<CaseDto>
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                Items = caseDtos
            };
        }

        // NULLABLE dönüş (controller NotFound dönebilsin)
        public async Task<Case?> UpdateCaseAsync(int id, CaseUpdateDto dto)
        {
            var entity = await _caseRepository.GetByIdAsync(id);
            if (entity is null || entity.IsDeleted) return null;

            // PUT mantığı: zorunlu alanlar yine gönderilmiş olmalı
            if (string.IsNullOrWhiteSpace(dto.ContactClient) ||
                string.IsNullOrWhiteSpace(dto.FileSubject) ||
                string.IsNullOrWhiteSpace(dto.CaseResponsible) ||
                string.IsNullOrWhiteSpace(dto.PrmNatureOfAssignment) ||
                string.IsNullOrWhiteSpace(dto.PrmCasePlaceofUseSubject) ||
                string.IsNullOrWhiteSpace(dto.SubjectMatterDescription) ||
                string.IsNullOrWhiteSpace(dto.City) ||
                string.IsNullOrWhiteSpace(dto.Description))
            {
                throw new ArgumentException("Zorunlu alanlar boş olamaz.");
            }

            _mapper.Map(dto, entity);
            await _caseRepository.SaveAsync();
            return entity;
        }

        // SOFT DELETE
        public async Task<bool> DeleteCaseAsync(int id)
        {
            var entity = await _caseRepository.GetByIdAsync(id);
            if (entity is null) return false;

            if (entity.IsDeleted) return true; // zaten silinmiş

            entity.IsDeleted = true;
            entity.DeletedAt = DateTime.UtcNow;
            entity.DeletedBy = "system"; // İstersen controller’dan kullanıcı adı geçirilebilir.

            await _caseRepository.SaveAsync();
            return true;
        }
    }
}
