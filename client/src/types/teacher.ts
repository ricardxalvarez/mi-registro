import CountryCode from "./country"

export interface Teacher {
    id: string
    name: string
    lastName: string
    password: string
    username: string
    identification: string
    pic: string
    gender: string
    email: string
    age: number
    nationality: CountryCode
    civil_status: string
    address: string
    years_of_service: number
    expertise: string
    degree: string
    current_studies: string
    rank: string
    created_at: Date
}