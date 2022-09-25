import React, {PropsWithChildren, useEffect} from "react";
import {GridColDef} from "@mui/x-data-grid"
import {MenuItem, TextField} from "@mui/material";
import {FilterState, Language, ProficiencyLevel} from "../Types";
import {ApplyFilterButton} from "./FormButton";


interface FilterProps extends PropsWithChildren {
    state?: FilterState;
    sendFilterInput: (state: FilterState) => void;
}


const styleColors: any = {
    textInput: 'rgba(255,255,255,0.7)',
    formLabel: '#858B97',
}

const VISIBLE_FIELDS = ['Language', 'Level', 'Created at', 'People', 'RoomID']
const columns: GridColDef[] = [
    {field: 'language', headerName: 'Language', width: 150, editable: false},
    {field: 'level', headerName: 'Level', width: 150, editable: false},
    {field: 'createdAt', headerName: 'Created at', width: 150, editable: false},
    {field: 'capacity', headerName: 'Capacity', width: 150, editable: false},
    {field: 'roomId', headerName: 'RoomID', width: 150, editable: false},
]

const rows = [
    {language: Language.ENGLISH, level: ProficiencyLevel.ADVANCED, capacity: 0, roomId: 1, createdAt: "10-09-2022"},
    {language: Language.SPANISH, level: ProficiencyLevel.BEGINNER, capacity: 0, roomId: 2, createdAt: "10-09-2022"},
    {language: Language.GERMAN, level: ProficiencyLevel.FLUENT, capacity: 0, roomId: 3, createdAt: "10-09-2022"},
    {language: Language.HUNGARIAN, level: ProficiencyLevel.NATIVE, capacity: 2, roomId: 4, createdAt: "10-09-2022"},
    {language: Language.GERMAN, level: ProficiencyLevel.ADVANCED, capacity: 1, roomId: 5, createdAt: "10-09-2022"},
    {language: Language.GERMAN, level: ProficiencyLevel.ADVANCED, capacity: 1, roomId: 6, createdAt: "10-09-2022"},
    {language: Language.GERMAN, level: ProficiencyLevel.ADVANCED, capacity: 2, roomId: 7, createdAt: "10-09-2022"},
    {language: Language.GERMAN, level: ProficiencyLevel.ADVANCED, capacity: 1, roomId: 8, createdAt: "10-09-2022"},
    {language: Language.FRENCH, level: ProficiencyLevel.ADVANCED, capacity: 1, roomId: 8, createdAt: "10-09-2022"},
]

let languagesList = rows.map((item) => item.language);
languagesList = languagesList.filter((item, index) => languagesList.indexOf(item) === index);

const languageOptions = languagesList.map((language) => {
    return <MenuItem value={language}>{language}</MenuItem>;
})

let levelList = rows.map((item) => item.level);
levelList = levelList.filter((item, index) => levelList.indexOf(item) === index);

const levelOptions = levelList.map((level) => {
    return <MenuItem value={level}>{level}</MenuItem>
})

const capacityOptions = [1, 2].map((capacity) => {
    return <MenuItem value={capacity}>{capacity}</MenuItem>
})

export const RoomFilter: React.FC<FilterProps> = (props) => {
    // const {data} = useDemoData({
    //     dataSet: 'Employee',
    //     visibleFields: VISIBLE_FIELDS,
    //     rowLength: 100,
    // })
    const [filterValues, setFilterValues] = React.useState<FilterState>({
        language: Language.GERMAN,
        level: ProficiencyLevel.BEGINNER,
        capacity: 1,
    });

    useEffect(() => {
        const timeOutId = setTimeout(() => setFilterValues(filterValues), 1500);
        return () => clearTimeout(timeOutId);
    }, [filterValues]);

    const filterHandler = (prop: keyof FilterState) => (event: React.ChangeEvent<HTMLInputElement> | any) => {
        setFilterValues({...filterValues, [prop]: event.target.value});
    }

    const clickHandler = (filterValues: FilterState) => {
        props.sendFilterInput(filterValues);
    }

    return (<div style={{display: "flex", justifyContent: "left", marginTop: "5px",}}>
        <TextField
            id="select-language"
            value={filterValues.language}
            label="Language"
            variant={"outlined"}
            select
            onChange={filterHandler('language')}
            sx={{
                marginBottom: 1,
                color: "#FFFFFF",
                height: '6ch',
                width: '12vw',
                maxWidth: '15vw',
                marginLeft: "10px",
                marginRight: "10px",
                backgroundColor: 'rgba(58, 80, 107, 0.7)',
                '& .MuiFormLabel-root': {
                    color: styleColors.formLabel,
                },
                '& .MuiSelect-select': {
                    color: styleColors.textInput,
                },
            }}
        >
            {languageOptions}
        </TextField>
        <TextField
            id="select-level"
            value={filterValues.level}
            label="Level"
            variant={"outlined"}
            select
            onChange={filterHandler('level')}
            sx={{
                marginBottom: 1,
                color: "#FFFFFF",
                height: '6ch',
                width: '12vw',
                maxWidth: '15vw',
                marginLeft: "10px",
                marginRight: "10px",
                backgroundColor: 'rgba(58, 80, 107, 0.7)',
                '& .MuiFormLabel-root': {
                    color: styleColors.formLabel,
                },
                '& .MuiSelect-select': {
                    color: styleColors.textInput,
                },
            }}
        >
            {levelOptions}
        </TextField>
        <TextField
            id="select-capacity"
            value={filterValues.capacity}
            label="Capacity"
            variant={"outlined"}
            select
            onChange={filterHandler('capacity')}
            sx={{
                marginBottom: 1,
                color: "#FFFFFF",
                width: '6vw',
                marginLeft: "10px",
                marginRight: "10px",
                backgroundColor: 'rgba(58, 80, 107, 0.7)',
                '& .MuiFormLabel-root': {
                    color: styleColors.formLabel,
                },
                '& .MuiSelect-select': {
                    color: styleColors.textInput,
                },
            }}
        >
            {capacityOptions}
        </TextField>
        <ApplyFilterButton onClick={() => clickHandler(filterValues)}>Apply</ApplyFilterButton>
    </div>)
}