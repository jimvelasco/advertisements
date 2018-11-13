import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import ImageDisplayObj from "../common/ImageDisplayObj";
import { getBusinessPhotos } from "../../actions/advertiseActions";
import { createImage } from "../../actions/advertiseActions";
import { deletePhoto } from "../../actions/advertiseActions";
import TextFieldGroup from "../common/TextFieldGroup";

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
    // let link = "/api/business/allimages/" + this.props.selectedBizid;
    // axios
    //   .get(link)
    //   // .then(res => console.log(res.data))
    //   .then(res => {
    //     console.log(res.data);
    //     this.setState({ photos: res.data });
    //     //this.logConsole();
    //     // console.log(res.data);
    //   })
    //   .catch(err => {
    //     //console.log(err.response.data);
    //     let errors = {};
    //     errors.errormsg = "Problem Getting Businesses";
    //     this.setState({ errors: errors });
    //   });
    this.props.getBusinessPhotos(this.props.selectedBizid);
  }

  componentWillReceiveProps(nextProps) {
    //console.log("manage photos current props ", this.props);
    //console.log("manage photos nextProps ", nextProps);
    if (this.props.selectedBizid != nextProps.selectedBizid) {
      this.props.getBusinessPhotos(nextProps.selectedBizid);
      // console.log("WE NEED TO REFRSH THE SCREEN WITH STATE OR SOMETHING");
      // console.log("this props ", this.props.advertise.images.length);
      // console.log("next props ", nextProps.advertise.images.length);
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

  deletePhoto(id) {
    this.props.deletePhoto(id);
  }

  onSubmit(e) {
    e.preventDefault();

    let formdata = new FormData();
    formdata.append("file", this.state.file);
    formdata.append("filename", "another");
    formdata.append("ownerid", this.props.selectedBizid);
    formdata.append("description", this.state.description);
    this.props.createImage(formdata);
  }

  render() {
    // if (this.state.photos.length ==)
    const { errors } = this.state;

    const userrole = this.props.auth.user.role;
    const bizid = this.props.selectedBizid;
    const name = this.props.selectedName;
    const photos = this.props.advertise.images;

    return (
      <div className="bordershadow">
        <h3 style={{ textAlign: "center" }}>Manage Photos</h3>
        <h4 style={{ textAlign: "center" }}>{name}</h4>

        {photos.map((photo, index) => (
          <div className="floatLeft" key={index}>
            <ImageDisplayObj obj={photo} />
            <a
              href="#"
              onClick={() => {
                this.deletePhoto(photo._id);
              }}
            >
              delete
            </a>
          </div>
        ))}

        <div style={{ clear: "left" }} />

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
