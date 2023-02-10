import React, { useEffect, useRef, useState } from 'react';
import {useSelector} from 'react-redux';
import { selectVoteInfo } from '../../../app/voteInfo';
import TypingText from './TypingText';


const ResultMeeting = () => {
  const result = useSelector(selectVoteInfo).voteResult.elected;
  const [Text, setText] = useState("")
  useEffect(()=>{
    if (result != "skip") {
      setText(`무고한 사람을 죽이고 말았습니다... 안녕~${result}`)
    }
  },[result])
  
//   let index = 0;
//   const content = "Glad to Meet You."
//   const mainTitle = useRef();
//   const typing = () =>{
//     let text = `${content[index++]}`;
//     if (index <= content.length) {
//         mainTitle.textContent += text;
//   }
// }
//   const start = () =>{
//     setInterval(typing, 100);
//   }

  return (
    <div>
      {/* <div className="typing-demo">{result}</div> */}
      {result === "skip"?
      <TypingText text="아무도 당선되지 않았습니다..." speed={60} fontSize="1.25rem" color="green" />
      :<TypingText text={Text} speed={60} fontSize="1.25rem" color="green" />}
    </div>
  
  )
}

export default ResultMeeting;