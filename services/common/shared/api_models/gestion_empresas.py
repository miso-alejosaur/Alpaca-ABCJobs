from fastapi.applications import Optional
from pydantic import BaseModel, StringConstraints
from typing import Annotated, List

from common.shared.api_models.gestion_candidatos import CandidatoDTO, CandidatoPersonalInformationDTO, RolHabilidadDTO


class EmpresaCreateDTO(BaseModel):
    nombre: Annotated[
        str, StringConstraints(max_length=255, min_length=2, strip_whitespace=True)
    ]
    email: Annotated[
        str,
        StringConstraints(
            max_length=255, min_length=5, strip_whitespace=True, pattern=r".*@.*"
        ),
    ]
    password: Annotated[str, StringConstraints(max_length=20, min_length=8)]


class EmpresaDTO(BaseModel):
    id: int
    nombre: str
    email: str


class EmpresaCreateResponseDTO(BaseModel):
    empresa: EmpresaDTO
    token: str


class EmpleadoPersonalityDTO(BaseModel):
    id: int
    name: str


class EmpleadoDTO(BaseModel):
    id: int
    name: str
    title: str
    company: EmpresaDTO
    personality: EmpleadoPersonalityDTO
    skills: List[RolHabilidadDTO]


class EmpleadoCreateDTO(BaseModel):
    name: Annotated[
        str, StringConstraints(max_length=255, min_length=2, strip_whitespace=True)
    ]
    title: Annotated[
        str, StringConstraints(max_length=255, min_length=2, strip_whitespace=True)
    ]
    skills: List[int]
    personality_id: int


class EquipoDTO(BaseModel):
    id: int
    name: str
    company: EmpresaDTO
    employees: List[EmpleadoDTO]


class EquipoCreateDTO(BaseModel):
    name: Annotated[
        str, StringConstraints(max_length=255, min_length=2, strip_whitespace=True)
    ]
    employees: List[int]


class VacanteDTO(BaseModel):
    id: int
    name: str
    description: Optional[str]
    company: EmpresaDTO
    team: EquipoDTO
    preselection: List[CandidatoPersonalInformationDTO]


class VacanteCreateDTO(BaseModel):
    team_id: int
    name: Annotated[
        str, StringConstraints(max_length=255, min_length=2, strip_whitespace=True)
    ]
    description: Annotated[
        Optional[str], StringConstraints(max_length=255, min_length=2, strip_whitespace=True)
    ]


class VacantePreseleccionDTO(BaseModel):
    id_candidate: int
