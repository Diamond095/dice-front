import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import Dice1 from "../../../app/assets/my-dice/dice-1.jpg";
import Dice2 from "../../../app/assets/my-dice/dice-2.jpg";
import Dice3 from "../../../app/assets/my-dice/dice-3.jpg";
import Dice4 from "../../../app/assets/my-dice/dice-4.jpg";
import Dice5 from "../../../app/assets/my-dice/dice-5.jpg";
import Dice6 from "../../../app/assets/my-dice/dice-6.jpg";
import "./MyDice.scss";

const faces = [
  Dice6,
  Dice5,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
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

const MyDice = forwardRef(({ onRoll, targetFace }, ref) => {
  const [currentRotation, setCurrentRotation] = useState([0, 0, 0]);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);

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
    setRolling(true);
    
    const newRotation = getRotationForFace(targetFace - 1);
    const finalRotation = [
      newRotation[0] + Math.floor(Math.random() * 4 + 4) * Math.PI * 2,
      newRotation[1] + Math.floor(Math.random() * 4 + 4) * Math.PI * 2,
      newRotation[2],
    ];

    setCurrentRotation(finalRotation);
    setResult(targetFace);

    if (onRoll) onRoll(targetFace);
  };

  useImperativeHandle(ref, () => ({
    rollDice: handleRollDice,
    getResult: () => result,
  }));

  return (
    <div className="diceCanvas">
      <Canvas>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <directionalLight
          position={[-5, 5, 5]}
          intensity={1.2} /* Было 0.5 */
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
        />
        <spotLight
          position={[5, 10, 5]}
          angle={0.3}
          intensity={2} /* Было 1 */
          penumbra={1}
          castShadow
        />
        <hemisphereLight
          skyColor={"#ffffff"}
          groundColor={"#444444"}
          intensity={1.5} /* Было 0.6 */
        />
        <DiceMesh position={position} rotation={rotation} />
      </Canvas>
    </div>
  );
});

function getRotationForFace(faceIndex) {
  switch (faceIndex) {
    case 0:
      return [Math.PI / 2, 0, 0];
    case 1:
      return [-Math.PI / 2, 0, 0];
    case 2:
      return [0, 0, 0];
    case 3:
      return [0, Math.PI, 0];
    case 4:
      return [0, Math.PI / 2, 0];
    case 5:
      return [0, -Math.PI / 2, 0];
    default:
      return [0, 0, 0];
  }
}

export default MyDice;
