import { useState } from 'react';
import "./registration.css";
import axios from "axios";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const RegistrationForm = () => {

  const countryToStates = {
    india: ['Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Patna', 'Uttar Pradesh'], 
    uae: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al Ain', 'Umm al Quwain', 'Fujairah'], 
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData({
      ...formData,
      countryOfResidence: selectedCountry,
      state: '',
    });
  };


  const generatePDF = () => {
    const pdfTitle = `${formData.firstname}_${formData.lastname}.pdf`;
    const content = [];
  
  
    if (formData.profilePicture) {
  
      const reader = new FileReader();
  
      reader.onload = () => {
  
        const docDefinition = {
          content: [
            { text: 'User Registration Details', style: 'header', alignment: "center" },
            '\n\n',
            { image: reader.result, width: 100, height: 100, alignment: 'center' },
            "\n",
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
                    formData.firstname,
                    "\n",
                    formData.lastname,
                    "\n",
                    formData.dob,
                    "\n",
                    formData.gender,
                    "\n",
                    formData.email,
                    "\n",
                    formData.phoneNumber,
                    "\n",
                    formData.nationality,
                    "\n",
                    formData.countryOfResidence,
                    "\n",
                    formData.state,
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
        
        pdfMake.createPdf(docDefinition).download(pdfTitle);
        
      };
  
      reader.readAsDataURL(formData.profilePicture);
    } else {
      const docDefinition = {
        content: content,
        styles: {
          header: { fontSize: 18, bold: true },
          subheader: { fontSize: 14, bold: true },
        },
      };
  
      pdfMake.createPdf(docDefinition).download(pdfTitle);
    }
  };
    
  
  

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    profilePicture: null,
    dob: "",
    gender: "",
    email: "",
    phoneNumber: "",
    nationality: "",
    countryOfResidence: "",
    state: "",
  });

  const handleChange = (e) => {
    const { name, type } = e.target;
  
    if (type === "file") {
      const file = e.target.files[0];
  
      if (file) {
        const reader = new FileReader();
  
        reader.onload = (event) => {
          const profilePictureBlob = new Blob([event.target.result], { type: file.type });
  
          setFormData({ ...formData, [name]: profilePictureBlob });
        };
  
        reader.readAsArrayBuffer(file);
      }
    } else {
      setFormData({ ...formData, [name]: e.target.value });
    }
  };

  const [registrationStatus, setRegistrationStatus] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
  
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
  
    try {
      const response = await axios.post("http://localhost:3001/register", formDataToSend);
      console.log(response.status)
      console.log(response.data)
      if(response.status === 200 && response.data.success){
        setRegistrationStatus("Success")
      } else if(response.data.failure) {
        setRegistrationStatus("Failure")
      } else {      }

    } catch (error) {
      console.error("Axios error:", error);
      setRegistrationStatus("Failure")
    }
  };
  
  return (
    <div className="form-container">
      
        <form onSubmit={handleSubmit}>
          <div className="form-wrapper">
          <div className="form-title">Registration Form</div>
          <div className="user-details">
            <div className="form-group">
            
            {/* First Name */}

            <label className="lbl" htmlFor="firstname">
              First Name
            </label>
            <input
                type="text"
                name="firstname"
                placeholder="Your first name"
                value={formData.firstname}
                onChange={handleChange}
            />

            </div>

            {/* Last Name */}
            <div className="form-group">

            <label className="lbl" htmlFor="lastname">Last Name</label>

            <input
                type="text"
                name="lastname"
                placeholder="Your last name"
                value={formData.lastname}
                onChange={handleChange}
            />
            </div>

            
            {/* DOB */}

            <div className="form-group">
            
            <label className="lbl" htmlFor="dob">
              Date of Birth:
            </label>

            <input 
              type="date"
              onChange={handleChange}
              value={formData.dob}
              id="dob" 
              name="dob"
            />

            </div>

            
            {/* Email Address */}

            <div className="form-group">
            
            <label className="lbl" htmlFor="email">
              Email:
            </label>
            <input 
              type="email" 
              name="email" 
              placeholder="your email" 
              onChange={handleChange} 
              required 
            />

            </div>

            {/* Phone Number */}

            <div className="form-group">
                
            <label className="lbl" htmlFor="phoneNumber">
                Phone Number:
            </label>
            <div className="phone-code">
            <select 
              id="countryCode"  
              name="countryCode"
              // defaultValue="" 
              required
            >
              
              <option value="" disabled>
                Country Code
              </option>
              <option value="+1">
                +1 (USA)
              </option>
              <option value="+44">
                +44 (UK)
              </option>
              <option value="+44">
                +91 (India)
              </option>
            </select>
            

          

            <input 
              type="tel" 
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              name="phoneNumber" 
              pattern="[0-9]{10}" 
              required 
            />
            </div>
            </div>

            {/* Nationality */}
            
            <div className="form-group">

            <label className="lbl" htmlFor="nationality">
              Nationality:
            </label>
            
            <input 
              type="text" 
              id="nationality" 
              value={formData.nationality}
              onChange={handleChange}
              name="nationality" 
              required 
            />
            </div>

            {/* Sex */}

            <div  className="form-group">
              <div className="form-gender-label">
            <label className="lbl" htmlFor="gender">
              Gender:
            </label>
            </div>
            <div className="form-gender-options">
            <select 
              id="gender" 
              name="gender" 
              value={formData.gender} 
              // defaultValue="" 
              onChange={handleChange} 
              required
            >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">
                  Male
                </option>
                <option value="female">
                  Female
                </option>
                <option value="other">
                  Other
                </option>
            </select>
            </div>
            </div>

            
            

            {/* Country */}

            <div className="form-group">

              <div className="form-country-label">
            
            <label className="lbl" htmlFor="countryOfResidence">Country</label>
            </div>
            <div className="form-country-options">
            <select 
              id="countryOfResidence" 
              name="countryOfResidence"
              value={formData.countryOfResidence}
              onChange={handleCountryChange}
              placeholder="Country Of Residence" 
              // defaultValue="" 
              required
            >
                <option value="" disabled>Select Country</option>
                <option value="india">India</option>
                <option value="uae">United Arab Emirates (UAE)</option>
            
            </select>
            </div>
            </div>

            {/* State */}


            <div className="form-group">
              <div className="form-state-lbl">

            <label className="lbl" htmlFor="state">State:</label>
            </div>
            <div className="form-state-options">
            <select 
              id="state" 
              name="state" 
              value={formData.state}
              onChange={handleChange}
              // defaultValue="" 
              required
            >
                
              <option value="" disabled>Select State</option>
              {formData.countryOfResidence && 
                countryToStates[formData.countryOfResidence]
                .map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
                
            </select>
            </div>
            </div>

            {/* Profile Picture */}

            <div  className="form-group">
            
            
            <label className="lbl custom-file-upload" htmlFor="profilePicture">
              Upload your Image
            </label>

            <input
                type="file"
                className='custom-file-input'
                name="profilePicture"
                accept="image/*"
                onChange={handleChange}
            />

            </div>

            <div className="form-group">
      
      {registrationStatus === "success" && (
        <div className="success-message">User registered Successfully</div>
      )}
      {registrationStatus === "failure" && (
        <div className="error-message">User registration failed</div>
      )}
    </div>
          <button className="btn" type="submit">Register</button>
          <button className="btn" type="button" onClick={generatePDF}>Download Form</button>
    </div>
   </div>
  </form>
        
</div>
);
}


export default RegistrationForm
