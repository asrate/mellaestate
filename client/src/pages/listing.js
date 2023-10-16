import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Listing() {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const params = useParams();
  const token = localStorage.getItem("access_token");
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/listing/getlisting/${params.listingId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          setError(true);
          return;
        }
        setList(data);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  });
  return <div>{list && list.name}</div>;
}

export default Listing;
