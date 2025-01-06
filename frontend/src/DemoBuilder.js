import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router';
import axios from 'axios';
import './DemoBuilder.css';
import { Container, Table, Button, Form } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


function DemoBuilder() {
    return (
        <Router>
            <Container bg="dark" fluid="sm">
                <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
                <Navbar.Brand href="/home">Demo Builder</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav
                  activeKey="/home"
                  onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
                >
                  <NavDropdown title="Manage Segments Menu" id="nav-dropdown">
                    <NavDropdown.Item href="/add-segment">Add Segment</NavDropdown.Item>
                    <NavDropdown.Item href="/list-segment">List Segments</NavDropdown.Item>
                    <NavDropdown.Item href="/delete-segment">Delete Segments</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Manage Requester Menu" id="nav-dropdown">
                    <NavDropdown.Item href="/add-requester-user">Add Requester</NavDropdown.Item>
                    <NavDropdown.Item href="/list-requester-user">List Requesters</NavDropdown.Item>
                    <NavDropdown.Item href="/delete-requester-user">Delete Requesters</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Manage Admins Menu" id="nav-dropdown">
                    <NavDropdown.Item href="/add-admin-user">Add Admin</NavDropdown.Item>
                    <NavDropdown.Item href="/list-admin-user">List Admins</NavDropdown.Item>
                    <NavDropdown.Item href="/delete-admin-user">Delete Admins</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Manage Projects Menu" id="nav-dropdown">
                     <NavDropdown title="Projects Requests" id="nav-dropdown">
                        <NavDropdown.Item href="/add-project-request">Add Project Request</NavDropdown.Item>
                        <NavDropdown.Item href="/list-project-request">List Project Requests</NavDropdown.Item>
                        <NavDropdown.Item href="/delete-project-request">Delete Project Request</NavDropdown.Item>
                        <NavDropdown.Item href="/approve-project-request">Approve Project Requests</NavDropdown.Item>
                     </NavDropdown>
                     <NavDropdown title="Active Projects" id="nav-dropdown">
                        <NavDropdown.Item href="/add-active-project">Add Active Project</NavDropdown.Item>
                        <NavDropdown.Item href="/list-active-projects">List Active Projects</NavDropdown.Item>
                        <NavDropdown.Item href="/delete-active-project">Delete Active Project</NavDropdown.Item>
                     </NavDropdown>
                     <NavDropdown title="Archived Projects" id="nav-dropdown">
                        <NavDropdown.Item href="/list-archive-project">List Archived Projects</NavDropdown.Item>
                     </NavDropdown>
                  </NavDropdown>
                  <Nav.Item>
                    <Nav.Link href="/add-requester-user">Something else</Nav.Link>
                  </Nav.Item>
                </Nav>
                </Navbar.Collapse>
                </Navbar>
                <Routes>
                    <Route path="/home" element={<ShowHomePage />} />
                    <Route path="/add-requester-user" element={<AddRequesterUserPage />} />
                    <Route path="/list-requester-user" element={<ListRequesterUserPage />} />
                    <Route path="/delete-requester-user" element={<DeleteRequesterUserPage />} />
                    <Route path="/add-admin-user" element={<AddAdminUserPage />} />
                    <Route path="/list-admin-user" element={<ListAdminUserPage />} />
                    <Route path="/delete-admin-user" element={<DeleteAdminUserPage />} />
                    <Route path="/add-project-request" element={<AddProjectRequestPage />} />
                    <Route path="/list-project-request" element={<ListProjectRequestPage />} />
                    <Route path="/delete-project-request" element={<DeleteProjectRequestPage />} />
                    <Route path="/approve-project-request" element={<ApproveProjectRequestPage />} />
                    <Route path="/add-active-project" element={<AddActiveProjectPage />} />
                    <Route path="/list-active-projects" element={<ListActiveProjectsPage />} />
                    <Route path="/delete-active-project" element={<DeleteActiveProjectPage />} />
                    <Route path="/list-archive-project" element={<ListArchiveProjectPage />} />
                    <Route path="/add-segment" element={<AddSegmentPage />} />
                    <Route path="/list-segment" element={<ListSegmentPage />} />
                    <Route path="/delete-segment" element={<DeleteSegmentPage />} />
                </Routes>
            </Container>
        </Router>
    );
}

