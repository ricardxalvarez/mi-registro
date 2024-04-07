import styled from "styled-components";

// types
import * as UtilsTypes from '../../../types/utils'
import * as GradeTypes from '../../../types/grade'
import * as StudentTypes from '../../../types/student'
import { Dispatch, SetStateAction } from "react";

interface ListInterface {
  sections: GradeTypes.Section[]
  setSectionId: Dispatch<SetStateAction<string>>
}

export default function List({
  sections,
  setSectionId
}: ListInterface) {
    return (
        <Main>
            <div className="competencies">
              {
                sections.map((section, idx) => {
                  return <div className="card" key={idx} 
                        onClick={() => setSectionId(section.id)}
                        >
                          <p>{section.grade.name} Sección "{section.name}"</p>
                          <p className="small">{section.level.name}</p>
                          {
                            section.subjects.map((subject, indx) => {
                              return <p className="subject" key={indx}>{subject.name}</p>
                            })
                          }
                          <div className="go-corner">
                              <div className="go-arrow">
                              →
                              </div>
                          </div>
                  </div>
                })
              }
            </div>
        </Main>
    )
}

const Main = styled.div`
width: 100%;
height: 100%;
.competencies {
  display: flex;
  width: 100%;
  gap: 10px;
  flex-wrap: wrap;
}
.card {
  flex: 1;
  min-width: 300px;
  cursor: pointer;
  position: relative;
  background-color: #f2f8f9;
  border-radius: 10px;
  padding: 20px 15px;
  text-decoration: none;
  z-index: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card p {
  font-size: 17px;
  font-weight: 400;
  line-height: 20px;
  color: ${props => props.theme.gray.SteelGray};
}

.card p.small {
  font-size: 14px;
  text-transform: capitalize;
}

.card p.subject {
  font-size: 12px;
}

.go-corner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 32px;
  height: 32px;
  overflow: hidden;
  top: 0;
  right: 0;
  background-color: ${props => props.theme.blue.SteelBlue};
  border-radius: 0 4px 0 32px;
}

.go-arrow {
  margin-top: -4px;
  margin-right: -4px;
  color: ${props => props.theme.white.White};
  font-family: courier, sans;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 3px 5px ${props => props.theme.shadow.Dark200};
}

.card:before {
  content: "";
  position: absolute;
  z-index: -1;
  top: -16px;
  right: -16px;
  background: ${props => props.theme.blue.SteelBlue};
  height: 32px;
  width: 32px;
  border-radius: 32px;
  transition: all 0.25s ease-out;
}

.card:hover:before {
  width: calc(100% + 40px);
  height: calc(100% + 20px);
}

.card:hover p {
  transition: all 0.3s ease-out;
  color: ${props => props.theme.white.White};
}

.card:hover h3 {
  transition: all 0.3s ease-out;
  color: ${props => props.theme.white.White};
}
`