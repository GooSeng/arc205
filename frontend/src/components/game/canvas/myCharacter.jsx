import { Line, SpotLight, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Euler, Color } from "three";
import { useRef, useEffect, useState, Suspense, createRef } from "react";
import {
  CuboidCollider,
  CylinderCollider,
  RigidBody,
} from "@react-three/rapier";
import { selectMe } from "../../../app/me";
import { useSelector } from "react-redux";
import { action } from "app/store";
import CharacterMesh from "../mesh/characterMesh";
import { selectGameInfo } from "app/gameInfo";

const MyCharacter = ({ color }) => {

  const isInMeeting = useSelector(selectGameInfo).isInMeeting;
  const player = useSelector(selectMe).player;
  const [, get] = useKeyboardControls();
  const ref = useRef();
  // const sightRef = useRef();
  const isGameStop = useSelector(selectGameInfo).isGameStop;
  const isInSabotage = useSelector(selectGameInfo).isInSabotage;
  // const [intersecting, setIntersection] = useState(false);

  const frontVector = new Vector3();
  const sideVector = new Vector3();
  const direction = new Vector3();
  const cameraVec = new Vector3();

  const speed = 6.0;

  const sylinderRot = new Euler(1.5, 0, 0);
  // const sightColor = new Color(1,1,1);
  // ref.current.charState = "IDLE";
  // ref.current.charDir = "RIGHT";

  const [sightColor, setSightColor] = useState("white")

  const timer = useRef();

  useEffect(() => {
    if(isInSabotage) {
      setSightColor("red")
    } else {
      setSightColor("white")
    }

  },[isInSabotage])

  useEffect(() => {
    timer.current = setInterval(() => {
      if (!isInMeeting) {
        action("LOCAITION_SEND_REQUEST", {
          x: ref.current.translation().x,
          y: ref.current.translation().y,
        });
      }
    }, 300);
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    if (isInMeeting) {
      ref.current.setTranslation({ x: 0, y: 0, z: 0 });
      action("LOCAITION_SEND_REQUEST", {
        x: 0,
        y: 0,
      });
    }
  }, [isInMeeting]);

  useFrame((state) => {
    state.camera.position.lerp(
      cameraVec.set(
        ref.current.translation().x,
        ref.current.translation().y,
        5
      ),
      0.02
    );

    const { forward, backward, left, right } = get();

    if (isGameStop) return;

    ref.current.charState =
      forward || backward || left || right ? "DASH" : "IDLE";

    if (left) ref.current.charDir = "LEFT";
    else if (right) ref.current.charDir = "RIGHT";

    frontVector.set(0, forward - backward, 0);
    sideVector.set(left - right, 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed);

    ref.current.setLinvel({ x: direction.x, y: direction.y, z: 0 });
  });

  return (
    <>
      <RigidBody
        ref={ref}
        colliders={false}
        type="dynamic"
        lockRotations={true}
      >
        <pointLight
          color={sightColor}
          // ref={sightRef}
          distance={player.sight}
          intensity={1.4}
          decay={0.01}
          position={[0, 0, 1]}
        />

        <Suspense>
          <CharacterMesh
            id={player.id}
            ref={ref}
            color={color}
            isAlive={player.isAlive}
          />
        </Suspense>

        <CuboidCollider
          name={`me_${player.id}`}
          args={[0.5, 0.5, 0.1]}
          sensor={!player.isAlive}
          onIntersectionEnter={(e) => {
            if (!e.colliderObject.name) return;

            // console.log(e.colliderObject.name)

            if (e.colliderObject.name.search("dead") >= 0) {
              // 시체
              action("me/setAdjustBody", e.colliderObject.name);
            } else if (
              e.colliderObject.name.search("meeting") >= 0 &&
              player.isAlive
            ) {
              // 회의 버튼
              action("gameInfo/setAdjacentMeetingBtn", true);
            } else if (e.colliderObject.name.search("mission") >= 0) {
              // 미션 버튼
              action(
                "missionInfo/setAdjacentMissionBtn",
                // e.colliderObject.name[e.colliderObject.name.length - 1]
                e.colliderObject.name.split('_')[1]
              );
            } else {
              // 유저들
              action("me/setAdjustPlayer", e.colliderObject.name);
            }
          }}
          onIntersectionExit={(e) => {
            if (e.colliderObject.name.search("dead") >= 0) {
              // 시체
              action("me/setAdjustBody", null);
            } else if (e.colliderObject.name.search("meeting") >= 0) {
              // 회의 버튼
              action("gameInfo/setAdjacentMeetingBtn", false);
            } else if (e.colliderObject.name.search("mission") >= 0) {
              // 미션 버튼
              action("missionInfo/setAdjacentMissionBtn", false);
            } else {
              // 유저들
              action("me/setAdjustPlayer", null);
            }
          }}
        />
        <CylinderCollider
          name={`sight_${player.id}`}
          args={[0.08, 4]}
          sensor
          restitution={0}
          rotation={sylinderRot}
          onIntersectionEnter={(e) => {
            if (!e.colliderObject.name) return;

            if (e.colliderObject.name?.search("dead_") < 0) {
              // action("me/setAdjustPlayer", e.colliderObject.name)
              // console.log("in ", e.colliderObject.name)
              action("others/setOtherSoundOn", e.colliderObject.name);
              action("others/setOtherVideoOn", e.colliderObject.name);
            }
          }}
          onIntersectionExit={(e) => {
            if (!e.colliderObject.name) return;

            if (e.colliderObject.name?.search("dead_") < 0) {
              // action("me/setAdjustPlayer", e.colliderObject.name)
              // console.log("out ", e.colliderObject.name)
              action("others/setOtherSoundOff", e.colliderObject.name);
              action("others/setOtherVideoOff", e.colliderObject.name);
            }
          }}
        />
      </RigidBody>
    </>
  );
};

export default MyCharacter;
