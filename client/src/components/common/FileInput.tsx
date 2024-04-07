import styled from "styled-components";
import { GoPaperclip } from "react-icons/go";
import { FaRegFilePdf } from "react-icons/fa";
import { FaRegFileImage } from "react-icons/fa";
import { GoTrash } from "react-icons/go";

interface FileInputInterface {
    value: File | undefined
    accept: '.pdf' | '.png, .jpg, .jpeg, .heic' 
    onChange: Function
    deleteFile: Function
    label?: string
}

export default function FileInput({
    value,
    accept,
    onChange,
    deleteFile,
    label
}: FileInputInterface) {
    return (
        <Main>
            {
                !value ?
                <div className="drop">
                    <div className="icon">
                        <GoPaperclip/>
                    </div>
                    <div>
                        <span className="label">
                            {label}
                        </span>
                        <span className="accept">
                            {accept}
                        </span>
                    </div>
                    <input type="file"
                    accept={accept}
                    value={value}
                    onChange={e => e.target.files && onChange(e.target.files[0])}
                    />
                </div>
                :
                <div className="file-container">
                    <div className="file">
                        <div className="icon">
                            {
                                accept === '.png, .jpg, .jpeg, .heic' &&
                                <FaRegFileImage/>
                            }
                            {
                                accept === '.pdf' &&
                                <FaRegFilePdf/>
                            }
                        </div>
                        <div className="text-cont">
                            <span className="label">{label}</span>
                            <span className="text">
                                {value.name}
                            </span>
                        </div>
                    </div>
                    <div className="delete"
                    onClick={() => deleteFile()}
                    >
                        <GoTrash/>
                    </div>
                </div>
            }
        </Main>
    )
}

const Main = styled.div`
height: 70px;
border-radius: 8px;
background-color: ${props => props.theme.white.White};
color: ${props => props.theme.gray.GunmetalGray};
border: 1px solid ${props => props.theme.dark.Charcoal};
min-width: 130px;
.drop {
    padding: 10px;
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    flex-direction: column;
    cursor: pointer;
    .label {
        font-size: 14px;
        text-align: center;
        display: block;
    }
    .accept {
        font-size: 12px;
        text-align: center;
        display: block;
    }
    input {
        position: absolute;
        opacity: 0;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
.file-container {
display: flex;
align-items: center;
justify-content: center;
height: 100%;
.file {
    gap: 5px;
    height: 100%;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    overflow: hidden;
    .text-cont {
        overflow: hidden;
        flex: 1;
    }
    .label {
        font-size: 12px;
        display: block;
    }
}
.delete {
    width: 40px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 30px;
    border-radius: 50%;
}
}
`