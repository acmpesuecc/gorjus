import axios from "axios";
import Editor from "@monaco-editor/react";
import { Form } from "@remix-run/react";
import { useState } from "react";
import styles from "~/styles/index.css";
import { useEffect } from "react";
// import ImageSlider from "react-image-comparison-slider";
// import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

export function links() {
   return [{ rel: "stylesheet", href: styles }];
}
export async function action({ request }) {
   const body = await request.formData();
   const data = Object.fromEntries(body);
   console.log(data);
   var data_final = { html_str: data.code, css_str: "" };
   return body;
}

let API_URL = "http://localhost:8080"

function RenderImageFunction(htmlstr, cssstr, name) {
   return axios.post(
     API_URL + "/render",
     {
       html_string: htmlstr,
       css_string: cssstr,
       name: name,
     },
     {
       responseType: "arraybuffer",
       headers: { "Content-Type": "multipart/form-data" },
     }
   );
}


function DeliverImageFunction(filename) {
   return axios.post(
     API_URL + "/deliver",
     {
       name: filename 
     },
     {
       responseType: "arraybuffer",
       headers: { "Content-Type": "multipart/form-data" },
     }
   ); 
}

function GetImageURLFromBytes(bytes) {

}

function setreferenceimage(image_name) {

}

export default function Index() {


   // Auth stuff
   const [userid, setUserid] = useState("");
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [token, setToken] = useState("");
   const [loginStatus, setLoginStatus] = useState(true);

   // Runtime Stuff
   const [code, setCode] = useState("");
   const [value, setValue] = useState("");

   const [imgname, setImageName] = useState("");
   const [imgsrc, setImgSrc] = useState("");

   const [referenceimgname, setReferenceImgname] = useState();
   const [referenceimgsrc, setReferenceImgSrc] = useState("");

   const [accuracy, setProgressBar] = useState("");
   const [questionNumber, setQuestionNumber] = useState(null);

   const image_filename_map = [
      "rendered_images/1_ACM.png",
      "rendered_images/2_PINKSPOKES.png",
      "rendered_images/3_WRT.png",
      "rendered_images/4_BATMAN.png",
      "rendered_images/5_A.png",
      "rendered_images/6_SNOWMAN.png",
   ]

   function HandleImageCompare() {
      var reference_name = referenceimgname
      var rendered_name = imgname
      axios.post(
        API_URL + "/compare_existing",
        {
          im1_name: "../runtime_dir/" + reference_name,
          im2_name: "../runtime_dir/rendered_images/" + rendered_name,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then(resp => {
         console.log(resp)
         setProgressBar(resp.data.message * 100)
      })
   }


   // let default = "<html></html>"

   function handleLogin(value, event) {
      // event.preventDefault();
      console.log(value);
      axios
         .post("http://localhost:8080/login", {
            username: username,
            password: password
         })
         .then((response) => {
            console.log(response);
            if (response.data.status === "false") {
               console.log("Error logging in!")
            } else {
               setToken(response.data.token);
               setLoginStatus(true);
            }
         })
         .catch((error) => {
            console.log(error);
         });
   }

   function handleChange(value, event) {

      setCode(value);
      localStorage.setItem('code', code);
      console.log(code);
   }
   const per = [12, 20, 30, 40, 50, 60, 70, 24, 54, 23, 10, 80, 90, 100]


   const handleImageSelect = (name) => {

   DeliverImageFunction(name)
     .then((response) => {
       console.log(response);
       return new Blob([response.data]);
     })
     .then((blob) => URL.createObjectURL(blob))
     .then((url) => console.log(setReferenceImgSrc(url)))
     .catch((err) => console.error(err));

   }

   const MyCustomHandle = () => {
      return (<div style={{ width: '5px', height: '100%', backgroundColor: "red" }}></div>)
   }

   const ProgressBar = ({ progressPercentage }) => {
      return (
         <div className='h-4 my-3 w-4/5 mx-auto bg-gray-300 rounded '>
            <div
               style={{ width: `${progressPercentage}%` }}
               className={`   h-full rounded text-xs font-medium text-blue-100 text-center p-0.5 leading-none ${progressPercentage < 70 ? 'bg-red-600' : 'bg-green-600'}`}>
               {progressPercentage} %
            </div>
         </div>
      );
   };
   const getProgressBar = ({ progressPercentage }) => {
      setProgressBar(progressPercentage);
   }

   function handleSubmit(value, event) {

      console.log("Submitting the Code => ", code);

      // TODO Make this better, tie in question number here
      var title = username + "-QUES" + image_filename_map.indexOf(referenceimgname)  + ".png"
      setImageName(title)
      
        // TODO Make this name a function of username and SRN or whatever
        RenderImageFunction(code, "", title)
          .then((response) => {
            setImageName(title)
            console.log(response);
            return new Blob([response.data]);
          })
          .then((blob) => URL.createObjectURL(blob))
          .then((url) => console.log(setImgSrc(url)))
          .catch((err) => console.error(err));
   }

   useEffect(() => {
      const code = localStorage.getItem('code');
      if (code) {
         setCode(code);
      }
      setReferenceImgname(image_filename_map[2])
   }, []);

   useEffect(() => {
      handleImageSelect(referenceimgname)
   }, [referenceimgname])


 const handleChange_new = (e) => {
         console.log(e);
         setReferenceImgname(e.target.value);
    };

   return (
     <>
       <div className="p-4 my-5 mx-5  flex bg-[#1e1e1e] gap-4 lg shadow justify-center rounded items-center text-center   dark:bg-gray-800">
         <span class="text-sm text-gray-500 text-center dark:text-gray-400 w-1/2">
           {" "}
           <a href="/" class="hover:underline">
             CSS Battle !!!
           </a>
         </span>
         <form class="w-full flex  ">
           <div class=" justify-evenly flex gap-2  ">
             <div class="">
               <input
                 class="bg-gray-600 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                 id="inline-full-name"
                 type="text"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
               />
             </div>

             <div class="">
               <div class="">
                 <input
                   class="bg-gray-600 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                   id="inline-password"
                   type="password"
                   value={password}
                   onChange={(e) => {
                     setPassword(e.target.value);
                     console.log(e.target.value);
                   }}
                   placeholder="SRN"
                 />
               </div>
             </div>

             <div class="md:flex md:items-center">
               <div class="md:w-1/3"></div>
               <div class="md:w-2/3"></div>
             </div>
           </div>
         </form>

         <button
           onClick={handleLogin}
           className={` ${
             loginStatus && "hidden"
           } shadow    hover:text-white  border bg-transparent  hover:bg-blue-500 text-blue-700 border-blue-500 hover:border-transparent   focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded h-10 w-32`}
         >
           Sign Up
         </button>

         <div className="select-container">
           <select className="select" value={referenceimgname} onChange={handleChange_new}>
            { image_filename_map.map(x => <option value={x} key={x}>{x}</option> )  }
           </select>
           <p>{`You selected ${value}`}</p>
         </div>
       </div>

       <ProgressBar progressPercentage={accuracy} />

       <div className="container grid grid-rows-3 grid-flow-col  min-w-full  ">
         <div className="row-span-3 p-4 max-w-[85%] h-2/3 border-r-2 border-gray-500 ">
           <input type="text" name="code" value={code} hidden />
           <Editor
             height="71.5vh"
             width="100%"
             language="html"
             theme="vs-dark"
             value={code}
             onChange={handleChange}
             className="code-block  rounded  ml- 20 "
             options={{
               scrollBeyondLastLine: false,
               fontSize: "20px",
             }}
           />
           <div className="flex items-centre relative mt-5">
             <button
               type="submit"
               onClick={handleSubmit}
               className={` ${
                 !loginStatus && "hidden"
               } font-semibold py-2 px-4 hover:text-white  border bg-transparent  hover:bg-blue-500 text-blue-700 border-blue-500 hover:border-transparent rounded  mx-auto  `}
             >
               Renderr
             </button>
             <button
               type="submit"
               onClick={HandleImageCompare}
               className={` ${
                 !loginStatus && "hidden"
               }  bg-transparent  hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded   mx-auto  `}
             >
               Compare
             </button>
           </div>
         </div>
         <div className="  p-4 w-full  col-span-2  ">
           <ReactCompareSlider
             changePositionOnHover="True "
             // handle={<MyCustomHandle />}
             style={{ width: "400px" }}
             className="relative top-0 "
             position={50}
             itemOne={<ReactCompareSliderImage src={imgsrc} alt="Image one" />}
             itemTwo={
               <ReactCompareSliderImage
                 src={referenceimgsrc}
                 alt={referenceimgname}
               />
             }
           />
         </div>
         <div className=" p-4 row-span-1 col-span-2 ">
           {/* div for renering an imnage */}
           <img
             src={referenceimgsrc}
             alt="lol"
             width="400px"
             className=" relative top-0   "
           ></img>
           {/* <button type="submit" onClick={handleSubmit} className="  bg-transparent  hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded relative  left-24  ">
          Submit
        </button> */}
         </div>
       </div>

       <footer className="p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
         <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
           © 2023{" "}
           <a href="/" class="hover:underline">
             Google Developer Student Club
           </a>
           .
         </span>
       </footer>
     </>
   );
}
