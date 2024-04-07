import { Modal, ModalContainer } from "../styles/common/modal";
import { IoIosClose } from "react-icons/io";
import { useGlobal } from "../context/global";
import GeneralInput from "../components/common/GeneralInput";
import { ChangeEvent, FormEvent, useState } from "react";
import * as ParentTypes from '../types/parent'
import Select from "../components/common/Select";
import createAgeArray from "../utils/optionsArray";
// enums
import genders from '../json/genders.json'
import relationship from '../json/relationship.json'
import jobs from '../json/jobs.json'
import scholarship from '../json/scholarship.json'
import CountryInput from "../components/common/Country";
import AdminService from "../services/admin.service";
import isNumeric from "../utils/isNumeric";
import ListInput from "../components/common/ListInput";

export default function SignUpParent() {
    const {setSignupParentModalOpen} = useGlobal()
    const [data, setData] = useState<ParentTypes.Parent>({
        nationality: 'DO'
    } as ParentTypes.Parent)
    const [idType, setIdType] = useState<string>('id_card')
    function onChange(e: ChangeEvent<HTMLInputElement>) {
        const name = e.target.name
        const value = e.target.value
        setData(prevData => ({...prevData, [name]: value}))
    }
    function onChangeSelect(e: ChangeEvent<HTMLSelectElement>) {
        const name = e.target.name
        let value: string | number = e.target.value
        if (isNumeric(value)) value = Number(value)
        setData(prevData => ({...prevData, [name]: value}))
    }
    const ages_list = createAgeArray(18, 80, 'años')

    async function register(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const response = await AdminService.registerParent(data)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    console.log(data)
    return (
        <ModalContainer>
            <Modal onSubmit={register}>
                <h1>Registrar padre</h1>
                <div className="input-container">
                    <GeneralInput
                    maxLength={40}
                    label="Nombre"
                    value={data.name || ''}
                    required
                    name="name"
                    onChange={onChange}
                    />
                    <GeneralInput
                    maxLength={40}
                    label="Apellido"
                    value={data.lastName || ''}
                    required
                    name="lastName"
                    onChange={onChange}
                    />
                    <GeneralInput
                    maxLength={75}
                    label="Usuario"
                    value={data.username || ''}
                    required
                    name="username"
                    onChange={onChange}
                    />
                </div>
                <div className="input-container">
                    <GeneralInput
                    maxLength={70}
                    label="Email"
                    value={data.email || ''}
                    name="email"
                    onChange={onChange}
                    required
                    type="email"
                    />
                    <Select
                    options={[{name: 'Cédula', value: 'id_card'}, {name: 'Passport', value: 'passport'}]}
                    onChange={(e) => {
                        setIdType(e.target.value)
                    }}
                    />
                    {
                        idType === 'id_card' ?
                        <GeneralInput
                        label="Cédula"
                        value={data.id_card|| ''}
                        required
                        name="id_card"
                        onChange={onChange}
                        />
                        :
                        <GeneralInput
                        label="Pasaporte"
                        value={data.passport|| ''}
                        name="passport"
                        // required
                        onChange={onChange}
                        />

                    }
                </div>
                <div className="input-container">
                    <GeneralInput
                    maxLength={500}
                    label="Dirección"
                    value={data.address || ''}
                    name="address"
                    required
                    onChange={onChange}
                    />
                    <Select
                    options={genders}
                    label="Género"
                    name="gender"
                    value={data.gender}
                    onChange={onChangeSelect}
                    required
                    defaultNull
                    />
                    <Select
                    options={ages_list}
                    label="Edad"
                    name="age"
                    value={data.age}
                    onChange={onChangeSelect}
                    defaultNull
                    required
                    />
                </div>
                <div className="input-container">
                    <GeneralInput
                    label="Teléfono residencial"
                    name="landline"
                    onChange={onChange}
                    value={data.landline}
                    required
                    />
                    <GeneralInput
                    label="Teléfono movil"
                    name="phone"
                    value={data.phone}
                    onChange={onChange}
                    required
                    maxLength={70}
                    />
                </div>
                <div className="input-container">
                    <GeneralInput
                    label="Contraseña"
                    name="password"
                    placeholder="Min. 8 caracteres"
                    value={data.password || ''}
                    onChange={onChange}
                    required
                    // maxLength={125}
                    />
                    <CountryInput
                    value={data.nationality}
                    label="Nacionalidad"
                    onChange={onChangeSelect}
                    name="nationality"
                    />
                </div>
                <hr className="separator" />
                <h2>Parentesco</h2>
                <div className="input-container">
                    <div style={{display: 'flex', alignItems: 'end', gap: '10px'}}>
                        <Select
                        options={relationship}
                        name="relationship"
                        onChange={onChangeSelect}
                        // value={data.relationship}
                        label="Parentesco"
                        style={{height: '50px'}}
                        defaultNull
                        />
                        {
                            data.relationship !== undefined &&
                            (!relationship.some(item => item.value === data.relationship) || data.relationship === '') &&
                            <GeneralInput
                            value={data.relationship}
                            name="relationship"
                            onChange={onChange}
                            required
                            />
                        }
                    </div>
                    <ListInput
                    list={data.children || []}
                    required
                    isText
                    label="Nombre de usuarios dependientes"
                    onChange={(newList: string[]) => setData(prevData => ({...prevData, children: newList}))}
                    />
                </div>
                <hr className="separator" />
                <h2>Oficio y escolaridad</h2>
                <div className="input-container">
                    <div style={{display: 'flex', alignItems: 'end', gap: '10px'}}>
                            <Select
                            options={scholarship}
                            name="scholarship"
                            onChange={onChangeSelect}
                            style={{height: '50px'}}
                            label="Escolaridad"
                            defaultNull
                            />
                            {
                                data.scholarship !== undefined &&
                                (!scholarship.some(item => item.value === data.scholarship) || data.scholarship === '') &&
                                <GeneralInput
                                value={data.scholarship}
                                name="scholarship"
                                onChange={onChange}
                                maxLength={155}
                                required
                                />
                            }
                    </div>
                    <div style={{display: 'flex', alignItems: 'end', gap: '10px'}}>
                            <Select
                            options={jobs}
                            name="job"
                            onChange={onChangeSelect}
                            style={{height: '50px'}}
                            label="Ocupación"
                            defaultNull
                            />
                            {
                                data.job !== undefined &&
                                (!jobs.some(item => item.value === data.job) || data.job === '') &&
                                <GeneralInput
                                value={data.job}
                                name="job"
                                maxLength={155}
                                onChange={onChange}
                                required
                                />
                            }
                    </div>
                </div>
                <div className="input-container">
                    <GeneralInput
                    label="Lugar de trabajo"
                    value={data.job_address}
                    name="job_address"
                    required
                    onChange={onChange}
                    maxLength={255}
                    />
                    <GeneralInput
                    label="Teléfono de trabajo"
                    value={data.job_phone}
                    name="job_phone"
                    required
                    onChange={onChange}
                    maxLength={75}
                    />
                </div>
                <div className="actions">
                    <button
                    > Registrar
                    </button>
                </div>
                <div className="close"
                onClick={() =>  setSignupParentModalOpen(false)}
                >
                    <IoIosClose/>
                </div>
            </Modal>
        </ModalContainer>
    )
}