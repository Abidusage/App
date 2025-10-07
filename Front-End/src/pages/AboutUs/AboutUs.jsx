import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-content">
        <h1>About Us</h1>
        <p>
          Welcome to our platform! Here you can find talented freelancers to
          help you with your projects and access free learning resources to
          boost your skills.
        </p>

        <section className="section freelancers">
          <h2>Find Freelancers</h2>
          <p>
            Looking for experts to assist with your project? Our platform
            connects you with skilled freelancers in various fields, ready to
            tackle your challenges and deliver quality work.
          </p>
        </section>

        <section className="section resources">
          <h2>Free Learning Resources</h2>
          <p>
            Explore our collection of free courses and resources. Whether you're
            looking to learn a new skill or improve your knowledge, we have
            something for everyone.
          </p>
        </section>

        <section className="section services">
          <h2>Our Services</h2>
          <p>
            We offer a range of services to support your business needs,
            including project management, software development, and design
            services. Our experts are ready to help you achieve your goals.
          </p>
        </section>

        <section className="section testimonials">
          <h2>Testimonials</h2>
          <p>
            Hear from our satisfied clients! Discover how our platform has
            helped businesses and individuals alike achieve success.
          </p>
        </section>

        <div className="call-to-action">
          <a href="/contact" className="cta-button">
            Join Us Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
