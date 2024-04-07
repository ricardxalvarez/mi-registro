import React, { useState, useContext } from "react";
import * as UserTypes from '../types/user'
import AdminService from "../services/admin.service";
import TeacherService from "../services/teacher.service";

const AppProvider = React.createContext(null as any);

export const AppContext = ({children}: {children: React.ReactNode}) => {
    const [tab, setTab] = useState<string>('home')
    const getUser = () => {
        const user = localStorage.getItem('user')
        if (user) {
            return JSON.parse(user)
        } else return null
    }
    const [user, setUser] = useState<UserTypes.GlobalUser>(getUser())
    const [signupTeacherModalOpen, setSignupTeacherModalOpen] = useState<boolean>(false)
    const [signupStudentModalOpen, setSignupStudentModalOpen] = useState<boolean>(false)
    const [signupParentModalOpen, setSignupParentModalOpen] = useState<boolean>(false)


    if (user) switch (user.source) {
        case 'administrador':
            AdminService.setToken(user.token)
            break;
        case 'profesor':
            TeacherService.setToken(user.token)
            break;
        default:
            break;
    }
    const values = {
        tab, setTab,
        user, setUser,
        signupTeacherModalOpen, setSignupTeacherModalOpen,
        signupStudentModalOpen, setSignupStudentModalOpen,
        signupParentModalOpen, setSignupParentModalOpen
    }
    return <AppProvider.Provider value={values}>{children}</AppProvider.Provider>;
}

export const useGlobal = () => {
    return useContext(AppProvider);
  };