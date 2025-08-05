using AutoMapper;
using dava_avukat_eslestirme_asistani.DTOs;
using dava_avukat_eslestirme_asistani.Entities;

namespace dava_avukat_eslestirme_asistani
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Lawyer, LawyerDto>();
            CreateMap<LawyerCreateDto, Lawyer>();
            CreateMap<Case, CaseDto>();
            CreateMap<CaseCreateDto, Case>();
        }
    }
}
