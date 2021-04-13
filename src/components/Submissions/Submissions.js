import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import './Submissions.css';
import { Layout, Menu, Breadcrumb, Row, Col, Avatar, Image, Tag, Table, Button, Modal, Dropdown, Card } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import Stack from '../../Models/Stack';
import Department from '../../Models/Department';
import Student from '../../Models/Student';
import {
  FileOutlined,
  AntDesignOutlined,
  DownOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Submissions = () => {
  const history = useHistory();
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  const isLogged = localStorage.getItem('isLogged');
  const formTitle = localStorage.getItem('formTitle');
  let { id } = useParams();

  const tagColors = ['#2DB7F5', '#87D068', '#EE89E0', '#B3C463', '#89EE9C', '#BFC5C0', '#FF6D4D']

  const [collapsed, setCollapsed] = useState(false);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [matchUpButton, setMatchUpButton] = useState(false);
  const [gpaColumnName, setGpaColumnName] = useState('Select GPA Column');
  const [preferedDepertmantName, setPreferedDepertmantName] = useState('Select Prefered Department Column');
  const [isMatchupVisible, setIsMatchupVisible] = useState(false);
  const[avatarMenuVisibility, setAvatarMenuVisibility] = useState('hidden');

  function startMatching() {
    const depts = new Set();
    dataSource.forEach(element => {
      element.forEach(element2 => {
        if (element2.text === preferedDepertmantName && Array.isArray(element2.answer)) {
          element2.answer.forEach(prefDept => {
            prefDept = prefDept.replaceAll(' ', '');
            let tmp = undefined;
            if (prefDept.indexOf('(') !== -1) {
              tmp = new Department(prefDept.substring(prefDept.indexOf(':') + 1, prefDept.indexOf('(')), parseInt(prefDept.substring(prefDept.indexOf('(') + 1, prefDept.indexOf(')'))));
            }
            else {
              tmp = new Department(prefDept.substring(prefDept.indexOf(':') + 1), -1);
            }
            depts.add(tmp);
          })
        }
      });
    });

    let tmp = new Set();
    depts.forEach(element => {
      if (tmp.has(element.getName()))
        depts.delete(element);
      tmp.add(element.getName());
    })

    let students = new Stack();

    dataSource.forEach(subs => {
      let newStudent = new Student();
      subs.forEach(subProps => {
        if (subProps.name.toLowerCase().includes('name')) {
          newStudent.setName(subProps.prettyFormat);
        }
        if (subProps.text === gpaColumnName) {
          newStudent.setGpa(parseFloat(subProps.answer));
        }
        if (subProps.text === preferedDepertmantName) {
          newStudent.setPreferenceList(subProps.answer);
        }
        newStudent.setJson(subs);
      })
      students.push(newStudent);

    });

    while (!students.isEmpty()) {
      let tmpS = students.pop();
      var Break = {};

      try {
        if(Array.isArray(tmpS.getPreferenceList())){
          tmpS.getPreferenceList().forEach(prefDept => {
            depts.forEach(aDept => {
              if(prefDept.includes(aDept.getName())) {
                let isAdded = aDept.addStudent(tmpS);
                if(isAdded) {
                  if(aDept.isDepartmentOverloaded()) {
                    let removedStudent = aDept.getTakenStudents().pop();
                    students.push(removedStudent);
                    throw Break;
                  }
                  else {
                    throw Break;
                  }
                }
                else
                  return;
              }
            })
          })
        }
      }
      catch(e) {
        if (e !== Break) throw e;
      }
      

    }

    setIsMatchupVisible(true);
    setDataSource(Array.from(depts));
    onCancel();
  
  }

  const menuGpaColumns = (
    <Menu>
      {
        columns.map((col) => {
          return <Menu.Item><a target="_blank" rel="noopener noreferrer" onClick={() => setGpaColumnName(col.title)}>{col.title}</a></Menu.Item>
        })
      }
    </Menu>
  );

  const menuDepartmentColumns = (
    <Menu>
      {
        columns.map((col) => {
          return <Menu.Item><a target="_blank" rel="noopener noreferrer" onClick={() => setPreferedDepertmantName(col.title)}>{col.title}</a></Menu.Item>
        })
      }
    </Menu>
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const onCancel = () => {
    setGpaColumnName('Select GPA Column')
    setPreferedDepertmantName('Select Prefered Department Column')
    setIsModalVisible(false);
  };

  const parseMyString = (myJson) => {
    let departments = [];
    let myString = myJson.answer;

    if (typeof myJson.answer === 'string') {
      myString = myString.replaceAll('[', '');
      myString = myString.replaceAll(']', '');
      myString = myString.replaceAll('{', '');
      myString = myString.replaceAll('}', '');
      myString = myString.replaceAll('"', '');
      myString = myString.replaceAll(':', ': ');
      myString = myString.replaceAll('amp;', '');

      let comaIndex = myString.indexOf(',');
      while (comaIndex !== -1) {
        let dept = myString.substring(0, comaIndex);
        departments.push(dept);
        myString = myString.substring(comaIndex + 1);
        comaIndex = myString.indexOf(',');
      }

      departments.push(myString);

      myJson.answer = departments;
    }

  }

  if (isLogged === 'false') {
    history.push('/');
  }

  useEffect(async () => {
    if (loggedUser !== null) {
      document.title = 'Submissions';
      const response = await fetch(`https://api.jotform.com/form/${id}/submissions?apiKey=${loggedUser.content.appKey}`)
      const res = await response.json();

      if (res.content.length > 0) {
        setMatchUpButton(true);
        setColumns(Object.values(res.content[0].answers)
          .filter((ans) => ans.name !== undefined && !ans.name.includes('submit') && !ans.type.includes('head') && !ans.type !== 'control_text')
          .sort((a, b) => a.order - b.order)
          .map((ans) => {
            return {
              title: ans.text,
              dataIndex: ans.name,
              render: (p1, p2) => {
                const int = p2.findIndex(p => p.name === ans.name);

                if (p2[int].cfname !== undefined && p2[int].answer !== undefined) {
                  parseMyString(p2[int]);
                }

                if (int === -1) {
                  return <span color='red'>unknown</span>
                }

                if (typeof p2[int].answer === 'string') {
                  return <span>{p2[int].answer}</span>
                }

                if (Array.isArray(p2[int].answer)) {
                  return p2[int].answer.map((ans, index) => {
                    if (p2[int].text === 'Prefered Departments') {
                      if (ans.indexOf('(') !== -1 && ans.indexOf(')') !== -1)
                        return <Tag color={tagColors[int]} style={{ margin: 1 }}>{index + 1 + ') ' + ans.substring(0, ans.indexOf('('))}</Tag>
                      return <Tag color={tagColors[int]} style={{ margin: 1 }}>{index + 1 + ') ' + ans}</Tag>
                    }
                    return <Tag color={tagColors[int]} style={{ margin: 1 }}>{ans}</Tag>
                  })
                }
                if (p2[int].name.toLowerCase().includes('date'))
                  return <span>{Object.values(p2[int].answer).join('/')}</span>

                if (p2[int].answer !== undefined)
                  return <span>{Object.values(p2[int].answer).join(' ')}</span>
              }
            }
          })
        );

        let data2 = res.content.filter(ans => !!ans.answers);
        data2 = data2.map((item) => Object.values(item.answers));
        data2 = data2.sort((a, b) => a.order - b.order);

        setDataSource(data2);
      }

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
          <Menu.Item key="9" icon={<FileOutlined />} onClick={() => history.push('/home')}>
            My Forms
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, backgroundColor: '#282F42' }}>
          <h1 style={{ color: 'white', marginLeft: 24 }}>Hoşgeldin {loggedUser.content.name}</h1>
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
        <Content style={{ margin: '0 16px', minHeight: 360, overflowY: 'scroll', maxHeight: 800 }}>
          <Row justify='space-between'>
            <Col>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item><h1><a href='/home'>My Forms</a> / <a href={'/submissions/'+id}>{formTitle}</a></h1></Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col style={{ margin: '16px 0' }}>
              <Button style={{ width: 120 }} disabled={!matchUpButton} type='primary' onClick={() => setIsModalVisible(true)}>
                MatchUp
              </Button>
              <Modal title="Matching Options" visible={isModalVisible} onOk={() => { setIsMatchupVisible(true); onCancel(); }} onCancel={() => onCancel()}
                footer={[
                  <Button
                    key="reset" type='danger' onClick={() => {
                      onCancel();
                      setIsModalVisible(true);
                    }
                    }>
                    Reset
                  </Button>,
                  <Button
                    key="cancel" onClick={() => onCancel()}>
                    Cancel
                  </Button>,
                  <Button key="okey" type='primary' onClick={() => startMatching()}>
                    OK
                  </Button>,
                ]}

              >
                <Row>
                  <Dropdown overlay={menuGpaColumns} placement="bottomLeft" arrow>
                    <Button>{gpaColumnName}</Button>
                  </Dropdown>
                </Row>
                <Row>
                  <Dropdown overlay={menuDepartmentColumns} placement="bottomLeft" arrow>
                    <Button style={{ marginTop: 8 }} >{preferedDepertmantName}</Button>
                  </Dropdown>
                </Row>
              </Modal>
            </Col>
          </Row>
          <div>
            {
              isMatchupVisible === true ?
                dataSource.map(dept => {
                  let matchupData = [];
                  dept.getTakenStudents().forEach(x => {
                    matchupData.push(x.getJson());
                  })
                  return <Table scroll={{ x: 'calc(700px + 50%)', y: 590 }} title={() => <b>{'Department: ' + dept.getName() + ' Quota: ' + dept.getQuota()}</b>} columns={columns} dataSource={matchupData} />
                })  :
                <Table scroll={{ x: 'calc(700px + 50%)', y: 590 }} columns={columns} dataSource={dataSource} />
            }
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>JotForm Project 2021 February</Footer>
      </Layout>
    </Layout>
  );
}



export default Submissions;