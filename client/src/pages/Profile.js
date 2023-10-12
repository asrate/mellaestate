import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutStart,
  signOutFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

//firebase storage
// allow read;
// allow write: if
// request.resource.size < 4 * 1024 * 1024 &&
// request.resource.contentType.matches("image/.*");

function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formdata, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate;
  const dispatch = useDispatch();
  console.log(formdata);
  // console.log(fileUploadError);
  // console.log(file);
  // console.log(filePerc);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Uploading is" + progress + "% done");
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formdata, avatar: downloadURL })
        );
      }
    );
  };
  const handlechange = (event) => {
    setFormData({ ...formdata, [event.target.id]: event.target.value });
  };
  const handleSubmit = async (event) => {
    const token = localStorage.getItem("access_token");
    event.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `http://localhost:5000/api/user/update/${currentUser._id}`,
        {
          method: "post",
          // credentials: "include",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formdata),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error);
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    const token = localStorage.getItem("access_token");
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `http://localhost:5000/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOUT = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/http://localhost/5000/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      localStorage.removeItem("access_token", data.token);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/.*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formdata.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 "
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (image must be less than 4 mb){" "}
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Successfully Uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          onChange={handlechange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
          onChange={handlechange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          defaultValue={currentUser.password}
          onChange={handlechange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-10 p-3"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          create listing
        </Link>
        <div className="flex justify-between">
          <span
            onClick={handleDeleteUser}
            className="text-red-700 cursor-pointer"
          >
            Delete Account
          </span>
          <span onClick={handleSignOUT} className="text-red-700 cursor-pointer">
            Sign Out
          </span>
        </div>
        <p className="text-green-700 mt-5">
          {updateSuccess ? "User is updated successfully!" : " "}
        </p>
      </form>
    </div>
  );
}

export default Profile;
