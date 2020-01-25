import React from "react"

class SendMessageForm extends React.Component{
    
    constructor(){
        super()
        this.state = {
            message: ""
        }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    handleChange(e){
        this.setState({
            message: e.target.value
        })
    }
    
    handleSubmit(e) {
        e.preventDefault();
        // console.log(this.state.message)
        this.props.sendMessage(this.state.message) // sending this.state.message to sendMessage func
        this.setState({
            message: ""
        })
    }
    
    render(){
        return(
            <form 
                className="send-message-form"
                onSubmit={this.handleSubmit}
            >
                <input 
                type="text"
                placeholder="Type message"
                value={this.state.message}
                onChange={this.handleChange}
                />
            </form>
        )
    }
}

export default SendMessageForm