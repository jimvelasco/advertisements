import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import ImageDisplayObj from "../common/ImageDisplayObj";
import { getBusinessPhotos } from "../../actions/advertiseActions";
import { createImage } from "../../actions/advertiseActions";
import { deletePhoto } from "../../actions/advertiseActions";
import TextFieldGroup from "../common/TextFieldGroup";
import Spinner from "../common/Spinner";

// we need to get into git

class ManagePhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      errors: {},
      file: null,
      fname: null,
      statusmsg: "",
      description: ""
    };
    // console.log("Dashboard props", props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFileInputChange = this.onFileInputChange.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    this.props.getBusinessPhotos(this.props.selectedBizid);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedBizid != nextProps.selectedBizid) {
      this.props.getBusinessPhotos(nextProps.selectedBizid);
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onFileInputChange(e) {
    // console.log(e.target.files[0]);
    if (e.target.files[0]) {
      //let fileurlobj = URL.createObjectURL(e.target.files[0]);
      this.setState({
        file: e.target.files[0],
        //fileurl: fileurlobj,
        statusmsg: ""
      });
    }
  }

  deletePhoto(e, id) {
    e.preventDefault();
    this.props.deletePhoto(id);
  }

  onSubmit(e) {
    e.preventDefault();

    let formdata = new FormData();
    formdata.append("file", this.state.file);
    formdata.append("filename", "another");
    formdata.append("advertiserId", this.props.auth.user.id);
    formdata.append("businessId", this.props.selectedBizid);
    formdata.append("description", this.state.description);
    this.props.createImage(formdata);
  }

  render() {
    // if (this.state.photos.length ==)
    const { errors } = this.state;
    const { advertise } = this.props;
    const perrors = this.props.errors;

    console.log("manage photos render advertise state", advertise);

    const userrole = this.props.auth.user.role;
    const bizid = this.props.selectedBizid;
    const name = this.props.selectedName;
    const photos = this.props.advertise.images;
    const closePhotos = this.props.closePhotos;
    if (
      this.props.advertise.isloading &&
      this.props.advertise.page === "photos"
    ) {
      return <Spinner />;
    }

    return (
      <div className="shadow p-4" style={{ marginTop: "20px" }}>
        <div style={{ textAlign: "right" }}>
          <a
            className="btn btn-sm btn-info"
            href="#"
            onClick={() => {
              {
                {
                  closePhotos();
                }
              }
            }}
          >
            close
          </a>
        </div>
        <h3 style={{ textAlign: "center" }}>Manage Photos: {name}</h3>
        {/* <h4 style={{ textAlign: "center" }}>{name}</h4> */}

        {photos.map((photo, index) => (
          <div className="floatLeft shadow" key={index}>
            <div style={{ textAlign: "right", paddingRight: "5px" }}>
              <a
                className="smallfont"
                href="#"
                onClick={e => {
                  this.deletePhoto(e, photo._id);
                }}
              >
                delete
              </a>
            </div>
            <ImageDisplayObj obj={photo} />
          </div>
        ))}

        <div style={{ clear: "left" }} />

        <div className="row">
          <div className="col-md-8 offset-md-2 shadow p-4 mt-3 ">
            <h5 style={{ textAlign: "center" }}>New Photo</h5>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextFieldGroup
                  type="text"
                  label="Name"
                  placeholder="Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
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
              <input type="submit" className="btn btn-info btn-block mt-4" />
            </form>
            {perrors && <div className="error-display">{perrors.message}</div>}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  advertise: state.advertise
});

export default connect(
  mapStateToProps,
  { getBusinessPhotos, createImage, deletePhoto }
)(ManagePhotos);
// export default ManagePhotos;
