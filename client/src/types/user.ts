export interface Login {
    username: string,
    password: string
}

export type UserSources = 'administrador' | 'profesor' | 'padre' | 'estudiante'

export interface GlobalUser {
    source: UserSources,
    id: string,
    email: string,
    username: string,
    name: string,
    lastName: string,
    created_at: string,
    token: string
}