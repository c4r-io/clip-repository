"use client";
import { api } from "@/utils/apibase";
import { getToken } from "@/utils/token";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/contextapi/UserProvider";
const Page = ({ params }) => {
  const { userData, dispatchUserData } = useContext(UserContext);
  const router = useRouter();
  const [userResponse, setUserResponse] = useState(null);
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [permission, setPermission] = useState(null);
  const getUser = async () => {
    dispatchUserData({ type: "checkLogin" });
    const config = {
      method: "GET",
      url: "/api/user/" + params.slug,
      headers: {
        Authorization: `Bearer ${getToken("token")}`,
      },
    };
    try {
      const response = await api.request(config);
      setUserResponse(response.data);
      // setUserName(response.data.userName);
      // setPermission(response.data.permission);
      // setPassword(response.data.password);
    } catch (error) {
      if (error.response.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
        router.push("/dashboard");
        return;
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      router.push("/dashboard/user");
      console.error(error);
    }
  };
  useEffect(() => {
    getUser();
  }, [params.slug]);
  // update user data
  // content type form data
  const updateUser = async (e) => {
    e.preventDefault();
    dispatchUserData({ type: "checkLogin" });
    const data = {};
    if (userName && userResponse?.users?.userName !== userName) {
      data.userName = userName;
    }
    if (password && userResponse?.users?.password !== password) {
      data.password = password;
    }
    if (permission && userResponse?.users?.permission !== permission) {
      data.permission = permission;
    }
    if (Object.keys(data).length <= 0) {
      toast.error(
        "Empty Form Submission Not Allowed, Try after changing data.",
        {
          position: "top-center",
        }
      );
      return;
    }
    const config = {
      method: "put",
      url: "/api/user/" + params.slug,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getToken("token")}`,
      },
      // bodyObject
      data,
    };
    try {
      const response = await api.request(config);
      router.push("/dashboard/user");
      getUser;
      toast.success("Updated Successfully!", {
        position: "top-center",
      });
    } catch (error) {
      if (error.response.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
        // router.push('/');
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      console.error(error);
    }
  };
  return (
    <div className="container mx-auto py-4 px-4 md:px-0">
      <form onSubmit={updateUser}>
        <div className="mb-6">
          <label
            htmlFor="userName"
            className="block mb-2 text-sm font-medium text-white"
          >
            {" "}
            User name
          </label>
          <input
            type="text"
            id="userName"
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
            placeholder="User name"
            defaultValue={userResponse?.users?.userName}
            onInput={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-white"
          >
            {" "}
            Password
          </label>
          <input
            type="text"
            id="password"
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
            placeholder="Password"
            defaultValue={userResponse?.users?.password}
            onInput={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="countries"
            className="block mb-2 text-sm font-medium text-white"
          >
            Select an option
          </label>
          <select
            value={userResponse?.users?.permission}
            onChange={(e) => setPermission(e.target.value)}
            id="countries"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option >Choose a role</option>
            <option value="self">Self</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Update User
        </button>
      </form>
    </div>
  );
};
export default Page;
