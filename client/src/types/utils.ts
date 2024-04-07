export type Level = 'primario' | 'secundario' | 'inicial'

export interface SectionFilter {
    modality_id?: string
    level_id?: string
    cycle_id?: string
    grade_id?: string
    section_id?: string
    subject_id?: string
    period_id?: string
    scope_id?: string
    indicator_kinder_id?: string
}

export interface Attendance {
    attendant: boolean
    day: Date

    section_id: string
    grade_id: string
    level_id: string
    modality_id: string
    center_id: string
    teacher_id: string
    student_id: string

    period_id: string
    subject_id: string
}

export interface Subject {
    id: string
    grade_id: string
    cycle_id: string
    level_id: string
    modality_id: string
    center_id: string
    teacher_id: string
    section_id: string
    name: string
}