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
export default function Index() {
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [imgsrc, setImgSrc] = useState("");
  const [accuracy, setProgressBar] = useState("");
  const [userid, setUserid] = useState("");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // let default = "<html></html>"
  
  function handleLogin(value, event) {
    axios
      .post("http://localhost:9000/login", {
        username: value.username,
        password: value.password,
      })
      .then((response) => {
        console.log(response);
        setUserid(response.data);
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
const per = [12,20,30,40,50,60,70,24,54,23,10,80,90,100]
  // const Slider = ({imgsrc,imgref}) => {
  //   return (
  //     <ImgComparisonSlider class="rendered">
  //       <img slot="first" alt="first " width="400px"  className=" relative top-0" src={imgsrc} />
  //       <img slot="second" alt="second" width="400px"  className=" relative top-0   " src={imgref}/>
  //     </ImgComparisonSlider>
  //   );
  // }
  const MyCustomHandle = () => {return(<div style={{ width: '5px', height: '100%', backgroundColor: "red" }}></div>)
    }
  
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
    className="p-4 my-5 mx-5  flex bg-[#1e1e1e] gap-4 lg shadow justify-center rounded items-center text-center   dark:bg-gray-800"
    >
      <span class="text-sm text-gray-500 text-center dark:text-gray-400 w-1/2"> <a href="/" class="hover:underline">CSS Battle !!!</a></span>
      <form onSubmit={handleLogin} class="w-full flex  ">
  <div class=" justify-evenly flex gap-2  ">
   
    <div class="">
      <input class="bg-gray-600 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" value={username}/>
    </div>

  <div class="">
    
    <div class="">
      <input class="bg-gray-600 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-password" type="password" value={password} placeholder="SRN"/>
    </div>
  </div>
  
  <div class="md:flex md:items-center">
    <div class="md:w-1/3"></div>
    <div class="md:w-2/3">
      <button class="shadow    hover:text-white  border bg-transparent  hover:bg-blue-500 text-blue-700 border-blue-500 hover:border-transparent   focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded h-10 w-32" type="button">
        Sign Up
      </button>
    </div>
  </div>
  </div>
</form>
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
          <button type="submit" onClick={handleSubmit} className="   font-semibold py-2 px-4 hover:text-white  border bg-transparent  hover:bg-blue-500 text-blue-700 border-blue-500 hover:border-transparent rounded  mx-auto  ">
          Renderr
        </button>
        <button type="submit" onClick={handleSubmit} className="  bg-transparent  hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded   mx-auto  ">
          Compare
        </button>
      </div>
      </div>
      <div className="  p-4 w-full  col-span-2  ">
        {/* <h1 className="relative font-mono top-20 left-28">Output</h1> */}
        {/* <span className="relative font-mono top-20 left-36 text-white">Output</span> */}
        {/* <Slider imgref={"https://media.discordapp.net/attachments/972456002656010288/1080514369026261084/7OfjmAB6MFjGr3KoAvpHoezw6YUDiM9bOMaXLRLpriM4vkhshM1Bd5vD7kItYIFvGwKlbBvxiVK2atjZL4cuTqYQz3aJKth38hGKOXNu0IuuiGY091sgiAe6PmAkWpuLeQr0D4vpIHKGWXFjpdYTsM6ChKl3LyG1LBuYoQrnKE4ZOtbxFGXhGEboONXSqXbqFAkxYGir59R46cpWJmARRSl3K7nVHvK5Sre8ZU3gDajxFV2moprL5XVyuSq7eeO3t2AY4EJZJOyLQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRDENf8DqqfoKbgCGfcAAAAASUVORK5CYII.png"} imgsrc={"https://media.discordapp.net/attachments/972456002656010288/1080514369026261084/7OfjmAB6MFjGr3KoAvpHoezw6YUDiM9bOMaXLRLpriM4vkhshM1Bd5vD7kItYIFvGwKlbBvxiVK2atjZL4cuTqYQz3aJKth38hGKOXNu0IuuiGY091sgiAe6PmAkWpuLeQr0D4vpIHKGWXFjpdYTsM6ChKl3LyG1LBuYoQrnKE4ZOtbxFGXhGEboONXSqXbqFAkxYGir59R46cpWJmARRSl3K7nVHvK5Sre8ZU3gDajxFV2moprL5XVyuSq7eeO3t2AY4EJZJOyLQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRDENf8DqqfoKbgCGfcAAAAASUVORK5CYII.png"}/> */}

      {/* <img src="https://media.discordapp.net/attachments/972456002656010288/1080514369026261084/7OfjmAB6MFjGr3KoAvpHoezw6YUDiM9bOMaXLRLpriM4vkhshM1Bd5vD7kItYIFvGwKlbBvxiVK2atjZL4cuTqYQz3aJKth38hGKOXNu0IuuiGY091sgiAe6PmAkWpuLeQr0D4vpIHKGWXFjpdYTsM6ChKl3LyG1LBuYoQrnKE4ZOtbxFGXhGEboONXSqXbqFAkxYGir59R46cpWJmARRSl3K7nVHvK5Sre8ZU3gDajxFV2moprL5XVyuSq7eeO3t2AY4EJZJOyLQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRDENf8DqqfoKbgCGfcAAAAASUVORK5CYII.png" alt="lol" width="400px"  className=" relative top-0   "></img> */}
      {/* <ImgComparisonSlider width="400px" tabindex="0"  className="rendered relative top-0">
        <img slot="first" alt="first " width="100%" src="https://media.discordapp.net/attachments/972456002656010288/1080514369026261084/7OfjmAB6MFjGr3KoAvpHoezw6YUDiM9bOMaXLRLpriM4vkhshM1Bd5vD7kItYIFvGwKlbBvxiVK2atjZL4cuTqYQz3aJKth38hGKOXNu0IuuiGY091sgiAe6PmAkWpuLeQr0D4vpIHKGWXFjpdYTsM6ChKl3LyG1LBuYoQrnKE4ZOtbxFGXhGEboONXSqXbqFAkxYGir59R46cpWJmARRSl3K7nVHvK5Sre8ZU3gDajxFV2moprL5XVyuSq7eeO3t2AY4EJZJOyLQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRDENf8DqqfoKbgCGfcAAAAASUVORK5CYII.png" />
        <img slot="second" alt="second"  width="100%" src="https://media.discordapp.net/attachments/972456002656010288/1080514369026261084/7OfjmAB6MFjGr3KoAvpHoezw6YUDiM9bOMaXLRLpriM4vkhshM1Bd5vD7kItYIFvGwKlbBvxiVK2atjZL4cuTqYQz3aJKth38hGKOXNu0IuuiGY091sgiAe6PmAkWpuLeQr0D4vpIHKGWXFjpdYTsM6ChKl3LyG1LBuYoQrnKE4ZOtbxFGXhGEboONXSqXbqFAkxYGir59R46cpWJmARRSl3K7nVHvK5Sre8ZU3gDajxFV2moprL5XVyuSq7eeO3t2AY4EJZJOyLQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRDENf8DqqfoKbgCGfcAAAAASUVORK5CYII.png"/>
      </ImgComparisonSlider> */}
      <ReactCompareSlider changePositionOnHover="True " handle={<MyCustomHandle />}  style={{ width: '400px' }}  className=" relative top-0 "
  itemOne={<ReactCompareSliderImage src="https://media.discordapp.net/attachments/972456002656010288/1080514369026261084/7OfjmAB6MFjGr3KoAvpHoezw6YUDiM9bOMaXLRLpriM4vkhshM1Bd5vD7kItYIFvGwKlbBvxiVK2atjZL4cuTqYQz3aJKth38hGKOXNu0IuuiGY091sgiAe6PmAkWpuLeQr0D4vpIHKGWXFjpdYTsM6ChKl3LyG1LBuYoQrnKE4ZOtbxFGXhGEboONXSqXbqFAkxYGir59R46cpWJmARRSl3K7nVHvK5Sre8ZU3gDajxFV2moprL5XVyuSq7eeO3t2AY4EJZJOyLQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRDENf8DqqfoKbgCGfcAAAAASUVORK5CYII.png"  alt="Image one" />}
  itemTwo={<ReactCompareSliderImage src="https://placehold.jp/30b3b5/ea2e2e/400x300.png"  alt="Image two" />}
/>
        
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
