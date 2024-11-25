import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import Dice1 from "../../../app/assets/opponent-dice/dice-1.jpg";
import Dice2 from "../../../app/assets/opponent-dice/dice-2.jpg";
import Dice3 from "../../../app/assets/opponent-dice/dice-3.jpg";
import Dice4 from "../../../app/assets/opponent-dice/dice-4.jpg";
import Dice5 from "../../../app/assets/opponent-dice/dice-5.jpg";
import Dice6 from "../../../app/assets/opponent-dice/dice-6.jpg";
import "./OpponentDice.scss";

const faces = [
  Dice6,
  Dice5,
  Dice1,
  Dice2,
  Dice3,
  Dice4
];

const DiceMesh = ({ position, rotation }) => {
  const textures = useTexture(faces);

  return (
    <a.mesh position={position} rotation={rotation}>
      <boxGeometry args={[2, 2, 2]} />
      {textures.map((texture, index) => (
        <meshStandardMaterial
          attach={`material-${index}`}
          map={texture}
          key={index}
        />
      ))}
    </a.mesh>
  );
};

const OpponentDice = forwardRef(({ onRoll, targetFace }, ref) => {
  const [currentRotation, setCurrentRotation] = useState([0, 0, 0]);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [round, setRound] = useState(0)

  const { position, rotation } = useSpring({
    position: [0, 0, 0],
    rotation: currentRotation,
    config: { mass: 1, tension: 100, friction: 30 },
    reset: rolling,
    onRest: () => {
      setRolling(false);
    },
  });

  const handleRollDice = () => {
    if (rolling) return;
    setRound(round + 1)
    setRolling(true);

    const targetFaceIndex = targetFace - 1; // Set the target face index from 1 to 6
    const newRotation = getRotationForFace(targetFaceIndex);
    const finalRotation = [
      newRotation[0] + Math.floor(Math.random() * 4 + 4) * Math.PI * 2,
      newRotation[1] + Math.floor(Math.random() * 4 + 4) * Math.PI * 2,
      newRotation[2],
    ];

    setCurrentRotation(finalRotation);
    setResult(targetFace); // Save the result of the rolled face

    if (onRoll) onRoll(targetFace); // Pass the result to the parent
  };

  useImperativeHandle(ref, () => ({
    rollDice: handleRollDice,
    getResult: () => result,
  }));

  return (
    <div className="diceCanvas">
      <Canvas>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <directionalLight
          position={[-5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
        />
        <spotLight
          position={[5, 10, 5]}
          angle={0.3}
          intensity={1}
          penumbra={1}
          castShadow
        />
        <hemisphereLight
          skyColor={"#ffffff"}
          groundColor={"#444444"}
          intensity={0.6}
        />
        <DiceMesh key={round} position={position} rotation={rotation} />
      </Canvas>
    </div>
  );
});

function getRotationForFace(faceIndex) {
  switch (faceIndex) {
    case 0:
      return [Math.PI / 2, 0, 0]; // Face 1
    case 1:
      return [-Math.PI / 2, 0, 0]; // Face 2
    case 2:
      return [0, 0, 0]; // Face 3
    case 3:
      return [0, Math.PI, 0]; // Face 4
    case 4:
      return [0, Math.PI / 2, 0]; // Face 5
    case 5:
      return [0, -Math.PI / 2, 0]; // Face 6
    default:
      return [0, 0, 0];
  }
}

export default OpponentDice;
