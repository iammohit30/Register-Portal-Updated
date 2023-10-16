import { useState } from 'react';
import "./registration.css";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';


const RegistrationForm = () => {

  const navigate = useNavigate();

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

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    profilePicture: "",
    dob: "",
    gender: "",
    email: "",
    phoneNumber: "",
    nationality: "",
    countryOfResidence: "",
    state: "",
  });


  const [phoneNumberLength, setPhoneNumberLength] = useState(0);
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [imageSizeError, setImageSizeError] = useState(false)

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, type } = e.target;

    if (name === 'phoneNumber') {
      const phoneNumber = e.target.value;
      setPhoneNumberLength(phoneNumber.length);
  
      if (phoneNumber.length !== 10) {
        setPhoneNumberError('Phone number should be 10 digits');
      } else {
        setPhoneNumberError('');
      }
    }
  
    if (type === "file") {
      const file = e.target.files[0];
  
      if (file) {
        if (file.size <= 1048576) {
        const reader = new FileReader();
  
        reader.onload = (event) => {
          setFormData({ ...formData, [name]: event.target.result });
          setImageSizeError(false)
        };
  
        reader.readAsDataURL(file);
      } else{
        setRegistrationStatus("Failure")
        setImageSizeError(true)
      }
      }
    } else {
      setFormData({ ...formData, [name]: e.target.value });
    }
  };
  
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (calculateAge(formData.dob) < 18 || imageSizeError) {
      setRegistrationStatus('Failure');
      console.log("Registration Failure\nAge or Image does not match the criteria")
      return;
    }

    const formDataToSend = new FormData();
  
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
  
    try {
      const response = await axios.post("http://localhost:3001/register", formDataToSend);
      navigate("/userList")
      if (response.status === 200 && response.data.success) {
        setRegistrationStatus("Success");
      } else {
        setRegistrationStatus("Failure");
      }
    } catch (error) {
      console.error("Axios error:", error);
      setRegistrationStatus("Failure");
    }
  };

  const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      return age - 1;
    }
    return age;
  };
  
  return (
    <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-wrapper">
            <div className="form-header">
          <div className="form-title">Registration Form</div>
          <Link to="/">
          <button className='headerBtn'>Back</button>
          </Link>
          </div>
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
            {formData.dob && calculateAge(formData.dob) < 18 && (
              <div className="error-message">Age must be 18 or above to register.</div>
            )}

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
            {phoneNumberError && (
              <div className="error-message">{phoneNumberError}</div>
            )}
            <div className="phone-code">
            <select 
              id="countryCode"  
              name="countryCode"
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
            { imageSizeError && (
            <div className="error-message">Image size must be 1 MB or less.</div>
          )}
            
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
                <div className="error-message">User registration Failed</div>
              )}
          </div>
          
          <button className="btn" type="submit">Register</button>
    </div>
   </div>
  </form>
        
</div>
);
}


export default RegistrationForm
