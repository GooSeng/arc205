import { Box, Merged, Plane } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Ground } from "./map/ground";
import MeetingButton from "./meetingButton";
import MissionButton from "./missionButton";

const SimpleMap = () => {

    return (
        <>
            <Ground/>
            <RigidBody restitution={0} colliders="cuboid" type="fixed" lockRotations={true}>
                <Box args={[8, 20, 1]} position={[-10, 0, 0]} material-color="black" />
                <Box args={[8, 20, 1]} position={[10, 0, 0]} material-color="black" />
                <Box args={[20, 8, 1]} position={[0, 10, 0]} material-color="black" />
                <Box args={[20, 8, 1]} position={[0, -10, 0]} material-color="black" />
                <MissionButton position={[0, 4, 0]}/>
                <MeetingButton position={[0, -4, 0]}/>
            </RigidBody>
        </>
    )
}

export default SimpleMap;