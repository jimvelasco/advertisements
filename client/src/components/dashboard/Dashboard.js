import React, { Component } from "react";
import './Dashboard.css';

import BookForm from '../shuttles/BookForm.js';

class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard-wrap" >
        <div className="book-trip" >
          <div className="sub-title" >BOOK A TRIP</div>
          <div className="book-form">
            <BookForm />
          </div>
        </div>
        <div className="trips-progress" >
          <div className="sub-title" >TRIPS IN PROGRESS</div>
          <div className="trips-ip" ></div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
