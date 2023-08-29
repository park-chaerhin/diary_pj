import './App.css';
import React,{Component} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import FixedBottomNavigation from './components/Navigation';
import Diary from './components/Diary';
import Calendar from './components/Calendar';
import List from './components/List';


export default class App extends Component {
  render(){
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Diary />}></Route>
          <Route path="/Calendar" element={<Calendar />}></Route>
          <Route path="/List" element={<List />}></Route>
        </Routes>  

        <FixedBottomNavigation />
      </BrowserRouter>
    );
  }
}