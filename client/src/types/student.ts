import CountryCode from "./country"

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
    emergency_name: string
    emergency_phone: string
    emergency_identification: string
    alergies: string
    medicines: string
    disabilities: string
    level: string
    // if level is "inicial"
    siblings_quantity: number
    // array of numbers, length must be equal to brothers_quantity
    siblings_ages: number[]
    sibling_place: number
    doctor_name: string
    doctor_phone: string
    doctor_exequatur: string
    // vaccines
    tuberculosis: boolean
    influenza: string
    spr: string
    neumoco: string
    bopv: string
    dpt: string
    covid: string
    vph: string
    dt: string
    hepatitis: string,
    pregnant_tdan: string
    pregnant_dt: boolean
    pregnant_influenza: string
    // if level is 'primario' or 'secundario'
    student_status: string
    enrolled_at: Date
    removed_at: Date
    promoted: boolean
    created_at: Date
}