import { Row, Button, Modal, Col } from 'antd';
import { selectGameInfo } from 'app/gameInfo';
import { selectGameResult } from 'app/gameResult';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import TypingText from './meeting/TypingText';



const GameResult = () => {
  const isInGame = useSelector(selectGameInfo).isInGame
  const gameResult = useSelector(selectGameResult).gameResult
  const navigate = useNavigate();
  const [Text, setText] = useState("")
  const [winSide, setWinSide] = useState("")


  const getWinSide=()=>{
    
    if (gameResult&&(gameResult.win === "MAFIA")) {
      return('MimicBot 이 이겼습니다')
    } else {
      return('Human 이 이겼습니다')
    }
  }

  // ※렌더링 되고 10초 지난후 라우터 이동

  return (
    <>
    <Modal
    open={!isInGame&&gameResult}
    width={1920}
    closable={false}
    footer={[
    ]}>

    <div>
      <TypingText text={getWinSide()} speed={60} fontSize="1.25rem" color="green" />
      {/* {gameResult.players.map((player) => {
        <div>{player.id}:{player.role}</div>
      })} */}
      <Row justify="center">
      <Link to={`/rooms`}><Button type="primary">메인화면으로 돌아가기</Button></Link>
      </Row>     
      
    </div>
    </Modal>
    </>
  );
};

export default GameResult;