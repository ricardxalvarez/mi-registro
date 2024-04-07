import http from "./http";
import * as UtilsTypes from '../types/utils'
import * as GradeTypes from '../types/grade'
import * as TeacherType from "../types/teacher";
import * as PlanTypes from '../types/plan'

class TeacherServiceClass {
    private token: string | undefined;
    private config: { headers: { Authorization: string | undefined } };
    private user: string = '/users'
    private section: string = '/section'
    private grade: string = '/grade'
    private attendance: string = '/attendance'
    private period: string = '/period'
    private teacher: string = '/teachers'
    private plan: string = '/plan'
    constructor(token?: string) {
        this.token = token;
        this.config = { headers: { Authorization: `Bearer ${this.token}` } };
    }

    setToken(token: string) {
        this.token = token;
        this.config = { headers: { Authorization: `Bearer ${this.token}` } };
    }

    me() {
        return http.get(this.teacher + '/me', this.config)
    }

    update(data: TeacherType.Training) {
        return http.put(this.teacher + '/update', data, this.config)
    }

    changePlan(data: PlanTypes.Planification & PlanTypes.AspectWorked) {
        return http.post(this.plan + '/change', data, this.config)
    }

    listSections() {
        return http.get(this.section + '/list/teacher', this.config)
    }

    getPlan(section_id: string, subject_id: string) {
        return http.get(this.plan + `/section/${section_id}/subject/${subject_id}`, this.config)
    }

    listStudentsBySection(section_id: string) {
        return http.get(this.section + `/list/students/${section_id}`, this.config)
    }

    getAttendance(section_id: string, day: Date, subject_id?: string) {
        return http.post(this.attendance + '/list', { section_id, day, subject_id }, this.config)
    }

    postAttendance(data: UtilsTypes.Attendance) {
        return http.post(this.attendance, data, this.config)
    }

    listSubjectsByTeacher(section_id: string) {
        return http.get(this.section + `/list/subject/${section_id}/teacher/`, this.config)
    }

    getPeriods(section_id: string) {
        return http.get(this.period + `/list/${section_id}`, this.config)
    }

    changeGrade(data: GradeTypes.Calification) {
        return http.post(this.grade + '/change', data, this.config)
    }
}

const TeacherService = new TeacherServiceClass()

export default TeacherService