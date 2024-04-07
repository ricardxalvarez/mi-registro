import * as TeacherTypes from './teacher'
import * as UtilTypes from './utils'

export interface Grade {
    id: string
    modality_id: string
    level_id: string
    cycle_id: string
    name: string
    created_at: string
    level: Level
    modality: Modality
    cycle: Cycle
}

export interface Level {
    id: string
    name: string
    modality_id: string
    created_at: string
}

export interface Modality {
    id: string
    name: string
    created_at: string
}

export interface Cycle {
    id: string
    name: string
    level_id: string
    modality_id: string
    created_at: string
}

export interface Section {
    id: string
    center_id: string
    grade_id: string
    modality_id: string
    cycle_id: string
    level_id: string
    teacher_id: string
    name: string
    year_start: string
    year_end: string
    created_at: string
    grade: Grade
    modality: Modality
    cycle: Cycle
    level: Level
    teacher: TeacherTypes.Teacher
    subjects: UtilTypes.Subject[]
}

export interface Period {
    id: string

    included_months?: string
    specific_month?: string
    type: string
    section_id: string
    grade_id: string
    level_id: string
    center_id: string
    year_gnl: string
    grades: Calification[]
    scope_id: string
    student_id: string
    teacher_id: string

    period: string
}

export interface Calification {
    id: string
    cp1?: number
    rcp1?: number
    cp2?: number
    rcp2?: number
    cp3?: number
    rcp3?: number
    cp4?: number
    rcp4?: number
    type?: string

    section_id: string
    grade_id?: string
    level_id?: string
    modality_id?: string
    center_id: string
    student_id: string
    teacher_id: string
    subject_id: string
    period_id: string
    especific_competency_id?: string

    scope_id?: string
    indicator_kinder_id?: string

    grade?: string
}

export interface ScopeKinder {
    id: string
    li: string
    rsia: string
    indicators: IndicatorKinder[]
}

export interface IndicatorKinder {
    id: string
    indicator: string
    scope_id: string
}