import http from "./http";
import * as UserTypes from '../types/user'

class UserServiceClass {
    private user: string = '/users'
    login(data: UserTypes.Login) {
        return http.post(this.user + '/login', data)
    }
}

const UserService = new UserServiceClass()

export default UserService