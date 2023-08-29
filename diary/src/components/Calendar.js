/*
    2/
        새로고침 눌러야 showlist에 반영됨!
    3/
        클릭한 날짜 구해서 해당 날짜에 list 등록
    4/
        firebase에 저장된 사진 불러오기
*/

// https://eunhee-programming.tistory.com/267 참고

// firebase 연결
import {db} from '../firebase/index';
import {collection, onSnapshot, doc, getDocs} from '@firebase/firestore';

//import * as React from 'react';
import  React,{Component} from 'react';

import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import './Calendar.css'


export default class Calendar extends Component {
    constructor(props){
        super(props);
        
        // 오늘 날짜 구하기
        this.today = {
            year : new Date().getFullYear(),
            month : new Date().getMonth() + 1,
            date : new Date().getDate(),
            day : new Date().getDay()
        };

        this.state = {
            //선택한 날짜
            selectedYear: this.today.year,
            selectedMonth: this.today.month,
            selectedDate: this.today.date,
            selectedDay: this.today.day,

            // 이미지 있는 날짜 저장
            dateWithImages: {},

            //렌더링 상태
            changed: false,

            //데이터 저장
            memos: [],
        };

        // DB 연결 객체 
        this.memosCollectionRef = collection(db, 'memos');
    
        // DB에 입력할 날짜
        this.date = new Date();
        this.now_date = this.date.getFullYear() + ' - ' + (this.date.getMonth()+1) + ' - ' + this.date.getDate();
        this.now_time = this.date.getHours() + ' : ' + this.date.getMinutes();
                
        this.week = [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT' ];
    }

    ////    달력 만들기     ////
    handleDateClick = (day) => {
        this.setState({
            selectedDate: day
        })
    }

    // 선택한 달의 마지막 날짜
    getdateTotalCount = () => {
        const {selectedYear, selectedMonth} =  this.state;
        return new Date(selectedYear, selectedMonth, 0).getDate();
    };

    // 이전 달
    prevMonth = () => {
        const { selectedYear, selectedMonth } = this.state;

        if (selectedYear === 1){
            this.setState({
                selectedMonth: 12,
                selectedYear: selectedYear - 1,
            }); 
        }else {
            this.setState({selectedMonth: selectedMonth - 1 });
        }
    };

    // 다음 달
    nextMonth = () => {
        const { selectedYear, selectedMonth } = this.state;

        if (selectedYear === 1){
            this.setState({
                selectedMonth: 12,
                selectedYear: selectedYear + 1,
            });
            } else {
                this.setState({selectedMonth: selectedMonth + 1 });
            }
    };

    // 연도 고르기
    yearControl = () => {
        const {selectedYear} = this.state;

        let yearArr = [];
        const startYear = this.state.selectedYear - 10;
        const endYear = this.state.selectedYear + 10;

        for (var i = startYear; i < endYear+1; i++){
            yearArr.push(
                <option key={i} value={i}>
                    {i}
                </option>
            );
        }
        return(
            <span>{selectedYear}</span>
        );
    };

    // 달 고르기
    monthControl = () => {
        const { selectedMonth, selectedYear } = this.state;

        let nextMonth = selectedMonth + 1;
        let nextYear = selectedYear;

        if(nextMonth > 12) {
            nextMonth = 1;
            nextYear += 1;
        };

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        return(
            <span> {months[nextMonth - 2]} </span>
        )
    };

    getchangeSelectYear = (e) => { 
        this.setState({ selectedYear: Number(e.target.value) });
    };

    changeSelectMonth = (e) => {
        this.setState({ selectedMonth: Number(e.target.value) });
    };

    // 달력 - 요일
    returnWeek = () => {
        const weekendStyle = {
            color: '#D6879F'
        };

        let weekArr = [];
        this.week.forEach((v)=>{
            weekArr.push(
                <div
                    className = " weekday "
                    style = {v === "SUN" ? weekendStyle : (v === "SAT" ? weekendStyle : null)}
                >
                    {v}
                </div>
            );
        });
        return weekArr;
    };

    // 달력 - 날짜
    returnDay = () => {
        const { selectedYear, selectedMonth, dateWithImages } = this.state;
        const dateTotalCount = this.getdateTotalCount();

        const todayStyle = {
            backgroundColor: '#DCE1F2',
            fontWeight: 'bold',
            color: '#444078'
        };

        const dayArr = [];
        for (const nowDay of this.week) {
            const day = new Date(
                selectedYear, 
                selectedMonth - 1, 
                1
            ).getDay();

            if ( this.week[day] === nowDay ) {
                for ( var i = 0; i < dateTotalCount; i++) {
                    const currentDate = new Date(selectedYear, selectedMonth - 1, i + 1);
                    
                    const dayStyle = {
                        //오늘 날짜
                        ...(this.today.year === selectedYear &&
                        this.today.month === selectedMonth &&
                        this.today.date === i + 1
                            ? todayStyle
                            : {}),
                    };

                    dayArr.push(
                        <div
                            key={i + 1}
                            className = "weekday"
                            // 날짜 클릭 핸들러
                            onClick={() => this.handleDateClick(i +1 )}
                            style={ dayStyle }
                        >
                            <Button size='small'>
                                { i + 1 }
                            </Button>
                        </div>
                    );
                }
            } else{
                dayArr.push(
                    <div className="weekday"></div>
                );
            }
        }
        return dayArr;
    };

    // CRUD : Read, firebase 데이터베이스 리스너 설정
    async componentDidMount(){
        this.getMemos();

        const memosRef = collection(db, 'memos');
        onSnapshot(memosRef, (snapshot) => {
            const memos = [];
            const dateWithImages = {};

            snapshot.forEach((doc)=>{
                const memo = doc.data();
                memos.push(memo);

                const memoDate = memo.date;
                if (!dateWithImages[memoDate]) {
                    dateWithImages[memoDate] = true;
                }
            })
            this.setState({ memos, dateWithImages });
        });

        this.renderAddClass();
    }

    getMemos = async() => {
        const data = await getDocs(this.memosCollectionRef);

        const memoDate = [];
        data.forEach((doc) =>{
            memoDate.push(doc.data());
        })

        const memos = data.docs.map(doc => ({...doc.data(), id: doc.id}));
        this.setState({memos, changed: false});
    };

    //날짜에 일정있으면 이미지 추가
    renderAddClass = () =>{
        const weekday = document.querySelectorAll('.weekday button');
        
        
        weekday.forEach((dayitems)=>{

            const memosRef = collection(db, 'memos');
            onSnapshot(memosRef, (snapshot) => {
                snapshot.forEach((doc)=>{
                    if(this.AddClassFilter(new Date(doc.data().date), dayitems)){
                        dayitems.parentNode.classList.add('active');
                    }
                })
            })
        })
    }

    //일정 날짜 비교
    AddClassFilter = (itemDates, dayitemsdata) =>{
        const SelectYM = document.querySelectorAll('.SelectYear_SelectMonth span');
        const months_en = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const months = [
            '1', '2', '3', '4', '5', '6',
            '7', '8', '9', '10', '11', '12'
        ];
        let saveMonthIndex = '';

        if(itemDates.getFullYear() === Number(SelectYM[1].innerText)){

           for(let x=0; x<months_en.length; x++){
                if(SelectYM[0].innerText.split(' ')[0] === months_en[x]){
                    saveMonthIndex=months[x];
                    break;
                }
           }

            if(itemDates.getMonth()+1 === Number(saveMonthIndex)){
                if(itemDates.getDate() === Number(dayitemsdata.innerText)){
                    return true;
                }
            }

        }
        return false;
    }

    render() {
        const {selectedYear, selectedMonth, selectedDate, selectedDay, memos} = this.state;

        const filteredMemos = memos.filter((value) => {
            if (value.date) {
                const valueDate = new Date(value.date);
                return(
                    selectedDate &&
                    //Date 객체인지 확인하고, 그 후에 getDate() 호출
                    selectedDate instanceof Date &&
                    valueDate.getDate() === selectedDate.getDate() &&
                    valueDate.getMonth() === selectedDate.getMonth() &&
                    valueDate.getFullYear() === selectedDate.getFullYear()
                );
            }
            return false;
        });

        return( 
            <div style={{
                backgroundColor: '#DCE1F2',
                width: '100vw',
                height: '100vh',
                overflowX: 'hidden' // 가로 스크롤 제거
            }}>
                <div>
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
                            className='SelectYear_SelectMonth'
                            style={{
                                fontSize: 'large', 
                                color: '#444078',
                            }}
                        >
                            {this.monthControl()} {' '}
                            {this.yearControl()}
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
                            backgroundColor: '#fff',
                            margin: '0 2rem',
                            borderRadius: '0.5rem',
                            height: 'max-content',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)', // 요일 칸 수
                                gap: '0.5rem', // 요일 사이 간격
                                textAlign: 'center',
                                justifyContent: 'center',
                                padding: '1rem 0',
                                color: '#787C9C',
                            }}
                        >
                            {this.returnWeek()}
                        </div>
                        <div 
                            className="date" 
                            style={{ 
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                gap: '0.5rem',
                                padding: '1rem',
                                height: '25rem',
                                //width: '100%',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden'
                            }}
                        >
                            {this.returnDay()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}