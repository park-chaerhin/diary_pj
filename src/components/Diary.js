// firebase 연결
import {db} from '../firebase/index';
import {collection,addDoc} from '@firebase/firestore';

import * as React from 'react';
import {Component} from 'react';

import Logo from '../images/MEMO-removebg-preview.png'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import TextField from '@mui/material/TextField';
import { Paper } from '@mui/material';
import Chip from '@mui/joy/Chip';

import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';

export default class Memo extends Component{
    constructor(props){
        super(props);
        this.state = {
            //오늘 날짜
            value: dayjs(),
            newListTitle: '',
            newListContent: '',
        }
        //현재 시간
        this.date = new Date();
        this.time = this.date.getHours() + ' : ' + this.date.getMinutes();
    }

    handleChange = (newValue) => {
        this.setState({ value: newValue });
    };

    createList = async () => {
        //데이터 가져오기
        const selectedDate = this.state.value;
        const title = this.state.newListTitle;
        const content = this.state.newListContent;
        //현재 시간
        this.date = new Date();
        const time = this.date.getHours() + ' : ' + this.date.getMinutes();

        //Firebase에 데이터 추가
        try {
            const  docRef = await addDoc(collection(db, 'memos'), {
                // 문자형식으로 날짜 저장
                date: selectedDate.format(),
                title: title,
                content: content,
                time: time
            });
            console.log(docRef);

            alert('저장되었습니다~');

            //데이터 추가 후 폼 초기화
            this.setState({
                newListTitle: '',
                newListContent: ''
            });
        } catch (error) {
            console.log('a');
            console.log(error);
        }
    }
    
    handleTitleChange = (event) => {
        this.setState({ newListTitle: event.target.value })
    }

    handleContentChange = (event) => {
        this.setState({ newListContent: event.target.value })
    }
    

    render(){
        return(
            <div
                style={{
                    backgroundColor: "#DCE1F2",
                    width: '100vw',
                    height: '100vh',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <img
                    src={Logo}
                    alt='logo'
                    style={{
                        width: '10rem',
                        height: '10rem'
                    }}
                />

                <div 
                    className='container'
                    style={{
                        display: 'inline-grid',
                        textAlign: 'center',
                        width: '50vw',
                        height: 'min-content',
                        backgroundColor: '#fff',
                        borderRadius: '0.5rem',
                        padding: '2rem',
                        position: 'fixed',
                        bottom: '60px',
                    }}
                >
                    <LocalizationProvider  
                        dateAdapter={AdapterDayjs}
                        locale="en"
                        style={{
                            height: '1rem'
                        }}
                    >
                        <DatePicker
                            value={this.state.value}
                            onChange={this.handleChange}
                            style={{
                                padding: '0'
                            }}
                        />
                    </LocalizationProvider>
                    
                    <TextField
                        placeholder='제목'
                        variant='standard'
                        size='small'
                        required
                        style={{
                            width: '30vw',
                            height: '3rem',
                            marginTop: '1rem'
                        }}
                        value={this.state.newListTitle}
                        onChange={this.handleTitleChange}
                    />

                    <Paper
                        variant="outlined"
                        square
                        sx={{
                            '& .MuiTextField-root': { width: '25ch' },
                        }}
                        noValidate
                        style={{
                            height: '10rem',
                            padding: '1rem',
                            marginBottom: '1rem'
                        }}
                    >
                        <TextField 
                            placeholder='지금을 기록해요'
                            variant='standard'
                            margin='none'
                            multiline
                            maxRows={4}
                            required
                            style={{
                                width: '100%',
                                height: '9rem',
                            }}
                            value={this.state.newListContent}
                            onChange={this.handleContentChange}
                        />
                        <Chip
                            color="neutral"
                            onClick={function(){}}
                            size="sm"
                            style={{
                                display: 'flex'
                            }}
                        > 
                            {this.time} 
                        </Chip>
                    </Paper>

                    <Button
                        variant="outlined" 
                        startIcon= { <CreateIcon /> }
                        style={{
                            width: '5rem',
                            alignSelf: 'center',
                            margin: 'auto'
                        }}
                        onClick={this.createList}
                    >
                        ADD
                    </Button>
                </div>
            </div>
        )
    }
}