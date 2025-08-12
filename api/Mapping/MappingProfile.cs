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

            CreateMap<CaseUpdateDto, Case>();

            CreateMap<CaseCreateDto, Case>();

            CreateMap<Case, CaseDto>()
                .ForMember(dest => dest.WorkingGroupName,
                           opt => opt.MapFrom(src => src.WorkingGroup != null ? src.WorkingGroup.GroupName : null));
        }
    }
}
