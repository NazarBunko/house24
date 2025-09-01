import React from "react";

function RegistrationForm() {
  return (
    <div className="row" style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
      <form
        className="col s12"
        style={{
          border: "2px solid #ccc",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "600px",
          backgroundColor: "white",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <div className="row">
          <div className="input-field col s6">
            <input
              id="first_name"
              type="text"
              placeholder="John"
              style={{ padding: "10px" }}
            />
            <label htmlFor="first_name" className="active">First Name</label>
          </div>
          <div className="input-field col s6">
            <input
              id="last_name"
              type="text"
              placeholder="Doe"
              style={{ padding: "10px" }}
            />
            <label htmlFor="last_name" className="active">Last Name</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <input
              id="email"
              type="email"
              placeholder="example@mail.com"
              style={{ padding: "10px" }}
            />
            <label htmlFor="email" className="active">Email</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <input
              id="password"
              type="password"
              placeholder="********"
              style={{ padding: "10px" }}
            />
            <label htmlFor="password" className="active">Password</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <input
              id="confirm_password"
              type="password"
              placeholder="********"
              style={{ padding: "10px" }}
            />
            <label htmlFor="confirm_password" className="active">Confirm Password</label>
          </div>
        </div>

        <div className="row">
          <div className="col s12">
            <label>
              <input type="checkbox" />
              <span style={{ marginLeft: "10px" }}>I accept the Terms and Conditions</span>
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col s12" style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              type="submit"
              className="btn waves-effect waves-light"
              style={{ width: "50%", borderRadius: "8px" }}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;
