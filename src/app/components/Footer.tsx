import React from "react";
import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <footer className="footer w-full py-4 bg-gray-100 text-center text-gray-600 text-sm mt-12">
      &copy; {new Date().getFullYear()} AMS Apartment Management System. All rights reserved.
    </footer>
  );
}
