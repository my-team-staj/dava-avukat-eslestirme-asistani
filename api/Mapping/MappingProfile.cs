using AutoMapper;
using dava_avukat_eslestirme_asistani.DTOs;
using dava_avukat_eslestirme_asistani.Entities;

namespace dava_avukat_eslestirme_asistani
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // --- Lawyer ---
            CreateMap<Lawyer, LawyerDto>()
                .ForMember(dest => dest.WorkGroupId, opt => opt.MapFrom(src => src.WorkingGroupId))
                .ForMember(dest => dest.WorkGroup, opt => opt.MapFrom(
                    src => src.WorkingGroup != null ? src.WorkingGroup.GroupName : null  // << düzeltme: Name -> GroupName
                ));

            CreateMap<LawyerCreateDto, Lawyer>()
                .ForMember(dest => dest.WorkingGroupId, opt => opt.MapFrom(src => src.WorkGroupId));

            CreateMap<LawyerUpdateDto, Lawyer>()
                .ForMember(dest => dest.WorkingGroupId, opt => opt.MapFrom(src => src.WorkGroupId));

            // --- Case ---
            CreateMap<CaseCreateDto, Case>();
            CreateMap<CaseUpdateDto, Case>();
            CreateMap<Case, CaseDto>();
        }
    }
}
