import React, {PropsWithChildren, useEffect} from "react";
import {GridColDef} from "@mui/x-data-grid"
import {MenuItem, TextField} from "@mui/material";
import {FilterState, Language, ProficiencyLevel} from "../Types";
import {ApplyFilterButton, DiscardFilterButton, DiscardFormButton} from "./FormButton";
import {capacityOptions, languageOptions, levelOptions} from "../Utils";


interface FilterProps extends PropsWithChildren {
    state?: FilterState;
    sendFilterInput: (state: FilterState) => void;
}


const styleColors: any = {
    textInput: 'rgba(255,255,255,0.7)',
    formLabel: '#858B97',
}

export const RoomFilter: React.FC<FilterProps> = (props) => {

    const [filterValues, setFilterValues] = React.useState<FilterState>({
        language: Language.GERMAN,
        proficiencyLevel: ProficiencyLevel.BEGINNER,
        capacity: 1,
        filter: true,
    });

    useEffect(() => {
        const timeOutId = setTimeout(() => setFilterValues(filterValues), 1500);
        return () => clearTimeout(timeOutId);
    }, [filterValues]);

    const filterHandler = (prop: keyof FilterState) => (event: React.ChangeEvent<HTMLInputElement> | any) => {
        setFilterValues({...filterValues, [prop]: event.target.value});
    }

    const filterDispatcher = () => {
        setFilterValues({...filterValues, filter: true});
        props.sendFilterInput({
            language: filterValues.language,
            proficiencyLevel: filterValues.proficiencyLevel,
            capacity: filterValues.capacity,
            filter: true,
        });
    }
    const filterRemover = ()=>{
        setFilterValues({...filterValues, filter: false});
        // console.log(filterValues)
        props.sendFilterInput({
            language: Language.GERMAN,
            proficiencyLevel: ProficiencyLevel.BEGINNER,
            capacity: 1,
            filter: false,
        });
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
            {languageOptions()}
        </TextField>
        <TextField
            id="select-level"
            value={filterValues.proficiencyLevel}
            label="Level"
            variant={"outlined"}
            select
            onChange={filterHandler('proficiencyLevel')}
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
            {levelOptions()}
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
            {capacityOptions()}
        </TextField>
        <ApplyFilterButton  style={{
            width: '5rem',
        }} onClick={() => filterDispatcher()}>Apply</ApplyFilterButton>
        <DiscardFilterButton style={{
            border: "1px solid #FFFFFF80",
            width: '5rem',
        }} onClick={()=> filterRemover()}>Remove</DiscardFilterButton>
    </div>)
}