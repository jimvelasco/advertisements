import React, { Component } from "react";

import { connect } from "react-redux";

import { triggerError, triggerStatus } from "../../actions/advertiseActions";

class TestLinks extends Component {
  constructor(props) {
    super(props);
    this.triggerError = this.triggerError.bind(this);
    this.triggerStatus = this.triggerStatus.bind(this);
  }

  triggerError() {
    console.log("trigger error called");
    this.props.triggerError();
  }
  triggerStatus() {
    this.props.triggerStatus();
  }

  // componentDidMount() {
  //   console.log("status message did mount component did mount ", this.props);
  //   this.setState({ statusmessage: this.props.status.message });
  //   //if (!this.props.advertise.businesses) {
  //   //  console.log("component did mount getting businesses");
  //   // this.getBusinesses();
  //   //}
  // }
  // componentWillReceiveProps(nextProps) {
  //   console.log("register componentWillReceiveProps");
  //   console.log("current props ", this.props);
  //   console.log("nextProps ", nextProps);
  //   this.setState({ statusmessage: nextProps.status.message });
  //   if (nextProps.status.message) {
  //     this.showMessage();
  //   }
  //   //this.showMessage();
  //   // if (nextProps.errors) {
  //   //   this.setState({ errors: nextProps.errors });
  //   //   // setState triggers a render
  //   // }
  // }

  // clearMessage() {
  //   clearTimeout(messageTimer);
  //   this.setState({ statusmessage: null });

  //   this.props.clearStatusMessage();
  // }

  // showMessage() {
  //   // const what = setTimeout(() => {
  //   //   this.setState({ statusmessage: null }), 1000)
  //   // }

  //   // setTimeout(
  //   //   function() {
  //   //     this.props.clearStatusMessage();
  //   //   }.bind(this),
  //   //   3000
  //   // );

  //   messageTimer = setTimeout(
  //     function() {
  //       this.clearMessage();
  //     }.bind(this),
  //     3000
  //   );

  //   // }
  //   // setTimeout(this.setState({ statusmessage: null }), 1000);
  // }
  render() {
    // const { errors } = this.props;
    // const statusmessage = this.state.statusmessage;

    return (
      <div>
        <a
          href="#"
          onClick={() => {
            this.triggerError();
          }}
        >
          trigger
        </a>
        &nbsp;|&nbsp;
        <a
          href="#"
          onClick={() => {
            this.triggerStatus();
          }}
        >
          status
        </a>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  status: state.status
});

export default connect(
  mapStateToProps,
  { triggerError, triggerStatus }
)(TestLinks);
