import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import './Matchup.css';
import { Layout, Menu, Breadcrumb, Row, Col, Card, Avatar, Image, Input, Button } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import {
  SearchOutlined,
  FileOutlined,
  AntDesignOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Matchup = () => {
  const history = useHistory();
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  const isLogged = localStorage.getItem('isLogged');
  const formTitle = localStorage.getItem('formTitle');
  let { id } = useParams();

  const[avatarMenuVisibility, setAvatarMenuVisibility] = useState('hidden');
  const[isAvatarMouseOver, setIsAvatarMouseOver] = useState(false);
  const[isAvatarMenuMouseOver, setIsAvatarMenuMouseOver] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  if (isLogged === 'false') {
    history.push('/');
  }

  const onCollapse = isCollapsed => {
    setCollapsed(isCollapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Image src={'https://www.jotform.com/resources/assets/logo/jotform-logo-transparent-800x400.png'} preview={false} />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="9" icon={<FileOutlined />} onClick={() => history.push('/home')}>
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
            onMouseEnter={() => {
              setIsAvatarMouseOver(true);
              setAvatarMenuVisibility('visible');
            }}
            onMouseLeave={() => {
              setIsAvatarMouseOver(false);
              setAvatarMenuVisibility(isAvatarMenuMouseOver === true ? 'visible' : 'hidden');
            }}
          />
          <div style={{ visibility: avatarMenuVisibility }}> 
            <Card className="avatarMenu"
              onMouseEnter={() => {
                setIsAvatarMenuMouseOver(true);
                setAvatarMenuVisibility('visible');
              }}
              onMouseLeave={() => {
                setIsAvatarMenuMouseOver(false);
                setAvatarMenuVisibility(isAvatarMouseOver === true ? 'visible' : 'hidden');
              }}
            >
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
              <Breadcrumb.Item><h1><a href='/home'>My Forms</a> / <a href={`/submissions/${id}`}>{formTitle}</a> / Mathcup</h1></Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360, overflowY: 'scroll', maxHeight: 730 }}>
            <Card className='matchupCard'>

            </Card>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>JotForm Project 2021 February</Footer>
      </Layout>
    </Layout>
  );
}



export default Matchup;