function ShowHomePage() {

    return (
        <Container>
            <p><a href="/login">Private</a></p>
            <p><a href="/logout">Log out</a></p>
        </Container>
    );
}

function AddRequesterUserPage() {
    const [segment, setSegment] = useState('');
    const [name_first, setFirstName] = useState('');
    const [name_last, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [cn, setCn] = useState('');
    const [response, setResponse] = useState('');

    const handleAddRequesterUser = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://127.0.0.1:5000/add-requester-user', {
                segment,
                name_first,
                name_last,
                phone,
                email,
                cn
            });
            setResponse(result.data.cn);
        } catch (error) {
            setResponse(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <Container>
            <h1>Add Requester Users</h1>
            <Form onSubmit={handleAddRequesterUser}>
                <Form.Group>
                    <Form.Label>Segment</Form.Label>
                    <Form.Control type="string" value={segment} onChange={(e) => setSegment(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="string" value={name_first} onChange={(e) => setFirstName(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="string" value={name_last} onChange={(e) => setLastName(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="string" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>CN</Form.Label>
                    <Form.Control type="string" value={cn} onChange={(e) => setCn(e.target.value)} required />
                </Form.Group>
                <Button type="submit" className="mt-3">Submit</Button>
            </Form>
            {response && <p className="mt-3">{response}</p>}
        </Container>
    );
}

function ListRequesterUserPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/list-requester-user'
        ).then((response) => {
            setData(response.data);
        });
    }, []);

    return (
        <Container>
            <h1>List Requester Users</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Segment</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>CN</th>
                </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row[0]}>
                            <td>{row[0]}</td>
                            <td>{row[1]}</td>
                            <td>{row[2]}</td>
                            <td>{row[3]}</td>
                            <td>{row[4]}</td>
                            <td>{row[5]}</td>
                            <td>{row[6]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

function DeleteRequesterUserPage() {
    const [data, setData] = useState([]);

    const fetchData = () => {
        axios.get('http://127.0.0.1:5000/list-requester-user').then((response) => {
            setData(response.data);
        });
    };

    useEffect(fetchData, []);

    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:5000/delete-requester-user/${id}`).then(() => {
            fetchData();
        });
    };

    return (
        <Container>
            <h1>Delete Requester Users</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Segment</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>CN</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row[0]}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                        <td>{row[3]}</td>
                        <td>{row[4]}</td>
                        <td>{row[5]}</td>
                        <td>{row[6]}</td>
                        <td>
                            <Button variant="danger" onClick={() => handleDelete(row[0])}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}


function AddAdminUserPage() {
    const [segment, setSegment] = useState('');
    const [name_first, setFirstName] = useState('');
    const [name_last, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [cn, setCn] = useState('');
    const [response, setResponse] = useState('');

    const handleAddAdminUser = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://127.0.0.1:5000/add-admin-user', {
                segment,
                name_first,
                name_last,
                phone,
                email,
                cn
            });
            setResponse(result.data.cn);
        } catch (error) {
            setResponse(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <Container>
            <h1>Add Admin Users</h1>
            <Form onSubmit={handleAddAdminUser}>
                <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="string" value={name_first} onChange={(e) => setFirstName(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="string" value={name_last} onChange={(e) => setLastName(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="string" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>CN</Form.Label>
                    <Form.Control type="string" value={cn} onChange={(e) => setCn(e.target.value)} required />
                </Form.Group>
                <Button type="submit" className="mt-3">Submit</Button>
            </Form>
            {response && <p className="mt-3">{response}</p>}
        </Container>
    );
}


function ListAdminUserPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/list-admin-user').then((response) => {
            setData(response.data);
        });
    }, []);

    return (
        <Container>
            <h1>List Admin Users</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>CN</th>
                </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row[0]}>
                            <td>{row[0]}</td>
                            <td>{row[1]}</td>
                            <td>{row[2]}</td>
                            <td>{row[3]}</td>
                            <td>{row[4]}</td>
                            <td>{row[5]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}


function DeleteAdminUserPage() {
    const [data, setData] = useState([]);

    const fetchData = () => {
        axios.get('http://127.0.0.1:5000/list-admin-user').then((response) => {
            setData(response.data);
        });
    };

    useEffect(fetchData, []);

    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:5000/delete-admin-user/${id}`).then(() => {
            fetchData();
        });
    };

    return (
        <Container>
            <h1>Delete Admin Users</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>CN</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row[0]}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                        <td>{row[3]}</td>
                        <td>{row[4]}</td>
                        <td>{row[5]}</td>
                        <td>{row[6]}</td>
                        <td>
                            <Button variant="danger" onClick={() => handleDelete(row[0])}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}


function AddProjectRequestPage() {
    const [selected_segment, setSelectedSegment] = useState('');
    const [requestor, setRequestor] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [mq1_host, setMq1Host] = useState('');
    const [mq1_port, setMq1Port] = useState('');
    const [mq2_host, setMq2Host] = useState('');
    const [mq2_port, setMq2Port] = useState('');
    const [mq3_host, setMq3Host] = useState('');
    const [mq3_port, setMq3Port] = useState('');
    const [mq_flag, setMqFlag] = useState('');
    const [inbound_sftp_pw, setInboundSftpPw] = useState('');
    const [inbound_sftp_key, setInboundSftpKey] = useState('');
    const [response, setResponse] = useState('');
    const [data, setData] = useState([]);

    const fetchData = () => {
        axios.get('http://127.0.0.1:5000/get-segments').then((response) => {
            setData(Array.from(response.data));
        });
    };

    useEffect(fetchData, []);    
    
    const handleSelectSegment = (event) => {
        setSelectedSegment(event.target.value);
    };

    const handleAddProjectRequest = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://127.0.0.1:5000/add-project-request', {
                selected_segment,
                requestor,
                start_date,
                end_date,
                mq1_host,
                mq1_port,
                mq2_host,
                mq2_port,
                mq3_host,
                mq3_port,
                mq_flag,
                inbound_sftp_pw,
                inbound_sftp_key
            });
            setResponse(result.data.cn);
        } catch (error) {
            setResponse(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <Container>
            <h1>Add Project Request</h1>
            <Form onSubmit={handleAddProjectRequest}>
                <Form.Group>
                    <Form.Label>Segment</Form.Label>
                    <Form.Control as="select" type="string" value={selected_segment} onChange={(e) => setSelectedSegment(e.target.value)} required >
                    {data.map((data, index) => (<option key={index} value={data}>{data}</option>))}
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Requestor</Form.Label>
                    <Form.Control type="string" value={requestor} onChange={(e) => setRequestor(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control type="date" value={start_date} onChange={(e) => setStartDate(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control type="date" value={end_date} onChange={(e) => setEndDate(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>MQ1 Host</Form.Label>
                    <Form.Control type="string" value={mq1_host} onChange={(e) => setMq1Host(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>MQ1 Port</Form.Label>
                    <Form.Control type="string" value={mq1_port} onChange={(e) => setMq1Port(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>MQ2 Host</Form.Label>
                    <Form.Control type="string" value={mq2_host} onChange={(e) => setMq2Host(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>MQ2 Port</Form.Label>
                    <Form.Control type="string" value={mq2_port} onChange={(e) => setMq2Port(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>MQ3 Host</Form.Label>
                    <Form.Control type="string" value={mq3_host} onChange={(e) => setMq3Host(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>MQ3 Port</Form.Label>
                    <Form.Control type="string" value={mq3_port} onChange={(e) => setMq3Port(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>MQ Flag</Form.Label>
                    <Form.Control type="string" value={mq_flag} onChange={(e) => setMqFlag(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>SFTP PW</Form.Label>
                    <Form.Control type="string" value={inbound_sftp_pw} onChange={(e) => setInboundSftpPw(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>SFTP Key</Form.Label>
                    <Form.Control type="string" value={inbound_sftp_key} onChange={(e) => setInboundSftpKey(e.target.value)} />
                </Form.Group>
                <Button type="submit" className="mt-3">Submit</Button>
            </Form>
            {response && <p className="mt-3">{response}</p>}
        </Container>
    );
}


function ListProjectRequestPage() {
    const [data, setData] = useState([]);

    const fetchData = () => {
        axios.get('http://127.0.0.1:5000/list-project-request').then((response) => {
            setData(response.data);
        });
    };

    useEffect(fetchData, []);

    return (
        <Container>
            <h1>List Project Requests</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Segment</th>
                    <th>Requestor</th>
                    <th>Request Date</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Producer SFTP Password</th>
                    <th>Producer SFTP Password</th>
                    <th>Producer MQ Host</th>
                    <th>Producer MQ Port</th>
                    <th>Producer MQ Flag</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row[0]}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                        <td>{row[3]}</td>
                        <td>{row[4]}</td>
                        <td>{row[5]}</td>
                        <td>{row[6]}</td>
                        <td>{row[7]}</td>
                        <td>{row[8]}</td>
                        <td>{row[9]}</td>
                        <td>{row[10]}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}


function DeleteProjectRequestPage() {
    const [data, setData] = useState([]);

    const fetchData = () => {
        axios.get('http://127.0.0.1:5000/list-project-request').then((response) => {
            setData(response.data);
        });
    };

    useEffect(fetchData, []);

    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:5000/delete-project-request/${id}`).then(() => {
            fetchData();
        });
    };

    return (
        <Container>
            <h1>Delete Project Request</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Segment</th>
                    <th>Requestor</th>
                    <th>Request Date</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Producer SFTP Password</th>
                    <th>Producer SFTP Password</th>
                    <th>Producer MQ Host</th>
                    <th>Producer MQ Port</th>
                    <th>Producer MQ Flag</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row[0]}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                        <td>{row[3]}</td>
                        <td>{row[4]}</td>
                        <td>{row[5]}</td>
                        <td>{row[6]}</td>
                        <td>{row[7]}</td>
                        <td>{row[8]}</td>
                        <td>{row[9]}</td>
                        <td>{row[10]}</td>
                        <td>
                            <Button variant="danger" onClick={() => handleDelete(row[0])}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}


function ApproveProjectRequestPage() {
    const [data, setData] = useState([]);


    const fetchData = () => {
        axios.get('http://127.0.0.1:5000/list-project-request').then((response) => {
            setData(response.data);
        });
    };

    useEffect(fetchData, []);

        const handleApproval = (id) => {
        axios.get(`http://127.0.0.1:5000/approve-project-request/${id}`).then(() => {
            fetchData();
        });
    };

    return (
        <Container>
            <h1>Approve Project Request</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Segment</th>
                    <th>Requestor</th>
                    <th>Request Date</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Producer SFTP Password</th>
                    <th>Producer SFTP Password</th>
                    <th>Producer MQ Host</th>
                    <th>Producer MQ Port</th>
                    <th>Producer MQ Flag</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, idx) => (
                    <tr key={idx}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                        <td>{row[3]}</td>
                        <td>{row[4]}</td>
                        <td>{row[5]}</td>
                        <td>{row[6]}</td>
                        <td>{row[7]}</td>
                        <td>{row[8]}</td>
                        <td>{row[9]}</td>
                        <td>{row[10]}</td>
                        <td>
                            <Button variant="danger" onClick={() => handleApproval(row[0])}>Approve</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}


function AddActiveProjectPage(project) {
    const [response, setResponse] = useState('');

    const handleAddProjectRequest = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://127.0.0.1:5000/add-active-project', {
                project
            });
            setResponse(result.data.cn);
        } catch (error) {
            setResponse(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <Container>
            <h1>Project Added</h1>
        </Container>
    );
}


function ListActiveProjectsPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/list-active-project').then((response) => {
            setData(response.data);
        });
    }, []);

    return (
        <Container>
            <h1>List Active Projects</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Project</th>
                    <th>Segment</th>
                    <th>Requester</th>
                    <th>Approver</th>
                    <th>Request Date</th>
                    <th>Approved Date</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Deployed</th>
                </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row[0]}>
                            <td>{row[0]}</td>
                            <td>{row[1]}</td>
                            <td>{row[2]}</td>
                            <td>{row[3]}</td>
                            <td>{row[4]}</td>
                            <td>{row[5]}</td>
                            <td>{row[6]}</td>
                            <td>{row[7]}</td>
                            <td>{row[8]}</td>
                            <td>{String(row[9])}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}


function DeleteActiveProjectPage() {
    const [data, setData] = useState([]);

    const fetchData = () => {
        axios.get('http://127.0.0.1:5000/list-active-project').then((response) => {
            setData(response.data);
        });
    };

    useEffect(fetchData, []);

    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:5000/delete-active-project/${id}`).then(() => {
            fetchData();
        });
    };

    return (
        <Container>
            <h1>Delete Active Project</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Project</th>
                    <th>Segment</th>
                    <th>Requester</th>
                    <th>Approver</th>
                    <th>Request Date</th>
                    <th>Approved Date</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Deployed</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row[0]}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                        <td>{row[3]}</td>
                        <td>{row[4]}</td>
                        <td>{row[5]}</td>
                        <td>{row[6]}</td>
                        <td>{row[7]}</td>
                        <td>{row[8]}</td>
                        <td>{String(row[9])}</td>
                        <td>
                            <Button variant="danger" onClick={() => handleDelete(row[0])}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}


function ListArchiveProjectPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/list-archive-project').then((response) => {
            setData(response.data);
        });
    }, []);

    return (
        <Container>
            <h1>List Archived Projects</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Project</th>
                    <th>Segment</th>
                    <th>Requester</th>
                    <th>Request Date</th>
                    <th>Approver</th>
                    <th>Approved Date</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Delete Date</th>
                </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row[0]}>
                            <td>{row[0]}</td>
                            <td>{row[1]}</td>
                            <td>{row[2]}</td>
                            <td>{row[3]}</td>
                            <td>{row[4]}</td>
                            <td>{row[5]}</td>
                            <td>{row[6]}</td>
                            <td>{row[7]}</td>
                            <td>{row[8]}</td>
                            <td>{row[9]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}


function AddSegmentPage() {
    const [name, setName] = useState('');
    const [inbound_sftp, setInboundSftp] = useState('');
    const [inbound_sftp_user, setInboundSftpUser] = useState('');
    const [inbound_https, setInboundHttps] = useState('');
    const [inbound_jms, setInboundJms] = useState('');
    const [outbound_sftp, setOutboundSftp] = useState('');
    const [outbound_https, setOutboundHttps] = useState('');
    const [outbound_jms, setOutboundJms] = useState('');
    const [mq, setMq] = useState('');
    const [mq_hosts, setMqHosts] = useState('');
    const [response, setResponse] = useState('');


    const handleAddRequesterUser = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://127.0.0.1:5000/add-segment', {
                name,
                inbound_sftp,
                inbound_sftp_user,
                inbound_https,
                inbound_jms,
                outbound_sftp,
                outbound_https,
                outbound_jms,
                mq,
                mq_hosts
            });
            setResponse(result.data.cn);
        } catch (error) {
            setResponse(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <Container>
            <h1>Add Segment</h1>
            <Form onSubmit={handleAddRequesterUser}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="string" value={name} onChange={(e) => setName(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Inbound SFTP</Form.Label>
                    <Form.Control type="boolean" value={inbound_sftp} onChange={(e) => setInboundSftp(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Inbound SFTP User</Form.Label>
                    <Form.Control type="string" value={inbound_sftp_user} onChange={(e) => setInboundSftpUser(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Inbound HTTPS</Form.Label>
                    <Form.Control type="boolean" value={inbound_https} onChange={(e) => setInboundHttps(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Inbound JMS</Form.Label>
                    <Form.Control type="boolean" value={inbound_jms} onChange={(e) => setInboundJms(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Outbound SFTP</Form.Label>
                    <Form.Control type="boolean" value={outbound_sftp} onChange={(e) => setOutboundSftp(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Outbound HTTPS</Form.Label>
                    <Form.Control type="boolean" value={outbound_https} onChange={(e) => setOutboundHttps(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Outbound JMS</Form.Label>
                    <Form.Control type="boolean" value={outbound_jms} onChange={(e) => setOutboundJms(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>MQ</Form.Label>
                    <Form.Control type="boolean" value={mq} onChange={(e) => setMq(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>MQ Hosts</Form.Label>
                    <Form.Control type="integer" value={mq_hosts} onChange={(e) => setMqHosts(e.target.value)} required />
                </Form.Group>
                <Button type="submit" className="mt-3">Submit</Button>
            </Form>
            {response && <p className="mt-3">{response}</p>}
        </Container>
    );
}

function ListSegmentPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/list-segment').then((response) => {
            setData(response.data);
        });
    }, []);

    return (
        <Container>
            <h1>List Segments</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Inbound SFTP</th>
                    <th>Inbound SFTP User</th>
                    <th>Inbound HTTPS</th>
                    <th>Inbound JMS</th>
                    <th>Outbound SFTP</th>
                    <th>Outbound HTTPS</th>
                    <th>Outbound JMS</th>
                    <th>MQ</th>
                    <th>MQ Hosts</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row[0]}>
                        <td>{String(row[0])}</td>
                        <td>{String(row[1])}</td>
                        <td>{String(row[2])}</td>
                        <td>{String(row[3])}</td>
                        <td>{String(row[4])}</td>
                        <td>{String(row[5])}</td>
                        <td>{String(row[6])}</td>
                        <td>{String(row[7])}</td>
                        <td>{String(row[8])}</td>
                        <td>{String(row[9])}</td>
                        <td>{String(row[10])}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}

function DeleteSegmentPage() {
    const [data, setData] = useState([]);

    const fetchData = () => {
        axios.get('http://127.0.0.1:5000/list-segment').then((response) => {
            setData(response.data);
        });
    };

    useEffect(fetchData, []);

    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:5000/delete-segment/${id}`).then(() => {
            fetchData();
        });
    };

    return (
        <Container>
            <h1>Delete Segments</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Inbound SFTP</th>
                    <th>Inbound SFTP User</th>
                    <th>Inbound HTTPS</th>
                    <th>Inbound JMS</th>
                    <th>Outbound SFTP</th>
                    <th>Outbound HTTPS</th>
                    <th>Outbound JMS</th>
                    <th>MQ</th>
                    <th>MQ Hosts</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row[0]}>
                        <td>{String(row[0])}</td>
                        <td>{String(row[1])}</td>
                        <td>{String(row[2])}</td>
                        <td>{String(row[3])}</td>
                        <td>{String(row[4])}</td>
                        <td>{String(row[5])}</td>
                        <td>{String(row[6])}</td>
                        <td>{String(row[7])}</td>
                        <td>{String(row[8])}</td>
                        <td>{String(row[9])}</td>
                        <td>{String(row[10])}</td>
                        <td>
                            <Button variant="danger" onClick={() => handleDelete(row[0])}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}


export default DemoBuilder;