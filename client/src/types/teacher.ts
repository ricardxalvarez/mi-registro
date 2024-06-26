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
    created_at: Date
}

export interface Training {
    years_of_service: number
    expertise: string
    degree: string
    current_studies: string
    age: Number
    nationality: string
    civil_status: string
    address: string
    gender: string
    name: string
    identification: string
    lastName: string
}