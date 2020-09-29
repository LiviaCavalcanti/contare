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
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import defaultBgImg from "assets/img/default-user-profile-bg.jpeg";

import avatar from "assets/img/faces/face-1.jpg";

// New imports for communicating with backend
import { updateUser, getUser } from 'services/userService';
import { initializeConnection } from 'services/ConnectionService';
import { notifyFailure, notifySucess } from "services/notifyService";

class UserProfile extends Component {

  constructor(props) {
    super(props);
    this.handleUpdateUserProfile = this.handleUpdateUserProfile.bind(this)
    this.state = {
      user: null,
      bgImage: defaultBgImg,
      name: "",
      userName: "",
      description: ""
    }
    this.socket = initializeConnection();
  }

  componentDidMount() {
    this.updateUserFields(this.state.user);
    this.socket.on("updateprofile", function (user) {
      this.updateUserFields(user);
    }.bind(this));
  }

  async updateUserFields(user) {
    if (user == null) {
      user = await getUser(localStorage.getItem("token-contare"));
    }
    if (user == null || user === "undefined") return;
    let userFields = ["name", "lastName", "email", "username", "company", "address", "city", "country", "zip", "bio"] 
    userFields.forEach(field => {
      let element = document.getElementById(field)
      if (element) {
        if (user[field]) {
          element.value = user[field];
        } else {
          element.value = "";
        }
      }
    });

    // Password field
    if (user.isOAuth) {
      let passRow = document.getElementById("passwordRow");
      passRow.style.display = "none";
    }

    // UserCard fields (including picture)
    this.setState(function(oldState) {
      let img = (user.image == null || user.image.url == "NONE") ? avatar : user.image.url;
      return {
        bgImage: defaultBgImg,
        avatar: img,
        name: this.concatFullName(user),
        userName: user.username,
        description: user.bio
    }}.bind(this))
    
  }

  async handleUpdateUserProfile() {
    let fieldNames = ["name", "lastName", "email", "username", "company", "address", "city", "country", "zip", "password", "bio"] 
    let newFields = {}

    fieldNames.forEach(field => {
      newFields[field] = document.getElementById(field).value || ""
    })

    let sendOk = true;
    const token = localStorage.getItem("token-contare");
    let user = await getUser(token);
    if (!user.isOAuth) {
      // If not oauth, check for password fields
      let newpass = document.getElementById("newpassword").value;
      let newpass2 = document.getElementById("newpassword2").value;
      
      if (newFields['password'].length < 5) {
        // First, check for current password validity
        sendOk = false;
        notifyFailure("Senha inválida!");
      } else if(newFields["name"] == "") {
        notifyFailure("Obrigatório ter pelo menos o primeiro nome preenchido.")
      } else if (newpass != "" || newpass2 != "") { // Check if user wants to change password
          sendOk = false; // Set ok to false until all validations are met.
          if (newpass != newpass2) {
            notifyFailure("Campos de nova senha não conferem!");
          } else if (newpass.length < 5) {
            notifyFailure("Senha precisa ter pelo menos 5 caracteres!");
          } else {
            newFields["newpassword"] = newpass;
            // Can send new password
            sendOk = true;
          }
      }
    }

    if (sendOk) {
      const token = localStorage.getItem('token-contare')
        updateUser(token, newFields, function() {
          this.updateUserFields();
      }.bind(this))
    }
  }

  concatFullName(user) {
    if (user) {
      let fullName = user.name
      if (user.lastName) {
        fullName += " " + user.lastName
      }
      return fullName
    }
    return ""
  }

  render() {
    return (
      <div className="content admin-flex-container-content">
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                title="Editar Perfil"
                content={
                  <form>
                    <FormInputs
                      ncols={["col-md-5", "col-md-3", "col-md-4"]}
                      properties={[
                        {
                          label: "Empresa",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Empresa",
                          id: "company"
                        },
                        {
                          label: "Usuário",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Usuário",
                          id: "username",
                          autocomplete:"off"
                        },
                        {
                          label: "Endereço de Email",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "Email",
                          id: "email",
                          style: {pointerEvents: "none"},
                          disabled: true,
                          autocomplete:"off"
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-6", "col-md-6"]}
                      properties={[
                        {
                          label: "Primeiro Nome",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Primeiro Nome",
                          id: "name"
                        },
                        {
                          label: "Sobrenome",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Sobrenome",
                          id: "lastName"
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-12"]}
                      properties={[
                        {
                          label: "Endereço",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Endereço Residencial",
                          id: "address"
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-4", "col-md-4", "col-md-4"]}
                      properties={[
                        {
                          label: "Cidade",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Cidade",
                          id: "city"
                        },
                        {
                          label: "País",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "País",
                          id: "country"
                        },
                        {
                          label: "CEP",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "CEP",
                          id: "zip"
                        }
                      ]}
                    />
                    <Row>
                      <Col md={6}>
                        <FormGroup controlId="formControlsTextarea">
                          <ControlLabel>Sobre mim</ControlLabel>
                          <FormControl
                            rows="2"
                            componentClass="textarea"
                            bsClass="form-control"
                            placeholder="Sua descrição"
                            defaultValue=""
                            id="bio"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row id={"passwordRow"}> {/* Begin of row with passwords. */}
                    <FormGroup>
                      <Col md={4}>
                          <FormInputs ncols={["col-md-12"]}
                            properties={[{
                              label: "Senha Atual (Campo obrigatório)",
                              type: "password",
                              bsClass: "form-control",
                              placeholder: "Para alterar dados, digite sua senha.",
                              defaultValue: "",
                              id: "password"
                            }]}
                          />
                      </Col>
                      <Col md={4}>
                        <FormInputs ncols={["col-md-12"]}
                          properties={[{
                            label: "Caso queira mudar a senha, preencha a seguir",
                            type: "password",
                            bsClass: "form-control",
                            placeholder: "Nova senha.",
                            defaultValue: "",
                            id: "newpassword"
                          }]}
                        />
                        <FormInputs ncols={["col-md-12"]}
                          properties={[{
                            label: "Confirme a nova senha",
                            type: "password",
                            bsClass: "form-control",
                            placeholder: "Cópia da nova senha.",
                            defaultValue: "",
                            id: "newpassword2"
                          }]}
                        />
                      </Col>
                      </FormGroup>
                    </Row> {/* End of row with passwords. */}
                    <Row className={"row align-items-center"}>
                      <Col md={2}>
                        <Button bsStyle="info" pullRight fill onClick={this.handleUpdateUserProfile}>
                          Atualizar Perfil
                        </Button>
                      </Col>
                    </Row>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
            <Col md={4}>
              <UserCard
                bgImage={this.state.bgImage}
                avatar={this.state.avatar}
                name={this.state.name}
                userName={this.state.userName}
                description={
                  <span>
                    {this.state.description}
                  </span>
                }
                socials={
                  <div>
                    <Button simple>
                      <i className="fa fa-facebook-square" />
                    </Button>
                    <Button simple>
                      <i className="fa fa-twitter" />
                    </Button>
                    <Button simple>
                      <i className="fa fa-google-plus-square" />
                    </Button>
                  </div>
                }
                id={"usercard"}
                ref={this.userCard}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserProfile;
