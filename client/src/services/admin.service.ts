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
    private grade: string = '/grade'
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

    registerStudent(data: FormData) {
        return http.post(this.student + '/register', data, {...this.config, headers: {...this.config.headers, 'Content-Type': 'multipart/form-data' }})
    }

    registerParent(data: ParentTypes.Parent) {
        return http.post(this.parent + '/register', data, this.config)
    }

    getGrades() {
        return http.get(this.grade + '/list', this.config)
    }

    getSectionsByGrade(grade_id: string) {
        return http.get(this.grade + `/section/${grade_id}`, this.config)
    }
}

const AdminService = new AdminServiceClass()

export default AdminService