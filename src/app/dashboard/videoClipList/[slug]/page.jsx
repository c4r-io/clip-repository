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
  const [careerStage, setCareerStage] = useState(null);
  const [fieldOfResearch, setFieldOfResearch] = useState(null);
  const [institutionSelector, setInstitutionSelector] = useState(null);
  const [rigorTopic, setRigorTopic] = useState(null);
  const [videoClipListResponse, setVideoClipListResponse] = useState(null);
  const [videoTitle, setVideoTitle] = useState(null);
  const [videoDetailsText, setVideoDetailsText] = useState(null);
  const [videoKeywords, setVideoKeywords] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoLink, setVideoLink] = useState(null);
  const [nextLink, setNextLink] = useState(null);
  const getVideoClipList = async () => {
    dispatchUserData({ type: "checkLogin" });
    const config = {
      method: "GET",
      url: "/api/videoClipList/" + params.slug,
      headers: {
        Authorization: `Bearer ${getToken("token")}`,
      },
    };
    try {
      const response = await api.request(config);
      setVideoClipListResponse(response.data.videoClipLists);
      // setVideoTitle(response.data.videoClipLists.videoTitle);
      // setVideoDetailsText(response.data.videoClipLists.videoDetailsText);
      // setVideoKeywords(response.data.videoClipLists.videoKeywords);
      // setThumbnail(response.data.videoClipLists.thumbnail);
      // setVideoLink(response.data.videoClipLists.videoLink);
      // setCareerStage(response.data.videoClipLists.careerStage);
      // setFieldOfResearch(response.data.videoClipLists.fieldOfResearch);
      // setInstitutionSelector(response.data.videoClipLists.institutionSelector);
      // setRigorTopic(response.data.videoClipLists.rigorTopic);
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
      router.push("/dashboard/videoClipList");
      console.error(error);
    }
  };
  useEffect(() => {
    getVideoClipList();
  }, [params.slug]);
  function extractQueryParam(url, param) {
    const urlObj = new URL(url);
    const searchParams = new URLSearchParams(urlObj.search);
    return searchParams.get(param);
  }

  // update user data
  // content type form data
  const updateUser = async (e) => {
    e.preventDefault();
    dispatchUserData({ type: "checkLogin" });
    const data = {};
    if (videoTitle && videoClipListResponse?.videoTitle !== videoTitle) {
      data.videoTitle = videoTitle;
    }
    if (
      videoDetailsText &&
      videoClipListResponse?.videoDetailsText !== videoDetailsText
    ) {
      data.videoDetailsText = videoDetailsText;
    }
    if (
      videoKeywords &&
      videoClipListResponse?.videoKeywords !== videoKeywords
    ) {
      data.videoKeywords = videoKeywords;
    }
    if (
      thumbnail &&
      thumbnail.name &&
      thumbnail.lastModified &&
      videoClipListResponse?.thumbnail !== thumbnail
    ) {
      data.thumbnail = thumbnail;
    }
    if (videoLink && videoClipListResponse?.videoLink !== videoLink) {
      data.videoLink = extractQueryParam(videoLink, 'v');
    }
    if (nextLink && videoClipListResponse?.nextLink !== nextLink) {
      data.nextLink = nextLink;
    }
    if (careerStage && videoClipListResponse?.careerStage !== careerStage) {
      data.careerStage = careerStage;
    }
    if (
      fieldOfResearch &&
      videoClipListResponse?.fieldOfResearch !== fieldOfResearch
    ) {
      data.fieldOfResearch = fieldOfResearch;
    }
    if (
      institutionSelector &&
      videoClipListResponse?.institutionSelector !== institutionSelector
    ) {
      data.institutionSelector = institutionSelector;
    }
    if (rigorTopic && videoClipListResponse?.rigorTopic !== rigorTopic) {
      data.rigorTopic = rigorTopic;
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
      url: "/api/videoClipList/" + params.slug,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getToken("token")}`,
      },
      // bodyObject
      data,
    };
    try {
      const response = await api.request(config);
      router.push("/dashboard/videoClipList");
      getVideoClipList;
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
  const handleFileChange = (e) => {
    const selectedfile =e.target.files[0]
    if (selectedfile.size > 1 * 1024 * 1024) {
      toast.error("File is too large, Max size is 1 MB", {
        position: "top-center",
      })
      setThumbnail(null);
    }else{
      setThumbnail(e.target.files[0])
    
    }
  }
  return (
    <div className="container mx-auto py-4 px-4 md:px-0">
      <form onSubmit={updateUser}>
        <div className="mb-6">
          <label
            htmlFor="videoTitle"
            className="block mb-2 text-sm font-medium text-white"
          >
            {" "}
            Video title
          </label>
          <input
            type="text"
            id="videoTitle"
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
            placeholder="Video title"
            defaultValue={videoClipListResponse?.videoTitle}
            onInput={(e) => setVideoTitle(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="videoDetailsText"
            className="block mb-2 text-sm font-medium text-white"
          >
            {" "}
            Video details text
          </label>
          <input
            type="text"
            id="videoDetailsText"
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
            placeholder="Video details text"
            defaultValue={videoClipListResponse?.videoDetailsText}
            onInput={(e) => setVideoDetailsText(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="videoKeywords"
            className="block mb-2 text-sm font-medium text-white"
          >
            {" "}
            Video keywords
          </label>
          <input
            type="text"
            id="videoKeywords"
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
            placeholder="Video keywords"
            defaultValue={videoClipListResponse?.videoKeywords}
            onInput={(e) => setVideoKeywords(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <div>
            <label
              className="block mb-2 text-sm font-medium text-white"
              htmlFor="thumbnail"
            >
              Upload file (
              {thumbnail?.name || videoClipListResponse?.thumbnail?.name})
            </label>
            <input
              className="block w-full p-2.5 text-sm border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400"
              aria-describedby="thumbnail_help"
              id="thumbnail"
              type="file"
              onChange={(e) => handleFileChange(e)}
            />
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="videoLink"
            className="block mb-2 text-sm font-medium text-white"
          >
            {" "}
            Youtube video link
          </label>
          <input
            type="text"
            id="videoLink"
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
            placeholder="Youtube video id"
            defaultValue={`https://www.youtube.com/watch?v=${videoClipListResponse?.videoLink}`}
            onInput={(e) => setVideoLink(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="nextLink"
            className="block mb-2 text-sm font-medium text-white"
          >
            {" "}
            Next link
          </label>
          <input
            type="text"
            id="nextLink"
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
            placeholder="Next link"
            defaultValue={videoClipListResponse?.nextLink}
            onInput={(e) => setNextLink(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="careerStage"
            className="block mb-2 text-sm font-medium text-white"
          >
            Select a Career Stage option {careerStage}
          </label>
          <select
            value={videoClipListResponse?.careerStage}
            onChange={(e) => setCareerStage(e.target.value)}
            id="careerStage"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option>Choose a Career Stage</option>
            <option value="Professor">Professor</option>
            <option value="Postdoc">Postdoc</option>
            <option value="PhD Student">PhD Student</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-6">
          <label
            htmlFor="fieldOfResearch"
            className="block mb-2 text-sm font-medium text-white"
          >
            Select a Field of Research option
          </label>
          <select
            value={videoClipListResponse?.fieldOfResearch}
            onChange={(e) => setFieldOfResearch(e.target.value)}
            id="fieldOfResearch"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option>Choose a Field of Research</option>
            <option value="Neurobio">Neurobio</option>
            <option value="Cog Neuro">Cog Neuro</option>
            <option value="Comp Neuro">Comp Neuro</option>
            <option value="Deep Learning">Deep Learning</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-6">
          <label
            htmlFor="institutionSelector"
            className="block mb-2 text-sm font-medium text-white"
          >
            Select an Institution option
          </label>
          <select
            value={videoClipListResponse?.institutionSelector}
            onChange={(e) => setInstitutionSelector(e.target.value)}
            id="institutionSelector"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option>Choose an Institution</option>
            <option value="University">University</option>
            <option value="Government">Government</option>
            <option value="Industry">Industry</option>
            <option value="Start-Up">Start-Up</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-6">
          <label
            htmlFor="rigorTopic"
            className="block mb-2 text-sm font-medium text-white"
          >
            Select a Rigor Topic option
          </label>
          <select
            value={videoClipListResponse?.rigorTopic}
            onChange={(e) => setRigorTopic(e.target.value)}
            id="rigorTopic"
            className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option>Choose a Rigor Topic</option>
            <option value="P-Hacking">P-Hacking</option>
            <option value="HARKing">HARKing</option>
            <option value="Bias in ML">Bias in ML</option>
            <option value="Literature Review">Literature Review</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button
          type="submit"
          className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Update Video Lesson
        </button>
      </form>
    </div>
  );
};
export default Page;
