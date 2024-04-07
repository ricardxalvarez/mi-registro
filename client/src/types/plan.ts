export interface AspectWorked {
    id: string
    content_id: string
    especific_competency_id: string
    fundamental_competency_id: string
    period_id: string
    subject_id: string
    section_id: string
    especific_competency: EspecificCompetency
    fundamental_competency: FundamentalCompetency
    content: Content
}

export interface Planification {
    id: string
    especific_competency_id: string
    fundamental_competency_id: string
    indicator_id: string
    period_id: string
    subject_id: string
    section_id: string
    key_content: string
    especific_competency: EspecificCompetency
    fundamental_competency: FundamentalCompetency
    indicator: Indicator
}

export interface EspecificCompetency {
    id: string
    fundamental_competency_id: string
    subject_id: string
    grade_id: string
    cycle_id: string
    level_id: string
    modality_id: string
    name: string
}

export interface FundamentalCompetency {
    id: string
    name: string
    subject_id: string
    grade_id: string
    cycle_id: string
    level_id: string
    modality_id: string
    especific_competencies: EspecificCompetency[]
    indicators: Indicator[]
    contents: Content[]
}

export interface Indicator {
    id: string
    fundamental_competency_id: string
    subject_id: string
    grade_id: string
    level_id: string
    name: string
}

export interface Content {
    id: string
    especific_competency_id: string
    fundamental_competency_id: string
    subject_id: string
    grade_id: string
    level_id: string
    category: string
    description: string
}
