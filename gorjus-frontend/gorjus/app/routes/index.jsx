import axios from "axios";
import Editor from "@monaco-editor/react";
import { Form } from "@remix-run/react";
import { useState } from "react";
import styles from "~/styles/index.css";
import { useEffect } from "react";

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
export default function Index() {
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [imgsrc, setImgSrc] = useState("");
  const [accuracy, setProgressBar] = useState("");
  // let default = "<html></html>"

  function handleChange(value, event) {

    setCode(value);
    localStorage.setItem('code', code);
    console.log(code);
  }
const per = [12,20,30,40,50,60,70,24,54,23,10,80,90,100]
  const ProgressBar = ({ progressPercentage }) => {

    return (
      <div className='h-4 my-3 w-4/5 mx-auto bg-gray-300 rounded '>
      <div
          style={{ width: `${progressPercentage}%`}}
          className={`   h-full rounded text-xs font-medium text-blue-100 text-center p-0.5 leading-none ${
              progressPercentage < 70 ? 'bg-red-600' : 'bg-green-600'}`}>
                {progressPercentage} %
      </div>
  </div>
    );
};
const getProgressBar = ({ progressPercentage }) => {
  setProgressBar(progressPercentage)
  ;}
  function handleSubmit(value, event) {
    
    let randomValue = per[Math.floor(Math.random() * per.length)];
    getProgressBar({progressPercentage:randomValue})
   
    

    console.log(randomValue);
    console.log("Submitting the Code => ", code);


    // axios
    //   .post(
    //     "http://localhost:9000/",
    //     { html_str: code, css_str: "" },
    //     { responseType: "arraybuffer" }
    //   )
    //   .then((response) => {
    //     console.log(response);
    //     return new Blob([response.data]);
    //   })
    //   .then((blob) => URL.createObjectURL(blob))
    //   .then((url) => console.log(setImgSrc(url)))
    //   .catch((err) => console.error(err));
  }
  let defaultCode = "<html></html>";
  useEffect(() => {
    const code = localStorage.getItem('code');
    
    if (code) {
      setCode(code);
    }
  }, []);
  return (
    <>
    <div
    className="p-4 my-5 mx-5  bg-[#1e1e1e] lg shadow rounded items-center text-center justify-between  dark:bg-gray-800"
    >
      <span class="text-sm text-gray-500 text-center dark:text-gray-400"> <a href="/" class="hover:underline">CSS Battle !!!</a></span>
    </div>
    <ProgressBar progressPercentage={accuracy} />
    
    <div
      className="container grid grid-rows-3 grid-flow-col  min-w-full  "
    >
      <div 
      className="row-span-3 p-4 max-w-[85%] h-2/3 border-r-2 border-gray-500 "

      >
    
        
        <input type="text" name="code" value={code} hidden />
        <Editor
          height="71.5vh"
          width="100%"
          language="html"
          theme="vs-dark"
          value= {code}
          onChange={handleChange}
          className="code-block  rounded  ml- 20 "
          options={{
            scrollBeyondLastLine: false,
            fontSize: "20px",
          }}
        />
        <div 
        className="flex items-centre relative mt-5"
        >
          <button type="submit" onClick={handleSubmit} className="  bg-transparent  hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded  mx-auto  ">
          Render
        </button>
        <button type="submit" onClick={handleSubmit} className="  bg-transparent  hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded   mx-auto  ">
          Compare
        </button>
      </div>
      </div>
      <div className="  p-4 w-full  col-span-2  ">
        {/* <h1 className="relative font-mono top-20 left-28">Output</h1> */}
        {/* <span className="relative font-mono top-20 left-36 text-white">Output</span> */}
      <img src="https://media.discordapp.net/attachments/972456002656010288/1080514369026261084/7OfjmAB6MFjGr3KoAvpHoezw6YUDiM9bOMaXLRLpriM4vkhshM1Bd5vD7kItYIFvGwKlbBvxiVK2atjZL4cuTqYQz3aJKth38hGKOXNu0IuuiGY091sgiAe6PmAkWpuLeQr0D4vpIHKGWXFjpdYTsM6ChKl3LyG1LBuYoQrnKE4ZOtbxFGXhGEboONXSqXbqFAkxYGir59R46cpWJmARRSl3K7nVHvK5Sre8ZU3gDajxFV2moprL5XVyuSq7eeO3t2AY4EJZJOyLQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRDENf8DqqfoKbgCGfcAAAAASUVORK5CYII.png" alt="lol" width="400px"  className=" relative top-0   "></img>
      
        
      </div>
      <div className=" p-4 row-span-1 col-span-2 ">
        {/* div for renering an imnage */}
        <img src="https://media.discordapp.net/attachments/972456002656010288/1080514369026261084/7OfjmAB6MFjGr3KoAvpHoezw6YUDiM9bOMaXLRLpriM4vkhshM1Bd5vD7kItYIFvGwKlbBvxiVK2atjZL4cuTqYQz3aJKth38hGKOXNu0IuuiGY091sgiAe6PmAkWpuLeQr0D4vpIHKGWXFjpdYTsM6ChKl3LyG1LBuYoQrnKE4ZOtbxFGXhGEboONXSqXbqFAkxYGir59R46cpWJmARRSl3K7nVHvK5Sre8ZU3gDajxFV2moprL5XVyuSq7eeO3t2AY4EJZJOyLQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRDENf8DqqfoKbgCGfcAAAAASUVORK5CYII.png" alt="lol" width="400px"  className=" relative top-0   "></img>
        {/* <button type="submit" onClick={handleSubmit} className="  bg-transparent  hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded relative  left-24  ">
          Submit
        </button> */}
      </div>
    </div>
    
    <footer
    className="p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800"
    >
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" class="hover:underline">Google Developer Student Club</a>. 
    </span>
    </footer>
    </>
  );
}
