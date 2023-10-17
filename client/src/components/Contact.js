import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function Contact({ list }) {
  const [landlord, setLandrod] = useState(null);
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  const token = localStorage.getItem("access_token");
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/user/${list.userRef}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await res.json();
        setLandrod(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [list.userRef]);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for <span className="font-semibold">{list.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${list.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}

export default Contact;
