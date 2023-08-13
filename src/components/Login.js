import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';
import Dashboard from './Dashboard'
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [res, setres] = useState("")
  //const [user, setuser] = useState("")

  const navigate = useNavigate()
  const handleChangePassword = (e)=> {
    e.preventDefault()
    setPassword(e.target.value);
  }

  const handleChangeEmail = (e)=> {
    e.preventDefault()
    setEmail(e.target.value);
  }
  const handleSubmit = async(e) =>{
    e.preventDefault()
    const data = {"email": email, "password": password}
    let response = await fetch("http://127.0.0.1:8000/login",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data),
      config: {"credentials": true}})

      let json_data = await response.json()
      setres(json_data["msg"])
      if(json_data)
        {
          localStorage.setItem("auth_token", json_data["access"])
        }
        console.log(json_data)

      if(json_data["msg"] == "Login Success")
      {
        navigate("/")
      }
  }
    return (
    <div className='login'>
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={handleChangeEmail} />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
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
      New user<Link to={"/register"}>Register</Link>
    </Form>
    </div>
  );
}

export default Login;