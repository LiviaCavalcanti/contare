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
import {updateUser, getUser} from 'services/userService';
import { initializeConnection } from 'services/ConnectionService';


class UserProfile extends Component {

  constructor(props) {
    super(props);
    this.handleUpdateUserProfile = this.handleUpdateUserProfile.bind(this)
    this.state = {
      user: null
    }
    initializeConnection();
  }

  componentDidMount() {
    this.updateUserFields(this.state.user)
  }

  async updateUserFields(user) {
    if (user == null) {
      user = await getUser(localStorage.getItem("token-contare"));
    }
    console.log("Updating user fields in page with this obj: %o.", user)
    let userFields = ["name", "lastName", "email", "username", "company", "address", "city", "country", "zip"] 
    userFields.forEach(field => {
      let element = document.getElementById(field)
      if (element) {
        element.value = user[field] || "";
      }
    });
  }



  async handleUpdateUserProfile() {
    const token = localStorage.getItem("token-contare");
    let user = await getUser(token);

    // Reading fields
    let fieldNames = ["name", "lastName", "email", "username", "company", "address", "city", "country", "zip", "password"] 
    let newFields = {}
    fieldNames.forEach(field => {
      newFields[field] = document.getElementById(field).value || ""
    })

    if(newFields["name"] == "" || newFields["email"] == "" || newFields["password"] == "") {
      //notifyFailure("Preencha todos os campos corretamente!")
      alert("Preencher pelo menos os campos de nome, email e senha com alguma coisa.")
    } else {
        console.log("This is the user I got: %o", user);
        const token = localStorage.getItem('token-contare')
        updateUser(token, newFields, function(response) {
          console.log("Received this res from op: %o", response);
          this.updateUserFields(newFields);
          //notifySucess("Perfil alterado com sucesso!")
          alert("Perfil alterado com sucesso!")
      }.bind(this))
    }
  }

  render() {
    return (
      <div className="content">
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
                          id: "username"
                        },
                        {
                          label: "Endereço de Email",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "Email",
                          id: "email"
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
                      <Col md={12}>
                        <FormGroup controlId="formControlsTextarea">
                          <ControlLabel>Sobre mim</ControlLabel>
                          <FormControl
                            rows="5"
                            componentClass="textarea"
                            bsClass="form-control"
                            placeholder="Sua descrição"
                            defaultValue="Agora, serei uma pessoa financeiramente consciente. :)"
                            id="bio"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={8}>
                        <FormGroup>
                          <FormInputs ncols={["col-md-8"]}
                            properties={[{
                              label: "Senha",
                              type: "password",
                              bsClass: "form-control",
                              placeholder: "Para alterar dados, digite sua senha.",
                              defaultValue: "",
                              id: "password"
                            }]}
                          />
                        </FormGroup>
                      </Col>
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
                //bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                bgImage={defaultBgImg}
                avatar={avatar}
                name=""
                userName=""
                description={
                  <span>
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
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserProfile;
