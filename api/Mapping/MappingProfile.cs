using AutoMapper;
using dava_avukat_eslestirme_asistani.DTOs;
using dava_avukat_eslestirme_asistani.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace dava_avukat_eslestirme_asistani.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Create DTO -> Entity
            CreateMap<CaseCreateDto, Case>();
            CreateMap<Case, CaseDto>();

        }
    }
}

