import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
// components
import List from "../../../components/teacher/Competencies/List";
import Competency from "../../../components/teacher/Competencies/Competency";
// types
import * as UtilsTypes from '../../../types/utils'
import * as GradeTypes from '../../../types/grade'
import * as StudentTypes from '../../../types/student'
// services
import TeacherService from "../../../services/teacher.service";

export default function Competencies() {
  const [sectionId, setSectionId] = useState<string>('')
  const [sections, setSections] = useState<GradeTypes.Section[]>([])
  useEffect(() => {
    async function getInto() {
      try {
        if (sections.length) return
        const response = await (await TeacherService.listSections()).data
        setSections(response.sections)
      } catch (error) {
        console.log(error)
      }
    }
    getInto()
  }, [])

  const section = useMemo(() => {
    return sections.find(s => s.id === sectionId)
  }, [sectionId, sections])
  return (
      <Main>
        {
          section ?
          <Competency
          section={section}
          setSectionId={setSectionId}
          />
          :
          <List
          sections={sections}
          setSectionId={setSectionId}
          />
        }
      </Main>
  )
}

const Main = styled.div`
width: 100%;
height: 100%;
`