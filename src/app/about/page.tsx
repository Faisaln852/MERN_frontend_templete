"use client"

import { useEffect } from "react";

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About Us'; // consider changing this to match the page content
  }, []);

return (
  <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
    <div className="max-w-3xl px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="text-muted-foreground mb-2">
        Welcome to MySite — your go-to platform for amazing stuff. We’re a small team passionate about building quality experiences for customers.
      </p>
      <p className="text-muted-foreground">
        If you have questions, visit our{" "}
        <a href="/contact" className="underline">
          contact page
        </a>{" "}
        or send us an email at support@example.com.
      </p>
    </div>
  </div>
);

};

export default AboutPage;