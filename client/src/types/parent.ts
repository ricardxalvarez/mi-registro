import CountryCode from "./country"

export interface Parent {
    id: string
    name: string
    lastName: string
    password: string
    username: string
    id_card: string,
    passport: string,
    gender: string
    relationship: string
    email: string
    nationality: CountryCode
    age: number
    address: string
    phone: string
    landline: string
    scholarship: string
    job: string
    job_address: string
    job_phone: string
    children: string[]
}