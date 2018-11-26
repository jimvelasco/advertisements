import React, { Component } from "react";

import { connect } from "react-redux";

import { clearStatusMessage } from "../../actions/advertiseActions";

let messageTimer = null;

class StatusMessage extends Component {
  constructor(props) {
    super(props);
    // console.log("Businesses props", props);
    this.state = {
      statusmessage: null
    }; //shuttles: ["one", "two", "three"] };
    // this.getAdvertisements = this.getAdvertisements.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    // let messageTimer = null;
  }

  componentDidMount() {
    //console.log("status message did mount component did mount ", this.props);
    this.setState({ statusmessage: this.props.statusMsg.message });
    // let sp = window.scrollY;
    // console.log("cdm status message position is ", sp);
    //if (!this.props.advertise.businesses) {
    //  console.log("component did mount getting businesses");
    // this.getBusinesses();
    //}

    // setTimeout(function() {
    //   window.scrollTo(0, sp);
    // }, 20);
  }
  componentWillReceiveProps(nextProps) {
    // console.log("register componentWillReceiveProps");
    // console.log("current props ", this.props);
    // console.log("nextProps ", nextProps);
    // this.setState({ statusmessage: nextProps.status.message });
    if (nextProps.statusMsg.message) {
      this.setState({ statusmessage: nextProps.statusMsg.message });

      this.showMessage();
    }
    //this.showMessage();
    // if (nextProps.errors) {
    //   this.setState({ errors: nextProps.errors });
    //   // setState triggers a render
    // }
  }

  clearMessage() {
    clearTimeout(messageTimer);
    this.setState({ statusmessage: null });

    this.props.clearStatusMessage();
  }

  showMessage() {
    messageTimer = setTimeout(
      function() {
        this.clearMessage();
      }.bind(this),
      3000
    );

    // }
    // setTimeout(this.setState({ statusmessage: null }), 1000);
  }
  render() {
    const { errors } = this.props;
    const statusmessage = this.state.statusmessage;

    //let sp = localStorage.getItem("scrollpos");
    //console.log("the scroll during render is position is ", sp);
    let ptop = window.scrollY;
    let itop = 60 + ptop; //parseInt(localStorage.getItem("scrollpos"));

    //style={{top:}}

    return (
      <div>
        {statusmessage ? (
          <div className="statusmessage" style={{ top: itop }}>
            {statusmessage}
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  statusMsg: state.statusMsg
});

export default connect(
  mapStateToProps,
  { clearStatusMessage }
)(StatusMessage);
