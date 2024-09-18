import React, { useState, useRef } from "react";
import "./AuthForm.css";
import defaultProfile from "../../asset/logo.png"; // Replace with the path to your default profile image
import axios from "axios";
import ImageCompressor from "image-compressor.js"; // For image compression
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";


const AuthForm = ({setToken}) => {
  const[loading,setLoading]=useState(false)
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register forms
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    image: defaultProfile, // Default profile image
  });
  const navigate=useNavigate();
  const imageRef = useRef(); // useRef for image input

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      // Compress the image before setting it to state
      new ImageCompressor(files[0], {
        quality: 0.6,
        success: (compressedResult) => {
          const fileReader = new FileReader();
          fileReader.onloadend = () => {
            setFormData({ ...formData, image: fileReader.result }); // Update image with the compressed one
          };
          fileReader.readAsDataURL(compressedResult);
        },
        error(e) {
          console.log(e.message);
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
    
      
      if (isLogin) {
        // Submit login form data (password hashed on the frontend)
        const email=formData.email;
        const password=formData.password;
        await axios
        .post("https://invoice-management-system-server.vercel.app/login", {email,password} )
        .then((res) => {
            localStorage.setItem('email',res.data.user.email)
            localStorage.setItem('token',res.data.token)
            setToken(res.data.token)
            localStorage.setItem('image',res.data.user.image)
            toast.success(res.data.msg,{position:"top-center"});
            console.log(res.data.user)
            setFormData({ name: "", email: "", address: "", password: "", image: defaultProfile})
            setLoading(false)
            navigate('/')
        })
        .catch((error) => {
          console.log(error);
          setFormData({ name: "", email: "", address: "", password: "", image: defaultProfile})
          toast.error(error.response.data.msg,{position:"top-center"});
          setLoading(false)
          
        });
      }
      
      else {
        // Submit register form data with hashed password
       
        console.log("Register form submitted", formData);

        // Send data to the server
        await axios
          .post("https://invoice-management-system-server.vercel.app/register", formData)
          .then((res) => {
            localStorage.setItem('email',res.data.user.email)
            localStorage.setItem('token',res.data.token)
            setToken(res.data.token)
            localStorage.setItem('image',res.data.user.image)
            toast.success(res.data.msg,{position:"top-center"})
            setFormData({ name: "", email: "", address: "", password: "", image: defaultProfile})
            setLoading(false)
            navigate('/')
          })
          .catch((error) => {
            toast.error(error.response.data.msg,{position:"top-center"})
            // console.log(error.response.data.msg)
            setFormData({ name: "", email: "", address: "", password: "", image: defaultProfile})
            setLoading(false)


          });
      }
    } catch (error) {
      console.error("Error hashing password:", error);
    }
  };

  const triggerImageUpload = () => {
    imageRef.current.click(); // Trigger image file input click
  };

  return (
    <div className="auth-container">
      <div className="form-toggle">
        <button
          className={`toggle-btn ${isLogin ? "active" : ""}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`toggle-btn ${!isLogin ? "active" : ""}`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            {/* Image Input */}
            <div className="form-group">
              <h2 style={{textAlign:'center'}}>Company Logo</h2>
              <div  className="profile-image">
                <img src={formData.image} alt="Profile" className="profile-pic" onClick={triggerImageUpload} />
              </div>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleChange}
                ref={imageRef}
                style={{ display: "none" }}
                minLength={1}
                maxLength={1}
              />
            </div>

            {/* Name Input */}
            <div className="form-group">
              <label htmlFor="name">Company Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={50}
              />
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                minLength={12}
              />
            </div>

            {/* Address Input */}
            <div className="form-group">
              <label htmlFor="address">Company Address</label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                required
                minLength={5}
                maxLength={50}
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </>
        )}

        {/* Login Form */}
        {isLogin && (
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                minLength={12}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </>
        )}

        <button type="submit" className="submit-btn">          
          {loading && <ImSpinner3 />}
          {isLogin ? " Login" : " Register"}
        </button>

      </form>
    </div>
  );
};

export default AuthForm;
