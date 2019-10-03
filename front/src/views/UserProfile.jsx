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
import {updateUser, getUser} from 'services/userService'
import {notifyFailure, notifySucess} from 'services/notifyService'


class UserProfile extends Component {

  constructor(props) {
    super(props);

    this.handleUpdateUserProfile = this.handleUpdateUserProfile.bind(this)

  }

  handleUpdateUserProfile() {

    console.log(this.props.user);
    const token = localStorage.getItem("token-contare");
    console.log("localStorage: ", localStorage);
    console.log("Trying to get user with this token: ", token);
    let user = getUser(token);
    console.log(user);

    // const newName = document.getElementById('newName').value
    // const newPass = document.getElementById('newPass').value
    // const newPassConfirm = document.getElementById('newPassConfirm').value

    // if(newName == "" || newPass == "" || newPassConfirm == "") {
    //   notifyFailure("Preencha todos os campos corretamente!")
    // } else {
    //   if(newPass !== newPassConfirm) {
    //     notifyFailure("Senhas não conferem!")
    //   } else {
    //     let newUser = this.props.user
    //     newUser.name = newName
    //     newUser.password = newPass
    //     const token = localStorage.getItem('token-contare')
    //     updateUser(token, newUser, function(response){
    //       notifySucess("Perfil alterado com sucesso!")
    //       this.setState({ showEdit: false });
    //   }.bind(this))
    //   }
    // }
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
                          label: "Empresa (desativado)",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Empresa",
                          defaultValue: "Contare Ltda.",
                        },
                        {
                          label: "Usuário",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Usuário",
                          defaultValue: "rafaelpontes"
                        },
                        {
                          label: "Endereço de Email",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "Email"
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
                          defaultValue: "Rafael"
                        },
                        {
                          label: "Sobrenome",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Sobrenome",
                          defaultValue: "Pontes"
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
                          defaultValue:
                            "Avenida da Paz, número 234"
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
                          defaultValue: "Campina Grande"
                        },
                        {
                          label: "País",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "País",
                          defaultValue: "Brasil"
                        },
                        {
                          label: "CEP",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "CEP"
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
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button bsStyle="info" pullRight fill onClick={this.handleUpdateUserProfile}>
                      Atualizar Perfil
                    </Button>
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
                name="Rafael Pontes"
                userName="rafaelpontes"
                description={
                  <span>
                    "Um cara comum,
                    <br />
                    porém, financeiramente,
                    <br />
                    Contaresciente!"
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
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserProfile;
