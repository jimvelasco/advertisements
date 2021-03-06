import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../common/Spinner";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import TextFieldGroup from "../common/TextFieldGroup";
import ImageDisplayObj from "../common/ImageDisplayObj";
import { getAdvertisements } from "../../actions/advertisementActions";
import { createAdvertisement } from "../../actions/advertisementActions";
import { modifyAdvertisement } from "../../actions/advertisementActions";
import { deleteAdvertisement } from "../../actions/advertisementActions";
import { changeAdvertisementStatus } from "../../actions/advertisementActions";
import { setCurrentAdvertisement } from "../../actions/advertisementActions";

import Modal from "react-responsive-modal";

class Advertisements extends Component {
  constructor(props) {
    super(props);
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;

    // console.log("tdate is ", today);
    this.state = {
      advertisements: [],
      advertisement: {},
      errors: {},
      file: null,
      fname: null,
      statusmsg: "",
      name: "",
      discount: "",
      description: "",
      new_or_update: "NEW",
      selectedAdvertisementId: null,
      startdate: today,
      enddate: "",
      winpos: 0,
      open: false
    }; //shuttles: ["one", "two", "three"] };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onRBChange = this.onRBChange.bind(this);
    this.onFileInputChange = this.onFileInputChange.bind(this);
  }

  componentDidMount() {
    // this.getAdvertisements();
    // console.log("advertisements props", this.props);
    let bizid = this.props.selectedBizid;
    this.props.getAdvertisements(bizid);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    //console.log("got to here1");
    if (this.props.selectedBizid !== nextProps.selectedBizid) {
      let bizid = nextProps.selectedBizid;
      // console.log("this props bizid", this.props.selectedBizid);
      // console.log("next props bizid", nextProps.selectedBizid);
      // console.log("getting advertisements for ", bizid);
      this.props.getAdvertisements(bizid);
    } else if (
      this.props.advertise.advertisement._id !==
        nextProps.advertise.advertisement._id ||
      this.props.advertise.advertisement.image._id !==
        nextProps.advertise.advertisement.image._id
    ) {
      //console.log("got to here4");
      let curad = nextProps.advertise.advertisement;
      // console.log("curad start ", curad.startdate);
      // console.log("curad start tostring ", curad.startdate.toDateString());
      this.setState({
        name: curad.name,
        discount: curad.discount,
        description: curad.description,
        startdate: curad.startdate,
        enddate: curad.enddate
      });
    } else {
      // this.setState({
      //   name: "",
      //   discount: "",
      //   description: "",
      //   startdate: "",
      //   enddate: "",
      //   new_or_update: "NEW"
      // });
    }

    //console.log("cdm");

    // let ypos = 0;
    // if (this.state.winpos) {
    //   ypos = this.state.winpos;
    // }
    // setTimeout(function() {
    //   window.scrollTo(0, ypos);
    // }, 20);
  }

