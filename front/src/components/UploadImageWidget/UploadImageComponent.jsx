import React, { Component } from "react"
import {addImage} from '../../services/userService'
import {render} from `react-dom`

class UploadImageButton extends Component{
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            validated: false
        }
    }

    uploadWidget(){
        cloudinary.openUploadWidget({ cloud_name: 'contaremidia', upload_preset: 'preset', tags:['xmas']},
        function(error, result) {
            console.log(result);
        });
    }

    redirect = (path) => {
        this.props.history.push(path)
    }


    handleSubmit(event) {
        addImage()
    }

    render(){
        return(
            <div className="upload">
                <button onClick={this.uploadWidget.bind(this)} className="upload-button">
                    Add Image
                </button>
            </div>
        )
    }
}
render(<UploadImageButton />, document.getElementById('container')); // colocar o id correto aqui ;D