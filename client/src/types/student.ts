import CountryCode from "./country"
import * as Vaccines from './health'

export interface Student{
    id: string
    name: string
    lastName: string
    password: string
    username: string
    identification: string
    gender: string
    RNE: string
    pic: string
    address: string
    nationality: CountryCode
    civil_status: string
    birth: Date
    email: string
    birth_place: string
    lives_with: string
    // if lives_with is 'otro'
    lives_with_name: string
    lives_with_lastName: string
    lives_with_relationship: string
    lives_with_address: string
    lives_with_phone: string
    lives_with_email: string
    lives_with_job: string
    lives_with_job_address: string
    // if level is "inicial"
    siblings_quantity: number
    // array of numbers, length must be equal to brothers_quantity
    siblings_ages: number[]
    sibling_place: number
    health: Health
    documents: Documents
    section_id: string
    // if level is 'primario' or 'secundario'
    student_status: string
    enrolled_at: Date
    removed_at: Date
    promoted: boolean
    created_at: Date
}

export interface Health {
    emergency_name: string
    emergency_phone: string
    emergency_identification: string
    alergies: string
    medicines: string
    disabilities: string
    doctor_name: string
    doctor_phone: string
    doctor_exequatur: string
    // vaccines
    tuberculosis: Date
    hepatitis: Date,
    rotavirus: Vaccines.Rotavirus
    influenza: Vaccines.Influenza
    spr_12: Date
    neumoco: Date
    spr_18: Date
    bopv_dpt_tdan: Vaccines.BOPV_DPT_TDAN
    bopv_dpt_dt: Vaccines.BOPV_DPT_DT
    covid: Vaccines.COVID_19
    vph: Vaccines.VPH
    dt: Vaccines.DT
    pregnant_tdan: Date
    pregnant_dt: Date
    pregnant_influenza: Date
}

export interface Documents {
    birth_certificate: File
    birth_warrant: File
    family_letter: File
    behavior_letter: File
    father_id: File
    mother_id: File
    evlc_sicometric: File
    photo: File
    form_inscription: File
    admission_test: File
    health_insurance: File
    vaccination_card: File
    id_card: File
    passport: File
}