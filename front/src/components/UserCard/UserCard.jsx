/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { createVoidZero } from "typescript";
import { addImage } from "services/userService";
import { notifySucess } from "services/notifyService";

export class UserCard extends Component {

  state = {
    selectedFile: null
  }

  fileSelectedHandler = event => {
    if (!event || !event.target.files[0]) return;
    let filename = event.target.files[0].name
    this.setState({
      selectedFile: event.target.files[0]
    })
    this.fileNameHint.innerHTML = "Foto selecionada: " + filename;
    this.uploadButton.style.display = "inline"
  }

  fileUploadHandler = () => {
    this.resizeImage();
    this.state.selectedFile = null
    this.uploadButton.style.display = "none"
    this.fileNameHint.innerHTML = "";
  }

  resizeImage() {
    if (!this.state.selectedFile) return;
    
    let fr = new FileReader();
    fr.onload = function () {
      var img = document.createElement("img");
      img.src = fr.result;
      img.onload = (ev) => {
        var canvas = document.createElement("canvas");
        var MAX_WIDTH = 150;
        var MAX_HEIGHT = 150;
        var width = img.width;
        var height = img.height;
        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        let dataurl = canvas.toDataURL(fr.type);
        this.profilePicture.src = dataurl;
        addImage(localStorage.getItem("token-contare"), dataurl, (msg) => {
          notifySucess("Foto de perfil atualizada com sucesso!");
        })
    }
    }.bind(this);
    fr.readAsDataURL(this.state.selectedFile);
  }

  render() {
    return (
      <div className="card card-user" id={this.props.id}>
        <div className="image">
          <img src={this.props.bgImage} alt="..." />
        </div>
        <div className="content">
          <div className="author">
            <a href={`/${this.props.userName}`}></a>
            <img
              onClick={() => this.fileInput.click()}
              className="avatar border-gray"
              src={this.props.avatar}
              alt="..."
              ref={profilePicture => this.profilePicture = profilePicture}
            />
            <div className="custom-file">
              <input
                style={{display: "none"}}
                type="file" 
                className="custom-file-input" 
                id="pictureFileInput"
                onChange={this.fileSelectedHandler}
                ref={fileInput => this.fileInput = fileInput}>
              </input>
              <div>
                <button
                  style={this.photoButtonStyle}
                  onClick={() => this.fileInput.click()}>Mudar foto</button>
                <button
                  style={this.confirmPhotoButtonStyle}
                  onClick={this.fileUploadHandler}
                  ref={uploadButton => this.uploadButton = uploadButton}>
                    Confirmar foto</button>
              </div>
              <span ref={fileNameHint => this.fileNameHint = fileNameHint}></span>
            </div>
            <h4 className="title">
              {this.props.name}
              <br />
              <small>{this.props.userName}</small>
            </h4>
          </div>
          <p className="description text-center">{this.props.description}</p>
        </div>
      </div>
    );
  }

  photoButtonStyle = {
    color: "white",
    margin: "10px",
    backgroundColor: "blue",
  }

  confirmPhotoButtonStyle = {
    color: this.photoButtonStyle.color,
    margin: this.photoButtonStyle.margin,
    backgroundColor: this.photoButtonStyle.backgroundColor,
    display: "none"
  }
}

export default UserCard;
