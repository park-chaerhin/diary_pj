// firebase 연결
import {db} from '../firebase';
import {collection, doc, getDocs, deleteDoc, query, orderBy} from '@firebase/firestore';

import * as React from 'react';
import {Component} from 'react';

/**  MUI  **/
import Typography from '@mui/joy/Typography';

import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';

import Button from '@mui/material/Button';
import IconButton from '@mui/joy/IconButton';

import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {timelineOppositeContentClasses} from '@mui/lab/TimelineOppositeContent';

// import Chip from '@mui/joy/Chip';

import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

export default class ExampleTextareaComment extends Component {
    constructor(props){
        super(props);
        this.state = {
            memos: [],
            selectedYear: new Date().getFullYear(),
            selectedMonth: new Date().getMonth() +1,
        };
    }

    async componentDidMount() {
        await this.loadMemos();
    }

    async componentDidUpdate(prevProps, prevState) {
        if (
            prevState.selectedYear !== this.state.selectedYear ||
            prevState.selectedMonth !== this.state.selectedMonth
        ) {
            await this.loadMemos();
        }
    }

    getMonthName (monthNumber) {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[monthNumber - 1];
    }

    getDayName (dayNumber) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return dayNames[dayNumber];
    }

    prevMonth = () => {
        const currentDate = new Date(this.state.selectedYear, this.state.selectedMonth - 1, 1);
        currentDate.setMonth(currentDate.getMonth() - 1);
        this.setState({
            selectedYear: currentDate.getFullYear(),
            selectedMonth: currentDate.getMonth() + 1,
        });
    };

    nextMonth = () => {
        const currentDate = new Date(this.state.selectedYear, this.state.selectedMonth - 1, 1);
        currentDate.setMonth(currentDate.getMonth() + 1);
        this.setState({
            selectedYear: currentDate.getFullYear(),
            selectedMonth: currentDate.getMonth() + 1,
        });
    };

    async loadMemos() {
        try {
            const querySnapshot = await getDocs(collection(db, 'memos'));
            const sortedMemos = querySnapshot.docs
            .map((doc) => {
                const data = doc.data();
                return {...data, id: doc.id};
            })
            .filter((memo) => {
                const memoDate = new Date(memo.date);
                return (
                    memoDate.getFullYear() === this.state.selectedYear &&
                    memoDate.getMonth() + 1 === this.state.selectedMonth
                );
            })
            .sort((a,b) => a.date.localeCompare(b.date));
            this.setState({ memos: sortedMemos });
        } catch (error) {
            console.log(error);
        }
    };

    formatDate (date) {
        const options = { month: 'short', day: 'numeric'};
        return new Date(date).toLocaleDateString('en-US', options);
    };

    async handleDelete (id) {
        const confirmDelete = window.confirm('삭제하시겠습니까?');
        
        if (confirmDelete) {
            try {
                const memoRef = doc(db, 'memos', id);
                await deleteDoc(memoRef); 
            
                // 삭제한 데이터를 제외하고 업데이트
                const updatedMemos = this.state.memos.filter(
                    (memo) => memo.id !== id
                ); 
                this.setState({ memos: updatedMemos });

                alert('삭제되었습니다 ~')
            } catch (error) {
                console.log( error );
            }
        }
    };


    render () {
        const { memos, selectedYear, selectedMonth } = this.state;
        let previousDate = ''; // 이전에 출력된 날짜 저장 변수
        const selectedMonthName = this.getMonthName(selectedMonth);
        // 일.월.화.. 순서
        const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();

        return (
            <div
                style={{
                    backgroundColor: '#DCE1F2',
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                    justifyContent: 'center', //세로
                    alignItems: 'center' //가로
                }}
            >
                <div className="title" 
                    style={{ 
                        display: "flex", 
                        width: '100vw',
                        padding: '1rem 0',
                        justifyContent: 'center',
                        alignItems: 'center' //세로중앙정렬
                    }}
                >
                    <Button 
                        variant="text" 
                        onClick={this.prevMonth}
                        style={{
                            fontSize: 'large', 
                            color: '#444078',
                        }}
                    >
                        ◀
                    </Button>
                    <h3
                        style={{
                            fontSize: 'large', 
                            color: '#444078',
                        }}
                    >
                        {selectedMonthName} {' '}
                        {selectedYear}
                    </h3>
                    <Button 
                        variant="text" 
                        onClick={this.nextMonth}
                        style={{fontSize: 'large', color: '#444078'}}
                    >
                        ▶
                    </Button>
                </div>

                <div
                    style={{
                        height: '100vh',
                        margin: '0px 2rem',
                        borderRadius: '0.5rem',
                        backgroundColor: '#fff',
                        overflow: 'scroll',
                        //WebkitOverflowScrolling: 'auto'
                    }}
                >
                    <div
                        style={{
                            width: '100%'
                        }}
                    >
                        {memos.map((memo, index) => {
                            const memoDate = new Date(memo.date);
                            const currentDayName = this.getDayName(memoDate.getDay());
                            const currentDate = `${currentDayName}, ${this.formatDate(memo.date)}`;
                            const shouldDisplayDate = currentDate !== previousDate;

                            if (shouldDisplayDate) {
                                previousDate = currentDate;
                            }

                            return (
                                <div 
                                    key={index}
                                    style={{
                                        //display: 'flex',
                                        width: '100%'
                                    }}
                                >
                                    {shouldDisplayDate && (
                                        <div
                                            style={{ 
                                                margin: '1rem 1.8rem',
                                                minWidth: '100px',
                                                fontWeight: 'bold',
                                                color: '#444078'
                                            }}
                                        >
                                            {currentDate}
                                        </div>
                                    )}
                                    <Timeline
                                        sx={{
                                            [`& .${timelineItemClasses.root}:before`]: {
                                            flex: 0,
                                            padding: 0,
                                            },
                                        }}
                                        style={{
                                            //width: '70%'
                                            margin: '0',
                                            padding: '0 2rem'
                                        }}
                                    >
                                        <TimelineItem>
                                            <TimelineSeparator>
                                                <TimelineDot
                                                    variant="outlined"
                                                    style={{
                                                        color: '#444078',
                                                        margin: 0
                                                    }}
                                                />
                                                <TimelineConnector
                                                    style={{
                                                        color: '#444078'
                                                    }}
                                                />
                                            </TimelineSeparator>
                                            <TimelineContent
                                                style={{
                                                    color: '#444078',
                                                    padding: '0 16px',
                                                    display: 'flex'
                                                }}
                                            >
                                                <div>
                                                    <div>{memo.time}</div>
                                                    <div>{memo.content}</div>
                                                </div>
                                                <IconButton
                                                    size='sm'
                                                    //variant='solid'
                                                    onClick={() => {this.handleDelete(memo.id)}}
                                                >
                                                    <DeleteForeverOutlinedIcon  />
                                                </IconButton>
                                            </TimelineContent>
                                        </TimelineItem>
                                    </Timeline>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}