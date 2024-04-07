import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { IoMdArrowBack } from "react-icons/io";
import Select from "../../common/Select";
// types
import * as PlanTypes from '../../../types/plan'
import * as GradeTypes from '../../../types/grade'
import TeacherService from "../../../services/teacher.service";

interface CompetencyInterface {
    section: GradeTypes.Section
    setSectionId: Dispatch<SetStateAction<string>>
}

interface InputItem {
    id: string
    category: string;
    description: string;
  }
  
  interface OutputItem {
    category: string;
    children: { description: string, id: string }[];
  }
  
  function transformArray(input: InputItem[]): OutputItem[] {
    // Use an object to group items by type
    const groupedByType: { [key: string]: { category: string, children: { description: string, id: string }[] } } = {};
  
    // Iterate over each item in the input array
    input.forEach(item => {
      const { id, description, category } = item;
  
      // If the type is encountered for the first time, initialize its structure
      if (!groupedByType[category]) {
        if (!category) return
        groupedByType[category] = { category, children: [] };
      }
  
      // Add the id to the corresponding type in the grouped object
      groupedByType[category].children.push({ id, description });
    });
  
    // Convert the grouped object into an array of OutputItem
    const outputArray: OutputItem[] = Object.values(groupedByType);
  
    return outputArray;
  }

