import React, { Component } from 'react';
import {  HashRouter as Router,  Route,  NavLink} from 'react-router-dom';
import './App.css';

class Item extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            items: []
        };
        this.aceSort = this.aceSort.bind(this);
        this.decSort = this.decSort.bind(this);
    }
    componentDidMount() {
        fetch('backend.php')
        .then( (response) => response.json())
        .then((responseJson) => {
            this.setState({
                items: responseJson
            });
        });
    }
    aceSort(event, sortKey){
        const items = this.state.items;
        items.sort((a,b) => a[sortKey].localeCompare(b[sortKey]))
        this.setState({items})
    }
    decSort(event, sortKey){
        const items = this.state.items;
        items.sort((a,b) => b[sortKey].localeCompare(a[sortKey]))
        this.setState({items})
    }
    render(){
        return(
            <div><h5>Click table Header to sort Data</h5>
            <table>
            <thead>
            <tr>
            <th>Employee ID</th>
            <th onClick={e => this.aceSort(e, 'firstname')}>First Name</th>
            <th onClick={e => this.decSort(e, 'lastname')}>Last Name</th>
            <th onClick={e => this.decSort(e, 'position')}>Position</th>
            <th onClick={e => this.aceSort(e, 'age')}>Age</th>
            <th>Description</th>
            </tr>
            </thead>
            <tbody>
            {this.state.items.map(employee =>
                <tr key={employee.employeeID}>
                <td>{employee.employeeID} </td>
                <td>{employee.firstname} </td>
                <td>{employee.lastname}</td>
                <td>{employee.position}</td>
                <td>{employee.age}</td>
                <td>{employee.description}</td>
                </tr>
            )}
            </tbody>
            </table>
            </div>
        );
    }
}

class Search extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            items: [],
            searchInput: ''
        };
    }
    componentDidMount() {
        fetch('backend.php')
        .then( (response) => response.json())
        .then((responseJson) => {
            this.setState({
                items: responseJson
            });
        });
    }
    searchItem(){
        fetch("backend.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                method:'search',
                input: this.refs.input.value
            })
        }).then(response => response.json())
        .then(responseJson => {
            console.log(responseJson);
            this.setState({
                items: responseJson
            });
            return;
        })
        .catch((error) => {
            throw (error);
        });
    }
render(){
    return(
        <div>
        <table>
        <thead><tr>
        <th><input
        type='text'
        ref="input"
        placeholder="Search Items"
        name='input'
        required onKeyUp={() => this.searchItem()}/>
        </th>
        </tr>
        <tr>
        <th>Employee ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Position</th>
        <th>Age</th>
        <th>Description</th>
        </tr>
        </thead>
        <tbody>
        {this.state.items.map(employee =>
            <tr key={employee.employeeID}>
            <td>{employee.employeeID} </td>
            <td>{employee.firstname} </td>
            <td>{employee.lastname}</td>
            <td>{employee.position}</td>
            <td>{employee.age}</td>
            <td>{employee.description}</td>
            </tr>
        )}
        </tbody>
        </table></div>
    );
}
}
//
class Edit extends React.Component{
    constructor(props){
        super(props)
        this.addItem = this.addItem.bind(this);
        this.state = {
            items: [],
            firstname:'',
            lastname:'',
            position:'',
            age:'',
            description:'',
            id:'',
            isEdit:0
        }
    }
    componentDidMount() {
        fetch('backend.php')
        .then( (response) => response.json())
        .then((responseJson) => {
            this.setState({
                items: responseJson
            });
        });
    }

    updateRecord(){
        console.log(this.state.id);
        fetch("backend.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                method:'update',
                id:  this.state.id,
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                position: this.state.position,
                age: this.state.age,
                description:this.state.description
            })
        }).then(response => response.json())
        .then(responseJson => {
            console.log(responseJson);
            this.setState({
                items: responseJson
            });
            return;
        })
        .catch((error) => {
            throw (error);
        });
    }

    deleteRecord(employee){
        console.log(employee.employeeID);
        fetch('backend.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method:'delete',
                id: employee.employeeID
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                items: responseJson
            });
            return;
        })
        .catch((error) => {
            throw (error);
        });
    }
    addItem(){
        fetch("backend.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                method:'insert',
                id:'',
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                position: this.state.position,
                age: this.state.age,
                description:this.state.description
            })
        }).then(response => response.json())
        .then(responseJson => {
            console.log(responseJson);
            this.setState({
                items: responseJson
            });
            return;
        })
        .catch((error) => {
            throw (error);
        });
    }
    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }
    onUpdate(employee){
        this.setState({
            id: employee.employeeID,
            isEdit:1,
            firstname: employee.firstname,
            lastname: employee.lastname,
            position: employee.position,
            age: employee.age,
            description:employee.description
        });
    }
    render(){
        let commandButton = <button type="button" onClick={() => this.addItem()}>ADD</button>;
        if(this.state.isEdit !== 0){
            commandButton = <button type="button" onClick={() => this.updateRecord()}>EDIT</button>;
        }
        return(
            <div>
            <table>
            <thead>
            <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Position</th>
            <th>Age</th>
            <th>Description</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td>New</td>
            <td><input
            type='text'
            placeholder="Enter First Name"
            name='firstname'
            required
            value={this.state.firstname}
            onChange={this.onChange} /> </td>
            <td><input
            type='text'
            placeholder="Enter Last Name"
            name='lastname'
            required
            value={this.state.lastname}
            onChange={this.onChange} /></td>
            <td><input
            type='text'
            placeholder="Enter Position"
            name='position'
            required
            value={this.state.position}
            onChange={this.onChange} /></td>
            <td><input
            type='text'
            placeholder="Enter your age"
            name='age'
            required
            value={this.state.age}
            onChange={this.onChange} /></td>
            <td><input
            type='text'
            name='description'
            placeholder="Enter Description"
            required
            value={this.state.description}
            onChange={this.onChange} /></td>
            <td>{commandButton}
            </td>
            </tr>
            {this.state.items.map(employee =>
                <tr key={employee.employeeID}>
                <td>{employee.employeeID} </td>
                <td>{employee.firstname} </td>
                <td>{employee.lastname}</td>
                <td>{employee.position}</td>
                <td>{employee.age}</td>
                <td>{employee.description}</td>
                <td><button type="button"  onClick={() => this.onUpdate(employee)}>Edit</button></td>
                <td><button type="button"  onClick={() => this.deleteRecord(employee)}>Delete</button></td>
                </tr>
            )}
            </tbody>
            </table></div>
        );
    }
}

class About extends React.Component{
    render(){
        return(
            <div>This is Employee Management System helps administration to Manage the employee details</div>
        );
    }
}

class App extends Component {
    render() {
        return (
            <Router>
            <div>
            <header>
            <ul>
            <li><NavLink exact to = "/items">Items</NavLink></li>
            <li><NavLink to = "/search">Search</NavLink></li>
            <li><NavLink to = "/edit">Edit</NavLink></li>
            <li><NavLink to = "/about">About</NavLink></li>
            </ul>
            </header>
            <Route exact path="/items" component={Item}/>
            <Route path="/search/:input" component={Search}/>
            <Route path="/search" component={Search}/>
            <Route path="/edit" component={Edit}/>
            <Route path="/about" component={About}/>
            <footer>
            <div>&copy; Copyright 2018</div>
            </footer>
            </div>
            </Router>
        );
    }
}

export default App;
