import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottary from './lottary'

class App extends Component {
 state={
   manager: '',
   players: [],
   balance:'',
   value:'',
   message: '',
   winner:''
 }
  async componentDidMount(){
    const manager= await lottary.methods.manager().call();
    const players = await lottary.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottary.options.address);
    this.setState({manager: manager, players: players, balance: balance})
  }
  submit= async event =>{
   event.preventDefault();
   const accounts = await web3.eth.getAccounts();
   this.setState({message: 'waiting on transaction ...'})
   await lottary.methods.enter().send({
     from: accounts[0],
     value: web3.utils.toWei(this.state.value, 'ether')
   })
   this.setState({message: 'u have been entered'})
  }
  onClick = async event =>{
   const accounts = await web3.eth.getAccounts();
   this.setState({message: 'Waiting on transaction success...'})
   await lottary.methods.pickWinner().send({
     from: accounts[0]
   });
   const winner = await lottary.methods.getLastWinner().call();
   this.setState({winner: winner})
   this.setState({message: 'a winner has been picked'})
  }
  render() {
    // web3.eth.getAccounts().then(console.log)
    return (
      <div>
        <h2>lottary Contract</h2>
        <p>this contract is managed by: {this.state.manager }. <br />
        there are currrently {this.state.players.length } competing to win
        { web3.utils.fromWei(this.state.balance, 'ether' )} ether!</p>
        <hr/>
        <form onSubmit={this.submit}>
         <h4>Want to try your luck</h4>
         <div>
         <label>How much you wanna bet?</label>
         <input
         value= {this.state.value}
         onChange={event=>this.setState({value: event.target.value})}
         />
         </div>
         <button>Enter</button>

        </form>
        <hr />
        <h1>{this.state.message}</h1>
        <hr/>
        <h4>Ready to pick a winner</h4>
        <button onClick = {this.onClick}>Pick a winner</button>
        <p>The winner is ... {this.state.winner}</p>
        <hr/>
      </div>
      
    );
  }
}

export default App;
