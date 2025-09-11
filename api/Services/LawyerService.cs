using AutoMapper;
using AutoMapper.QueryableExtensions;
using dava_avukat_eslestirme_asistani.DTOs;
using dava_avukat_eslestirme_asistani.Entities;
using dava_avukat_eslestirme_asistani.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
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

        public async Task<List<LawyerDto>> GetAllLawyersAsync()
        {
            var lawyers = await _lawyerRepository.GetAllAsync();
            return _mapper.Map<List<LawyerDto>>(lawyers.ToList());
        }

        public async Task<LawyerDto?> GetLawyerByIdAsync(int id)
        {
            var lawyer = await _lawyerRepository.GetByIdAsync(id);
            return lawyer == null ? null : _mapper.Map<LawyerDto>(lawyer);
        }

        public async Task<LawyerDto> UpdateLawyerAsync(int id, LawyerUpdateDto dto)
        {
            var lawyer = await _lawyerRepository.GetByIdAsync(id);
            if (lawyer == null)
                throw new KeyNotFoundException("Avukat bulunamadı");

            // DTO -> Entity map (WorkingGroupId dahil)
            _mapper.Map(dto, lawyer);
            _lawyerRepository.Update(lawyer);
            await _lawyerRepository.SaveAsync();

            return _mapper.Map<LawyerDto>(lawyer);
        }

        /// <summary>
        /// Filtreleme, sıralama ve sayfalama ile avukat listesi döner.
        /// </summary>
        public async Task<(List<LawyerDto> Items, int TotalItems, int TotalPages)>
            GetLawyersAsync(LawyerQueryParameters query)
        {
            var q = _lawyerRepository.Query();

            // --- Filtreleme ---
            if (!string.IsNullOrWhiteSpace(query.City))
                q = q.Where(l => l.City == query.City);

            if (query.IsActive.HasValue)
                q = q.Where(l => l.IsActive == query.IsActive.Value);

            // Not: AvailableForProBono alanı yeni şemada yok; bu filtre kaldırıldı.

            // --- Arama ---
            if (!string.IsNullOrWhiteSpace(query.SearchTerm))
            {
                var t = query.SearchTerm.ToLowerInvariant();
                q = q.Where(l =>
                    (l.FullName != null && l.FullName.ToLower().Contains(t)) ||
                    (l.Email != null && l.Email.ToLower().Contains(t)) ||
                    (l.Phone != null && l.Phone.ToLower().Contains(t)) ||
                    (l.City != null && l.City.ToLower().Contains(t)) ||
                    (l.Languages != null && l.Languages.ToLower().Contains(t)) ||
                    (l.Title != null && l.Title.ToLower().Contains(t)) ||
                    (l.Education != null && l.Education.ToLower().Contains(t))
                );
            }

            // --- Toplam kayıt ---
            var totalItems = await q.CountAsync();

            // --- Sıralama ---
            var sortBy = (query.SortBy ?? "FullName").ToLowerInvariant();
            var desc = string.Equals(query.SortOrder, "desc", StringComparison.OrdinalIgnoreCase);

            q = sortBy switch
            {
                "city" => desc ? q.OrderByDescending(l => l.City).ThenBy(l => l.FullName)
                                    : q.OrderBy(l => l.City).ThenBy(l => l.FullName),
                "startdate" => desc ? q.OrderByDescending(l => l.StartDate).ThenBy(l => l.FullName)
                                    : q.OrderBy(l => l.StartDate).ThenBy(l => l.FullName),
                "title" => desc ? q.OrderByDescending(l => l.Title).ThenBy(l => l.FullName)
                                    : q.OrderBy(l => l.Title).ThenBy(l => l.FullName),
                "fullname" or _ => desc ? q.OrderByDescending(l => l.FullName)
                                        : q.OrderBy(l => l.FullName)
            };

            // --- Sayfalama ---
            var page = query.Page <= 0 ? 1 : query.Page;
            var pageSize = query.PageSize <= 0 ? 10 : query.PageSize;
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            // --- DTO'ya projeksiyon ---
            var items = await q
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ProjectTo<LawyerDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return (items, totalItems, totalPages);
        }

        /// <summary>
        /// Soft delete: IsActive=false yapar. Yoksa false döner.
        /// </summary>
        public async Task<bool> SoftDeleteLawyerAsync(int id)
        {
            var entity = await _lawyerRepository.GetByIdAsync(id);
            if (entity is null) return false;

            if (!entity.IsActive)
            {
                // Zaten soft-deleted; idempotent olarak başarı kabul edelim.
                return true;
            }

            entity.IsActive = false;
            // İstersen soft-delete alanlarını da setleyebilirsin:
            // entity.IsDeleted = true;
            // entity.DeletedAt = DateTime.UtcNow;

            _lawyerRepository.Update(entity);
            await _lawyerRepository.SaveAsync();
            return true;
        }
    }
}