export default function Competency({
    setSectionId,
    section
}: CompetencyInterface) {
    const [subjectId, setSubjectId] = useState<string>('')
    const [periodId, setPeriodId] = useState<string>('')
    const [plan, setPlan] = useState<(PlanTypes.AspectWorked & PlanTypes.Planification)[]>([])
    const [periods, setPeriods] = useState<GradeTypes.Period[]>([])
    const [fundamentalCompetencies, setFundamentalCompetencies] = useState<PlanTypes.FundamentalCompetency[]>([])
    useEffect(() => {
        async function getInfo() {
            try {
                if (!section || !subjectId) return

                const response = await (await TeacherService.getPlan(section.id, subjectId)).data
                console.log(response)
                setPlan(response.plan)
                setPeriods(response.periods)
                setFundamentalCompetencies(response.fundamental_competencies)
            } catch (error) {
                console.log(error)
            }
        }
        getInfo()
    }, [section, subjectId])
    async function addNewPlanRow() {
        const newPlanRow = {
            period_id: periodId,
            subject_id: subjectId,
            section_id: section.id,
        } as (PlanTypes.AspectWorked & PlanTypes.Planification);
        setPlan([...plan, newPlanRow])
        try {
            await TeacherService.changePlan(newPlanRow)
        } catch (error) {  
            console.log(error)
        }
        // Update the parent component's periods state
        // setPeriods(updatedPeriods as GradeTypes.Period[]);
    }

    async function onChangePlan(value: string, name: string, id: string) {
        const oldPlanRow = plan.find(p => p.id === id)
        const newPlanRow = {
            ...oldPlanRow,
            [name]: value
        } as (PlanTypes.AspectWorked & PlanTypes.Planification);
        // Update the parent component's state (periods) with the updated grade
        const updatedPlan = plan.map((p) => {
          if (p.period_id === periodId) {
            return { ...p, ...newPlanRow };
          }
          return p;
        });
        // Update the parent component's periods state
        setPlan(updatedPlan);
        try {
            await TeacherService.changePlan(newPlanRow)
        } catch (error) {
            console.log(error)
        }
    }

    const especific_competencies: PlanTypes.EspecificCompetency[] = useMemo(() => {
        const list: any = []
        fundamentalCompetencies.forEach((f) => {
            list.push(...f.especific_competencies)
        })
        return list
    }, [fundamentalCompetencies])
    const indicators: PlanTypes.Indicator[] = useMemo(() => {
        const list: any = []
        fundamentalCompetencies.forEach((f) => {
            list.push(...f.indicators)
        })
        return list
    }, [fundamentalCompetencies])


    const contents = useMemo(() => {
        const list: any = []
        fundamentalCompetencies.forEach((f) => {
            list.push(...f.contents)
        })
        return list
    }, [fundamentalCompetencies])
    return (
        <Main>
            <button
            type="button"
            className="back"
            onClick={() => setSectionId('')}
            ><IoMdArrowBack/></button>
            <Filter>
                <Select
                label="Asignatura"
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                options={section.subjects.map(s  => ({name: s.name, value: s.id}))}
                required
                defaultNull
                />
                {
                    subjectId &&
                    <Select
                    label="Periodo"
                    value={periodId}
                    onChange={e => setPeriodId(e.target.value)}
                    options={periods.map(p  => ({name: p.type, value: p.id}))}
                    required
                    defaultNull
                    />
                }
            </Filter>
            {
                periodId &&
                section.level.name === 'secundario' &&
                <>
                <Competencies>
                    <CompetenciesTable>
                        <thead>
                            <tr>
                                <th
                                >Competencias Fundamentales</th>
                                <th
                                >Competencias Específicas (CE) del Grado</th>
                                <th
                                >Indicadores de Logro (IL)</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {
                                fundamentalCompetencies.map((fundamental, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td>{fundamental.name}</td>
                                            <td>
                                                <div className={fundamental.especific_competencies.length ? "especific" : ''}>
                                                {fundamental.especific_competencies.map((especific) => {
                                                    return ( 
                                                        <div>
                                                            {especific.name}
                                                        </div>
                                                    )
                                                })}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={fundamental.indicators.length ? "indicator" : ''}>
                                                    {fundamental.indicators.map((indicator) => {
                                                        return ( 
                                                            <div>
                                                                {indicator.name}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </CompetenciesTable>
                </Competencies>
                <Planner>
                    <PlannerTable>
                        <thead>
                            <tr>
                                <th>CE</th>
                                <th>Indicadores de Logro</th>
                                <th>Contenidos Claves</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                plan.filter(p => p.period_id === periodId).map((p, idx) => {
                                    return (
                                        <tr>
                                            <td>
                                                <select defaultValue={p.especific_competency_id}
                                                onChange={e => onChangePlan(e.target.value, 'especific_competency_id', p.id)}
                                                >
                                                    <option selected disabled value="">--</option>
                                                    {
                                                        especific_competencies.map((g) => {
                                                            return (
                                                                <option 
                                                                selected={p.especific_competency_id === g.id}  
                                                                value={g.id}>{g.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </td>
                                            <td>
                                                <select defaultValue={p.indicator_id}
                                                onChange={e => onChangePlan(e.target.value, 'indicator_id', p.id)}
                                                >
                                                    <option selected disabled value="">--</option>
                                                    {
                                                        indicators.map((g) => {
                                                            return (
                                                                <option 
                                                                selected={p.indicator_id === g.id}  
                                                                value={g.id}>{g.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>

                                            </td>
                                            <td>
                                                <input type="text"
                                                value={p.key_content}
                                                onChange={e => onChangePlan(e.target.value, 'key_content', p.id)}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td><button
                                onClick={addNewPlanRow}
                                >+</button></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </PlannerTable>
                </Planner>
                </>
            }
            {
                periodId &&
                section.level.name === 'primario' &&
                <>
                <Competencies>
                    <CompetenciesTable level="primario">
                        <thead>
                            <tr>
                                <th
                                >Competencias Fundamentales</th>
                                <th
                                >Competencias Específicas (CE) del Grado</th>
                                <th
                                >Indicadores de Logro (IL)</th>
                                <th
                                >Ejes de contenido</th>
                            </tr>
                        </thead>
                        <tbody>
                            <td className="contents">
                                {
                                    transformArray(contents).length ?
                                transformArray(contents).map((content, idx) => {
                                    return (
                                        <div key={idx}>
                                            <span className="title">{content.category}</span>
                                            {
                                                content.children.map((cat, ind) => {
                                                    return <span key={ind}>{cat.description}</span>
                                                })
                                            }
                                        </div>
                                    )
                                })
                                :
                                contents.map((content: PlanTypes.Content, idx: number) => {
                                    return (
                                        <div key={idx}>
                                            {content.description}
                                        </div>
                                    )
                                })
                                }
                            </td>
                            {
                                fundamentalCompetencies.map((fundamental, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td>{fundamental.name}</td>
                                            <td>
                                                <div className={fundamental.especific_competencies.length ? "especific" : ''}>
                                                {fundamental.especific_competencies.map((especific, idx) => {
                                                    return ( 
                                                        <div key={idx}>
                                                            {especific.name}
                                                        </div>
                                                    )
                                                })}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={fundamental.indicators.length ? "indicator" : ''}>
                                                    {fundamental.indicators.map((indicator) => {
                                                        return ( 
                                                            <div>
                                                                {indicator.name}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </td>
                                            
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </CompetenciesTable>
                </Competencies>
                <Planner>
                    <PlannerTable>
                        <thead>
                            <tr>
                                <th>Competencias Fundamentales</th>
                                <th>CE</th>
                                <th>Indicador</th>
                                <th>Ejes de contenido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                plan.filter(p => p.period_id === periodId).map((p, idx) => {
                                    return (
                                        <tr>
                                            <td>
                                                <select defaultValue={p.fundamental_competency_id}
                                                onChange={e => onChangePlan(e.target.value, 'fundamental_competency_id', p.id)}
                                                >
                                                    <option selected disabled value="">--</option>
                                                    {
                                                        fundamentalCompetencies.map((g) => {
                                                            return (
                                                                <option 
                                                                selected={p.especific_competency_id === g.id}  
                                                                value={g.id}>{g.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </td>
                                            <td>
                                                <select defaultValue={p.especific_competency_id}
                                                onChange={e => onChangePlan(e.target.value, 'especific_competency_id', p.id)}
                                                >
                                                    <option selected disabled value="">--</option>
                                                    {
                                                        especific_competencies.map((g) => {
                                                            return (
                                                                <option 
                                                                selected={p.indicator_id === g.id}  
                                                                value={g.id}>{g.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </td>
                                            <td>
                                                <select defaultValue={p.indicator_id}
                                                onChange={e => onChangePlan(e.target.value, 'indicator_id', p.id)}
                                                >
                                                    <option selected disabled value="">--</option>
                                                    {
                                                        indicators.map((g) => {
                                                            return (
                                                                <option 
                                                                selected={p.indicator_id === g.id}  
                                                                value={g.id}>{g.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </td>
                                            <td>
                                                <select defaultValue={p.content_id}
                                                onChange={e => onChangePlan(e.target.value, 'content_id', p.id)}
                                                >
                                                    <option selected disabled value="">--</option>
                                                    {
                                                        contents.map((g: PlanTypes.Content) => {
                                                            return (
                                                                <option 
                                                                selected={p.indicator_id === g.id}  
                                                                value={g.id}>{g.description}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td><button
                                onClick={addNewPlanRow}
                                >+</button></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </PlannerTable>
                </Planner>
                </>
            }
        </Main>
    )
}

const Main = styled.div`
width: 100%;
.back {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: none;
    color: ${props => props.theme.dark.Onyx};
    background-color: ${props => props.theme.white.White};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
    transition: all .3s ease;
    margin-bottom: 10px;
    &:hover {
        box-shadow: 0 3px 5px ${props => props.theme.shadow.Dark200};
        transform: translateY(-3px);
    }
}
`

const Filter = styled.div`
flex-wrap: wrap;
background-color: ${props => props.theme.white.White};
padding: 10px;
margin-bottom: 10px;
border-radius: 10px;
box-shadow: 0 5px 10px ${props => props.theme.shadow.Dark100};
display: flex;
align-items: center;
gap: 10px;
`

const Competencies = styled.div`
    overflow: auto;
    width: 100%;
    max-height: calc(100% - 40px);
    box-shadow: 0 5px 10px ${props => props.theme.shadow.Dark100};
`

const CompetenciesTable = styled.div<{level?: 'primario' | 'secundario'}>`
    background-color: ${props => props.theme.blue.BlueGray};
    border: 2px solid ${props => props.theme.gray.BlueGray};
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    min-width: 450px;
    overflow: hidden;
    border-radius: 10px;
    position: relative;
    th {
        width: 33%;
        padding: 10px;
        text-align: center;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: ${props => props.theme.gray.Platinum};
        ${props => props.level === 'primario' && {
            width: '15%'
        }}
    }
    td {
        padding: 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-color: ${props => props.theme.white.White};
    }
    td.contents {
        position: absolute;
        right: 0;
        width: 25%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 5px;
        .title {
            color: ${props => props.theme.dark.Onyx};
        }
    }
    div.especific {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 5px;
        height: 100%;
        color: ${props => props.theme.gray.Smoke};
    }
    div.indicator {
        display: flex;
        flex-direction: column;
        gap: 5px;
        height: 100%;
        color: ${props => props.theme.gray.Smoke};
        font-size: 14px;
    }
    tr {
        border-radius: 10px;
        overflow: hidden;
        min-height: 60px;
        width: 100%;
    }
`

const Planner = styled.div`
    margin-top: 10px;
    overflow: auto;
    width: 100%;
    max-height: calc(100% - 40px);
    box-shadow: 0 5px 10px ${props => props.theme.shadow.Dark100};
`

const PlannerTable = styled.div`
    background-color: ${props => props.theme.blue.BlueGray};
    border: 2px solid ${props => props.theme.gray.BlueGray};
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    min-width: 500px;
    overflow: hidden;
    border-radius: 10px;
    th {
        width: 15%;
        padding: 0 10px;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: ${props => props.theme.gray.Platinum};
    }
    td {
        text-align: center;
        background-color: ${props => props.theme.white.White};
        select {
            width: 100%;
            height: 40px;
            flex: 1;
            -webkit-appearance: none;
            -moz-appearance: none;
            background: transparent;
            background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
            background-repeat: no-repeat;
            background-position-x: 90%;
            background-position-y: 50%;
            border: none;
            width: 100%;
            padding: 10px 15px;
            outline: none;
        }
        input {
            width: 100%;
            height: 40px;
            border: none;
            background-color: rgba(0,0,0,0);
            outline: none;
            padding: 0 10px;
        }
    }
    button {
        width: 30px;
        height: 30px;
        border-radius: 5px;
        border: none;
        background-color: ${props => props.theme.blue.Denim};
        color: ${props => props.theme.white.White};
        font-size: 16px;
        cursor: pointer;
    }
    tr {
        border-radius: 10px;
        overflow: hidden;
        height: 40px;
        width: 100%;
    }
`