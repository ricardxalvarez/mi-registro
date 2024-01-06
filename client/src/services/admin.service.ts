import http from "./http";
import * as TeacherTypes from '../types/teacher'
import * as StudentTypes from '../types/student'
import * as ParentTypes from '../types/parent'

class AdminServiceClass {
    private token: string | undefined;
    private config: { headers: { Authorization: string | undefined } };
    private user: string = '/users'
    private teacher: string = '/teachers'
    private student: string = '/students'
    private parent: string = '/parents'
    constructor(token?: string) {
        this.token = token;
        this.config = { headers: { Authorization: `Bearer ${this.token}` } };
    }

    setToken(token: string) {
        this.token = token;
        this.config = { headers: { Authorization: `Bearer ${this.token}` } };
    }

    registerTeacher(data: TeacherTypes.Teacher) {
        return http.post(this.teacher + '/register', data, this.config)
    }

    registerStudent(data: StudentTypes.Student) {
        return http.post(this.student + '/register', data, this.config)
    }

    registerParent(data: ParentTypes.Parent) {
        return http.post(this.parent + '/register', data, this.config)
    }
}

const AdminService = new AdminServiceClass()

export default AdminService