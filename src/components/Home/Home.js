import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import './Home.css';
import { Layout, Menu, Breadcrumb, Row, Col, Card, Avatar, Image, Input, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import {
  SearchOutlined,
  FileOutlined,
  AntDesignOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Home = () => {
  const history = useHistory();
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  const isLogged = localStorage.getItem('isLogged');

  const [avatarMenuVisibility, setAvatarMenuVisibility] = useState('hidden');

  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);

  if (isLogged === 'false') {
    history.push('/');
  }

  useEffect(async () => {
    if (loggedUser !== null) {
      document.title = 'Home';
      const response = await fetch(`https://api.jotform.com/user/forms?apikey=${loggedUser.content.appKey}`)
      const res = await response.json();
      setData(res.content);
      setRawData(res.content);
    }
  }, []
  )

  const onCollapse = isCollapsed => {
    setCollapsed(isCollapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Image src={'https://www.jotform.com/resources/assets/logo/jotform-logo-transparent-800x400.png'} preview={false} />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="9" icon={<FileOutlined />} >
            My Forms
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, backgroundColor: '#282F42' }}>
          <h1 style={{ color: 'white', marginLeft: 24 }}>Hoşgeldin {loggedUser !== null ? loggedUser.content.name : ''}</h1>
          <Avatar
            style={{ position: 'absolute', right: 24, top: 8 }}
            size={52}
            src={"https://i2.wp.com/cdn.jotfor.ms/assets/img/v4/avatar/Podo-Avatar2-04.png?ssl=1"}
            icon={<AntDesignOutlined />}
            onClick={() => avatarMenuVisibility === 'visible' ? setAvatarMenuVisibility('hidden') : setAvatarMenuVisibility('visible')}
          />
          <div style={{ visibility: avatarMenuVisibility }}>
            <Card className="avatarMenu">
              <Button type="danger" htmlType="submit" block
                onClick={() => {
                  history.push('/');
                }}
              >
                Logout
            </Button>
            </Card>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Row justify='space-between'>
            <Col>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item><h1><a href='/home'>My Forms</a></h1></Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col>
              <Input style={{ margin: '16px 0' }} placeholder="Formlarımda Ara" prefix={<SearchOutlined />} onChange={(event) => {
                setData(rawData.filter((form) => form.title.toUpperCase().includes((event.target.value).toUpperCase())));
              }}
                className="searchInput" />
            </Col>
          </Row>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360, overflowY: 'scroll', maxHeight: 730 }}>
            {
              data.filter((form) => form.status === 'ENABLED').map((form) => (
                <>
                  <Row style={{ padding: 4 }}>
                    <Col key={form.id}>
                      <Card hoverable={true} className='formCard' onClick={() => {
                        localStorage.setItem('formTitle', form.title);
                        history.push(`/submissions/${form.id}`);
                      }
                      }>
                        <div>
                          <Row>
                            <Col>
                              <Image src={'https://uxwing.com/wp-content/themes/uxwing/download/10-brands-and-social-media/google-forms.png'} width={50} preview={false} />
                            </Col>
                            <Col>
                              <Row>
                                <h1>{form.title}</h1>
                              </Row>
                              <Row>
                                <small>{form.count} Form Yanıtı.</small>
                                <small>Son Düzenlenme: {form.updated_at}</small>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </>
              ))
            }
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>JotForm Project 2021 February</Footer>
      </Layout>
    </Layout>
  );
}



export default Home;