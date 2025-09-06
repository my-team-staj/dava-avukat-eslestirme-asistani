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

            // Filtreleme
            if (!string.IsNullOrWhiteSpace(query.City))
                q = q.Where(l => l.City == query.City);

            if (query.IsActive.HasValue)
                q = q.Where(l => l.IsActive == query.IsActive.Value);

            if (query.AvailableForProBono.HasValue)
                q = q.Where(l => l.AvailableForProBono == query.AvailableForProBono.Value);

            // Arama
            if (!string.IsNullOrWhiteSpace(query.SearchTerm))
            {
                var searchTerm = query.SearchTerm.ToLower();
                q = q.Where(l => l.Name.ToLower().Contains(searchTerm) || 
                                l.Email.ToLower().Contains(searchTerm) ||
                                l.BaroNumber.ToLower().Contains(searchTerm));
            }

            // Toplam kayıt
            var totalItems = await q.CountAsync();

            // Sıralama
            var sortBy = (query.SortBy ?? "Name").ToLowerInvariant();
            var desc = string.Equals(query.SortOrder, "desc", StringComparison.OrdinalIgnoreCase);

            q = sortBy switch
            {
                "rating" => desc ? q.OrderByDescending(l => l.Rating).ThenBy(l => l.Name)
                                 : q.OrderBy(l => l.Rating).ThenBy(l => l.Name),
                "name" or _ => desc ? q.OrderByDescending(l => l.Name)
                                    : q.OrderBy(l => l.Name)
            };

            // Sayfalama
            var page = query.Page <= 0 ? 1 : query.Page;
            var pageSize = query.PageSize <= 0 ? 10 : query.PageSize;
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            // DTO'ya projeksiyon
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
            _lawyerRepository.Update(entity);
            await _lawyerRepository.SaveAsync();
            return true;
        }
    }
}
