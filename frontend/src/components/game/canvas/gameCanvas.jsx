import { KeyboardControls, OrthographicCamera, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber"
import { Debug, Physics } from "@react-three/rapier";
import MyCharacter from "../canvas/myCharacter";
import OtherCharacter from "../canvas/otherCharacter";
import Obstacle from "../canvas/obstacle";
import Panel from "../../../PDH_pack/UI";
import { useEffect } from "react";
import { action } from "app/store"
import { selectOhterPlayers } from "app/others";
import { useSelector } from "react-redux";
const GameCanvas = () => {

    const players = useSelector(selectOhterPlayers);

    useEffect(() => {
        action('SOCKET_CONNECT_REQUEST')
    }, [])


    return (
        <KeyboardControls
            map={[
                { name: "forward", keys: ["ArrowUp", "w", "W"] },
                { name: "backward", keys: ["ArrowDown", "s", "S"] },
                { name: "left", keys: ["ArrowLeft", "a", "A"] },
                { name: "right", keys: ["ArrowRight", "d", "D"] },
                { name: "jump", keys: ["Space"] },
            ]}>
            <div style={{ width: "70vw", height: "70vh" }}>
                <Canvas flat linear>
                    <ambientLight intensity={0.1} />
                    <directionalLight position={[0, 0, 5]} />
                    <Physics timeStep={1 / 60} gravity={[0, 0, 0]} >
                        {/* <Debug /> */}
                        <MyCharacter initPosition={[0, -0.5, 0]} initColor="red" />
                        {players.map((data) => 
                            <OtherCharacter initPosition={[0, -0.5, 0]} name={data.player.name} key={data.player.name} location={{x : data.location.x, y : data.location.y, z : 0}} initColor="blue" />
                        )}
                        <Obstacle />
                    </Physics>
                    <OrthographicCamera />
                    {/* <OrbitControls /> */}
                </Canvas>
            </div>
        </KeyboardControls>
    )
}

export default GameCanvas;