  onOpenModal = () => {
    this.setState({
      name: "",
      discount: "",
      description: "",
      startdate: "",
      enddate: "",
      new_or_update: "NEW",
      open: true
    });
    // this.setState({ });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  componentDidUpdate() {
    // console.log("we just updated an advertisement");
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onRBChange(e) {
    this.setState({ new_or_update: e.target.value });
    // this.setState({ [e.target.name]: e.target.value });
  }
  onFileInputChange(e) {
    // console.log(e.target.files[0]);
    if (e.target.files[0]) {
      //let fileurlobj = URL.createObjectURL(e.target.files[0]);
      //console.log("file picked", e.target.files[0]);
      this.setState({
        file: e.target.files[0],
        //fileurl: fileurlobj,
        statusmsg: ""
      });
    }
  }
  onSubmit(e) {
    e.preventDefault();

    let sp = window.scrollY;
    this.setState({ winpos: sp });

    let curAdId = this.props.advertise.advertisement._id;

    let formdata = new FormData();
    formdata.append("advertisementId", curAdId);
    formdata.append("file", this.state.file);
    formdata.append("filename", "another");
    formdata.append("advertiserId", this.props.auth.user.id);
    formdata.append("businessId", this.props.selectedBizid);
    formdata.append("name", this.state.name);
    formdata.append("description", this.state.description);
    formdata.append("discount", this.state.discount);
    formdata.append("startdate", this.state.startdate);
    formdata.append("enddate", this.state.enddate);
    formdata.append("new_or_update", this.state.new_or_update);
    // console.log("formdata is ", formdata);

    // formdata.forEach((value, key) => {
    //   console.log(key + " " + value);
    // });

    if (this.state.new_or_update === "NEW") {
      this.props.createAdvertisement(formdata);
    } else {
      this.props.modifyAdvertisement(formdata);
    }

    // document.getElementById("advertisementform").reset();
  }

  deleteAdvertisement(adid) {
    // document.getElementById("advertisementform").reset();
    // alert("what");
    if (window.confirm("Are you sure you want to delete this Advertisement?")) {
      this.props.deleteAdvertisement(adid);
    } else {
      //alert("No");
    }
    // this.props.deleteAdvertisement(adid);
  }

  changeAdStatus = (e, adid, status) => {
    e.preventDefault();
    this.props.changeAdvertisementStatus(adid, status);
  };

  showModifyAd(e, adid) {
    e.preventDefault();
    // document.getElementById("advertisementform").reset();
    this.props.setCurrentAdvertisement(adid);
    this.setState({ file: null, new_or_update: "UPDATE", open: true });
  }

  render() {
    if (
      this.props.advertise.isloading &&
      this.props.advertise.page === "advertisements"
    ) {
      return <Spinner />;
    }

    if (this.props.advertise.advertisements.length == 0) {
      return (
        <h2 style={{ textAlign: "center", marginTop: "20px" }}>
          No advertisements exist for: {this.props.selectedName}
        </h2>
      );
    }

    const { errors } = this.state;
    const perrors = this.props.errors;
    const statusmsg = this.props.statusMsg.message;

    let advertisements = this.props.advertise.advertisements;
    let name = this.props.selectedName;
    const closeAdvertisements = this.props.closeAdvertisements;
    const new_or_update = this.state.new_or_update;

    // if (this.props.advertise.isLoading) {
    //   return <Spinner />;
    // }

    const { open } = this.state;

    // <Link to="/newbusiness" className="btn btn-sm btn-info">
    //   New Business
    // </Link>;

    return (
      <div
        id="addisplayarea"
        className="container shadow-lg p-4"
        style={{ marginTop: "20px" }}
      >
        <div style={{ textAlign: "left", float: "left" }}>
          <a
            className="btn btn-sm btn-info"
            href="#"
            onClick={() => {
              {
                {
                  this.onOpenModal();
                }
              }
            }}
          >
            New Advertisement
          </a>
        </div>
        <div style={{ textAlign: "right", float: "right" }}>
          <a
            className="btn btn-sm btn-info"
            href="#"
            onClick={() => {
              {
                {
                  closeAdvertisements();
                }
              }
            }}
          >
            Close
          </a>
        </div>

        <h4 style={{ textAlign: "center" }}>{name}</h4>
        <h5>Advertisements</h5>
        {/* {statusmsg && <div className="error-display">{statusmsg}</div>} */}

        <table className="table table-bordered table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              {/* <th>_id</th>*/}
              {/* <th>Id</th> */}
              {/* <th>Advertiser</th>
              <th>Business</th> */}
              <th>Name</th>
              <th>Description</th>
              <th>Discount</th>
              <th>Image</th>
              <th>Status</th>

              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {advertisements.map((advertisement, index) => (
              //link = `/delete-ad/${advertisement._id}`
              <tr key={advertisement._id}>
                {/* <td>{advertisement._id}</td> */}
                {/* <td>{advertisement.advertiserId}</td>
                <td>{advertisement.businessId}</td> */}
                <td>{advertisement.name}</td>
                <td>{advertisement.description}</td>
                <td>{advertisement.discount}</td>
                <td>
                  <ImageDisplayObj obj={advertisement.image} />
                </td>
                <td>{advertisement.status}</td>

                <td>
                  <a
                    href="#"
                    className="btn btn-sm btn-secondary btn-block"
                    onClick={e => {
                      this.showModifyAd(e, advertisement._id);
                    }}
                  >
                    modify
                  </a>

                  <a
                    href="#"
                    className="btn btn-sm btn-secondary btn-block"
                    onClick={e => {
                      this.changeAdStatus(
                        e,
                        advertisement._id,
                        advertisement.status
                      );
                    }}
                  >
                    status
                  </a>

                  <a
                    href="#"
                    className="btn btn-sm btn-secondary btn-block"
                    onClick={() => {
                      this.deleteAdvertisement(advertisement._id);
                    }}
                  >
                    delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="row">
          {/* <div className="col-md-10 offset-md-1 shadow p-4"> */}
          <div className="col-md-12  shadow xp-4">
            <Modal open={open} onClose={this.onCloseModal} center>
              <h5 style={{ marginTop: "5px", textAlign: "center" }}>
                Advertisement
              </h5>

              <form id="advertisementform" noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Name"
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Description"
                    placeholder="Description"
                    name="description"
                    value={this.state.description}
                    onChange={this.onChange}
                    error={errors.description}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Discount"
                    placeholder="Discount"
                    name="discount"
                    value={this.state.discount}
                    onChange={this.onChange}
                    error={errors.discount}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="date"
                    label="Start Date"
                    placeholder="Start Date"
                    name="startdate"
                    value={this.state.startdate}
                    onChange={this.onChange}
                    error={errors.startdate}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="date"
                    label="End Date"
                    placeholder="End Date"
                    name="enddate"
                    value={this.state.enddate}
                    onChange={this.onChange}
                    error={errors.enddate}
                  />
                </div>

                <div className="form-group">
                  <div className="row">
                    <div className="col-md-3">Image</div>
                    <div className="col-md-9">
                      <input
                        type="file"
                        name="file"
                        onChange={this.onFileInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-3">New/Update</div>
                    <div className="col-md-9">
                      <input
                        type="radio"
                        value="NEW"
                        checked={new_or_update === "NEW"}
                        name="neworupdate"
                        onChange={this.onRBChange}
                      />
                      &nbsp;New &nbsp;&nbsp;
                      <input
                        type="radio"
                        value="UPDATE"
                        checked={new_or_update === "UPDATE"}
                        disabled={new_or_update === "NEW"}
                        name="neworupdate"
                        onChange={this.onRBChange}
                      />
                      &nbsp;Update
                    </div>
                  </div>
                </div>
                {perrors && (
                  <div className="error-display">{perrors.message}</div>
                )}
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </Modal>
          </div>
          {/* end of form wrapper */}
        </div>
      </div>
    );
  }
}

//export default withRouter(Advertisements);
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  advertise: state.advertise,
  statusMsg: state.statusMsg
});

export default connect(
  mapStateToProps,
  {
    getAdvertisements,
    createAdvertisement,
    modifyAdvertisement,
    deleteAdvertisement,
    changeAdvertisementStatus,
    setCurrentAdvertisement
  }
)(withRouter(Advertisements));

//Advertisements;

// {/* <div class="row">
// <div className="col-md-3">Name</div>
// <div className="col-md-3">Description</div>
// <div className="col-md-3">Discount</div>
// <div className="col-md-3">Image</div>
// </div>

// {advertisements.map((advertisement, index) => (
// <div class="row" key={index}>
//   <div className="col-md-12">
//     <div className="row">
//       <div className="col-md-3">{advertisement.name}</div>
//     </div>
//     <div className="row">
//       <div className="col-md-3">
//         <a
//           href="#"
//           onClick={() => {
//             this.showModifyAd(advertisement._id);
//           }}
//         >
//           modify
//         </a>
//       </div>
//     </div>
//   </div>
// </div>
// ))} */}
