import "./userList.css"
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs

const UserList = () => {
  const [users, setUsers] = useState([]);


  const generatePDF = (user) => {
    console.log("Generate PDF function called");
    const pdfTitle = `${user.firstname}_${user.lastname}.pdf`;
    console.log("PDF Title:", pdfTitle);
  
    const docDefinition = {
      content: [
        { text: 'User Registration Details', style: 'header', alignment: "center" },
        '\n\n',
        {image: user.profilePicture, width: 100, height: 100, alignment: "center"},
        {
          columns: [
            {
              width: '50%',
              stack: [
                "\n",
                { text: 'First Name:', style: 'subheader' },
                "\n",
                { text: 'Last Name:', style: 'subheader' },
                "\n",
                { text: 'Date of Birth:', style: 'subheader' },
                "\n",
                { text: 'Gender:', style: 'subheader' },
                "\n",
                { text: 'Email:', style: 'subheader' },
                "\n",
                { text: 'Phone Number:', style: 'subheader' },
                "\n",
                { text: 'Nationality:', style: 'subheader' },
                "\n",
                { text: 'Country of Residence:', style: 'subheader' },
                "\n",
                { text: 'State:', style: 'subheader' },
              ],
            },
            {
              width: '50%',
              stack: [
                "\n",
                user.firstname,
                "\n",
                user.lastname,
                "\n",
                user.dob,
                "\n",
                user.gender,
                "\n",
                user.email,
                "\n",
                user.phoneNumber,
                "\n",
                user.nationality,
                "\n",
                user.countryOfResidence,
                "\n",
                user.state,
              ],
            },
          ],
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        subheader: { fontSize: 13, bold: false },
      },
      
    };
    console.log('Registration Date:', user.registrationDate);

    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.open()
    pdfDoc.download(pdfTitle);
  };

  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then((response) => {
        console.log("Fetched User Data", response.data)
        const sortedUsers = response.data.sort((a, b) => {
          return new Date(b.registrationDate) - new Date(a.registrationDate);
        });
        setUsers(sortedUsers);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);


  return (
    <div className="container">
        <div className="header">
          <div className="header-title">
          <h2>Registered Users</h2>
          </div>
          <div className="header-button">
          <Link to="/">
          <button className="headerBtn">
            Home
          </button>
          </Link>
          <Link to="/register-page">
          <button className="headerBtn">
            Register
          </button>
          </Link>
          </div>
      </div>
      <div className="wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th className="schema">Name</th>
            <th className="schema">Email</th>
            <th className="schema">Gender</th>
            <th className="schema">Nationality</th>
            <th className="schema">Download PDF</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.firstname} {user.lastname}</td>
              <td>{user.email}</td>
              <td>{user.gender}</td>
              <td>{user.nationality}</td>
              <td>
                <span onClick={() => generatePDF(user)}>
                  Download PDF
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default UserList;
