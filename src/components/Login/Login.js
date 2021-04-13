import React from 'react';
import 'antd/dist/antd.css';
import './Login.css';
import { Form, Input, Button, Card } from 'antd';
import { useHistory } from 'react-router-dom';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};


const Login = () => {
  const history = useHistory();
  document.title = 'Login';
  localStorage.setItem('loggedUser', null);
  localStorage.setItem('isLogged', false);



  const onFinish = (values) => {
    fetch("https://api.jotform.com/user/login", {
      body: `username=${values.username}&password=${values.password}&appName=deneme&access=full`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    })
      .then(response => response.json())
      .then(data => {
        if (data.responseCode === 200) {
          localStorage.setItem('loggedUser', JSON.stringify(data));
          localStorage.setItem('isLogged', true);
          history.push('/home');
        }
        else {
          console.log(data);
          console.log('BAŞARISIZ');
        }
      })

  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="background">
      <div className="blur">
        <Card className="loginCard"

          title="JotForm Login"
        >
          <div className="loginForm">
            <Form
              {...layout}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" className="loginButton" htmlType="submit" block>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;