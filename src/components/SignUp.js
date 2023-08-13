import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';

function CreateUser() {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [first_name, setFirst_name] = useState("")
  const [last_name, setLast_name] = useState("")

  const handleChangePassword = (e)=> {
    e.preventDefault()
    setPassword(e.target.value);
  }

  const handleChangeEmail = (e)=> {
    e.preventDefault()
    setEmail(e.target.value);
  }
  const handleChangeFirst_name = (e)=> {
    e.preventDefault()
    setFirst_name(e.target.value);
  }

  const handleChangeLast_name = (e)=> {
    e.preventDefault()
    setLast_name(e.target.value);
  }
  const handleSubmit = () =>{
    const data = {"first_name": first_name, "last_name": last_name, "email": email, "password": password}
    fetch("http://44.212.67.79/createuser",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    })
    console.log(data)
  }
    return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>First name</Form.Label>
        <Form.Control type="text"  onChange={handleChangeFirst_name} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Last name</Form.Label>
        <Form.Control type="text" placeholder="Enter email" onChange={handleChangeLast_name} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={handleChangeEmail} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={handleChangePassword}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    </Form>
  );
}

export default CreateUser;